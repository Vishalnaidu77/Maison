import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Google } from '../components/Google';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user = await handleLogin(email, password)
    if(user.role === "seller") navigate("/seller/dashboard/products")
    else navigate("/")

    setEmail("")
    setPassword("")
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Section - Image */}
      <div className="hidden w-1/2 lg:block relative">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Fashion Model" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-between p-12 lg:p-24 text-white">
          <div className="text-3xl font-light tracking-widest uppercase">
            Maison
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-light mb-6 leading-tight">
              Timeless Style.<br/>Crafted for Every Season.
            </h1>
            <p className="text-white/80 max-w-md font-light text-sm lg:text-base">
              Discover a world of minimal, sophisticated editorial fashion. Join us to curate your personal wardrobe with pieces designed for longevity and effortless elegance.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="lg:hidden text-2xl font-light tracking-widest uppercase mb-12 text-center">
            Maison
          </div>
          
          <h2 className="text-3xl font-light mb-2 text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-10 font-light">
            Enter your details to access your account.
          </p>

          <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
            <div className="relative group">
              <input 
                type="email" 
                id="email" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="peer w-full border-b border-gray-300 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none" 
                placeholder=" " 
                required
              />
              <label 
                htmlFor="email" 
                className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
              >
                Email address
              </label>
            </div>

            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="peer w-full border-b border-gray-300 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none pr-10" 
                placeholder=" " 
                required
              />
              <label 
                htmlFor="password" 
                className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
              >
                Password
              </label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-xs text-gray-500 font-light group-hover:text-black transition-colors">Remember me</span>
              </label>
              
              <a href="#" className="text-xs text-gray-500 hover:text-black font-light transition-colors underline-offset-4 hover:underline">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="w-full bg-black text-white py-3.5 mt-4 text-sm font-light hover:bg-gray-900 transition-all active:scale-[0.99] rounded-xl flex justify-center items-center gap-2"
            >
              Sign In
            </button>
          </form>

          <div className="mt-10 mb-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-gray-400 font-light uppercase tracking-wider">Or continue with</span>
            </div>
          </div>

          <Google />

          <p className="text-center text-sm text-gray-500 mt-12 font-light">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-normal hover:underline underline-offset-4 transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;