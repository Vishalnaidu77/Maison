import { stockOfVariant } from "../dao/product.dao.js";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

export async function addToCart (req, res){
    try {
        const { productId, variantId } = req.params;
        const { quantity } = req.body;
        const userId = req.userId

        console.log(quantity);
    
        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        })
    
        if(!product){
            return res.status(404).json({
                message: "Product or Variant not found",
                success: false
            })
        }

        const variant = product.variants.filter(v => v?._id.toString() === variantId.toString())

        const stock = await stockOfVariant(productId, variantId)
        const cart = (await cartModel.findOne({ user: userId })) || (await cartModel.create({ user: userId }));
        const isProductExist = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId)
    
        if(isProductExist){
            const qtyInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity;
            if((qtyInCart + quantity) > stock){
                return res.status(400).json({
                    message: `Only ${stock - qtyInCart} items left in stock, and you already have ${qtyInCart} items in your cart.`,
                    success: false
                })
            }
    
            await cartModel.findOneAndUpdate(
                { user: userId, "items.product": productId, "items.variant": variantId },
                { $inc: { "items.$.quantity": quantity }},
                { new: true }
            )
    
            return res.status(200).json({
                message: "Cart update successfully",
                success: true
            })
        }
    
        if(quantity > stock){
            return res.status(400).json({
                message: `Only ${stock} items left in stock`,
                success: false
            })
        }
    
        cart.items.push({
            product: productId,
            variant: variantId,
            quantity,
            price: variant[0].price
        })
    
        await cart.save()
    
        return res.status(200).json({
            message: "Product added to cart successfully",
            success: true
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function getCart(req, res) {
    const userId = req.userId

    let cart = await cartModel.findOne({ user: userId })

    if(!cart){
        cart = await cartModel.create({ user: userId })
    }

    return res.status(200).json({
        message: "Cart fetch successfully",
        success: true,
        cart
    })
}