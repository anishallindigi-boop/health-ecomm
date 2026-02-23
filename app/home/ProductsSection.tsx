'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { getProducts } from '@/redux/slice/ProductSlice';
import ProductCard from './ProductCard';
import Link from 'next/link';

const ProductsSection = () => {
  const dispatch = useAppDispatch();
  const { products, loading,fetched } = useAppSelector((state: RootState) => state.product);

 useEffect(() => {
    // ✅ Only fetch if not already fetched
    if (!fetched) {
      dispatch(getProducts());
    }
  }, [dispatch, fetched]);
  // ⭐ only top rated products
  const topRatedProducts = useMemo(() => {
    return products
      ?.filter((p) => p.topRated === true && p.status === 'published')
      ?.slice(0, 8);
  }, [products]);

  if (loading) {
    return (
      <section className="py-16 bg-background container">
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (!topRatedProducts?.length) return null;

  return (
    <section className="py-16 bg-background container">
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
        Our Top Rated Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {topRatedProducts.map((product) => (
          <ProductCard
            key={product._id}
            image={product.mainImage || product.image || '/placeholder.jpg'}
            name={product.name || 'Unnamed Product'}
            price={Number(product.discountPrice) || Number(product.price) || 0}
            originalPrice={Number(product.price) || 0}
            rating={5}
            slug={product.slug}
          />
        ))}
      </div>

      {/* <div className="text-center mt-10">
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white "
        >
            <button className="bg-gold-gradient text-primary-foreground font-body font-semibold px-8 py-3 rounded tracking-wider uppercase text-sm hover:opacity-90 transition-opacity shadow-gold"> View All Products</button>
         
        </Link>
      </div> */}
    </section>
  );
};

export default ProductsSection;