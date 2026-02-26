'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PreloaderProps {
  onComplete: () => void;
  minDisplayTime?: number;
  logoSrc?: string;
}

interface Particle {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
}

const Preloader = ({ 
  onComplete, 
  minDisplayTime = 2500,
  logoSrc = '/logo.png' 
}: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exiting'>('loading');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Generate particles only on client side to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate random particles after mount (client-side only)
    const newParticles: Particle[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: i * 0.5,
      animationDuration: 3 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  // Simulate realistic loading progress
  useEffect(() => {
    let rafId: number;
    let startTime: number;
    let progressValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      if (elapsed < minDisplayTime) {
        const normalizedTime = elapsed / minDisplayTime;
        progressValue = Math.min(
          100,
          normalizedTime * (2 - normalizedTime) * 100
        );
        setProgress(Math.floor(progressValue));
        rafId = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setPhase('complete');
        setTimeout(() => setPhase('exiting'), 400);
        setTimeout(onComplete, 800);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [minDisplayTime, onComplete]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Prevent hydration mismatch by not rendering particles until mounted
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-pulse">
          <img src={logoSrc} alt="Loading" className="w-auto h-16 md:h-20 object-contain opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        .animate-progress-shine {
          animation: progress-shine 1.5s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .loader-curtain {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
          transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .loader-curtain.exit {
          clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
        }
      `}</style>

      <div
        className={cn(
          'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white',
          'transition-all duration-700 ease-in-out',
          phase === 'exiting' && 'loader-curtain exit opacity-0'
        )}
      >
        {/* Animated background particles - only render after mount */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-black/5 animate-float"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
              }}
            />
          ))}
        </div>

        {/* Main content container */}
        <div className={cn(
          'relative z-10 flex flex-col items-center space-y-8',
          'animate-slide-up',
          phase === 'complete' && 'scale-95 opacity-50 transition-all duration-500'
        )}>
          
          {/* Logo container with effects */}
          <div className="relative group">
            <div className="absolute inset-0 bg-black/20 rounded-full blur-3xl animate-pulse-glow" />
            
            <div className={cn(
              'relative overflow-hidden rounded-2xl p-4 transition-all duration-500',
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            )}>
              <img
                src={logoSrc}
                alt="Company Logo"
                width={200}
                height={80}
                onLoad={handleImageLoad}
                className="w-auto h-16 md:h-20 object-contain drop-shadow-2xl"
              />
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            </div>
          </div>

          {/* Brand name / Tagline */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Multani Pansari
            </h2>
            <p className="text-sm text-gray-500 font-medium tracking-widest uppercase">
              Loading Experience
            </p>
          </div>

          {/* Progress section */}
          <div className="w-64 md:w-80 space-y-3">
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gray-100" />
              <div
                className="absolute inset-y-0 left-0 bg-black rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 animate-progress-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-medium text-gray-400">
              <span className={cn(
                'transition-colors duration-300',
                progress > 0 && 'text-gray-600'
              )}>
                Initializing
              </span>
              <span className={cn(
                'tabular-nums transition-all duration-300',
                progress === 100 ? 'text-green-600 font-bold' : 'text-gray-600'
              )}>
                {progress}%
              </span>
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full bg-black transition-all duration-300',
                  phase === 'loading' && 'animate-bounce'
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  opacity: phase === 'complete' ? 0.3 : 1,
                  transform: phase === 'complete' ? 'scale(0.5)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-black transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-black/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-black/5 to-transparent" />
      </div>
    </>
  );
};

export default Preloader;