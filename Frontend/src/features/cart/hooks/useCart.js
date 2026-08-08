import React from 'react'
import { useDispatch } from 'react-redux'
import { addItem, decreamentCartQuantity, increamentCartQuantity, setCart, setLoading } from '../cart.slice'
import { addItem as addItemToCart, decreamentQuantity, getCart, increamentQuantity } from '../services/cart.service'

const useCart = () => {

    const dispatch = useDispatch()

    const handleAddItem = async (productId, variantId, quantity) => {
        dispatch(setLoading(true))

        try {
            const res = await addItemToCart(productId, variantId, quantity)
            dispatch(setCart(res.cart))
            return res
        } catch (err) {
            return err.message
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetCart = async () => { 
        dispatch(setLoading(true))

        try {
            const res = await getCart();
            dispatch(setCart(res.cart))
        } catch (err) {
            return err.message
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleIncreamentQuantity = async (productId, variantId) => {
        dispatch(setLoading(true))

        try {
            const res = await increamentQuantity(productId, variantId)
            dispatch(increamentCartQuantity({ productId, variantId }))
        } catch (err) {
            return err.message
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleDecreamentQuantity = async (productId, variantId) => {
        dispatch(setLoading(true))

        try {
            const res = await decreamentQuantity(productId, variantId)
            dispatch(decreamentCartQuantity({ productId, variantId }))
        } catch (err) {
            return err.message
        } finally {
            dispatch(setLoading(false))
        }
    }

  return {
    handleAddItem,
    handleGetCart,
    handleIncreamentQuantity,
    handleDecreamentQuantity
  }
}

export default useCart