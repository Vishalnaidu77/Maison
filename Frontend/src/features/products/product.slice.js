import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        sellerProduct: [],
        isLoading: false,
        error: null
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setSellerProducts: (state, action) => {
            state.sellerProduct = action.payload
        },
        setSellerProductToList: (state, action) => {
            state.sellerProduct.push(action.payload)
        },
        setEditProduct: (state, action) => {
            const index = state.products.findIndex(p => p._id === action.payload._id)
            if(index !== -1){
                state.products[index] = action.payload
            }
            const sIndex = state.sellerProduct.findIndex(p => p._id === action.payload._id)
            if(sIndex !== -1){
                state.sellerProduct[sIndex] = action.payload
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setProducts, setError, setLoading, setSellerProducts, setSellerProductToList, setEditProduct } = productSlice.actions
export default productSlice.reducer