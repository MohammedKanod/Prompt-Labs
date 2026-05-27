import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { store } from "@/lib/store";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import UnlockModal from "@/components/UnlockModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Copy, Check, Share2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const post = store.getAllPosts().find((p) => p.id === id);
  const { toast } = useToast();

  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <Link href="/explore">
          <Button variant="outline">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const isUnlocked = store.hasUnlocked(post.id);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.prompt);
      setCopied(true);
      toast({ title: "Prompt copied!", description: "Ready to paste into your AI generator." });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleUnlocked = () => {
    store.unlockPost(post.id);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <Link href="/explore" className="inline-flex items-center text-secondary-foreground hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Explore
      </Link>

      <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-[400px] md:h-[600px] w-full relative">
          <BeforeAfterSlider beforeImage={post.beforeImage} afterImage={post.afterImage} autoPlay={false} />
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className="bg-black/40 text-white border-white/10">{post.category}</Badge>
            <Badge variant="outline" className="border-white/10 text-secondary-foreground">{post.modelUsed}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">{post.title}</h1>

          <div className="bg-background rounded-xl p-6 md:p-8 border border-white/5 relative mb-8">
            <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-widest mb-4">The Prompt</h3>
            
            <p className={`text-lg md:text-xl font-mono leading-relaxed text-white/90 ${!isUnlocked ? "blur-sm opacity-50 select-none" : ""}`}>
              {isUnlocked ? post.prompt : post.blurPrompt}
            </p>

            {!isUnlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[2px] rounded-xl z-10">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-xl shadow-primary/20"
                  onClick={() => setUnlockModalOpen(true)}
                >
                  <Lock size={18} className="mr-2" /> Unlock to View Prompt
                </Button>
                <p className="text-sm text-secondary-foreground mt-4">Watch a short ad to unlock for 24 hours.</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm text-secondary-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="border-white/10 flex-1 md:flex-none">
                <Share2 size={16} className="mr-2" /> Share
              </Button>
              {isUnlocked && (
                <Button 
                  className="bg-white text-black hover:bg-white/90 flex-1 md:flex-none"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                  {copied ? "Copied!" : "Copy Prompt"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <UnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onUnlocked={handleUnlocked}
      />
    </div>
  );
}
