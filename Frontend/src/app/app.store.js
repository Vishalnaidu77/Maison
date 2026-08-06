import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/states/auth.slice'
import productSlice from '../features/products/product.slice'
import cartSlice from "../features/cart/cart.slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productSlice,
        cart: cartSlice
    }
})