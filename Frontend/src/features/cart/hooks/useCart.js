import React from 'react'
import { useDispatch } from 'react-redux'
import { addItem, setLoading } from '../cart.slice'
import { addItem as addItemToCart } from '../services/cart.service'

const useCart = () => {

    const dispatch = useDispatch()

    const handleAddItem = async (productId, variantId, quantity) => {
        dispatch(setLoading(true))

        try {
            const res = await addItemToCart(productId, variantId, quantity)
            return res
        } catch (err) {
            return err.message
        } finally {
            dispatch(setLoading(false))
        }
    }

  return {
    handleAddItem
  }
}

export default useCart