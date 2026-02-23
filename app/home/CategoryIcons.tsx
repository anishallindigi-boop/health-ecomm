'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { GetProductCategory } from '@/redux/slice/ProductCategorySlice';
import Image from 'next/image';
import Link from 'next/link';

const CategoryIcons = () => {
  const dispatch = useAppDispatch();
  const { categories, loading,fetched  } = useAppSelector(
    (state: RootState) => state.productcategory
  );

  useEffect(() => {
    // Only fetch if not already fetched
    if (!fetched) {
      dispatch(GetProductCategory());
    }
  }, [dispatch, fetched]); // Add fetched to dependency array

  const activeCategories = categories.filter(
    (cat) => cat.status === 'published' && cat.isActive
  );

  if (loading) {
    return (
      <section className="py-10 bg-secondary">
        <div className="container">
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-secondary">
      <div className="container">
        <div className="flex items-center justify-start gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {activeCategories.map((category) => (
            <Link
              key={category._id}
              href={`/shop?categories=${category._id}`}
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
            >
              <div className="w-38 h-38 rounded-full  border-2 border-border flex items-center justify-center group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                   
                    className=" object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap text-center max-w-[80px] truncate">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;