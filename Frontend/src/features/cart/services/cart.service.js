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