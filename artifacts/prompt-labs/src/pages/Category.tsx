import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { store } from "@/lib/store";
import PromptCard from "@/components/PromptCard";
import UnlockModal from "@/components/UnlockModal";
import { ArrowLeft } from "lucide-react";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const category = store.getAllCategories().find((c) => c.slug === slug);
  const posts = store.getAllPosts().filter((p) => p.category.toLowerCase() === category?.name.toLowerCase());
  
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [activeUnlockPost, setActiveUnlockPost] = useState<string | null>(null);

  const handleUnlock = (postId: string) => {
    setActiveUnlockPost(postId);
    setUnlockModalOpen(true);
  };

  const handleUnlocked = () => {
    if (activeUnlockPost) {
      store.unlockPost(activeUnlockPost);
    }
  };

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <Link href="/categories" className="text-primary hover:underline">Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <Link href="/categories" className="inline-flex items-center text-secondary-foreground hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> All Categories
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{category.name}</h1>
        <p className="text-secondary-foreground max-w-2xl text-lg">{category.description}</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-card border border-white/5 rounded-2xl">
          <p className="text-secondary-foreground text-lg">No prompts found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
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
