import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "https://maison-tr08.onrender.com/api/product" || "http://localhost:8000/api/product",
    withCredentials: true,
})

export const addProduct = async (formData) => {
    const res = await productApiInstance.post("/add-product", formData)
    return res.data
}

export const getSellerProducts = async () => {
    const res = await productApiInstance.get("/all-products/seller")
    return res.data
}

export const getAllProducts = async () => {
    const res = await productApiInstance.get("/")
    return res.data
}

export const editProduct = async (productDetails) => {
    const res = await productApiInstance.patch(`/edit-product/${productDetails._id}`, productDetails)
    return res.data
}

export const getProductDetails = async (productId) => {
    const res = await productApiInstance.get(`seller-product/${productId}`)
    return res.data
}

export const addVariant = async (productId, formData) => {
    const res = await productApiInstance.post(`/add-variants/${productId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data
}