import React, { useEffect, useState } from 'react';
import useProduct from '../hooks/useProduct';

const currencyOptions = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

const CreateProduct = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceAmount, setPriceAmount] = useState('');
  const [priceCurrency, setPriceCurrency] = useState('INR');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Variant States
  const [variants, setVariants] = useState([]);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [varPriceAmount, setVarPriceAmount] = useState('');
  const [varPriceCurrency, setVarPriceCurrency] = useState('INR');
  const [varStock, setVarStock] = useState('0');
  const [varImageUrl, setVarImageUrl] = useState('');
  const [varAttributes, setVarAttributes] = useState({});
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrVal, setNewAttrVal] = useState('');

  const { handleAddProduct } = useProduct();

  useEffect(() => {
    const previews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [images]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const nextFiles = [...images, ...selectedFiles].slice(0, 7);
    setImages(nextFiles);
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    setImages((currentImages) => currentImages.filter((_, index) => index !== indexToRemove));
  };

  const handleAddAttribute = (e) => {
    e.preventDefault();
    if (!newAttrName.trim() || !newAttrVal.trim()) return;
    setVarAttributes(prev => ({
      ...prev,
      [newAttrName.trim()]: newAttrVal.trim()
    }));
    setNewAttrName('');
    setNewAttrVal('');
  };

  const handleRemoveAttribute = (key) => {
    setVarAttributes(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSaveVariant = (e) => {
    e.preventDefault();
    if (!varPriceAmount) {
      alert("Please enter a price for the variant.");
      return;
    }
    if (!varImageUrl.trim()) {
      alert("Please enter at least one image URL for the variant.");
      return;
    }

    const newVariant = {
      price: {
        amount: parseFloat(varPriceAmount),
        currency: varPriceCurrency
      },
      stock: parseInt(varStock, 10) || 0,
      images: [{ url: varImageUrl.trim() }],
      attributes: varAttributes
    };

    setVariants(prev => [...prev, newVariant]);
    // Reset form
    setVarPriceAmount('');
    setVarPriceCurrency(priceCurrency);
    setVarStock('0');
    setVarImageUrl('');
    setVarAttributes({});
    setShowVariantForm(false);
  };

  const handleRemoveVariant = (index) => {
    setVariants(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (images.length === 0) {
      setMessage('Add at least one image to continue.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priceAmount', priceAmount);
    formData.append('priceCurrency', priceCurrency);
    formData.append('variants', JSON.stringify(variants));

    images.forEach((image) => {
      formData.append('images', image);
    });

    setIsSubmitting(true);
    const response = await handleAddProduct(formData);
    setIsSubmitting(false);

    if (response?.success) {
      setTitle('');
      setDescription('');
      setPriceAmount('');
      setPriceCurrency('INR');
      setImages([]);
      setVariants([]);
      setMessage('Product saved successfully.');
      return;
    }

    setMessage(response?.message || 'Unable to save product.');
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 sm:px-8 lg:px-10 flex items-center justify-center">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-2xl font-light tracking-widest uppercase mb-10 text-center text-gray-900">
          Maison
        </div>

        <h2 className="text-3xl font-light mb-2 text-gray-900 text-center">Create Product</h2>
        <p className="text-gray-500 text-sm mb-10 font-light text-center">
          Keep the listing simple, clean, and complete.
        </p>

        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="relative group">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="peer w-full border-b border-gray-300 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none"
              placeholder=" "
              required
            />
            <label
              htmlFor="title"
              className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
            >
              Title
            </label>
          </div>

          <div className="relative group">
            <textarea
              id="description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="peer w-full border-b border-gray-300 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none resize-none"
              placeholder=" "
              required
            />
            <label
              htmlFor="description"
              className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
            >
              Description
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="relative group">
              <input
                type="number"
                id="priceAmount"
                min="0"
                step="0.01"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                className="peer w-full border-b border-gray-300 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none"
                placeholder=" "
                required
              />
              <label
                htmlFor="priceAmount"
                className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
              >
                Price Amount
              </label>
            </div>

            <div className="relative group">
              <select
                id="priceCurrency"
                value={priceCurrency}
                onChange={(e) => setPriceCurrency(e.target.value)}
                className="peer w-full border-b border-gray-300 bg-transparent py-3 text-sm text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none appearance-none"
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
                className="absolute left-0 top-3 -translate-y-5 text-xs text-gray-500 transition-all peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-black font-light cursor-text"
              >
                Price Currency
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-gray-900 font-light">Images</p>
                <p className="text-xs text-gray-500 font-light mt-1">
                  Upload up to 7 images. First image is used as the lead visual.
                </p>
              </div>
              <span className="text-xs text-gray-400 font-light">
                {images.length}/7
              </span>
            </div>

            <label className="flex min-h-28 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition-colors hover:border-black hover:bg-white">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={images.length >= 7}
              />
              <div>
                <p className="text-sm font-light text-gray-900">Choose files or drag them here</p>
                <p className="mt-2 text-xs font-light text-gray-500">
                  JPEG, PNG, WEBP up to 5MB each.
                </p>
              </div>
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imagePreviews.map((preview, index) => (
                  <div key={preview} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <img src={preview} alt={`Selected product ${index + 1}`} className="h-28 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-gray-900 shadow-sm opacity-100 transition group-hover:bg-black group-hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900 font-light">Product Variants</p>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  Add distinct variations (e.g. size, color, material) with separate stock and pricing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowVariantForm(!showVariantForm)}
                className="text-xs uppercase tracking-widest font-medium text-black border border-black/10 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {showVariantForm ? 'Cancel' : '+ Add Variant'}
              </button>
            </div>

            {/* Existing Variants List */}
            {variants.length > 0 && (
              <div className="space-y-2.5">
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-neutral-50/50">
                    <div className="flex items-start gap-4">
                      {variant.images?.[0]?.url && (
                        <img
                          src={variant.images[0].url}
                          alt={`Variant ${index + 1}`}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {Object.entries(variant.attributes || {}).map(([key, val]) => (
                            <span key={key} className="text-[10px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-light">
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 font-light">
                          Price: <span className="font-medium text-gray-900">{variant.price.currency} {variant.price.amount}</span> &bull; Stock: <span className="font-medium text-gray-900">{variant.stock}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-xs text-gray-400 hover:text-black font-light transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Variant Form */}
            {showVariantForm && (
              <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-4 animate-in fade-in duration-300">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">New Variant Details</p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <input
                      type="number"
                      id="varPriceAmount"
                      min="0"
                      step="0.01"
                      value={varPriceAmount}
                      onChange={(e) => setVarPriceAmount(e.target.value)}
                      className="peer w-full border-b border-gray-300 bg-transparent py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="varPriceAmount"
                      className="absolute left-0 top-2.5 -translate-y-4.5 text-[10px] text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-xs peer-focus:-translate-y-4.5 peer-focus:text-[10px] peer-focus:text-black font-light cursor-text"
                    >
                      Price Amount *
                    </label>
                  </div>

                  <div className="relative">
                    <select
                      id="varPriceCurrency"
                      value={varPriceCurrency}
                      onChange={(e) => setVarPriceCurrency(e.target.value)}
                      className="peer w-full border-b border-gray-300 bg-transparent py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none appearance-none"
                    >
                      {currencyOptions.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="varPriceCurrency"
                      className="absolute left-0 top-2.5 -translate-y-4.5 text-[10px] text-gray-500 transition-all peer-focus:-translate-y-4.5 peer-focus:text-[10px] peer-focus:text-black font-light cursor-text"
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
                      className="peer w-full border-b border-gray-300 bg-transparent py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="varStock"
                      className="absolute left-0 top-2.5 -translate-y-4.5 text-[10px] text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-xs peer-focus:-translate-y-4.5 peer-focus:text-[10px] peer-focus:text-black font-light cursor-text"
                    >
                      Stock Count
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      id="varImageUrl"
                      value={varImageUrl}
                      onChange={(e) => setVarImageUrl(e.target.value)}
                      className="peer w-full border-b border-gray-300 bg-transparent py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none shadow-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="varImageUrl"
                      className="absolute left-0 top-2.5 -translate-y-4.5 text-[10px] text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-xs peer-focus:-translate-y-4.5 peer-focus:text-[10px] peer-focus:text-black font-light cursor-text"
                    >
                      Image URL *
                    </label>
                  </div>
                </div>

                {/* Attributes creator */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium block">Attributes (e.g. Size, Color)</span>
                  
                  {Object.keys(varAttributes).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {Object.entries(varAttributes).map(([k, v]) => (
                        <span key={k} className="inline-flex items-center gap-1 text-[10px] bg-neutral-100 text-gray-800 px-2 py-1 rounded-full font-light border border-neutral-200">
                          {k}: {v}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(k)}
                            className="text-[9px] text-gray-400 hover:text-black font-bold ml-0.5"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        id="newAttrName"
                        value={newAttrName}
                        onChange={(e) => setNewAttrName(e.target.value)}
                        className="peer w-full border-b border-gray-200 bg-transparent py-2 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none"
                        placeholder="Name (e.g., Size)"
                      />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        id="newAttrVal"
                        value={newAttrVal}
                        onChange={(e) => setNewAttrVal(e.target.value)}
                        className="peer w-full border-b border-gray-200 bg-transparent py-2 text-xs text-gray-900 focus:border-black focus:outline-none transition-colors rounded-none"
                        placeholder="Value (e.g., M)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-black transition-colors font-light shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveVariant}
                  className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 py-2.5 text-xs font-medium uppercase tracking-wider rounded-xl transition-all"
                >
                  Save Variant Spec
                </button>
              </div>
            )}
          </div>

          {message && (
            <p className="text-sm font-light text-gray-500">{message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3.5 mt-2 text-sm font-light hover:bg-gray-900 transition-all active:scale-[0.99] rounded-xl flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving Product...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;