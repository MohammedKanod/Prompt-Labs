import React from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { GUIDES } from "./Guides";

export default function Guide() {
  const { slug } = useParams<{ slug: string }>();
  const guide = GUIDES.find(g => g.slug === slug);

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Guide not found</h1>
        <Link href="/guides" className="text-primary hover:underline">Back to Guides</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl min-h-screen">
      <Link href="/guides" className="inline-flex items-center text-secondary-foreground hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> All Guides
      </Link>

      <article className="prose prose-invert prose-lg max-w-none">
        <div className="flex items-center gap-4 mb-8">
          <guide.icon size={40} className="text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight m-0">{guide.title}</h1>
        </div>
        
        <p className="text-xl text-secondary-foreground mb-12 border-l-4 border-primary pl-6">
          {guide.desc}
        </p>

        {slug === "prompt-engineering-basics" && (
          <>
            <h2>The Anatomy of a Great Prompt</h2>
            <p>Every effective prompt is built on a solid foundation. Think of it like a recipe. You need a subject, an environment, lighting, and camera details.</p>
            <ul>
              <li><strong>Subject:</strong> What is the main focus? Be specific. "A cybernetic dog" is better than "a dog".</li>
              <li><strong>Environment:</strong> Where is the subject? "In a neon-lit alleyway in neo-Tokyo."</li>
              <li><strong>Lighting:</strong> Lighting defines the mood. Try "cinematic lighting, rim light, volumetric glow".</li>
              <li><strong>Camera/Style:</strong> How is it captured? "Shot on 35mm lens, depth of field, Unreal Engine 5 render."</li>
            </ul>
            <h3>The Power of Modifiers</h3>
            <p>Modifiers adjust the output's quality and style. Keywords like <code>masterpiece, highly detailed, 8k resolution, photorealistic</code> force the model to bias toward high-quality data.</p>
          </>
        )}

        {slug === "beginners-guide" && (
          <>
            <h2>Getting Started with AI</h2>
            <p>If you're new to AI image generation, the terminology can be overwhelming. Here's a quick cheat sheet:</p>
            <ul>
              <li><strong>Seed:</strong> A starting number for the generation. Using the same seed with the same prompt yields the same image.</li>
              <li><strong>Aspect Ratio:</strong> The dimensions of the image. In Midjourney, use <code>--ar 16:9</code> for landscape or <code>--ar 9:16</code> for portrait.</li>
              <li><strong>Stylize:</strong> How much artistic freedom the AI has. <code>--s 1000</code> in Midjourney makes it highly stylized.</li>
            </ul>
            <h3>Your First Prompt</h3>
            <p>Try this: <em>A cute robot cat playing in a futuristic park, bright sunny day, highly detailed, 3d render, octane render --ar 16:9</em></p>
          </>
        )}

        {slug === "writing-guide" && (
          <>
            <h2>Advanced Style Transfer</h2>
            <p>Once you master the basics, you can start mimicking specific artistic styles, film stocks, and directors.</p>
            <h3>Directing the Camera</h3>
            <p>Use directorial terms to frame your shots:</p>
            <ul>
              <li><strong>Establishing Shot:</strong> Wide angle, sets the scene.</li>
              <li><strong>Dutch Angle:</strong> Tilted camera, creates unease.</li>
              <li><strong>Macro Photography:</strong> Extreme close up on small details.</li>
            </ul>
            <h3>Blending Concepts</h3>
            <p>The true magic of AI is combining disparate concepts. Try merging architectural styles with organic forms: <em>Brutalist architecture integrated with bioluminescent coral reefs, sunset lighting, sharp shadows, cinematic.</em></p>
          </>
        )}
      </article>
    </div>
  );
}
