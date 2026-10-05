import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
    },
    reducers: {
        setCart: (state, action) => {
            const payloadItems = action.payload?.items || action.payload || []
            state.items = Array.isArray(payloadItems) ? payloadItems : []
        },
        addItem: (state, action) => {
            state.items = Array.isArray(state.items) ? [...state.items, action.payload] : [action.payload]
        },
        removeItemFromCart: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.filter(item => {
                const itemProductId = item.product?._id?.toString() || item.product?.toString()
                const itemVariantId = item.variant?.toString()
                return !(itemProductId === productId.toString() && itemVariantId === variantId.toString())
            })
        },
        increamentCartQuantity: (state, action) => {
            const { productId, variantId } = action.payload

            const items = Array.isArray(state.items) ? state.items : []

            state.items = items.map(item => {
                const itemProductId = item.product?._id?.toString() || item.product?.toString()
                const itemVariantId = item.variant?.toString()
                if(itemProductId === productId.toString() && itemVariantId === variantId.toString()){
                    return { ...item, quantity: Number(item.quantity || 0) + 1 }
                } else {
                    return item
                }
            })
        },
        decreamentCartQuantity: (state, action) => {
            const { productId, variantId } = action.payload;

            const items = Array.isArray(state.items) ? state.items : []
            state.items = items
                .map(item => {
                    const itemProductId = item.product?._id?.toString() || item.product?.toString()
                    const itemVariantId = item.variant?.toString()
                    if(itemProductId === productId.toString() && itemVariantId === variantId.toString()){
                        const nextQty = Number(item.quantity || 0) - 1
                        return nextQty > 0 ? { ...item, quantity: nextQty } : null
                    } else {
                        return item
                    }
                })
                .filter(Boolean)
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
        
    }
})

export const { setCart, addItem, setLoading, increamentCartQuantity, decreamentCartQuantity, removeItemFromCart } = cartSlice.actions
export default cartSlice.reducer