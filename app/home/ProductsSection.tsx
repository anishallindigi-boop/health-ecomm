import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const topProducts = [
  { image: '/product-1.jpg', name: "Vajra Vardhak", price: 2000, originalPrice: 2200, rating: 5 },
  { image: '/product-2.jpg', name: "Sthul Ghatak", price: 2500, originalPrice: 3100, rating: 0 },
  { image: '/product-3.jpg', name: "Chyawanprash", price: 999, originalPrice: 1499, rating: 0 },
  { image: '/product-4.jpg', name: "Madhu Vinashi Liquid", price: 900, originalPrice: 1500, rating: 5 },
  { image: '/product-5.jpg', name: "Swarn Shakti Bhasma", price: 11000, originalPrice: 33000, rating: 5 },
];

const moreProducts = [
  { image: '/product-6.jpg', name: "Keshu Jeevani Kesh Amrit Oil", price: 1250, originalPrice: 2500, rating: 0 },
  { image: '/product-7.jpg', name: "Pain Zero Pain Oil", price: 849, originalPrice: 999, rating: 5 },
  { image: '/product-8.jpg', name: "Power Grow", price: 1100, originalPrice: 2100, rating: 0 },
];

const ProductsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
          Our Top Rated Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {topProducts.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moreProducts.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
