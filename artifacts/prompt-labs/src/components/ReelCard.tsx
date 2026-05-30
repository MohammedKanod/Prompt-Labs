import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Heart, Share2, MessageCircle } from "lucide-react";
import { Post } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

interface ReelCardProps {
  post: Post;
  onUnlock: () => void;
  isUnlocked: boolean;
}

export default function ReelCard({ post, onUnlock, isUnlocked }: ReelCardProps) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className="relative w-full h-[100dvh] max-h-[850px] md:h-[800px] md:w-[450px] md:mx-auto md:rounded-2xl overflow-hidden bg-black snap-start shrink-0">
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={() => setShowAfter(!showAfter)}
      >
        <img 
          src={showAfter ? post.afterImage : post.beforeImage} 
          alt={post.title} 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        
        {/* Tap indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-md rounded-full px-4 py-2 text-white/80 text-sm font-medium border border-white/10 pointer-events-none">
          Tap to see {showAfter ? "before" : "after"}
        </div>
      </div>

      <div className="absolute top-6 left-4 z-20 flex gap-2">
        <Badge variant="secondary" className="bg-black/40 backdrop-blur-md border border-white/10 text-white font-medium shadow-lg">
          {post.category}
        </Badge>
        <Badge variant="outline" className="bg-black/40 backdrop-blur-md border border-white/10 text-white font-medium shadow-lg">
          {showAfter ? "AFTER" : "BEFORE"}
        </Badge>
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20">
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
            <Heart size={24} />
          </div>
          <span className="text-white font-medium text-xs shadow-black drop-shadow-md">{post.views}</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
            <MessageCircle size={24} />
          </div>
          <span className="text-white font-medium text-xs shadow-black drop-shadow-md">{Math.floor(post.views / 10)}</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
            <Share2 size={24} />
          </div>
          <span className="text-white font-medium text-xs shadow-black drop-shadow-md">{post.shareCount}</span>
        </button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-16 p-4 z-20">
        <h2 className="text-white text-xl font-bold mb-2 shadow-black drop-shadow-md">{post.title}</h2>
        
        <div className="relative mb-4">
          <p className={`text-sm text-white/90 font-mono line-clamp-3 shadow-black drop-shadow-md ${!isUnlocked ? "blur-sm opacity-70" : ""}`}>
            {isUnlocked ? post.prompt : post.blurPrompt}
          </p>
          {!isUnlocked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <button 
                onClick={onUnlock}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2 shadow-xl border border-white/10 transition-all hover:scale-105"
              >
                <Lock size={16} /> Unlock
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-white/80 text-xs font-medium bg-black/30 px-2 py-1 rounded border border-white/5 backdrop-blur-sm">
              #{tag}
            </span>
          ))}
        </div>
        
        <Link href={`/post/${post.id}`} className="text-primary hover:text-white text-sm font-medium transition-colors inline-block mt-2">
          View full details &rarr;
        </Link>
      </div>
    </div>
  );
}
