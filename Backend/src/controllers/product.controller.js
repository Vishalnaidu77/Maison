import { productModel } from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js"

export async function addProductController(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body
        const seller = req.user
        
    
        const images = await Promise.all(req.files.map(async file => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
        }))
    
        let variants = []
        if (req.body.variants) {
            try {
                variants = typeof req.body.variants === 'string'
                    ? JSON.parse(req.body.variants)
                    : req.body.variants
            } catch (err) {
                console.error("Error parsing variants:", err)
            }
        }
    
        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images,
            variants,
            seller: seller._id
        })
    
        return res.status(201).json({
            message: "Product Create successfully",
            success: true,
            product
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    } 
}

export async function getSellerProducts(req, res) {
    try {
        const seller = req.user
    
        const products = await productModel.find({ seller: seller._id })
        if(products.length === 0){
            return res.status(404).json({
                message: "Products not found by this seller",
                success: false,
                err: "Products not found"
            })
        }
    
        return res.status(200).json({
            message: "Fetch all products",
            success: true,
            products
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function getAllProducts(req, res){
    try {
        const products = await productModel.find()

        if(!products){
            return res.status(404).json({
                message: "Products not available",
                success: false,
                err: "Products not available"
            })
        }

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        })
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function editProductController(req, res) {
    try {
        const { newTitle, newDescription, newPrice, newImages, title, description, price, images, variants } = req.body
        const { productId } = req.params
    
        const product = await productModel.findById(productId)
        if(!product){
            return res.status(404).json({
                message: "Product not found",
                success: false,
                err: "Product not found"
            })
        }
    
        const updatedProductDetails = {}
    
        if(title !== undefined){
            updatedProductDetails.title = title
        } else if(newTitle !== undefined){
            updatedProductDetails.title = newTitle
        }
    
        if(description !== undefined){
            updatedProductDetails.description = description
        } else if(newDescription !== undefined){
            updatedProductDetails.description = newDescription
        }
    
        if(price !== undefined){
            updatedProductDetails.price = price
        } else if(newPrice !== undefined){
            updatedProductDetails.price = newPrice
        }
    
        if(images !== undefined){
            updatedProductDetails.images = images
        } else if(newImages !== undefined){
            updatedProductDetails.images = newImages
        }

        if(variants !== undefined){
            updatedProductDetails.variants = variants
        }
    
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { $set: updatedProductDetails },
            { runValidators: true, returnDocument: 'after' }
        )
    
        return res.status(200).json({
            message: "Edit product successfully",
            success: true,
            product: updatedProduct
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected Error",
            success: false,
            err: err.message
        })
    }   
}

export async function getSellerProductDetails(req, res){

    const { productId } = req.params;

    try {
        const product = await productModel.findById(productId)
        if(!product){
            return res.status(404).json({
                message: "Product not found",
                success: false,
                err: "Product not found"
            })
        }

        return res.status(200).json({
            message: "Fetch Product Details successfully",
            success: true,
            product
        })
        
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function addVariantsController(req, res) {
    try {
        const { productId } = req.params

        const product = await productModel.findOne({ _id: productId })
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }
        
        const files = req.files
        const { priceAmount, stock, priceCurrency, attributes } = req.body;
        const images = [];

        if(files && files.length > 0){
            (await Promise.all(files.map(async (file) => {
                const image = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
                return image
            }))).map(img => images.push(img))
        }

        const attribute = JSON.parse(attributes || "{}")
        console.log(attributes);

        product.variants.push({
            images,
            price: {
                amount: priceAmount,
                currency: priceCurrency || product.price.currency
            },
            stock,
            attributes: attribute
        })

        await product.save()

        return res.status(200).json({
            message: "Product variant added successfully",
            success: true,
            product
        })

    } catch (err) {
        return res.status(400).json({
            message: "Failed to add variant",
            success: false,
            err: err.message
        })
    }
}