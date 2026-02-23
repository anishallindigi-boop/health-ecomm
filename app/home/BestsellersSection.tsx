'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { getProducts } from '@/redux/slice/ProductSlice';
import ProductCard from './ProductCard';
import Link from 'next/link';

const BestsellersSecton = () => {
  const dispatch = useAppDispatch();
  const { products, loading,fetched } = useAppSelector((state: RootState) => state.product);

 useEffect(() => {
    // ✅ Only fetch if not already fetched
    if (!fetched) {
      dispatch(getProducts());
    }
  }, [dispatch, fetched]);

  // 🏆 only top selling products
  const topSellingProducts = useMemo(() => {
    return products
      ?.filter((p) => p.topSelling === true && p.status === 'published')
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

  if (!topSellingProducts?.length) return null;

  return (
    <section className="py-16 bg-background container">
     <div className='py-6'>
       <p className='text-center text-white'>Best Selling Products</p>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
        शरीर हो या मन की थकान, मुल्तानी पंसारी सबका समाधान!
      </h2>
     </div>
     

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {topSellingProducts.map((product) => (
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
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          View All Products
        </Link>
      </div> */}
    </section>
  );
};

export default BestsellersSecton;