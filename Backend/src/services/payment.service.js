import Razorpay from 'razorpay'
import { config } from '../config/config.js'

const razorpay = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET
})

export const createOrder = async ({ amount, currency = "INR"}) => {
    const option = {
        amount: amount * 100, // Multiply by Hundered because Razorpay take smallest value of currency
        currency
    }

    const order = await razorpay.orders.create(option)
    return order
}
