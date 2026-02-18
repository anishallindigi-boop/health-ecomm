import { Users, FlaskConical, HeartPulse, TrendingUp } from "lucide-react";

const trustItems = [
  {
    icon: Users,
    title: "Trusted 5,00,000+ Customers",
    desc: "5 लाख से ज़्यादा लोग बोले – भाई Buti toh kaam ki hai! हर product बना है भरोसे के साथ।",
  },
  {
    icon: FlaskConical,
    title: "Lab-Tested & Certified",
    desc: "Sirf सुनने वाली बात नहीं – Buti hai lab-tested. हर bottle quality test se pass hui hai.",
  },
  {
    icon: HeartPulse,
    title: "Holistic Health Benefits",
    desc: "Immunity, energy ya digestion – Buti ka fayda har corner mein hai. Multiple health benefits – ekdum desi aur direct.",
  },
  {
    icon: TrendingUp,
    title: "Long-Term Wellness",
    desc: "Buti sirf symptoms nahi दबाती, toh kaam ki hai! Daily use karo aur dekho health ka asli long-term balance.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <p className="text-center text-primary font-body text-sm tracking-[0.3em] uppercase mb-2">
          POWER OF AYURVEDA
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Ancient Wisdom, Modern Wellness
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="border border-border rounded-lg p-6 bg-card hover:glow-gold transition-all duration-300"
            >
              <Icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
