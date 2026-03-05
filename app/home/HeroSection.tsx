'use client'

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getProducts } from "@/redux/slice/ProductSlice";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {

  const dispatch = useAppDispatch();
  const { products, fetched } = useAppSelector((state: RootState) => state.product);

  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!fetched) {
      dispatch(getProducts());
    }
  }, [dispatch, fetched]);

  const slides = useMemo(() => {
    return products
      ?.filter((p) => p.status === "published")
      ?.slice(0, 8)
      ?.map((p) => ({
        img: p.mainImage,
        title: p.name,
        highlight: "Premium Product",
        desc: p.metadescription || "Best quality Ayurvedic product",
        price: `₹${p.discountPrice || p.price}`,
        slug: p.slug
      }));
  }, [products]);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, [slides]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + slides.length) % slides.length);
  }, [slides]);

  useEffect(() => {
    if (!auto || slides.length === 0) return;

    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [auto, next, slides]);

  if (!slides.length) return null;

  const s = slides[current];

  return (
    <section className="relative h-[80vh] md:h-[90vh] lg:h-screen min-h-[500px] overflow-hidden">

      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={s.img}
          alt={s.title}
        className="absolute inset-0 w-full h-full object-contain bg-black"

          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">

        <div className="max-w-7xl mx-auto px-5 md:px-10 w-full">

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {s.title}
              </h1>

              {/* Badge */}
              <span className="inline-block bg-gold-gradient text-primary font-semibold px-4 py-2 rounded-full text-xs sm:text-sm mb-4">
                {s.highlight}
              </span>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6">
                {s.desc}
              </p>

              {/* Button */}
              <Link href={`products/${s.slug}` || "#"}>
              <Button
                
                className="bg-gold-gradient text-primary cursor-pointer hover:opacity-90 p-6"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {s.price} — Shop Now
              </Button>
              </Link>

            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-20">

        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all ${
                  i === current ? "w-10 bg-gold-gradient" : "w-4 bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => setAuto((a) => !a)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border bg-gold-gradient border-white/40 text-white flex items-center justify-center"
            >
              {auto ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={prev}
              className="w-9 h-9 md:w-10 md:h-10 bg-gold-gradient rounded-full border border-white/40 text-white flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={next}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/40 bg-gold-gradient text-white flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;