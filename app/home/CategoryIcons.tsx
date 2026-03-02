'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { GetProductCategory } from '@/redux/slice/ProductCategorySlice';
import Link from 'next/link';

const CategoryIcons = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, fetched } = useAppSelector(
    (state: RootState) => state.productcategory
  );

  useEffect(() => {
    if (!fetched) {
      dispatch(GetProductCategory());
    }
  }, [dispatch, fetched]);

  const activeCategories = categories.filter(
    (cat) => cat.status === 'published' && cat.isActive
  );

  if (loading) {
    return (
      <section className="py-6 bg-secondary">
        <div className="container flex justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-secondary container overflow-hidden">
      <div className="relative">
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {[...activeCategories, ...activeCategories].map((category, index) => (
            <Link
              key={`${category._id}-${index}`}
              href={`/shop?categories=${category._id}`}
              className="flex flex-col items-center min-w-[120px] group"
            >
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center overflow-hidden group-hover:border-primary transition-all">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-medium">
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-xs mt-2 text-muted-foreground group-hover:text-foreground transition-colors truncate w-20 text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tailwind Custom Animation */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        @keyframes marquee {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default CategoryIcons;