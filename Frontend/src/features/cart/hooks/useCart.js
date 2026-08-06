import React from 'react'
import { useDispatch } from 'react-redux'
import { addItem, setCart, setLoading } from '../cart.slice'
import { addItem as addItemToCart, getCart } from '../services/cart.service'

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

    const handleGetCart = async (userId) => {
        dispatch(setLoading(true))

        try {
            const res = await getCart(userId);
            dispatch(addItem(res.cart))
        } catch (err) {
            return err.message
        } finally {
            dispatch(setLoading(false))
        }
    }

  return {
    handleAddItem,
    handleGetCart
  }
}

export default useCart