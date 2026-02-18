'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const slides = [
  {
    id: 1,
    leftTitle: "सेहत का पूरा खजाना, एक ही जगह!",
    rightTitle: "चुनें हेल्थ सप्लीमेंट्स, एनर्जी बूस्टर्स, सब नेचुरला",
    product: '/slide-p4.png',
    cta: "ORDER TODAY",
    accent: ">>>>>>>>",
  },
  {
    id: 2,
    leftTitle: "प्राचीन आयुर्वेद, आधुनिक विज्ञान",
    rightTitle: "100% शुद्ध और प्राकृतिक, बिना किसी केमिकल के",
   product: '/slide-p4.png',
    cta: "SHOP NOW",
    accent: "★★★★★",
  },
  {
    id: 3,
    leftTitle: "हर सुबह के साथ ऊर्जा और सौंदर्य",
    rightTitle: "चिया सीड्स के साथ पाएं सम्पूर्ण पोषण और ताकत",
   product: '/slide-p4.png',
    cta: "BUY NOW",
    accent: "◆◆◆◆◆",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (phase !== "idle" || index === current) return;
      setPrev(current);
      setPhase("exit");
      setTimeout(() => {
        setCurrent(index);
        setPhase("enter");
        setTimeout(() => {
          setPrev(null);
          setPhase("idle");
        }, 600);
      }, 500);
    },
    [phase, current]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prevSlide = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const activeSlide = slides[current];
  const exitingSlide = prev !== null ? slides[prev] : null;

  const exitClass = "animate-[heroExit_0.5s_ease-in_forwards]";
  const enterClass = "animate-[heroEnter_0.6s_ease-out_forwards]";
  const exitLeftClass = "animate-[heroLeftExit_0.5s_ease-in_forwards]";
  const enterLeftClass = "animate-[heroLeftEnter_0.6s_ease-out_forwards]";
  const exitRightClass = "animate-[heroRightExit_0.5s_ease-in_forwards]";
  const enterRightClass = "animate-[heroRightEnter_0.6s_ease-out_forwards]";

  return (
    <section className="relative h-screen overflow-hidden bg-background">
      {/* Starry bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary))_0%,hsl(var(--background))_70%)]" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(1px 1px at 20px 30px, hsl(var(--gold-light)) 1px, transparent 0),
          radial-gradient(1px 1px at 40px 70px, hsl(var(--gold)) 1px, transparent 0),
          radial-gradient(1px 1px at 80px 40px, hsl(var(--foreground)) 1px, transparent 0),
          radial-gradient(1px 1px at 130px 80px, hsl(var(--gold-light)) 1px, transparent 0),
          radial-gradient(1px 1px at 160px 30px, hsl(var(--gold)) 1px, transparent 0)`,
        backgroundSize: '250px 120px',
      }} />

      <style>{`
        @keyframes heroExit {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(1.3) translateY(-30px); }
        }
        @keyframes heroEnter {
          0% { opacity: 0; transform: scale(0.6) translateY(60px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes heroLeftExit {
          0% { opacity: 1; transform: translateX(0) translateY(0); }
          100% { opacity: 0; transform: translateX(-80px) translateY(-20px); }
        }
        @keyframes heroLeftEnter {
          0% { opacity: 0; transform: translateX(-60px) translateY(30px); }
          100% { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes heroRightExit {
          0% { opacity: 1; transform: translateX(0) translateY(0); }
          100% { opacity: 0; transform: translateX(80px) translateY(-20px); }
        }
        @keyframes heroRightEnter {
          0% { opacity: 0; transform: translateX(60px) translateY(30px); }
          100% { opacity: 1; transform: translateX(0) translateY(0); }
        }
      `}</style>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-8 h-full">

          {/* Left text */}
          <div className="flex flex-col justify-center items-start relative">
            {phase === "exit" && exitingSlide && (
              <div className={`absolute inset-0 flex flex-col justify-center items-start ${exitLeftClass}`}>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">{exitingSlide.leftTitle}</h2>
                <p className="text-gold font-body text-lg tracking-[0.2em] mb-4">{exitingSlide.accent}</p>
                <button className="bg-gold-gradient text-primary-foreground font-body font-semibold px-8 py-3 rounded tracking-wider uppercase text-sm shadow-gold">{exitingSlide.cta}</button>
              </div>
            )}
            <div className={phase === "enter" ? enterLeftClass : phase === "exit" ? "opacity-0" : ""}>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">{activeSlide.leftTitle}</h2>
              <p className="text-gold font-body text-lg tracking-[0.2em] mb-4">{activeSlide.accent}</p>
              <button className="bg-gold-gradient text-primary-foreground font-body font-semibold px-8 py-3 rounded tracking-wider uppercase text-sm hover:opacity-90 transition-opacity shadow-gold">{activeSlide.cta}</button>
            </div>
          </div>

          {/* Center product */}
          <div className="flex items-center justify-center relative">
            {phase === "exit" && exitingSlide && (
              <div className={`absolute ${exitClass}`}>
                <img src={exitingSlide.product} alt="Product" className="w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] object-contain mix-blend-lighten" />
              </div>
            )}
            <div className={phase === "enter" ? enterClass : phase === "exit" ? "opacity-0" : ""}>
              <img src={activeSlide.product} alt="Product" className="w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] object-contain mix-blend-lighten drop-shadow-[0_0_40px_hsl(var(--gold)/0.25)] hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Right text */}
          <div className="flex flex-col justify-center items-end text-right relative">
            {phase === "exit" && exitingSlide && (
              <div className={`absolute inset-0 flex flex-col justify-center items-end text-right ${exitRightClass}`}>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight">{exitingSlide.rightTitle}</h2>
              </div>
            )}
            <div className={phase === "enter" ? enterRightClass : phase === "exit" ? "opacity-0" : ""}>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight">{activeSlide.rightTitle}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-border bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-gold/20 hover:border-gold transition-colors">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-border bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-gold/20 hover:border-gold transition-colors">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={`h-2.5 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-gold-gradient shadow-gold" : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground"}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
