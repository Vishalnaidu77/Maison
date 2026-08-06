import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useProduct from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';
import useCart from '../../cart/hooks/useCart';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const products = useSelector((state) => state.product.products) || [];
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.product.isLoading);

  const { handleGetAllProducts } = useProduct();

  // Component local states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);

  // Get current product
  const currentProduct = products.filter((p) => p._id === productId);
  const product = currentProduct[0];

  // Fetch all products if store is empty on page refresh
  useEffect(() => {
    if (products.length === 0) {
      handleGetAllProducts();
    }
  }, [products.length]);

  // Reset states when changing product
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedVariantIndex(null);
    setActiveVariant(product?.variants?.[0]?._id || null);
  }, [productId, product]);

  // Get related products
  const relatedProducts = products
    .filter((p) => p._id !== productId)
    .slice(0, 4);

  // Trigger custom toast
  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const { handleAddItem } = useCart()

  const handleAddToCart = async (productId, variantId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const selectedVariant = selectedVariantIndex !== null ? product?.variants?.[selectedVariantIndex] : null;
    const variantDesc = selectedVariant
      ? ` (${Object.entries(selectedVariant.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(', ')})`
      : '';

    const currentVariantId = variantId || activeVariant || product?.variants?.[0]?._id;

    await handleAddItem(productId, variantId = currentVariantId, quantity);

    setQuantity(1);
    triggerToast(`Added ${quantity} x "${product?.title}"${variantDesc} to your cart.`);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    triggerToast(
      !isWishlisted
        ? `Added "${product?.title}" to your wishlist.`
        : `Removed "${product?.title}" from your wishlist.`
    );
  };

  // Accordion toggles
  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? '' : section);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-white font-sans text-gray-900 antialiased flex flex-col overflow-hidden">
        {/* Header Skeleton */}
        <div className="h-20 shrink-0 border-b border-gray-100 bg-white/80 animate-pulse" />

        {/* Main Content Loading */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 sm:px-8 grid gap-8 lg:grid-cols-12 lg:gap-12 overflow-hidden">
          <div className="lg:col-span-7 flex flex-col min-h-0 h-full overflow-hidden animate-pulse">
            <div className="flex-1 bg-gray-100 rounded-3xl" />
            <div className="grid grid-cols-5 gap-3 mt-3 shrink-0">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-square bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen bg-white font-sans text-gray-900 antialiased flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 shrink-0 border-b border-gray-100 bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8">
            <Link to="/" className="text-xl font-light tracking-[0.3em] uppercase text-gray-900 hover:opacity-80 transition-opacity">
              Maison
            </Link>
            <Link to="/" className="text-xs font-light uppercase tracking-[0.15em] text-gray-900 border-b border-black pb-1 hover:opacity-80 transition-opacity">
              Back to Catalog
            </Link>
          </div>
        </header>

        {/* Not Found */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-gray-400 font-light block mb-4">Error 404</span>
          <h2 className="text-3xl font-light mb-4">Product Not Found</h2>
          <p className="text-sm font-light text-gray-500 max-w-md mb-8 leading-relaxed">
            The collection piece you are looking for is either unavailable or has been archived.
          </p>
          <Link to="/" className="bg-black text-white text-xs uppercase tracking-widest font-light px-8 py-4 hover:bg-gray-900 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = selectedVariantIndex !== null ? product?.variants?.[selectedVariantIndex] : null;
  const currentImages = (selectedVariant?.images && selectedVariant.images.length > 0)
    ? selectedVariant.images
    : (product?.images || []);
  const coverImage = currentImages[activeImageIndex]?.url || currentImages[0]?.url;
  const priceAmount = selectedVariant?.price?.amount ?? product?.price?.amount;
  const priceCurrency = selectedVariant?.price?.currency || product?.price?.currency || 'INR';

  return (
    <div className="h-screen bg-white font-sans text-gray-900 antialiased selection:bg-black selection:text-white flex flex-col overflow-hidden">
      {/* 1. Header */}
      <header className="h-20 shrink-0 border-b border-gray-100 bg-white/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link to="/" className="text-xl font-light tracking-[0.3em] uppercase text-gray-900 transition-opacity hover:opacity-80">
            Maison
          </Link>
          <div className="flex items-center space-x-6">
             <button className="relative p-1 text-gray-900 hover:opacity-75 transition-opacity" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Product Content */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="mx-auto max-w-7xl h-full px-6 py-6 sm:px-8 flex flex-col min-h-0">

          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center space-x-2 text-[10px] font-light uppercase tracking-[0.2em] text-gray-400 shrink-0">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <Link to="/#shop" className="hover:text-black transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-gray-800 line-clamp-1">{product?.title}</span>
          </nav>

          <div className="flex-1 min-h-0 grid gap-8 lg:grid-cols-12 lg:gap-12 overflow-hidden">

            {/* Gallery Column */}
            <div className="lg:col-span-7 flex flex-col min-h-0 h-full overflow-hidden">
              {/* Large Main Image */}
              <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 group flex items-center justify-center">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={product?.title}
                    className="h-full w-full object-contain p-4 transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-light text-gray-400">
                    No Image Available
                  </div>
                )}
                <div className="absolute left-6 top-6 rounded-full bg-white/90 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-900 backdrop-blur-sm shadow-sm">
                  {priceCurrency}
                </div>
              </div>

              {/* Thumbnails list */}
              {currentImages && currentImages.length > 1 && (
                <div className="flex gap-2.5 mt-3 justify-center shrink-0 overflow-x-auto py-1">
                  {currentImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                      }}
                      className={`relative w-14 h-14 shrink-0 overflow-hidden rounded-xl border bg-gray-50 transition-all duration-300 ${
                        activeImageIndex === idx
                          ? 'border-black ring-2 ring-black/5 scale-[0.98]'
                          : 'border-gray-200 hover:border-gray-400 hover:scale-[1.02]'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product?.title} thumb ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info / Controls Column */}
            <div className="lg:col-span-5 flex flex-col justify-between min-h-0 h-full overflow-y-auto pr-1 pb-4">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-light uppercase tracking-[0.3em] text-gray-400 block mb-1">Maison Atelier</span>
                  <h1 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-wide leading-tight mb-2">
                    {product?.title}
                  </h1>

                  {/* Price and Ratings */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mt-4">
                    <span className="text-xl font-light text-gray-900">
                      {priceAmount != null ? `${priceCurrency} ${priceAmount}` : '0'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex text-black">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[9px] tracking-wider text-gray-400 uppercase font-light">(24 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Product Variants Selector */}
                {product?.variants && product.variants.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 block">Available Options</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedVariantIndex(null);
                          setActiveImageIndex(0);
                          setActiveVariant(product?.variants?.[0]?._id || null);
                        }}  
                        className={`px-3 py-1.5 rounded-xl text-xs font-light uppercase tracking-wider border transition-all duration-300 ${
                          selectedVariantIndex === null
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 text-gray-800 hover:border-gray-400 bg-white'
                        }`}
                      >
                        Default
                      </button>
                      {product.variants.map((v, idx) => {
                        const attrString = Object.entries(v.attributes || {})
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(' / ');
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedVariantIndex(idx);
                              setActiveImageIndex(0);
                              setActiveVariant(v._id);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-light uppercase tracking-wider border transition-all duration-300 ${
                              selectedVariantIndex === idx
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 text-gray-800 hover:border-gray-400 bg-white'
                            }`}
                          >
                            {attrString || `Option ${idx + 1}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Accordion Panels */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="border-b border-gray-100 pb-3">
                    <button
                      onClick={() => toggleAccordion('description')}
                      className="flex w-full items-center justify-between text-left text-xs uppercase tracking-wider text-gray-800 font-light hover:text-black transition-colors"
                    >
                      <span>Description</span>
                      <svg className={`h-4 w-4 text-gray-400 transform transition-transform duration-300 ${activeAccordion === 'description' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    {activeAccordion === 'description' && (
                      <div className="mt-2 text-xs font-light leading-relaxed text-gray-500 animate-in fade-in slide-in-from-top-1 duration-200">
                        {product?.description || 'No description provided.'}
                      </div>
                    )}
                  </div>
                  <div className="border-b border-gray-100 pb-3">
                    <button
                      onClick={() => toggleAccordion('details')}
                      className="flex w-full items-center justify-between text-left text-xs uppercase tracking-wider text-gray-800 font-light hover:text-black transition-colors"
                    >
                      <span>Details & Care</span>
                      <svg className={`h-4 w-4 text-gray-400 transform transition-transform duration-300 ${activeAccordion === 'details' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    {activeAccordion === 'details' && (
                      <ul className="mt-2 list-disc list-inside space-y-1 text-[11px] font-light text-gray-500 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                        <li>Composed of 100% organic cotton, selected for comfort and minimal ecological footprint.</li>
                        <li>Double-stitched hems ensure longevity and shape retention.</li>
                        <li>Ethically assembled in our partner workshops in Florence, Italy.</li>
                      </ul>
                    )}
                  </div>
                  <div className="border-b border-gray-100 pb-3">
                    <button
                      onClick={() => toggleAccordion('shipping')}
                      className="flex w-full items-center justify-between text-left text-xs uppercase tracking-wider text-gray-800 font-light hover:text-black transition-colors"
                    >
                      <span>Shipping & Returns</span>
                      <svg className={`h-4 w-4 text-gray-400 transform transition-transform duration-300 ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    {activeAccordion === 'shipping' && (
                      <div className="mt-2 text-[11px] font-light text-gray-500 leading-relaxed space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p>Complimentary express shipping on all domestic orders within {priceCurrency === 'INR' ? 'India' : 'our shipping zones'} on values over 10,000.</p>
                        <p>We provide a 14-day return window on all unworn items with tags attached.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Quantity */}
              <div className="space-y-4 pt-4 border-t border-gray-100 mt-6 shrink-0 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-light uppercase tracking-wider text-gray-400">Quantity</span>
                  <div className="flex h-9 w-28 items-center justify-between rounded-lg border border-gray-200 px-2.5 bg-white">
                    <button
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(quantity - 1)}
                      className="p-1 text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                    <span className="text-xs font-light text-gray-900 w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-gray-500 hover:text-black transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => !user && navigate("/login")}
                    className="flex-1 bg-white text-black py-3 text-xs uppercase cursor-pointer tracking-widest font-light hover:bg-neutral-100 transition-all rounded-xl border border-gray-200 active:scale-[0.99] flex justify-center items-center gap-2"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAddToCart(productId, activeVariant)}
                    className="flex-1 bg-black text-white py-3 text-xs uppercase cursor-pointer tracking-widest font-light hover:bg-gray-800 transition-all rounded-xl active:scale-[0.99] flex justify-center items-center gap-2"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => !user ? navigate("/login") : handleToggleWishlist()}
                    className={`w-12 h-10 flex items-center justify-center border rounded-xl cursor-pointer transition-all duration-300 ${
                      isWishlisted
                        ? 'border-red-200 bg-red-50 text-red-500'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-black'
                    }`}
                  >
                    <svg
                      className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-current' : 'fill-none'}`}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3.5 rounded-2xl bg-black px-6 py-4.5 text-xs font-light tracking-wide text-white shadow-2xl backdrop-blur-md border border-white/10">
            <svg className="h-4.5 w-4.5 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="leading-relaxed">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;