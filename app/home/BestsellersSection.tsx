import ProductCard from "./ProductCard";


const bestsellers = [
  { image: '/product-1.jpg', name: "Anti-Pi", price: 1100, rating: 0 },
  { image: '/product-2.jpg', name: "Pigmi Care", price: 1250, originalPrice: 1699, rating: 0 },
  { image: '/product-3.jpg', name: "Praan Nozeena", price: 1500, originalPrice: 1800, rating: 0 },
  { image: '/product-4.jpg', name: "Ashva Kumari", price: 2100, rating: 0 },
];

const BestsellersSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <p className="text-center text-primary font-body text-sm tracking-[0.3em] uppercase mb-2">
          OUR BESTSELLERS
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
          शरीर हो या मन की थकान, बाबा जी की बूटी सबका समाधान!
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {bestsellers.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
        <div className="text-center">
          <button className="bg-gold-gradient text-primary-foreground font-body font-semibold px-8 py-3 rounded tracking-wider uppercase text-sm hover:opacity-90 transition-opacity">
            VIEW ALL
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;
