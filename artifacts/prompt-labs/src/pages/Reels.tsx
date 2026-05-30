import { useState, useEffect } from "react";
import ReelCard from "@/components/ReelCard";
import UnlockModal from "@/components/UnlockModal";
import { usePosts } from "@/hooks/usePosts";
import { hasUnlocked, unlockPost } from "@/lib/store";
import { Loader2 } from "lucide-react";

export default function Reels() {
  const { data: allPosts, isLoading } = usePosts();
  const posts = (allPosts || []).filter(p => p.reelEnabled);
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
      unlockPost(activeUnlockPost);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex justify-center">
      <div className="w-full md:w-[450px] h-[100dvh] overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        {posts.map((post) => (
          <ReelCard
            key={post.id}
            post={post}
            isUnlocked={hasUnlocked(post.id)}
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
      <style dangerouslySetInnerHTML={{__html: `
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
