import { useState, useMemo } from "react";
import PromptCard from "@/components/PromptCard";
import SearchBar from "@/components/SearchBar";
import UnlockModal from "@/components/UnlockModal";
import { usePosts } from "@/hooks/usePosts";
import { hasUnlocked, unlockPost } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

export default function Explore() {
  const { data: allPosts, isLoading, isError } = usePosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [activeUnlockPost, setActiveUnlockPost] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!allPosts) return [];
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
      unlockPost(activeUnlockPost);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Explore Prompts</h1>
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {isError ? (
        <div className="text-center py-24 space-y-4">
          <p className="text-white text-xl font-semibold">Unable to load prompts</p>
          <p className="text-secondary-foreground max-w-md mx-auto">Firestore security rules may be blocking reads. In the Firebase Console, go to <strong className="text-white">Firestore Database → Rules</strong> and paste the rules shown below.</p>
          <pre className="inline-block text-left bg-card border border-white/10 rounded-xl px-6 py-4 text-sm text-secondary-foreground mt-4 whitespace-pre">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if false;
    }
    match /categories/{catId} {
      allow read: if true;
      allow write: if false;
    }
  }
}`}</pre>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[320px] w-full rounded-xl bg-white/5" />
              <Skeleton className="h-6 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-1/2 bg-white/5" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
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
              isUnlocked={hasUnlocked(post.id)}
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
