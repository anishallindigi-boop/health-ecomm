'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PreloaderProps {
  onComplete: () => void;
  minDisplayTime?: number;
  logoSrc?: string;
  brandName?: string;
}

const Preloader = ({ 
  onComplete, 
  minDisplayTime = 2500,
  logoSrc = '/logo.png',
  brandName = 'Multani Pansari'
}: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'exiting'>('loading');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth progress animation
  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / minDisplayTime) * 100, 100);
      
      // Easing function for smoother progression
      const easeOutCubic = 1 - Math.pow(1 - rawProgress / 100, 3);
      const easedProgress = Math.min(easeOutCubic * 100, 100);
      
      setProgress(easedProgress);

      if (elapsed < minDisplayTime) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          setPhase('exiting');
          setTimeout(onComplete, 800);
        }, 200);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [minDisplayTime, onComplete]);

  const handleImageLoad = useCallback(() => {
    console.log('Logo loaded successfully:', logoSrc);
    setImageLoaded(true);
    setImageError(false);
  }, [logoSrc]);

  const handleImageError = useCallback(() => {
    console.error('Failed to load logo:', logoSrc);
    setImageError(true);
    // Still mark as loaded to show fallback
    setImageLoaded(true);
  }, [logoSrc]);

  // Fallback logo component (first letter of brand name)
  const FallbackLogo = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
      <span className="text-4xl font-bold text-gray-700">
        {brandName.charAt(0)}
      </span>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes dash {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          >
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
            
            {/* Floating particles - very subtle - only render when mounted */}
            {mounted && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, 10, 0],
                      opacity: [0.03, 0.06, 0.03],
                    }}
                    transition={{
                      duration: 8 + i * 2,
                      repeat: Infinity,
                      delay: i * 1,
                    }}
                    className="absolute rounded-full bg-gray-200"
                    style={{
                      width: 100 + i * 50,
                      height: 100 + i * 50,
                      left: `${10 + i * 15}%`,
                      top: `${20 + i * 10}%`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Logo in circle - main focus */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 1,
                  type: "spring",
                  damping: 15,
                  stiffness: 100
                }}
                className="relative mb-12"
              >
                {/* Outer rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300"
                  style={{ 
                    boxShadow: '0 0 30px rgba(0,0,0,0.03)'
                  }}
                />

                {/* Middle ring - reverse rotation */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-[-8px] rounded-full border border-gray-200"
                />

                {/* Inner ring with dots */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-[-4px] rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(0,0,0,0.02), transparent)'
                  }}
                />

                {/* Pulsing circle behind logo */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.15, 0.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-[-20px] rounded-full bg-gradient-to-r from-gray-200/30 to-gray-300/30 blur-xl"
                />

                {/* Logo container */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden">
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-white" />
                  
                  {/* Logo image with Next.js Image component */}
                  <div className="relative z-10 w-24 h-24 md:w-32 md:h-32">
                    {!imageError ? (
                      <Image
                        src={logoSrc}
                        alt={brandName}
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        className={cn(
                          "object-contain transition-all duration-700",
                          imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        )}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        priority
                      />
                    ) : (
                      <FallbackLogo />
                    )}
                    
                    {/* Show loading placeholder if image not loaded and no error */}
                    {!imageLoaded && !imageError && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Decorative dots around inner circle */}
                  <div className="absolute inset-2 rounded-full border border-gray-200/50" />
                  <div className="absolute inset-4 rounded-full border border-gray-100" />
                </div>

                {/* Orbiting dots - only animate when mounted */}
                {mounted && [0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-gray-400"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `rotate(${angle}deg) translateX(100px)`,
                      opacity: 0.2,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.25,
                    }}
                  />
                ))}
              </motion.div>

              {/* Brand name */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl md:text-4xl font-light text-gray-800 mb-3 tracking-wide"
              >
                {brandName}
              </motion.h2>

              {/* Loading text with progress */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mb-6"
              >
                <p className="text-gray-400 text-sm uppercase tracking-[0.3em]">
                  {progress < 30 && "Initializing"}
                  {progress >= 30 && progress < 60 && "Loading"}
                  {progress >= 60 && progress < 90 && "Preparing"}
                  {progress >= 90 && "Almost ready"}
                </p>
              </motion.div>

              {/* Progress indicator - minimal */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative w-48 h-0.5 bg-gray-100 overflow-hidden rounded-full"
              >
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gray-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" 
                       style={{ animation: 'progress-shine 1.5s infinite' }} />
                </motion.div>
              </motion.div>

              {/* Percentage - subtle */}
              <motion.span
                key={progress}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.4, y: 0 }}
                className="mt-3 text-xs text-gray-400 font-mono"
              >
                {Math.round(progress)}%
              </motion.span>
            </div>

            {/* Bottom corner accents */}
            <div className="absolute bottom-6 left-6 text-xs text-gray-300 font-light tracking-widest">
              ✦ SINCE 1980 ✦
            </div>
            <div className="absolute top-6 right-6 flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={mounted ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                  className="w-1 h-1 bg-gray-300 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default Preloader;