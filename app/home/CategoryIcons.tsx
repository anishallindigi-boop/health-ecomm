'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { GetProductCategory } from '@/redux/slice/ProductCategorySlice';
import Link from 'next/link';

const CategoryIcons = () => {
  const dispatch = useAppDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  
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

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || activeCategories.length === 0) return;
    
    const interval = setInterval(() => {
      if (scrollContainerRef.current && !isDragging) {
        const container = scrollContainerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScrollLeft - 10) {
          // Reset to start
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll to next
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScroll, isDragging, activeCategories.length]);

  // Mouse/Touch drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setAutoScroll(false);
    
    if ('touches' in e) {
      // Touch event
      setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0));
    } else {
      // Mouse event
      setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    }
    
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    
    let x: number;
    if ('touches' in e) {
      x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    } else {
      x = e.pageX - scrollContainerRef.current.offsetLeft;
    }
    
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => setAutoScroll(true), 5000);
  };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setAutoScroll(false);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setAutoScroll(true), 3000);
  };

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
    <section className="py-6 bg-secondary">
      <div className="container">
        {/* Category Title */}
        <h2 className="text-lg font-semibold text-center mb-4 text-primary">Shop by Category</h2>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

          {/* Scrollable Categories */}
          <div
            ref={scrollContainerRef}
            className={`flex justify-center gap-4 overflow-x-auto scrollbar-hide ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
          >
            {activeCategories.map((category) => (
              <Link
                key={category._id}
                href={`/shop?categories=${category._id}`}
                className="flex flex-col items-center min-w-[100px] group"
                draggable={false}
              >
                {/* Category Image/Icon */}
                <div className="w-20 h-20 rounded-full border-2 border-transparent bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden group-hover:border-primary transition-all duration-300 group-hover:shadow-lg">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {/* Category Name */}
                <span className="text-xs mt-2 text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center line-clamp-2 max-w-[80px]">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Scroll Progress Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {activeCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const itemWidth = 116; // 100px width + 16px gap
                    scrollContainerRef.current.scrollTo({
                      left: index * itemWidth,
                      behavior: 'smooth'
                    });
                    setAutoScroll(false);
                    setTimeout(() => setAutoScroll(true), 5000);
                  }
                }}
                className="group relative"
                aria-label={`Go to category ${index + 1}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-all duration-300 group-hover:w-3" />
              </button>
            ))}
          </div>

          {/* Auto-scroll Indicator */}
          {/* <div className="flex justify-center mt-2">
            <div className="flex items-center gap-1">
              <div className={`w-1 h-1 rounded-full ${autoScroll ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-300`} />
              <span className="text-[10px] text-muted-foreground">
                {autoScroll ? 'Auto-scrolling' : 'Paused'}
              </span>
            </div>
          </div> */}

          {/* Scroll Hint for Mobile */}
          <div className="flex justify-center mt-2 md:hidden">
            <span className="text-[10px] text-muted-foreground animate-pulse">
              ← Swipe to browse →
            </span>
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CategoryIcons;