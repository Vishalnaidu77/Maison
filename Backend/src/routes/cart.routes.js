import { Router } from 'express'
import { verifyUser } from '../middleware/auth.middleware.js'
import { addToCart, getCart } from '../controllers/cart.controller.js'

const cartRouter = Router()

cartRouter.post("/add/:productId/:variantId", verifyUser, addToCart)
cartRouter.get("/", verifyUser, getCart)

export default cartRouter