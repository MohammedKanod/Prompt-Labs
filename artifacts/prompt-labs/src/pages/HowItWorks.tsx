import React from "react";
import { motion } from "framer-motion";
import { Search, Unlock, Copy, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Discover",
      desc: "Browse our curated archive of high-end AI prompts. Use the before/after slider to see exactly how the prompt transforms a base concept into a masterpiece."
    },
    {
      icon: Unlock,
      title: "Unlock",
      desc: "Found a result you love? Watch a short 5-second sponsor message to instantly unlock the full prompt engineering details. No credit card required."
    },
    {
      icon: Copy,
      title: "Copy & Paste",
      desc: "One click copies the entire prompt. Head over to Midjourney, DALL-E, or your preferred AI generator and paste the text."
    },
    {
      icon: Sparkles,
      title: "Create",
      desc: "Generate stunning imagery instantly. Tweak our variables to customize the result and make it your own."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">How It Works</h1>
        <p className="text-lg text-secondary-foreground">
          A seamless workflow designed for professional creators. Get the results you want without the trial and error.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
        {/* Connection line for desktop */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 rounded-full bg-card border border-white/10 flex items-center justify-center mb-6 shadow-xl relative">
              <step.icon size={32} className="text-primary" />
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-secondary-foreground leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
