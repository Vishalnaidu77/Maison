import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItem = async (productId, variantId, quantity) => {
    const res = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity
    })
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