import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    rating: 4,
    text: '"Mera वज़न almost 5kg कम हुआ 6 हफ्तों में. Sthul Ghatak daily लेने से fat कम हुआ, बल्कि digestion भी better feel हुआ. Koi side effect नहीं, बस रोज़ लेना पड़ता है बिना skip करे."',
  },
  {
    name: "Anjali Mehta",
    rating: 5,
    text: '"Subah fresh feel करना ab routine बन गया है. Consti-Pi शुरू किया aur 3rd day से ही पेट इतना लगने लगा. Taste थोड़ा kadwa है, लेकिन काम ekdum solid करता है. Best Product I must say!!"',
  },
  {
    name: "Ramesh Patel",
    rating: 2,
    text: '"Vajra Vardhak लेने से धीरे-धीरे energy में बदलाव feel हुआ. Relationship mein भी improvement आया. Overexpect mat karna, but regular use se सही असर आता है."',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-2">
          REVIEW & RATINGS
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          सीधा Experience, Bina Filter
        </h2>
        <p className="font-body text-muted-foreground mb-10 max-w-xl">
          Baba Ji Ki Buti को जिन लोगों ने अपनाया, उन्होंने सिर्फ product नहीं दिया – उन्होंने result feel किया। नीचे जो feedbacks हैं, वो hamare users की awaaz हैं।
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="border border-border rounded-lg p-6 bg-card"
            >
              <h4 className="font-body font-semibold text-foreground mb-1">{t.name}</h4>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
