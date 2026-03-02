'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  slug?: string;
}

const ProductCard = ({ image, name, price, originalPrice, rating, slug }: ProductCardProps) => {
  const discount = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const CardContent = () => (
    <div className="group rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/4] overflow-hidden bg-[#c3c1ba]">
        <img
          src={image}
          alt={name}
        
          className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* Top Rated Badge */}
        {rating === 5 && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Top
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-primary line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>
        
        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 my-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">₹{price.toLocaleString()}</span>
          {originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Wrap with Link if slug provided, otherwise div
  return slug ? (
    <Link href={`/products/${slug}`} className="block">
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

export default ProductCard;