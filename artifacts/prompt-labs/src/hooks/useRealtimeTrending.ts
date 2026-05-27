import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/lib/store";

export function useRealtimeTrending(count = 3) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 9000);

    const q = query(
      collection(db, "posts"),
      orderBy("unlockCount", "desc"),
      limit(count)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        clearTimeout(timeout);
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        setIsLoading(false);
      },
      () => {
        clearTimeout(timeout);
        setIsLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, [count]);

  return { posts, isLoading };
}
