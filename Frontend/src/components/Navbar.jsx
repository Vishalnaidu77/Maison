import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setUser } from '../features/auth/states/auth.slice';
import Sidebar from './Sidebar';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // If logged-in user is a seller, render the Sidebar instead of top Navbar
  if (user?.role === 'seller') {
    return <Sidebar />;
  }
  const cartItems = useSelector((state) => state.cart.items) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    dispatch(setUser(null));
    navigate('/login');
  };

  const totalCartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  // Navigation Links
  const navLinks = [
    { name: 'Shop', href: '/#shop' },
    { name: 'Collections', href: '/#collections' },
    { name: 'Editorial', href: '/#editorial' },
    { name: 'Newsletter', href: '/#newsletter' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-light tracking-[0.3em] uppercase text-gray-900 transition-opacity hover:opacity-80"
        >
          Maison
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
            >
              {link.name}
            </a>
          ))}
          {user?.role === 'seller' && (
            <Link
              to="/seller/dashboard/products"
              className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
            >
              My Products
            </Link>
          )}
        </nav>

        {/* User Controls & Cart */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {user ? (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="hidden lg:inline text-xs font-light text-gray-400">
                Welcome, <strong className="font-normal text-gray-900">{user.fullname}</strong>
              </span>
              {user.role === 'seller' ? (
                <Link
                  to="/seller/dashboard/products"
                  className="rounded-full bg-black px-3.5 py-1.5 text-[10px] font-light uppercase tracking-widest text-white transition-all hover:bg-gray-800 hover:scale-[1.02]"
                >
                  Dashboard
                </Link>
              ) : (
                <span className="hidden sm:inline-block rounded-full bg-gray-100 px-3 py-1 text-[10px] font-light uppercase tracking-widest text-gray-500">
                  Buyer
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="text-xs font-light text-gray-400 hover:text-black hover:underline underline-offset-4 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-xs font-light uppercase tracking-[0.15em] text-gray-900 hover:opacity-80 transition-opacity"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-block text-xs font-light uppercase tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-1 text-gray-900 hover:opacity-75 transition-opacity cursor-pointer"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalCartCount > 0 && (
              <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] font-light text-white">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-gray-900 md:hidden hover:opacity-75 transition-opacity cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 hover:text-black transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
            {user?.role === 'seller' && (
              <>
                <Link
                  to="/seller/dashboard/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 hover:text-black transition-colors py-1"
                >
                  My Products
                </Link>
                <Link
                  to="/seller/dashboard/add-product"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 hover:text-black transition-colors py-1"
                >
                  + Add Product
                </Link>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            {user ? (
              <div className="flex flex-col space-y-2">
                <span className="text-xs font-light text-gray-500">
                  Signed in as <strong className="font-normal text-gray-900">{user.fullname}</strong>
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-left text-xs font-light uppercase tracking-widest text-red-600 hover:underline pt-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-light uppercase tracking-[0.15em] text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-light uppercase tracking-[0.15em] text-gray-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
