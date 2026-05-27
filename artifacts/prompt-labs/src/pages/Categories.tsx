import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { store } from "@/lib/store";
import { Layers } from "lucide-react";

export default function Categories() {
  const categories = store.getAllCategories();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Categories</h1>
        <p className="text-secondary-foreground max-w-2xl mx-auto text-lg">
          Explore specialized prompt engineering techniques tailored to specific visual domains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <Link key={cat.id} href={`/category/${cat.slug}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-white/5 p-8 rounded-2xl flex flex-col hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer h-full group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-white/50">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl text-white font-bold mb-2">{cat.name}</h3>
              <p className="text-secondary-foreground mb-6 flex-1">{cat.description}</p>
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-primary">{cat.count} prompts</span>
                <span className="text-white/30 group-hover:text-white transition-colors">&rarr;</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
