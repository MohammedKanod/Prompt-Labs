import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export { useQueryClient };
import * as fs from "@/lib/firestore";
import { Post, Category } from "@/lib/store";

export function usePosts() {
  return useQuery({ queryKey: ["posts"], queryFn: fs.getPosts });
}

export function useAllPostsAdmin() {
  return useQuery({ queryKey: ["posts", "admin"], queryFn: fs.getAllPostsAdmin });
}

export function usePost(id: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fs.getPost(id),
    enabled: !!id,
    // Use cached listing data immediately so the post never shows "not found"
    // while waiting for the individual Firestore fetch
    initialData: () => {
      const fromPublic = qc.getQueryData<Post[]>(["posts"]);
      const fromAdmin  = qc.getQueryData<Post[]>(["posts", "admin"]);
      return (fromPublic ?? fromAdmin)?.find(p => p.id === id);
    },
  });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: fs.getCategories });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: fs.createPost, 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }) 
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) => fs.updatePost(id, data), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }) 
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: fs.deletePost, 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }) 
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: fs.createCategory, 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }) 
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => fs.updateCategory(id, data), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }) 
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: fs.deleteCategory, 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }) 
  });
}
