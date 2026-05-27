import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-center">About Us</h1>
        <p className="text-xl text-secondary-foreground mb-12 text-center max-w-2xl mx-auto">
          We are a collective of designers, technologists, and AI researchers obsessed with the intersection of code and visual art.
        </p>

        <div className="bg-card border border-white/5 p-8 md:p-12 rounded-2xl mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-secondary-foreground leading-relaxed mb-6">
            AI image generation has democratized creativity, but it has also flooded the internet with generic, plastic-looking renders. At Prompt Labs, we believe that AI is a tool, not an artist. The artistry lies in the prompt—the direction, the intent, the specific curation of words.
          </p>
          <p className="text-secondary-foreground leading-relaxed">
            Our mission is to archive and distribute the highest quality prompts. We test extensively across Midjourney, DALL-E, and Stable Diffusion to ensure that every prompt we publish yields consistent, breathtaking, and usable results for professional workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-background border border-white/5 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Curation Process</h3>
            <p className="text-secondary-foreground leading-relaxed">
              Every prompt on our platform is hand-tested. We run it through multiple seeds, tweak the parameters, and verify the output before it ever reaches our archive. We only publish what we would use ourselves in production.
            </p>
          </div>
          <div className="bg-background border border-white/5 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Design Philosophy</h3>
            <p className="text-secondary-foreground leading-relaxed">
              We believe tools should be beautiful. The interface of Prompt Labs was designed with the same obsessive attention to detail that we apply to our prompts. Fast, dark, and focused entirely on the content.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
