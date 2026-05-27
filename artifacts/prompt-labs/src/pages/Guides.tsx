import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Layers, Zap, ArrowRight } from "lucide-react";

export const GUIDES = [
  { 
    title: "Prompt Engineering Basics", 
    desc: "Learn the foundational structure of effective AI image prompts.", 
    icon: BookOpen, 
    slug: "prompt-engineering-basics" 
  },
  { 
    title: "Beginner's Guide to AI Prompts", 
    desc: "A zero-to-hero introduction to controlling AI models.", 
    icon: Zap, 
    slug: "beginners-guide" 
  },
  { 
    title: "AI Prompt Writing Guide", 
    desc: "Advanced techniques for style transfer and composition.", 
    icon: Layers, 
    slug: "writing-guide" 
  }
];

export default function Guides() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Educational Guides</h1>
        <p className="text-secondary-foreground max-w-2xl mx-auto text-lg">
          Master the art of AI prompt engineering with our comprehensive resources tailored for visual creativity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {GUIDES.map((guide, idx) => (
          <Link key={idx} href={`/guide/${guide.slug}`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-white/5 p-8 rounded-2xl hover:border-white/10 hover:bg-white/5 transition-all group cursor-pointer h-full flex flex-col"
            >
              <guide.icon size={32} className="text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">{guide.title}</h3>
              <p className="text-secondary-foreground mb-6 flex-1">{guide.desc}</p>
              <span className="text-primary font-medium text-sm flex items-center group-hover:underline">
                Read Guide <ArrowRight size={14} className="ml-1" />
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
