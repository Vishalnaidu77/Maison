import React from 'react'
import { useDispatch } from 'react-redux'
import { setEditProduct, setError, setLoading, setProducts, setSellerProducts, setSellerProductToList } from '../product.slice'
import { addProduct, editProduct, getAllProducts, getProductDetails, getSellerProducts, addVariant } from '../services/product.api'

const useProduct = () => {

    const dispatch = useDispatch()

    const handleAddProduct = async (formdata) => {
        dispatch(setLoading(true))

        try {
            const res = await addProduct(formdata)
            dispatch(setSellerProductToList(res.product))
            return {
                success: true,
                message: res.message
            }
        } catch (err) {
            const message = err?.response?.data?.message || err.message
            dispatch(setError(message))
            return {
                success: false,
                message
            }
        } finally {
            dispatch(setLoading(false))
        }

    }

    const handleGetSellerProduct = async () => {
        dispatch(setLoading(true))

        try {
            const res = await getSellerProducts()
            dispatch(setSellerProducts(res.products))
            dispatch(setLoading(false))
        } catch (err) {
             const message = err?.response?.data?.message || err.message
            dispatch(setError(message))
            return {
                success: false,
                message
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetAllProducts = async () => {
        dispatch(setLoading(false))

        try {
            const res = await getAllProducts()
            dispatch(setProducts(res.products))
        } catch (err) {
            dispatch(setError(err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleEditProduct = async (productDetails) => {
        dispatch(setLoading(true))

        try {
            const res = await editProduct(productDetails)
            dispatch(setEditProduct(res.product))
            return {
                success: true,
                message: res.message,
                product: res.product
            }
        } catch (err) {
            const message = err?.response?.data?.message || err.message
            dispatch(setError(message))
            return {
                success: false,
                message
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleFetchProductDetails = async (productId) => {
        dispatch(setLoading(true))
        
        try {
            const res = await getProductDetails(productId)
            dispatch(setLoading(false))
            return {
                success: true,
                message: res.message,
                productDetail: res.product
            }
        } catch (err) {
            dispatch(setError(err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleCreateVariant = async (productId, formData) => {
        dispatch(setLoading(true))
        try {
            const res = await addVariant(productId, formData)
            dispatch(setEditProduct(res.product))
            return {
                success: true,
                message: res.message,
                product: res.product
            }
        } catch (err) {
            const message = err?.response?.data?.message || err.message
            dispatch(setError(message))
            return {
                success: false,
                message
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

  return {
    handleAddProduct,
    handleGetSellerProduct,
    handleGetAllProducts,
    handleEditProduct,
    handleFetchProductDetails,
    handleCreateVariant
  }
}

export default useProduct