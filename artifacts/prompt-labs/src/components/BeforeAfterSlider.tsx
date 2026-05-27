import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { GripVertical } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  autoPlay?: boolean;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, autoPlay = true }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && !isDragging) {
      const animate = async () => {
        await controls.start({ x: ["0%", "20%", "-20%", "0%"], transition: { duration: 8, ease: "easeInOut", repeat: Infinity } });
      };
      animate();
    } else {
      controls.stop();
    }
    return () => clearInterval(interval);
  }, [autoPlay, isDragging, controls]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchDown = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize group rounded-t-xl"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchDown}
    >
      <div className="absolute inset-0 bg-secondary" />
      
      {/* After Image (Base) */}
      <div className="absolute inset-0">
        <img 
          src={afterImage} 
          alt="After prompt" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-widest text-white/80">
          AFTER
        </div>
      </div>

      {/* Before Image (Overlay) */}
      <motion.div 
        className="absolute inset-0 overflow-hidden border-r-2 border-white/80"
        style={{ width: `${sliderPosition}%` }}
        animate={autoPlay && !isDragging ? controls : undefined}
      >
        <img 
          src={beforeImage} 
          alt="Before prompt" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ width: '100vw', maxWidth: 'none' }}
          draggable={false}
        />
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-widest text-white/80">
          BEFORE
        </div>
      </motion.div>

      {/* Slider Handle */}
      <motion.div 
        className="absolute top-0 bottom-0 w-0.5 bg-white/0 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
        animate={autoPlay && !isDragging ? controls : undefined}
      >
        <div className={`w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg transition-transform ${isDragging ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}>
          <GripVertical size={16} />
        </div>
      </motion.div>
    </div>
  );
}
