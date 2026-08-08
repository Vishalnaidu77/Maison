import { Router } from 'express'
import { verifyUser } from '../middleware/auth.middleware.js'
import { addToCart, getCart, increamentQuantity } from '../controllers/cart.controller.js'

const cartRouter = Router()

cartRouter.post("/add/:productId/:variantId", verifyUser, addToCart)
cartRouter.get("/", verifyUser, getCart)
cartRouter.patch("/:productId/:variantId", verifyUser, increamentQuantity)

export default cartRouter