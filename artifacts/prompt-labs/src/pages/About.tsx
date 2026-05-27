import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { OrbitalLogo } from "@/components/OrbitalLogo";
import AdminModal from "@/components/AdminModal";

export default function About() {
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const handleLogoClick = () => {
    clickCount.current += 1;
    
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    
    if (clickCount.current === 20) {
      setAdminModalOpen(true);
      clickCount.current = 0;
    } else {
      clickTimeout.current = setTimeout(() => {
        clickCount.current = 0;
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-center"
      >
        <div 
          className="w-32 h-32 mx-auto mb-8 cursor-default"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
        >
          <OrbitalLogo className="w-full h-full text-primary" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">About Prompt Labs</h1>
        
        <p className="text-lg text-secondary-foreground mb-8 leading-relaxed">
          Prompt Labs was born from a desire to elevate AI generation from a chaotic experiment into a predictable, professional workflow. We believe that a great prompt is indistinguishable from great photography direction.
        </p>

        <p className="text-lg text-secondary-foreground leading-relaxed">
          Our team curates, tests, and refines every prompt to ensure editorial-quality outputs across Midjourney, DALL-E, and Stable Diffusion. We don't just share text; we engineer visual intent.
        </p>
      </motion.div>

      <AdminModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </div>
  );
}
