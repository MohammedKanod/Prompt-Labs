import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  increment,
  setDoc,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import { Post, Category, INITIAL_POSTS, INITIAL_CATEGORIES } from "./store";

function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Firestore request timed out. Make sure Firestore is enabled in your Firebase Console and security rules allow reads.")), ms)
  );
  return Promise.race([promise, timeout]);
}

// POSTS
export async function getPosts(): Promise<Post[]> {
  const q = query(collection(db, "posts"), where("published", "==", true));
  const snapshot = await withTimeout(getDocs(q));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const snapshot = await withTimeout(getDocs(collection(db, "posts")));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
}

export async function getPost(id: string): Promise<Post | null> {
  const docRef = doc(db, "posts", id);
  const snapshot = await withTimeout(getDoc(docRef));
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Post;
  }
  return null;
}

export async function createPost(data: Omit<Post, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, "posts"), data);
  return docRef.id;
}

export async function updatePost(id: string, data: Partial<Post>): Promise<void> {
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, data);
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, "posts", id));
}

export async function incrementField(id: string, field: 'views' | 'unlockCount' | 'copyCount' | 'shareCount'): Promise<void> {
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, {
    [field]: increment(1)
  });
}

// CATEGORIES
export async function getCategories(): Promise<Category[]> {
  const snapshot = await withTimeout(getDocs(collection(db, "categories")));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, "categories"), data);
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const docRef = doc(db, "categories", id);
  await updateDoc(docRef, data);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

// SEED
export async function seedInitialData(): Promise<void> {
  const postsSnapshot = await withTimeout(getDocs(collection(db, "posts")));
  if (postsSnapshot.empty) {
    const batch = writeBatch(db);
    
    // Seed Categories first
    INITIAL_CATEGORIES.forEach(cat => {
      const catRef = doc(collection(db, "categories"));
      const { id, ...data } = cat;
      batch.set(catRef, data);
    });

    // Seed Posts
    INITIAL_POSTS.forEach(post => {
      const postRef = doc(collection(db, "posts"));
      const { id, ...data } = post;
      batch.set(postRef, data);
    });

    await batch.commit();
    console.log("Initial data seeded successfully");
  }
}
