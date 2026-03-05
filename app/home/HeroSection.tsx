'use client'

import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getProducts } from "@/redux/slice/ProductSlice";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {

const dispatch = useAppDispatch();
const { products, fetched } = useAppSelector((state: RootState) => state.product);

const [current, setCurrent] = useState(0);

useEffect(() => {
if (!fetched) {
dispatch(getProducts());
}
}, [dispatch, fetched]);

// Convert products → slides
const slides = useMemo(() => {
return products
?.filter((p) => p.status === "published")
?.slice(0, 8)
?.map((p) => ({
img: p.mainImage,
title: p.name,
subtitle: "Premium Product",
highlight: "Ayurvedic Care",
desc: p.metadescription || "Natural Ayurvedic wellness product",
price: `₹${p.discountPrice || p.price}`,
tag: "Trending",
slug: p.slug
}));
}, [products]);

// Auto slide
useEffect(() => {
if (!slides || slides.length === 0) return;

const timer = setInterval(() => {
  setCurrent((prev) => (prev + 1) % slides.length);
}, 4000);

return () => clearInterval(timer);


}, [slides]);

if (!slides || slides.length === 0) return null;

const s = slides[current];

return ( <section className="relative w-full bg-background overflow-hidden py-20">

```
  <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-center">

    {/* LEFT SIDE TEXT */}
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.5 }}
      >

        <span className="inline-block px-4 py-1.5 mb-5 text-xs uppercase tracking-[0.3em] border rounded-full text-primary">
          {s.subtitle}
        </span>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-3">
          {s.title}
        </h2>

        <h3 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-5">
          {s.highlight}
        </h3>

        <p className="text-lg text-muted-foreground mb-6">
          {s.desc}
        </p>

        <div className="flex items-center gap-4 mb-8 flex-wrap">

          <span className="text-3xl font-bold text-primary">
            {s.price}
          </span>

          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            {s.tag}
          </span>

        </div>

        <Link href={`/products/${s.slug}`}>
          <Button size="lg" className="bg-gold-gradient px-8 py-6 cursor-pointer">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop Now
          </Button>
        </Link>

      </motion.div>
    </AnimatePresence>


    {/* RIGHT SIDE BIG WHEEL */}
    <div className="relative flex items-center justify-center">

      <div className="relative w-[420px] h-[420px] md:w-[550px] md:h-[550px]">

        {/* CENTER PRODUCT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
            w-44 h-44 md:w-60 md:h-60 rounded-full overflow-hidden 
            border-4 border-primary shadow-xl z-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={s.img}
              alt={s.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>


        {/* WHEEL PRODUCTS */}
        {slides.map((sl, i) => {

          const angle = ((i - current) * (360 / slides.length)) * (Math.PI / 180);

          const radius = 220;

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const isActive = i === current;

          return (
            <motion.button
              key={i}
              className={`absolute rounded-full overflow-hidden border-2
              ${isActive ? "opacity-0" : "border-border opacity-80 hover:opacity-100"}`}
              style={{ left: "50%", top: "50%" }}
              animate={{
                x: x - 35,
                y: y - 35,
                width: 70,
                height: 70,
              }}
              transition={{ duration: 0.6 }}
              onClick={() => setCurrent(i)}
            >
              <img
                src={sl.img}
                alt={sl.title}
                className="w-full h-full object-cover"
              />
            </motion.button>
          );

        })}

      </div>

    </div>

  </div>
</section>

);
};

export default HeroSection;
