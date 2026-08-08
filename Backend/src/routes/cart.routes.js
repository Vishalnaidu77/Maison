import { Router } from 'express'
import { verifyUser } from '../middleware/auth.middleware.js'
import { addToCart, decreamentQuantity, getCart, increamentQuantity } from '../controllers/cart.controller.js'

const cartRouter = Router()

cartRouter.post("/add/:productId/:variantId", verifyUser, addToCart)
cartRouter.get("/", verifyUser, getCart)
cartRouter.patch("/increament/:productId/:variantId", verifyUser, increamentQuantity)
cartRouter.patch("/decreament/:productId/:variantId", verifyUser, decreamentQuantity)

export default cartRouter