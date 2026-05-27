import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/lib/store";

export interface AnalyticsTotals {
  views: number;
  unlocks: number;
  copies: number;
  shares: number;
}

export interface RealtimeAnalytics {
  totals: AnalyticsTotals;
  posts: Post[];
  topPosts: Post[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useRealtimeAnalytics(): RealtimeAnalytics {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError("Connection timed out. Make sure Firestore is enabled and rules allow reads.");
      }
    }, 9000);

    const q = query(collection(db, "posts"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        clearTimeout(timeout);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        setPosts(data);
        setIsLoading(false);
        setIsConnected(true);
        setError(null);
        setLastUpdated(new Date());
      },
      (err) => {
        clearTimeout(timeout);
        setIsLoading(false);
        setIsConnected(false);
        setError(err.message);
      }
    );

    return () => {
      clearTimeout(timeout);
      unsubscribe();
      setIsConnected(false);
    };
  }, []);

  const totals = posts.reduce<AnalyticsTotals>(
    (acc, post) => ({
      views: acc.views + (post.views || 0),
      unlocks: acc.unlocks + (post.unlockCount || 0),
      copies: acc.copies + (post.copyCount || 0),
      shares: acc.shares + (post.shareCount || 0),
    }),
    { views: 0, unlocks: 0, copies: 0, shares: 0 }
  );

  const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return { totals, posts, topPosts, isConnected, isLoading, error, lastUpdated };
}
