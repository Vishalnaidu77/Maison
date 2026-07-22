import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useProduct from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';

const SellerProductList = () => {
  const { handleGetSellerProduct } = useProduct();
  const { sellerProduct, isLoading, error } = useSelector((state) => state.product);

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  console.log(sellerProduct);
  
  return (
    <div className="min-h-screen bg-white px-6 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 text-center">
          <div className="text-2xl font-light tracking-widest uppercase text-gray-900 mb-4">
            Maison
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900">Seller Products</h1>
          <p className="mt-3 text-sm font-light text-gray-500">
            A quiet overview of the products you have added.
          </p>
        </div>

        <div className="rounded-[2rem] border border-gray-200 bg-gray-50/70 p-6 sm:p-8">
          {isLoading && (
            <div className="flex min-h-[40vh] items-center justify-center text-sm font-light text-gray-500">
              Loading products...
            </div>
          )}

          {!isLoading && error && (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <div>
                <p className="text-base font-light text-gray-900">Unable to load products</p>
                <p className="mt-2 text-sm font-light text-gray-500">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && sellerProduct.length === 0 && (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <div>
                <p className="text-base font-light text-gray-900">No products yet</p>
                <p className="mt-2 text-sm font-light text-gray-500">
                  Create your first product to start building the catalog.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && sellerProduct.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sellerProduct.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductList