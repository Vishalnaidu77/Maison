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
    
        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images,
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

export async function getAllProducts(req, res) {
    
}