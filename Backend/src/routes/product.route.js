import { Router } from 'express'
import { addProductController, getAllProducts } from '../controllers/product.controller.js';
import { verifySeller, verifyUser } from '../middleware/auth.middleware.js';
import multer, { memoryStorage } from 'multer'

const productRouter = Router()

const upload = multer({
    storage: memoryStorage(),
    limits:{ 
        fileSize: 5 * 1024 * 1024 // 5MB
    } 
})

productRouter.post("/add-product", verifySeller, upload.array('images', 7), addProductController)
productRouter.get("/all-products/seller", verifySeller, getAllProducts)

export default productRouter;