import { Router } from 'express'
import { verifyUser } from '../middleware/auth.middleware.js'
import { addToCart, createOrderController, decreamentQuantity, getCart, increamentQuantity, removeFromCart, verifyPaymentController } from '../controllers/cart.controller.js'

const cartRouter = Router()

cartRouter.post("/add/:productId/:variantId", verifyUser, addToCart)
cartRouter.get("/", verifyUser, getCart)
cartRouter.delete("/remove/:productId/:variantId", verifyUser, removeFromCart)
cartRouter.patch("/increament/:productId/:variantId", verifyUser, increamentQuantity)
cartRouter.patch("/decreament/:productId/:variantId", verifyUser, decreamentQuantity)

// Create orders
cartRouter.post("/payment/create/order", verifyUser, createOrderController)
cartRouter.post("/payment/verify/order", verifyUser, verifyPaymentController)

export default cartRouter