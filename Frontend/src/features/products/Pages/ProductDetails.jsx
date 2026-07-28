import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useProduct from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';

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
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Off-White');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Fetch all products if store is empty on page refresh
  useEffect(() => {
    if (products.length === 0) {
      handleGetAllProducts();
    }
  }, [products.length]);

  // Reset states when changing product
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setSelectedSize('M');
    setSelectedColor('Off-White');
  }, [productId]);

  // Get current product
  const currentProduct = products.filter((p) => p._id === productId);
  const product = currentProduct[0];

  console.log(product);

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

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login")
    }
    triggerToast(`Added ${quantity} x "${product?.title}" (Size: ${selectedSize}, Color: ${selectedColor}) to your cart.`);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    triggerToast(
      !isWishlisted
        ? `Added "${product?.title}" to your wishlist.`
        : `Removed "${product?.title}" from your wishlist.`
    );
  };

  console.log(user);

  // Color options dictionary
  const colors = [
    { name: 'Off-White', hex: '#FAF9F6', class: 'bg-[#FAF9F6] border-gray-300' },
    { name: 'Charcoal', hex: '#36454F', class: 'bg-[#36454F] border-transparent' },
    { name: 'Taupe', hex: '#B38B6D', class: 'bg-[#B38B6D] border-transparent' },
    { name: 'Sage', hex: '#9CAF88', class: 'bg-[#9CAF88] border-transparent' },
  ];

  // Accordion toggles
  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? '' : section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 antialiased flex flex-col justify-between">
        {/* Header Skeleton */}
        <div className="h-20 border-b border-gray-100 bg-white/80 animate-pulse" />

        {/* Main Content Loading */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 sm:px-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 space-y-4 animate-pulse">
            <div className="aspect-[4/5] bg-gray-100 rounded-3xl" />
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-square bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6 animate-pulse mt-4">
            <div className="h-4 bg-gray-100 w-1/4 rounded" />
            <div className="h-10 bg-gray-100 w-3/4 rounded" />
            <div className="h-6 bg-gray-100 w-1/3 rounded" />
            <div className="h-24 bg-gray-100 rounded" />
            <div className="h-12 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 antialiased flex flex-col justify-between">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
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

        {/* Footer */}
        <footer className="bg-black text-white py-12 px-6 sm:px-8 text-center text-[10px] font-light text-gray-500 border-t border-gray-900">
          &copy; 2026 Maison. All rights reserved.
        </footer>
      </div>
    );
  }

  const coverImage = product?.images?.[activeImageIndex]?.url || product?.images?.[0]?.url;
  const priceAmount = product?.price?.amount;
  const priceCurrency = product?.price?.currency || 'INR';

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-black selection:text-white flex flex-col">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link to="/" className="text-xl font-light tracking-[0.3em] uppercase text-gray-900 transition-opacity hover:opacity-80">
            Maison
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/#shop" className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              Shop
            </Link>
            <Link to="/#collections" className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              Collections
            </Link>
            <Link to="/#editorial" className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              Editorial
            </Link>
            <Link to="/#newsletter" className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              Newsletter
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-xs font-light text-gray-400">
                  Welcome, <strong className="font-normal text-gray-900">{user.fullname}</strong>
                </span>
                {user.role === 'seller' ? (
                  <Link
                    to="/seller/dashboard/products"
                    className="rounded-full bg-black px-4 py-1.5 text-[10px] font-light uppercase tracking-widest text-white transition-all hover:bg-gray-800 hover:scale-[1.02]"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-light uppercase tracking-widest text-gray-500">
                    Buyer
                  </span>
                )}
                <button
                  onClick={() => console.log('Dummy Logout triggered')}
                  className="text-xs font-light text-gray-400 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-xs font-light uppercase tracking-[0.15em] text-gray-900 hover:opacity-80 transition-opacity">
                Sign In
              </Link>
            )}

            <button className="relative p-1 text-gray-900 hover:opacity-75 transition-opacity" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] font-light text-white animate-pulse">
                {quantity > 0 ? quantity : 0}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Product Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:py-16">

          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center space-x-2 text-[10px] font-light uppercase tracking-[0.2em] text-gray-400">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <Link to="/#shop" className="hover:text-black transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-gray-800 line-clamp-1">{product?.title}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">

            {/* Gallery Column */}
            <div className="lg:col-span-7">
              <div className="sticky top-28 space-y-6">

                {/* Large Main Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-[2rem] border border-gray-100 group">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={product?.title}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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
                {product?.images && product.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-3.5">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative aspect-square overflow-hidden rounded-[1.25rem] border bg-gray-50 transition-all duration-300 ${activeImageIndex === idx
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
            </div>

            {/* Product Info / Controls Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-[10px] font-light uppercase tracking-[0.3em] text-gray-400 block mb-2">Maison Atelier</span>
                <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-wide leading-tight mb-4">
                  {product?.title}
                </h1>

                {/* Price and Ratings */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-6 mt-6">
                  <span className="text-2xl font-light text-gray-900">
                    {priceAmount != null ? `${priceCurrency} ${priceAmount}` : '0'}
                  </span>

                  {/* Reviews mockup */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-black">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] tracking-wider text-gray-400 uppercase font-light">(24 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Color Swatches */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-light uppercase tracking-wider text-gray-400">
                  <span>Color</span>
                  <span className="text-gray-900 font-medium">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative h-8 w-8 rounded-full border transition-all duration-300 ${color.class} ${selectedColor === color.name
                        ? 'ring-2 ring-black ring-offset-2 scale-[1.08]'
                        : 'hover:scale-[1.05]'
                        }`}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className={`h-1.5 w-1.5 rounded-full ${color.name === 'Off-White' ? 'bg-black' : 'bg-white'}`} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-light uppercase tracking-wider text-gray-400">
                  <span>Size</span>
                  <button className="text-gray-900 hover:underline underline-offset-4">Size Guide</button>
                </div>
                <div className="grid grid-cols-5 gap-2.5">
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-lg text-xs font-light uppercase tracking-widest border transition-all duration-300 ${selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-gray-800 hover:border-gray-400 bg-white'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="space-y-3">
                <span className="text-xs font-light uppercase tracking-wider text-gray-400 block">Quantity</span>
                <div className="flex h-11 w-32 items-center justify-between rounded-lg border border-gray-200 px-3 bg-white">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                    className="p-1 text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="text-xs font-light text-gray-900 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-gray-500 hover:text-black transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => !user && navigate("/login")}
                  className="flex-1 bg-white text-black py-4 text-xs uppercase cursor-pointer tracking-widest font-light hover:bg-neutral-100 transition-all rounded-xl shadow-lg shadow-black/5 active:scale-[0.99] flex justify-center items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white py-4 text-xs uppercase cursor-pointer tracking-widest font-light hover:bg-neutral-800 transition-all rounded-xl shadow-lg shadow-black/5 active:scale-[0.99] flex justify-center items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  Add to Cart
                </button>

                <button
                  onClick={() => !user ? navigate("/login") : handleToggleWishlist}
                  className={`w-14 h-12 flex items-center justify-center border rounded-xl cursor-pointer transition-all duration-300 ${isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-500 scale-[0.98]'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-black'
                    }`}
                  aria-label="Add to Wishlist"
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isWishlisted ? 'fill-current scale-110' : 'fill-none'}`}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
              </div>

              {/* Accordion Panels */}
              <div className="border-t border-gray-100 pt-6 mt-8 space-y-4">

                {/* 1. Description */}
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleAccordion('description')}
                    className="flex w-full items-center justify-between text-left text-xs uppercase tracking-wider text-gray-800 font-light hover:text-black transition-colors"
                  >
                    <span>Description</span>
                    <svg className={`h-4.5 w-4.5 text-gray-400 transform transition-transform duration-300 ${activeAccordion === 'description' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {activeAccordion === 'description' && (
                    <div className="mt-3 text-sm font-light leading-7 text-gray-500 animate-in fade-in slide-in-from-top-2 duration-300">
                      {product?.description || 'No description provided.'}
                    </div>
                  )}
                </div>

                {/* 2. Details & Care */}
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleAccordion('details')}
                    className="flex w-full items-center justify-between text-left text-xs uppercase tracking-wider text-gray-800 font-light hover:text-black transition-colors"
                  >
                    <span>Details & Care</span>
                    <svg className={`h-4.5 w-4.5 text-gray-400 transform transition-transform duration-300 ${activeAccordion === 'details' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {activeAccordion === 'details' && (
                    <ul className="mt-3 list-disc list-inside space-y-2 text-xs font-light text-gray-500 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                      <li>Composed of 100% organic cotton, selected for comfort and minimal ecological footprint.</li>
                      <li>Double-stitched hems ensure longevity and shape retention.</li>
                      <li>Ethically assembled in our partner workshops in Florence, Italy.</li>
                      <li>Recommended dry clean or gentle cold machine wash; flat dry.</li>
                    </ul>
                  )}
                </div>

                {/* 3. Shipping & Returns */}
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className="flex w-full items-center justify-between text-left text-xs uppercase tracking-wider text-gray-800 font-light hover:text-black transition-colors"
                  >
                    <span>Shipping & Returns</span>
                    <svg className={`h-4.5 w-4.5 text-gray-400 transform transition-transform duration-300 ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {activeAccordion === 'shipping' && (
                    <div className="mt-3 text-xs font-light text-gray-500 leading-relaxed space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p>Complimentary express shipping on all domestic orders within {priceCurrency === 'INR' ? 'India' : 'our shipping zones'} on values over 10,000.</p>
                      <p>International shipments are delivered via DHL Express within 3–7 business days. Custom duties and taxes may apply at checkout.</p>
                      <p>We provide a 14-day return window on all unworn items with tags attached. Return labels are complimentary.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-28 border-t border-gray-100 pt-20">
              <div className="mb-14 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-light uppercase tracking-[0.3em] text-gray-400 block mb-2">Curated Pairings</span>
                  <h2 className="text-2xl font-light text-gray-900">You May Also Like</h2>
                </div>
                <Link to="/" className="text-xs font-light uppercase tracking-widest text-black border-b border-black pb-1 hover:opacity-85 transition-opacity">
                  View Catalog
                </Link>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* 3. Footer */}
      <footer className="bg-black text-white py-20 px-6 sm:px-8 border-t border-gray-900 mt-20">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8 pb-16 border-b border-white/10">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <span className="text-lg font-light tracking-[0.25em] uppercase block">Maison</span>
            <p className="text-xs font-light text-gray-400 leading-relaxed max-w-xs">
              Curated wardrobe staples crafted for longevity and understated sophistication. Designed in Paris, made ethically.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-gray-300">Shop</h4>
            <ul className="space-y-2 text-xs font-light text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Apparel</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-gray-300">Support</h4>
            <ul className="space-y-2 text-xs font-light text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Duties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Product Care</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-gray-300">Company</h4>
            <ul className="space-y-2 text-xs font-light text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-light text-gray-500">
          <div>
            &copy; 2026 Maison. All rights reserved. Built with precision and care.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Instagram</a>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Spotify</a>
          </div>
        </div>
      </footer>

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