import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            alt: {
                type: String,
            }
        }
    ],
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "INR"],
            default: "INR"
        }
    },
    // keyFeatures: {
    //     type: [String],
    // }
}, { timestamps: true })

export const productModel = mongoose.model("Products", productSchema)
