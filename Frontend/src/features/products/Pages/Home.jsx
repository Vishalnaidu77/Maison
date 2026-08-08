import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useProduct from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const products = useSelector((state) => state.product.products) || [];
  const user = useSelector((state) => state.auth.user);
  const { handleGetAllProducts } = useProduct();
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const cartItems = useSelector(state => state.cart.items)

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  // Helper to categorize a product based on its title and description
  const getProductCategory = (product) => {
    const text = `${product?.title || ''} ${product?.description || ''}`.toLowerCase();
    if (
      text.includes('bag') || 
      text.includes('tote') || 
      text.includes('wallet') || 
      text.includes('purse') || 
      text.includes('accessory') || 
      text.includes('accessories') || 
      text.includes('belt') || 
      text.includes('hat') || 
      text.includes('scarf')
    ) {
      return 'Accessories';
    }
    return 'Apparel';
  };

  // Filter products based on active category
  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'All') return true;
    return getProductCategory(product) === activeCategory;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-black selection:text-white">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          {/* Logo */}
          <Link to="/" className="text-xl font-light tracking-[0.3em] uppercase text-gray-900 transition-opacity hover:opacity-80">
            Maison
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10">
            <a href="#shop" className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              Shop
            </a>
            <a href="#collections" className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              Collections
            </a>
            <a href="#editorial" className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              Editorial
            </a>
            <a href="#newsletter" className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              Newsletter
            </a>
          </nav>

          {/* User Controls */}
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

            <button 
            onClick={() => navigate("/cart")}
            className="relative p-1 text-gray-900 hover:opacity-75 transition-opacity" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <line x1="3" x2="21" y1="6" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] font-light text-white">
                {cartItems.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Banner */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Maison Editorial Hero" 
            className="h-full w-full object-cover object-center animate-in fade-in zoom-in-95 duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"></div>
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 sm:px-8 lg:pb-28">
          <div className="max-w-2xl text-white animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            <span className="text-xs uppercase tracking-[0.4em] text-white/70 font-light block mb-4">
              Summer / Autumn Edit
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-wide leading-tight mb-8">
              A Study in<br/>Minimalism
            </h1>
            <p className="text-white/80 font-light text-sm sm:text-base max-w-md mb-10 leading-relaxed">
              Discover clean lines, functional cuts, and artisanal materials designed for a modern wardrobe that transcends trends.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#shop" 
                className="bg-white text-black text-xs uppercase tracking-widest font-light px-8 py-4 hover:bg-black hover:text-white transition-all duration-300 rounded-none shadow-lg shadow-black/10"
              >
                Shop The Collection
              </a>
              <a 
                href="#collections" 
                className="border border-white/40 backdrop-blur-sm text-white text-xs uppercase tracking-widest font-light px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 rounded-none"
              >
                View Lookbook
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curator Highlights (Collections Grid) */}
      <section id="collections" className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-light uppercase tracking-[0.3em] text-gray-400 block mb-2">Curated Spaces</span>
            <h2 className="text-3xl font-light text-gray-900">Explore Collections</h2>
          </div>
          <p className="text-sm font-light text-gray-500 max-w-xs leading-relaxed">
            Thoughtfully organized capsules focusing on sustainability and everyday refinement.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
              alt="The Tailored Capsule" 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <span className="text-[9px] uppercase tracking-[0.35em] text-white/70 font-light block mb-2">Capsule 01</span>
              <h3 className="text-xl font-light mb-2">Modern Tailoring</h3>
              <p className="text-xs text-white/70 font-light max-w-xs line-clamp-2 mb-4">
                Structured blazers, pressed trousers, and architectural silhouettes built for modern days.
              </p>
              <div className="flex items-center text-[10px] font-light uppercase tracking-wider group-hover:underline underline-offset-4">
                Explore Capsule
                <svg className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop" 
              alt="Linen Series" 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <span className="text-[9px] uppercase tracking-[0.35em] text-white/70 font-light block mb-2">Capsule 02</span>
              <h3 className="text-xl font-light mb-2">The Linen Series</h3>
              <p className="text-xs text-white/70 font-light max-w-xs line-clamp-2 mb-4">
                Breathable fabrics, relaxed slips, and organic cotton shirts designed for warm weather longevity.
              </p>
              <div className="flex items-center text-[10px] font-light uppercase tracking-wider group-hover:underline underline-offset-4">
                Explore Capsule
                <svg className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer sm:col-span-2 lg:col-span-1">
            <img 
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1000&auto=format&fit=crop" 
              alt="Leather Goods" 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <span className="text-[9px] uppercase tracking-[0.35em] text-white/70 font-light block mb-2">Capsule 03</span>
              <h3 className="text-xl font-light mb-2">Artisanal Carryalls</h3>
              <p className="text-xs text-white/70 font-light max-w-xs line-clamp-2 mb-4">
                Hand-finished Italian leather totes, micro clutches, and minimalist belts designed for daily use.
              </p>
              <div className="flex items-center text-[10px] font-light uppercase tracking-wider group-hover:underline underline-offset-4">
                Explore Capsule
                <svg className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Gallery (Filtered Catalog) */}
      <section id="shop" className="bg-gray-50/50 border-y border-gray-100 py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          {/* Section Header */}
          <div className="mb-14 text-center">
            <span className="text-[10px] font-light uppercase tracking-[0.35em] text-gray-400 block mb-3">Our Offerings</span>
            <h2 className="text-3xl font-light mb-6">Featured Pieces</h2>
            
            {/* Minimalist Filter Tabs */}
            <div className="flex items-center justify-center space-x-8 mt-10">
              {['All', 'Apparel', 'Accessories'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative pb-2 text-xs uppercase tracking-[0.2em] font-light transition-colors ${
                    activeCategory === category ? 'text-black' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {category}
                  {activeCategory === category && (
                    <span className="absolute bottom-0 left-0 h-[1px] w-full bg-black animate-in fade-in slide-in-from-left duration-300"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex h-60 items-center justify-center text-sm font-light text-gray-400">
              No products found under {activeCategory}.
            </div>
          )}
        </div>
      </section>

      {/* 5. Editorial Spotlight */}
      <section id="editorial" className="mx-auto max-w-7xl px-6 py-28 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-12 items-center">
          {/* Editorial Text */}
          <div className="lg:col-span-5 space-y-8">
            <span className="text-[10px] font-light uppercase tracking-[0.3em] text-gray-400 block">Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 leading-tight">
              Designed for Longevity. Crafted for Everyday.
            </h2>
            <div className="h-[1px] w-20 bg-black"></div>
            <p className="text-sm font-light text-gray-600 leading-8">
              At Maison, we challenge the standard cycle of rapid consumption. We partner with ethical workshops in Italy and Portugal to design pieces from durable, organic, and certified surplus fabrics.
            </p>
            <p className="text-sm font-light text-gray-600 leading-8">
              Our designs avoid heavy hardware and complex detailing, keeping the aesthetic focused entirely on premium finishes, tailoring, and natural color palettes.
            </p>
            <div>
              <a 
                href="#collections" 
                className="text-xs uppercase tracking-widest font-normal text-black border-b border-black pb-2 hover:opacity-75 transition-opacity inline-flex items-center"
              >
                Read Our Sustainability Story
                <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
              </a>
            </div>
          </div>

          {/* Editorial Image Composition */}
          <div className="lg:col-span-7 grid gap-6 grid-cols-2">
            <div className="space-y-6">
              <div className="overflow-hidden bg-gray-50">
                <img 
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop" 
                  alt="Summer Silhouettes Editorial" 
                  className="h-[300px] w-full object-cover hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div className="p-4 border-l border-gray-100">
                <p className="text-[11px] font-light italic text-gray-500">"True elegance lies in returning to details that cannot be further simplified."</p>
                <p className="text-[9px] font-light uppercase tracking-wider text-gray-400 mt-2">— Maison Studio</p>
              </div>
            </div>
            <div className="pt-12">
              <div className="overflow-hidden bg-gray-50">
                <img 
                  src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop" 
                  alt="Fine craftsmanship closeup" 
                  className="h-[380px] w-full object-cover hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Block */}
      <section id="newsletter" className="border-t border-gray-100 bg-gray-50/50 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <span className="text-[10px] font-light uppercase tracking-[0.4em] text-gray-400 block mb-4">Stay Connected</span>
          <h2 className="text-3xl font-light mb-4">The Maison Letters</h2>
          <p className="text-sm font-light text-gray-500 max-w-md mx-auto mb-12 leading-relaxed">
            Subscribe to receive editorial letters, collection releases, and design stories directly to your inbox.
          </p>

          {subscribed ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 animate-in fade-in duration-500 max-w-md mx-auto">
              <p className="text-sm font-light text-gray-900">Thank you for subscribing.</p>
              <p className="text-xs font-light text-gray-500 mt-2">You will receive our next collection preview shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mx-auto max-w-md space-y-6">
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" " 
                  className="peer w-full border-b border-gray-300 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none text-center" 
                />
                <label className="absolute left-0 right-0 top-3 -translate-y-5 text-xs text-gray-400 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light text-center pointer-events-none">
                  Email address
                </label>
              </div>
              <button 
                type="submit" 
                className="bg-black text-white text-xs uppercase tracking-widest font-light px-8 py-3.5 hover:bg-gray-900 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-black text-white py-20 px-6 sm:px-8 border-t border-gray-900">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8 pb-16 border-b border-white/10">
          {/* Logo & Intro */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <span className="text-lg font-light tracking-[0.25em] uppercase block">Maison</span>
            <p className="text-xs font-light text-gray-400 leading-relaxed max-w-xs">
              Curated wardrobe staples crafted for longevity and understated sophistication. Designed in Paris, made ethically.
            </p>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-gray-300">Shop</h4>
            <ul className="space-y-2 text-xs font-light text-gray-400">
              <li><a href="#shop" className="hover:text-white transition-colors">All Products</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Apparel</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Accessories</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-gray-300">Support</h4>
            <ul className="space-y-2 text-xs font-light text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Duties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Product Care</a></li>
            </ul>
          </div>

          {/* Company Links */}
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
    </div>
  );
};

export default Home;