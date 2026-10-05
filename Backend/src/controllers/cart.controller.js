import { stockOfVariant } from "../dao/product.dao.js";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { getCartDetails } from "../dao/cart.dao.js";
import { createOrder } from "../services/payment.service.js";
import { paymentModel } from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

export async function addToCart (req, res){
    try {
        const { productId, variantId } = req.params;
        const { quantity } = req.body;
        const userId = req.userId
    
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
            success: true,
            cart
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// This controller remove the product from the cart
export async function removeFromCart(req, res){
    try {
        const { productId, variantId } = req.params;
        const userId = req.userId;

        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        });

        if(!product){
            return res.status(404).json({
                message: "Product or variant not found",
                success: false,
                err: "Not found"
            });
        }

        const cart = await cartModel.findOne({ user: userId });

        if(!cart){
            return res.status(400).json({
                message: "No cart exist",
                success: false,
                err: "No cart exist"
            });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId);

        if(!existingItem){
            return res.status(404).json({
                message: "Item not found in cart",
                success: false,
                err: "Item not found in cart"
            });
        }

        cart.items = cart.items.filter(item => !(item.product.toString() === productId && item.variant.toString() === variantId));
        await cart.save();

        return res.status(200).json({
            message: "Item removed from cart successfully",
            success: true,
            cart
        });

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        });
    }
}

export async function getCart(req, res) {
    try {
        const userId = req.userId

        const cart = await getCartDetails(userId)

        if(!cart){
            cart = await cartModel.create({ user: userId })
        }

        return res.status(200).json({
            message: "Cart fetch successfully",
            success: true,
            cart: cart
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function increamentQuantity(req, res) {
    try {
        const userId = req.userId;
        const { productId, variantId } = req.params;

        const product = await productModel.findOne({ 
           _id: productId,
           "variants._id": variantId 
        })

        if(!product){
            return res.status(404).json({
                message: "Product or variant not found",
                success: false,
                err: "Not found"
            })
        }

        const cart = await cartModel.findOne({ user: userId })
        if(!cart){
            return res.status(400).json({
                message: "No cart exist",
                success: false,
                err: "No cart exist"
            })
        }

        const stock = await stockOfVariant(productId, variantId)

        const itemQtyInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity || 0;

        if((itemQtyInCart + 1) > stock){
            return res.status(400).json({
                message: `Only ${stock} items left in the stock, and you already have ${itemQtyInCart} items in your cart`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { "items.product": productId, "items.variant": variantId },
            { $inc: {
                "items.$.quantity": 1
            }},
            { new: true }
        )

        return res.status(200).json({
            message: "Quantity update successfully",
            success: true,
        })

    } catch (err) {
        return res.status(400).json({
            messagae: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function decreamentQuantity(req, res){
    try {
        const userId = req.userId
        const { productId, variantId } = req.params;

        const product = await productModel.findOne({ 
           _id: productId,
           "variants._id": variantId 
        })

        if(!product){
            return res.status(404).json({
                message: "Product or variant not found",
                success: false,
                err: "Not found"
            })
        }

        const cart = await cartModel.findOne({ user: userId })
        if(!cart){
            return res.status(400).json({
                message: "No cart exist",
                success: false,
                err: "No cart exist"
            })
        }

        const stock = await stockOfVariant(productId, variantId)
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity || 0;

        if((quantityInCart + 1) > stock){
            return res.status(400).json({
                message: `Only ${stock} items left in the stock, and you already have ${itemQtyInCart} items in your cart`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { "items.product": productId, "items.variant": variantId },
            { $inc: { 
                "items.$.quantity": -1 
            }},
            { new: true }
        )

        return res.status(200).json({
            message: "Decrease quantity successfull",
            success: false
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function createOrderController(req, res){
    const userId = req.userId
    const cart = await getCartDetails(userId)

    const order = await createOrder({ amount: cart.itemTotal, currency: cart.currency})

    const payment = await paymentModel.create({
        user: userId,
        price: {
            amount: cart.itemTotal,
            currency: cart.currency
        },
        razorpay: {
            orderId: order.id
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            description: item.product.description,
            productId: item.product._id,
            variantId: item.variant,
            quantity: item.quantity,
            images: item.product.variants.images || item.product.images,
            price: {
                amount: item.product.variants.price.amount || item.product.price.amount,
                currency: item.product.variants.price.currency || item.product.price.currency
            }
        }))
    })

    res.status(200).json({
        message: "Order create successfully",
        order
    })
}

export async function verifyPaymentController (req, res){
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })

    if(!payment){
        return res.status(404).json({
            message: "Payment not found",
            success: false,
            err: "Payment not found"
        })
    }

    const isPaymentValid = validatePaymentVerification({
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

    if(!isPaymentValid){
        return res.status(400).json({
            message: "Payment not verified",
            success: false,
            err: "Payment not verified"
        })
    }

    payment.status = "paid"
    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature

    await payment.save()

    return res.status(200).json({
        message: "Payment verified successfully",
        success: true
    })
}