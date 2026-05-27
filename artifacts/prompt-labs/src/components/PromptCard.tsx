import { Link } from "wouter";
import { motion } from "framer-motion";
import { Lock, Share2, Crown, ChevronRight } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { Post } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PromptCardProps {
  post: Post;
  index: number;
  onUnlock: () => void;
  isUnlocked: boolean;
}

export default function PromptCard({ post, index, onUnlock, isUnlocked }: PromptCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col bg-card border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1"
    >
      <div className="absolute top-3 left-3 z-20 flex gap-2">
        <Badge variant="secondary" className="bg-black/60 hover:bg-black/80 backdrop-blur-md border-none text-white/90 font-medium">
          {post.category}
        </Badge>
        {post.featured && (
          <Badge className="bg-accent/90 hover:bg-accent text-accent-foreground backdrop-blur-md border-none font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Crown size={12} className="mr-1" /> Curated
          </Badge>
        )}
      </div>

      <div className="absolute top-3 right-3 z-20">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white/80 border border-white/10 transition-colors">
          <Share2 size={14} />
        </Button>
      </div>

      <div className="h-[280px] md:h-[320px] w-full">
        <BeforeAfterSlider beforeImage={post.beforeImage} afterImage={post.afterImage} />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-semibold text-lg text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <span className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/10 text-white/60 whitespace-nowrap">
            {post.modelUsed}
          </span>
        </div>

        <div className="relative mt-2 mb-6">
          <div className="text-sm text-secondary-foreground/70 leading-relaxed font-mono relative z-0">
            {isUnlocked ? post.prompt : post.blurPrompt}
          </div>
          
          {!isUnlocked && (
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent z-10 flex items-end pb-1">
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
          {isUnlocked ? (
            <Link href={`/post/${post.id}`} className="w-full">
              <Button className="w-full font-medium" variant="secondary">
                View Full Details <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          ) : (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all"
              onClick={(e) => { e.preventDefault(); onUnlock(); }}
            >
              <Lock size={16} className="mr-2" /> Unlock Prompt
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
