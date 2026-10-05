import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "https://maison-tr08.onrender.com/api/cart",
    withCredentials: true
})

export const addItem = async (productId, variantId, quantity) => {
    const res = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity
    })
    return res.data
}

export const removeItem = async (productId, variantId) => {
    const res = await cartApiInstance.delete(`/remove/${productId}/${variantId}`)
    return res.data
}

export const getCart = async () => {
    const res = await cartApiInstance.get("/")
    return res.data
}

export const increamentQuantity = async (productId, variantId) => {
    const res = await cartApiInstance.patch(`/increament/${productId}/${variantId}`)

    return res.data
}

export const decreamentQuantity = async (productId, variantId) => {
    const res = await cartApiInstance.patch(`/decreament/${productId}/${variantId}`)

    return res.data
}

export const createOrder = async () => {
    const res  = await cartApiInstance.post("/payment/create/order/")
    return res.data
}

export const verifyOrder = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const res = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })

    return res.data
}