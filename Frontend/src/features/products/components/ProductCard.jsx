import React from 'react';

const ProductCard = ({ product }) => {
  const coverImage = product?.images?.[0]?.url;
  const amount = product?.price?.amount;
  const currency = product?.price?.currency || 'INR';

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={product?.title || 'Product image'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-light text-gray-400">
            No image available
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-900 backdrop-blur-sm">
          {currency}
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-light text-gray-900 line-clamp-1">
              {product?.title}
            </h2>
            <span className="shrink-0 text-sm font-light text-gray-900">
              {amount != null ? `${amount}` : '0'}
            </span>
          </div>
          <p className="mt-2 text-sm font-light leading-6 text-gray-500 line-clamp-3">
            {product?.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-light uppercase tracking-[0.2em] text-gray-400">
          <span>{product?.images?.length || 0} images</span>
          <span>{currency}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;