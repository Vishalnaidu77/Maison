import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProduct from '../hooks/useProduct';

const currencyOptions = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleFetchProductDetails, handleEditProduct, handleCreateVariant } = useProduct();

  // Core Product State
  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceAmount, setPriceAmount] = useState('');
  const [priceCurrency, setPriceCurrency] = useState('INR');
  const [images, setImages] = useState([]);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'error'
  
  // New Variant Form States
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [isCreatingVariant, setIsCreatingVariant] = useState(false);
  const [varPriceAmount, setVarPriceAmount] = useState('');
  const [varPriceCurrency, setVarPriceCurrency] = useState('INR');
  const [varStock, setVarStock] = useState('0');
  const [varAttributes, setVarAttributes] = useState({});
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrVal, setNewAttrVal] = useState('');
  const [variantImages, setVariantImages] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState([]);

  // Fetch product on load
  const fetchProduct = async () => {
    setIsLoading(true);
    const res = await handleFetchProductDetails(productId);
    if (res?.success && res?.productDetail) {
      const prod = res.productDetail;
      setProduct(prod);
      setTitle(prod.title || '');
      setDescription(prod.description || '');
      setPriceAmount(prod.price?.amount || '');
      setPriceCurrency(prod.price?.currency || 'INR');
      setImages(prod.images || []);
    } else {
      setMessageType('error');
      setMessage('Failed to fetch product details.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Handle previewing local variant images before uploading
  useEffect(() => {
    const previews = variantImages.map((file) => URL.createObjectURL(file));
    setVariantImagePreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [variantImages]);

  const showFeedback = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  // Update base image deletion (locally in state)
  const removeBaseImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Inline Variant changes (stock, price, delete)
  const handleVariantStockChange = (varIndex, newStock) => {
    if (!product) return;
    const updatedVariants = product.variants.map((v, idx) => {
      if (idx === varIndex) {
        return { ...v, stock: Math.max(0, parseInt(newStock, 10) || 0) };
      }
      return v;
    });
    setProduct({ ...product, variants: updatedVariants });
  };

  const handleVariantPriceChange = (varIndex, newAmount) => {
    if (!product) return;
    const updatedVariants = product.variants.map((v, idx) => {
      if (idx === varIndex) {
        return {
          ...v,
          price: { ...v.price, amount: Math.max(0, parseFloat(newAmount) || 0) }
        };
      }
      return v;
    });
    setProduct({ ...product, variants: updatedVariants });
  };

  const handleRemoveVariant = (varIndex) => {
    if (!product) return;
    const updatedVariants = product.variants.filter((_, idx) => idx !== varIndex);
    setProduct({ ...product, variants: updatedVariants });
  };

  // Add dynamic attributes to the new variant
  const handleAddAttribute = (e) => {
    e.preventDefault();
    if (!newAttrName.trim() || !newAttrVal.trim()) return;
    setVarAttributes((prev) => ({
      ...prev,
      [newAttrName.trim()]: newAttrVal.trim()
    }));
    setNewAttrName('');
    setNewAttrVal('');
  };

  const handleRemoveAttribute = (key) => {
    setVarAttributes((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Handle uploading variant image files
  const handleVariantImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const nextFiles = [...variantImages, ...selectedFiles].slice(0, 3);
    setVariantImages(nextFiles);
    e.target.value = '';
  };

  const removeVariantImagePreview = (index) => {
    setVariantImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit and create new variant directly
  const handleCreateVariantSubmit = async (e) => {
    e.preventDefault();
    if (!varPriceAmount) {
      alert('Please enter a price for the variant.');
      return;
    }

    let finalAttributes = { ...varAttributes };
    // Auto-add pending attribute if user forg  ot to click "+ Add"
    if (newAttrName.trim() && newAttrVal.trim()) {
      finalAttributes[newAttrName.trim()] = newAttrVal.trim();
    }

    console.log(finalAttributes);

    setIsCreatingVariant(true);
    const formData = new FormData();
    formData.append('priceAmount', varPriceAmount);
    formData.append('priceCurrency', varPriceCurrency);
    formData.append('stock', varStock);
    formData.append('attributes', JSON.stringify(finalAttributes));
    
    variantImages.forEach((img) => {
      formData.append('images', img);
    });  

    const res = await handleCreateVariant(productId, formData);
    setIsCreatingVariant(false);

    if (res?.success && res?.product) {
      setProduct(res.product);
      // Reset form
      setVarPriceAmount('');
      setVarPriceCurrency(priceCurrency);
      setVarStock('0');
      setVarAttributes({});
      setNewAttrName('');
      setNewAttrVal('');
      setVariantImages([]);
      setShowVariantForm(false);
      showFeedback('Variant created successfully!', 'success');
    } else {
      showFeedback(res?.message || 'Failed to create variant.', 'error');
    }
  };

  // Submit base product changes & current variants stock/price list
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const productDetails = {
      _id: productId,
      title,
      description,
      price: {
        amount: parseFloat(priceAmount) || 0,
        currency: priceCurrency
      },
      images,
      variants: product?.variants || []
    };

    const res = await handleEditProduct(productDetails);
    setIsSaving(false);

    if (res?.success) {
      if (res.product) {
        setProduct(res.product);
        setImages(res.product.images || []);
      }
      showFeedback('Product changes saved successfully.', 'success');
    } else {
      showFeedback(res?.message || 'Failed to save product details.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm font-light text-gray-500 tracking-wider">LOADING PRODUCT DETAILS...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg font-light text-gray-900">Product not found.</p>
          <button
            onClick={() => navigate('/seller/dashboard/products')}
            className="mt-4 text-xs uppercase tracking-widest font-medium text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Navigation & Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <button
              onClick={() => navigate('/seller/dashboard/products')}
              className="group mb-2 inline-flex items-center text-xs font-light text-gray-400 hover:text-black transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Products
            </button>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Manage Product</h1>
            <p className="mt-1 text-xs font-light text-gray-500 uppercase tracking-widest">
              ID: {product._id}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-light text-gray-400">
              Last Updated: {new Date(product.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs tracking-wide border font-light animate-in fade-in slide-in-from-top-2 duration-300 ${
              messageType === 'success'
                ? 'bg-neutral-50 border-emerald-200 text-emerald-800'
                : messageType === 'error'
                ? 'bg-neutral-50 border-rose-200 text-rose-800'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800'
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Edit Base Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-[2rem] border border-gray-100 bg-neutral-50/40 p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-light text-gray-900 tracking-wide">Base Information</h2>
              
              <form onSubmit={handleSaveChanges} className="space-y-6">
                {/* Title */}
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="peer w-full border-b border-gray-200 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="title"
                    className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-400 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
                  >
                    Product Title
                  </label>
                </div>

                {/* Description */}
                <div className="relative">
                  <textarea
                    id="description"
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="peer w-full border-b border-gray-200 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none resize-none leading-relaxed"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="description"
                    className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-400 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
                  >
                    Description
                  </label>
                </div>

                {/* Base Price & Currency */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <input
                      type="number"
                      id="priceAmount"
                      min="0"
                      step="0.01"
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(e.target.value)}
                      className="peer w-full border-b border-gray-200 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="priceAmount"
                      className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-400 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
                    >
                      Base Price
                    </label>
                  </div>

                  <div className="relative">
                    <select
                      id="priceCurrency"
                      value={priceCurrency}
                      onChange={(e) => setPriceCurrency(e.target.value)}
                      className="peer w-full border-b border-gray-200 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
                      required
                    >
                      {currencyOptions.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="priceCurrency"
                      className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-400 transition-all peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
                    >
                      Currency
                    </label>
                  </div>
                </div>

                {/* Base Images Preview & Delete */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-light">Product Catalog Images</span>
                    <span className="text-xs text-gray-400 font-light">{images.length} Active</span>
                  </div>

                  {images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((img, idx) => (
                        <div key={img._id || idx} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white aspect-square">
                          <img src={img.url} alt={`Base Catalog ${idx + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeBaseImage(idx)}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white uppercase tracking-wider font-light"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400 font-light">
                      No catalog images uploaded.
                    </div>
                  )}
                </div>

                {/* Save Changes button */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-black text-white py-3.5 text-xs font-light uppercase tracking-widest hover:bg-neutral-900 transition-all active:scale-[0.99] rounded-xl flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Product Details'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Variants & Stock management */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-light text-gray-900 tracking-wide">Product Variants</h2>
                  <p className="text-xs text-gray-400 font-light mt-1">
                    Manage prices, stocks, and attributes for custom sizes, colours, or materials.
                  </p>
                </div>

                <button
                  onClick={() => setShowVariantForm(!showVariantForm)}
                  className="text-xs uppercase tracking-widest font-medium text-black border border-black/10 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors shrink-0"
                >
                  {showVariantForm ? 'Close Drawer' : '+ Create Variant'}
                </button>
              </div>

              {/* Dynamic Add Variant Section */}
              {showVariantForm && (
                <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/30 space-y-5 animate-in fade-in duration-300">
                  <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium border-b border-gray-100 pb-2">New Variant Configuration</p>
                  
                  <form onSubmit={handleCreateVariantSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="varPriceAmount"
                          min="0"
                          step="0.01"
                          value={varPriceAmount}
                          onChange={(e) => setVarPriceAmount(e.target.value)}
                          className="peer w-full border-b border-gray-300 bg-transparent py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="varPriceAmount"
                          className="absolute left-0 top-2.5 -translate-y-4.5 text-[10px] text-gray-400 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-xs peer-focus:-translate-y-4.5 peer-focus:text-[10px] peer-focus:text-black font-light cursor-text"
                        >
                          Price Amount *
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          id="varPriceCurrency"
                          value={varPriceCurrency}
                          onChange={(e) => setVarPriceCurrency(e.target.value)}
                          className="peer w-full border-b border-gray-300 bg-transparent py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none appearance-none"
                        >
                          {currencyOptions.map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                        <label
                          htmlFor="varPriceCurrency"
                          className="absolute left-0 top-2.5 -translate-y-4.5 text-[10px] text-gray-400 transition-all peer-focus:-translate-y-4.5 peer-focus:text-[10px] peer-focus:text-black font-light cursor-text"
                        >
                          Price Currency
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="varStock"
                          min="0"
                          value={varStock}
                          onChange={(e) => setVarStock(e.target.value)}
                          className="peer w-full border-b border-gray-300 bg-transparent py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none"
                          placeholder=" "
                        />
                        <label
                          htmlFor="varStock"
                          className="absolute left-0 top-2.5 -translate-y-4.5 text-[10px] text-gray-400 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-xs peer-focus:-translate-y-4.5 peer-focus:text-[10px] peer-focus:text-black font-light cursor-text"
                        >
                          Stock Count
                        </label>
                      </div>

                      <div className="relative">
                        <span className="text-[10px] text-gray-400 font-light block mb-1">Variant Images (Max 3)</span>
                        <label className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-2 text-center cursor-pointer hover:border-black transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleVariantImageChange}
                            className="hidden"
                            disabled={variantImages.length >= 3}
                          />
                          <span className="text-xs font-light text-gray-600">Choose images ({variantImages.length}/3)</span>
                        </label>
                      </div>
                    </div>

                    {/* Previews of newly selected variant images */}
                    {variantImagePreviews.length > 0 && (
                      <div className="flex gap-2">
                        {variantImagePreviews.map((preview, index) => (
                          <div key={preview} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                            <img src={preview} alt="Variant preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeVariantImagePreview(index)}
                              className="absolute top-0 right-0 bg-black/60 text-white rounded-bl-lg p-0.5 text-[8px]"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Variant Attributes creation */}
                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium block">Attributes (e.g. Size, Color)</span>
                      
                      {Object.keys(varAttributes).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {Object.entries(varAttributes).map(([k, v]) => (
                            <span key={k} className="inline-flex items-center gap-1 text-[10px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-light">
                              {k}: {v}
                              <button
                                type="button"
                                onClick={() => handleRemoveAttribute(k)}
                                className="text-[9px] text-gray-400 hover:text-black font-bold ml-1"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Attribute (e.g. Colour)"
                          value={newAttrName}
                          onChange={(e) => setNewAttrName(e.target.value)}
                          className="w-1/2 border-b border-gray-200 bg-transparent py-1.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. Indigo)"
                          value={newAttrVal}
                          onChange={(e) => setNewAttrVal(e.target.value)}
                          className="w-1/2 border-b border-gray-200 bg-transparent py-1.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddAttribute}
                          className="bg-neutral-900 text-white text-xs px-3 py-1 rounded-lg hover:bg-black transition-colors font-light shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isCreatingVariant}
                      className="w-full bg-black hover:bg-neutral-900 text-white py-3 text-xs font-light uppercase tracking-widest rounded-xl transition-all"
                    >
                      {isCreatingVariant ? 'Creating Variant...' : 'Confirm and Upload Variant'}
                    </button>
                  </form>
                </div>
              )}

              {/* Variant List / Stock / Price editing */}
              {product.variants && product.variants.length > 0 ? (
                <div className="space-y-4">
                  {product.variants.map((variant, varIdx) => {
                    const firstImage = variant.images?.[0]?.url;
                    
                    return (
                      <div
                        key={variant._id || varIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow gap-4"
                      >
                        {/* Variant info */}
                        <div className="flex items-start gap-4">
                          {firstImage ? (
                            <img
                              src={firstImage}
                              alt={`Variant ${varIdx}`}
                              className="w-16 h-16 rounded-xl object-cover border border-gray-150 shrink-0 bg-neutral-50"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl border border-gray-150 bg-neutral-50 flex items-center justify-center text-[10px] text-gray-300 font-light shrink-0">
                              NO IMG
                            </div>
                          )}

                          <div className="space-y-2">
                            {/* Attributes */}
                            <div className="flex flex-wrap gap-1.5">
                              {variant.attributes && Object.entries(variant.attributes).length > 0 ? (
                                Object.entries(variant.attributes).map(([key, val]) => (
                                  <span
                                    key={key}
                                    className="text-[10px] bg-neutral-50 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-light"
                                  >
                                    {key}: {val}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] italic text-gray-400 font-light">
                                  Default Spec
                                </span>
                              )}
                            </div>

                            <p className="text-[10px] text-gray-400 font-mono tracking-tighter">
                              ID: {variant._id || `temp-${varIdx}`}
                            </p>
                          </div>
                        </div>

                        {/* Stock & Price Controls */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-end sm:self-center">
                          {/* Price Edit */}
                          <div className="flex flex-col">
                            <label className="text-[10px] text-gray-400 font-light uppercase tracking-wider mb-1">
                              Price ({variant.price?.currency || 'INR'})
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price?.amount || 0}
                              onChange={(e) => handleVariantPriceChange(varIdx, e.target.value)}
                              className="w-20 border-b border-gray-200 py-1 text-sm text-gray-800 text-center focus:border-black focus:outline-none transition-colors"
                            />
                          </div>

                          {/* Stock Edit */}
                          <div className="flex flex-col">
                            <label className="text-[10px] text-gray-400 font-light uppercase tracking-wider mb-1">
                              Stock Count
                            </label>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleVariantStockChange(varIdx, (variant.stock || 0) - 1)}
                                className="px-2 py-1 text-xs text-gray-500 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
                              >
                                &minus;
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={variant.stock || 0}
                                onChange={(e) => handleVariantStockChange(varIdx, e.target.value)}
                                className="w-12 py-1 text-xs text-gray-800 text-center focus:outline-none border-x border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => handleVariantStockChange(varIdx, (variant.stock || 0) + 1)}
                                className="px-2 py-1 text-xs text-gray-500 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Delete Variant */}
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(varIdx)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1.5 self-end"
                            title="Delete Variant"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-neutral-900 text-white px-5 py-2.5 text-xs font-light uppercase tracking-widest hover:bg-black transition-colors rounded-xl disabled:opacity-55"
                    >
                      {isSaving ? 'Saving Changes...' : 'Save Stock & Price Edits'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-sm font-light text-gray-500">No variants exist for this product yet.</p>
                  <p className="text-xs text-gray-400 font-light mt-1 mb-4">
                    Create color, size, or material variations to manage separate stocks.
                  </p>
                  <button
                    onClick={() => setShowVariantForm(true)}
                    className="text-xs uppercase tracking-widest font-medium text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-all rounded-lg"
                  >
                    Configure First Variant
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;