import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
}

const ProductCard = ({ image, name, price, originalPrice, rating }: ProductCardProps) => {
  return (
    <div className="group border border-border rounded-lg overflow-hidden bg-card hover:glow-gold transition-all duration-300">
      <div className="aspect-square overflow-hidden bg-secondary flex items-center justify-center p-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <button className="w-full flex items-center justify-center gap-2 border border-border rounded py-2 mb-3 text-sm font-body text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <h3 className="font-body text-sm font-medium text-foreground truncate">{name}</h3>
        <div className="flex items-center gap-1 my-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through font-body">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-sm font-semibold text-foreground font-body">
            ₹{price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
