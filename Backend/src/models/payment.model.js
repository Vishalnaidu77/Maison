import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const paymentSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    price: {
        type: priceSchema,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    },
    orderItems: [
        {
            title: String,
            description: String,
            productId: mongoose.Schema.Types.ObjectId,
            variantId: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            images: [ { url: String }],
            price: priceSchema
        }
    ]
})

export const paymentModel = mongoose.model("payment", paymentSchema)
