import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import ReelCard from "@/components/ReelCard";
import UnlockModal from "@/components/UnlockModal";

export default function Reels() {
  const posts = store.getAllPosts().filter(p => p.reelEnabled);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [activeUnlockPost, setActiveUnlockPost] = useState<string | null>(null);

  useEffect(() => {
    // Hide scrollbar on body for Reels page
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleUnlock = (postId: string) => {
    setActiveUnlockPost(postId);
    setUnlockModalOpen(true);
  };

  const handleUnlocked = () => {
    if (activeUnlockPost) {
      store.unlockPost(activeUnlockPost);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex justify-center">
      <div className="w-full md:w-[450px] h-[100dvh] overflow-y-auto snap-y snap-mandatory hide-scrollbar flex flex-col items-center">
        {posts.map((post) => (
          <ReelCard
            key={post.id}
            post={post}
            isUnlocked={store.hasUnlocked(post.id)}
            onUnlock={() => handleUnlock(post.id)}
          />
        ))}
        {posts.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/50">
            No reels available.
          </div>
        )}
      </div>

      <UnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onUnlocked={handleUnlocked}
      />
      <style dangerouslySetAttribute={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
