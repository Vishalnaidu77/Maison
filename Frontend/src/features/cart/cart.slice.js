import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload?.items || action.payload || []
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        increamentCartQuantity: (state, action) => {
            const { productId, variantId } = action.payload

            // Fallback to ensure items is an array
            const items = Array.isArray(state.items) ? state.items : (state.items?.items || []);

            state.items = items.map(item => {
                if(item.product === productId && item.variant === variantId){
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    return item
                }
            })
        },
        decreamentCartQuantity: (state, action) => {
            const { productId, variantId } = action.payload;

            const items = Array.isArray(state.items) ? state.items : (state.items?.items || [])
            state.items = items.map(item => {
                if(item.product === productId && item.variant === variantId){
                    return { ...item, quantity: item.quantity - 1 }
                } else {
                    return item
                }
            })
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setCart, addItem, setLoading, increamentCartQuantity, decreamentCartQuantity } = cartSlice.actions
export default cartSlice.reducer