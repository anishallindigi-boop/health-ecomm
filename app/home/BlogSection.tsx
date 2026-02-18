import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const blogs = [
  {
    image: '/blog-1.jpg',
    title: "Piles के लिए आयुर्वेदिक समाधान Anti-Pi",
    excerpt: "खून कम हो, आराम रहे — यही है असली piles relief. Piles (बवासीर) सिर्फ physical discomfort नहीं है —...",
  },
  {
    image: '/blog-2.jpg',
    title: "थकान नहीं, ताज़गी चाहिए?",
    excerpt: "Ashva Kumari — हर महिला के हार्मोनल संतुलन का आयुर्वेदिक समाधान Hormonal imbalance एक ऐसी समस्या है जो नज़र...",
  },
  {
    image: '/blog-3.jpg',
    title: "Natural Energy, Clarity & Wellness",
    excerpt: "शुद्ध शक्ति का सूत्र — बिना शुगर, बिना साइड इफेक्ट। हर दिन energy की कमी महसूस होना, काम में...",
  },
];

const BlogSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <p className="text-center text-primary font-body text-sm tracking-[0.3em] uppercase mb-2">
          RECENT BLOGS
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
          News & Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {blogs.map((b) => (
            <div
              key={b.title}
              className="border border-border rounded-lg overflow-hidden bg-card group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {b.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-3">
                  {b.excerpt}
                </p>
              </div>
            </div>
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

export default BlogSection;
