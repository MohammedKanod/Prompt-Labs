import React from "react";
import { motion } from "framer-motion";

export function OrbitalLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
        <circle cx="50" cy="10" r="4" fill="currentColor" />
      </motion.svg>
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <circle cx="80" cy="50" r="3" fill="currentColor" />
      </motion.svg>
      <div className="h-6 w-6 rounded-full bg-primary relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
    </div>
  );
}
