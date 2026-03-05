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
const [radius,setRadius] = useState(150);

useEffect(() => {
if (!fetched) dispatch(getProducts());
}, [dispatch, fetched]);


useEffect(()=>{

const updateRadius = () => {

const width = window.innerWidth;

if(width < 640) setRadius(90)
else if(width < 768) setRadius(120)
else if(width < 1024) setRadius(160)
else setRadius(200)

}

updateRadius()

window.addEventListener("resize",updateRadius)

return ()=> window.removeEventListener("resize",updateRadius)

},[])



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



useEffect(() => {

if (!slides?.length) return;

const timer = setInterval(() => {
setCurrent((prev) => (prev + 1) % slides.length);
}, 4000);

return () => clearInterval(timer);

}, [slides]);


if (!slides?.length) return null;

const s = slides[current];


return (

<section className="relative w-full overflow-hidden py-16">

<div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-14 items-center">

{/* TEXT */}

<AnimatePresence mode="wait">
<motion.div
key={current}
className="text-center lg:text-left"
initial={{ opacity: 0, x: -30 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: 30 }}
transition={{ duration: 0.5 }}
>

<span className="inline-block px-4 py-1 mb-5 text-xs uppercase tracking-[0.3em] border rounded-full text-primary">
{s.subtitle}
</span>

<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3">
{s.title}
</h2>

<h3 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-5">
{s.highlight}
</h3>

<p className="text-muted-foreground mb-6">
{s.desc}
</p>

<div className="flex justify-center lg:justify-start items-center gap-4 mb-8 flex-wrap">
<span className="text-2xl font-bold text-primary">
{s.price}
</span>

<span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
{s.tag}
</span>
</div>

<Link href={`/products/${s.slug}`}>
<Button size="lg" className="px-8 py-6 bg-gold-gradient cursor-pointer p-5">
<ShoppingBag className="w-5 h-5 mr-2" />
Shop Now
</Button>
</Link>

</motion.div>
</AnimatePresence>



{/* WHEEL */}

<div className="flex justify-center">

<div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px]">

{/* CENTER IMAGE */}

<AnimatePresence mode="wait">
<motion.div
key={current}
className="absolute left-1/2 top-1/2 
-translate-x-1/2 -translate-y-1/2
w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52
rounded-full overflow-hidden border-4 border-primary z-20"
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.8, opacity: 0 }}
>
<img src={s.img} className="w-full h-full object-cover" />
</motion.div>
</AnimatePresence>


{/* WHEEL ITEMS */}

{slides.map((sl, i) => {

const angle = ((i - current) * (360 / slides.length)) * (Math.PI / 180);

const x = Math.cos(angle) * radius;
const y = Math.sin(angle) * radius;

if (i === current) return null;

return (

<motion.button
key={i}
className="absolute rounded-full overflow-hidden border border-border"
style={{ left: "50%", top: "50%" }}
animate={{
x: x - 24,
y: y - 24,
width: 68,
height: 68,
}}
transition={{ duration: 0.6 }}
onClick={() => setCurrent(i)}
>

<img
src={sl.img}
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