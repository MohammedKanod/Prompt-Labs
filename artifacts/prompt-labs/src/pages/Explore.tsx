import React, { useState, useMemo } from "react";
import { store } from "@/lib/store";
import PromptCard from "@/components/PromptCard";
import SearchBar from "@/components/SearchBar";
import UnlockModal from "@/components/UnlockModal";

export default function Explore() {
  const allPosts = store.getAllPosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [activeUnlockPost, setActiveUnlockPost] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return allPosts;
    const q = searchQuery.toLowerCase();
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.modelUsed.toLowerCase().includes(q)
    );
  }, [allPosts, searchQuery]);

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
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Explore Prompts</h1>
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-secondary-foreground text-lg">No prompts found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post, index) => (
            <PromptCard
              key={post.id}
              post={post}
              index={index}
              isUnlocked={store.hasUnlocked(post.id)}
              onUnlock={() => handleUnlock(post.id)}
            />
          ))}
        </div>
      )}

      <UnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onUnlocked={handleUnlocked}
      />
    </div>
  );
}
