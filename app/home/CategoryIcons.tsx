import { Zap, Heart, Leaf, Brain, Sparkles, Eye, Dumbbell, Scale } from "lucide-react";

const categories = [
  { icon: Zap, label: "Energy" },
  { icon: Heart, label: "Pain Relief" },
  { icon: Sparkles, label: "Skin" },
  { icon: Leaf, label: "Digestion" },
  { icon: Dumbbell, label: "Men's Health" },
  { icon: Eye, label: "Hair Care" },
  { icon: Brain, label: "Women's Health" },
  { icon: Scale, label: "Weight" },
];

const CategoryIcons = () => {
  return (
    <section className="py-10 bg-secondary">
      <div className="container">
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
          {categories.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:glow-gold transition-all">
                <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs font-body text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;
