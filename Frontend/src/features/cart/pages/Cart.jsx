import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import useCart from '../hooks/useCart'
import useProduct from '../../products/hooks/useProduct'

const Cart = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user)
  
  // Handle case where cartItems might be the whole cart object or an array of items
  const cartState = useSelector(state => state.cart.items);
  const cartItems = Array.isArray(cartState) && cartState[0]?.items 
    ? cartState[0].items 
    : (cartState?.items || (Array.isArray(cartState) ? cartState : []));

  const products = useSelector(state => state.product.products) || [];
  const { handleGetCart } = useCart()
  const { handleGetAllProducts } = useProduct()

  useEffect(() => {
    if(!user) return;
    handleGetCart()
  }, [user])

  useEffect(() => {
    if (products.length === 0) {
      handleGetAllProducts();
    }
  }, [products.length])

  // Calculate totals
  const subtotalValue = cartItems.reduce((acc, item) => {
    return acc + (item?.price?.amount || 0) * (item?.quantity || 1);
  }, 0);
  
  const subtotal = subtotalValue.toFixed(2);
  const currency = cartItems[0]?.price?.currency || 'INR';
  const shipping = subtotalValue > 5000 || subtotalValue === 0 ? 0 : 80;
  const total = (subtotalValue + shipping).toFixed(2);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-black selection:text-white flex flex-col">
      {/* Header */}
      <header className="h-20 shrink-0 border-b border-gray-100 bg-white/85 backdrop-blur-md sticky top-0 z-10 transition-all duration-300">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link to="/" className="text-xl font-light tracking-[0.3em] uppercase text-gray-900 transition-opacity hover:opacity-80">
            Maison
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/#shop" className="text-xs font-light uppercase tracking-[0.15em] text-gray-900 border-b border-transparent hover:border-black pb-1 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 sm:px-8">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-wide">
            Your Cart
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400 font-light">
            {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-t border-gray-100">
            <span className="text-xs uppercase tracking-[0.4em] text-gray-400 font-light block mb-4">Empty</span>
            <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
            <p className="text-sm font-light text-gray-500 max-w-md mb-8 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Discover our latest collection.
            </p>
            <Link to="/#shop" className="bg-black text-white text-xs uppercase tracking-widest font-light px-8 py-4 hover:bg-gray-800 transition-colors rounded-xl">
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col space-y-8">
              <div className="hidden sm:grid sm:grid-cols-12 pb-4 border-b border-gray-100 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <div className="space-y-6">
                {cartItems.map((item, idx) => {
                  const product = products.find(p => p._id === item.product);
                  const variant = product?.variants?.find(v => v._id === item.variant);
                  
                  // Safe fallback if product data is not loaded yet
                  if (!product) return null;

                  const image = variant?.images?.[0]?.url || product?.images?.[0]?.url;
                  const itemTotal = ((item?.price?.amount || 0) * (item?.quantity || 1)).toFixed(2)
                  const variantDesc = variant ? Object.entries(variant.attributes || {}).map(([k, v]) => `${v}`).join(', ') : '';

                  return (
                    <div key={idx} className="flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-6 py-6 border-b border-gray-50">
                      
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center gap-6">
                        <Link to={`/product/${product._id}`} className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden group">
                          {image ? (
                            <img src={image} alt={product.title} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-light">No img</div>
                          )}
                        </Link>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-light uppercase tracking-[0.2em] text-gray-400 mb-1">Maison Atelier</span>
                          <Link to={`/product/${product._id}`} className="text-sm sm:text-base font-light text-gray-900 hover:opacity-70 transition-opacity line-clamp-2 leading-relaxed">
                            {product.title}
                          </Link>
                          {variantDesc && (
                            <span className="mt-1.5 text-xs text-gray-500 font-light">{variantDesc}</span>
                          )}
                          <span className="mt-2 text-sm text-gray-900 font-light sm:hidden">
                            {currency} {item?.price?.amount}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-3 flex items-center justify-start sm:justify-center">
                        <div className="flex h-9 w-28 items-center justify-between rounded-lg border border-gray-200 px-2.5 bg-white">
                          <button className="p-1 text-gray-400 hover:text-black transition-colors" aria-label="Decrease quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="text-xs font-light text-gray-900 w-6 text-center">{item.quantity}</span>
                          <button className="p-1 text-gray-400 hover:text-black transition-colors" aria-label="Increase quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="col-span-3 flex items-center justify-between sm:justify-end gap-4">
                        <span className="hidden sm:block text-sm font-light text-gray-900">
                          {currency} {itemTotal}
                        </span>
                        <button className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-0.5">
                          Remove
                        </button>
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 sticky top-28">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm font-light text-gray-600 mb-6 border-b border-gray-200/60 pb-6">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-gray-900">{currency} {subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-gray-900">{shipping === 0 ? 'Complimentary' : `${currency} ${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-[10px] text-gray-400">
                      Free shipping on orders over {currency} 10000
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-medium uppercase tracking-wider text-gray-900">Total</span>
                  <span className="text-xl font-light text-gray-900">{currency} {total}</span>
                </div>

                <button className="w-full bg-black text-white py-4 rounded-xl text-xs uppercase tracking-widest font-light hover:bg-gray-800 transition-all active:scale-[0.99] flex justify-center items-center gap-2">
                  Proceed to Checkout
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-wider">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  Secure Checkout
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default Cart