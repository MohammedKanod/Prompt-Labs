import { useRef, useEffect, useCallback } from "react";
import { GripVertical } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  autoPlay?: boolean;
  loading?: "lazy" | "eager";
}

/**
 * Zero-lag before/after slider.
 * All position updates bypass React state and go directly to the DOM via refs,
 * so there are zero re-renders during drag or auto-play.
 */
export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  autoPlay = true,
  loading = "lazy",
}: BeforeAfterSliderProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const dividerRef     = useRef<HTMLDivElement>(null);
  const handleWrapRef  = useRef<HTMLDivElement>(null);
  const handleInnerRef = useRef<HTMLDivElement>(null);
  const beforeImgRef   = useRef<HTMLImageElement>(null);
  const beforeLabelRef = useRef<HTMLDivElement>(null);

  const positionRef    = useRef(50);        // 0–100
  const isDraggingRef  = useRef(false);
  const rafRef         = useRef(0);
  const startTimeRef   = useRef<number | null>(null);

  // Directly mutate DOM — no React state, no re-renders
  const applyPosition = useCallback((pct: number) => {
    positionRef.current = pct;
    if (dividerRef.current)     dividerRef.current.style.left       = `${pct}%`;
    if (handleWrapRef.current)  handleWrapRef.current.style.left    = `${pct}%`;
    if (beforeImgRef.current)   beforeImgRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    if (beforeLabelRef.current) beforeLabelRef.current.style.opacity = pct > 8 ? "1" : "0";
  }, []);

  // ── Auto-play: smooth oscillation via RAF ──────────────────────────────
  useEffect(() => {
    if (!autoPlay) return;
    const CYCLE = 5000; // ms one-way

    const tick = (time: number) => {
      if (isDraggingRef.current) {
        // Pause clock during drag so animation resumes smoothly
        startTimeRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed  = (time - startTimeRef.current) % (CYCLE * 2);
      const t        = elapsed / CYCLE;          // 0 → 2
      const progress = t <= 1 ? t : 2 - t;      // ping-pong 0→1→0
      // ease-in-out cubic
      const eased = progress < 0.5
        ? 4 * progress ** 3
        : 1 - (-2 * progress + 2) ** 3 / 2;
      applyPosition(15 + eased * 70);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoPlay, applyPosition]);

  // ── Pointer helpers ────────────────────────────────────────────────────
  const pctFromEvent = useCallback((clientX: number): number => {
    if (!containerRef.current) return positionRef.current;
    const { left, width } = containerRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    if (handleInnerRef.current) handleInnerRef.current.style.transform = "scale(1.25)";
    applyPosition(pctFromEvent(e.clientX));
  }, [applyPosition, pctFromEvent]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    applyPosition(pctFromEvent(e.clientX));
  }, [applyPosition, pctFromEvent]);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    if (handleInnerRef.current) handleInnerRef.current.style.transform = "scale(1)";
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-t-xl"
      style={{ cursor: "ew-resize" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* ── After image (always fully visible) ── */}
      <img
        src={afterImage}
        alt="After"
        draggable={false}
        loading={loading}
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold tracking-widest text-white/80 z-10 pointer-events-none">
        AFTER
      </div>

      {/* ── Before image — clipped, never translated ── */}
      <img
        ref={beforeImgRef}
        src={beforeImage}
        alt="Before"
        draggable={false}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ clipPath: "inset(0 50% 0 0)" }}
      />
      <div
        ref={beforeLabelRef}
        className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold tracking-widest text-white/80 z-10 pointer-events-none"
        style={{ opacity: 1, transition: "opacity 0.15s" }}
      >
        BEFORE
      </div>

      {/* ── Divider line ── */}
      <div
        ref={dividerRef}
        className="absolute top-0 bottom-0 w-px bg-white/80 z-20 pointer-events-none"
        style={{ left: "50%" }}
      />

      {/* ── Handle ── */}
      <div
        ref={handleWrapRef}
        className="absolute top-1/2 z-20 pointer-events-none"
        style={{ left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div
          ref={handleInnerRef}
          className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg"
          style={{ transition: "transform 0.1s" }}
        >
          <GripVertical size={15} />
        </div>
      </div>
    </div>
  );
}
