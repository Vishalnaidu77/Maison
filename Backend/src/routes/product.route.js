import { Router } from 'express'
import { addProductController, addVariantsController, editProductController, getAllProducts, getSellerProductDetails, getSellerProducts } from '../controllers/product.controller.js';
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
productRouter.get("/all-products/seller", verifySeller, getSellerProducts)
productRouter.get("/", getAllProducts)
productRouter.post("/add-variants/:productId", verifySeller, upload.array('images', 7), addVariantsController)
productRouter.patch("/edit-product/:productId", verifySeller, editProductController)
productRouter.get("/seller-product/:productId", verifySeller, getSellerProductDetails)

export default productRouter;