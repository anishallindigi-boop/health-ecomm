

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src='/hero-bg.jpg'
        alt="Ayurvedic herbs and natural ingredients"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-background/40" />
      <div className="relative z-10 text-center max-w-3xl px-4 animate-fade-in-up">
        <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
          HTT Chia Seeds
        </p>
        <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
          हर सुबह के साथ <br />
          <span className="text-gold-gradient">ऊर्जा और सौंदर्य</span>
        </h2>
        <p className="text-muted-foreground font-body mb-8 text-lg">
          चिया सीड्स के साथ पाएं सम्पूर्ण पोषण।
        </p>
        <button className="bg-gold-gradient text-primary-foreground font-body font-semibold px-8 py-3 rounded tracking-wider uppercase text-sm hover:opacity-90 transition-opacity shadow-gold">
          ORDER TODAY
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
