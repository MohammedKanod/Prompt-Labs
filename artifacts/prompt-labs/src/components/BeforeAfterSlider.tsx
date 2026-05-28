import { useState, useRef, useEffect, useCallback } from "react";
import { GripVertical } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  autoPlay?: boolean;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  autoPlay = true,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  // Smooth auto-play — oscillates the reveal position, never moves pixels
  useEffect(() => {
    if (!autoPlay || isDragging) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    startTimeRef.current = null;
    const CYCLE = 5000; // ms for one full back-and-forth

    const tick = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = (time - startTimeRef.current) % (CYCLE * 2);
      const t = elapsed / CYCLE; // 0 → 2
      const progress = t <= 1 ? t : 2 - t; // ping-pong 0→1→0
      // ease-in-out cubic
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setPosition(15 + eased * 70); // oscillate 15%…85%
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoPlay, isDragging]);

  const updateFromClient = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
    setPosition(pct);
  }, []);

  // Pointer events (handles mouse + touch uniformly)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClient(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateFromClient(e.clientX);
  };
  const handlePointerUp = () => setIsDragging(false);

  const clipBefore = `inset(0 ${100 - position}% 0 0)`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-t-xl"
      style={{ cursor: isDragging ? "grabbing" : "ew-resize" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* ── After image (always fully visible underneath) ── */}
      <img
        src={afterImage}
        alt="After"
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold tracking-widest text-white/80 z-10">
        AFTER
      </div>

      {/* ── Before image — clipped, never moves ── */}
      <img
        src={beforeImage}
        alt="Before"
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ clipPath: clipBefore }}
      />
      <div
        className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold tracking-widest text-white/80 z-10 transition-opacity"
        style={{ opacity: position > 8 ? 1 : 0 }}
      >
        BEFORE
      </div>

      {/* ── Divider line ── */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 z-20 pointer-events-none"
        style={{ left: `${position}%` }}
      />

      {/* ── Handle ── */}
      <div
        className="absolute top-1/2 z-20 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div
          className={`w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg transition-transform duration-150 ${
            isDragging ? "scale-125" : "scale-100"
          }`}
        >
          <GripVertical size={15} />
        </div>
      </div>
    </div>
  );
}
