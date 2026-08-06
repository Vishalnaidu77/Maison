import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

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
        type: priceSchema,
        required: true
    },
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema,
            }
        }
    ]
    // keyFeatures: {
    //     type: [String],
    // }
}, { timestamps: true })

export const productModel = mongoose.model("Products", productSchema)
