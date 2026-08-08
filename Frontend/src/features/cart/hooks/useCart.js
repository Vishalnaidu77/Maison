import React from 'react'
import { useDispatch } from 'react-redux'
import { addItem, increamentCartQuantity, setCart, setLoading } from '../cart.slice'
import { addItem as addItemToCart, getCart, increamentQuantity } from '../services/cart.service'

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

    const handleIncreamentQuantity = async (product, variant) => {
        dispatch(setLoading(true))

        try {
            const res = await increamentQuantity(product, variant)
            dispatch(increamentCartQuantity({ product, variant }))
        } catch (err) {
            return err.message
        } finally {
            dispatch(setLoading(false))
        }
    }

  return {
    handleAddItem,
    handleGetCart,
    handleIncreamentQuantity
  }
}

export default useCart