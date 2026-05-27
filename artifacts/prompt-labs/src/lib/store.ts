export interface Post {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  blurPrompt: string;
  beforeImage: string;
  afterImage: string;
  tags: string[];
  category: string;
  modelUsed: string;
  featured: boolean;
  reelEnabled: boolean;
  published: boolean;
  views: number;
  unlockCount: number;
  copyCount: number;
  shareCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  count: number;
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: "1", slug: "cinematic", name: "Cinematic", description: "Movie-like dramatic lighting and composition", count: 12 },
  { id: "2", slug: "portrait", name: "Portrait", description: "Stunning character and people photography", count: 8 },
  { id: "3", slug: "architecture", name: "Architecture", description: "Breathtaking buildings and structures", count: 6 },
  { id: "4", slug: "abstract", name: "Abstract", description: "Surreal concepts and shapes", count: 9 },
  { id: "5", slug: "fantasy", name: "Fantasy", description: "Magical realms and creatures", count: 15 },
  { id: "6", slug: "landscape", name: "Landscape", description: "Vast nature and environments", count: 11 },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "10001",
    slug: "10001-cinematic-neon-rain",
    title: "Cinematic Neon Rain",
    prompt: "Ultra realistic cinematic shot of a Tokyo street in heavy rain, neon signs reflecting in puddles, dramatic lighting, shot on 35mm lens, 8k resolution --ar 16:9 --v 6.0",
    blurPrompt: "Ultra realistic ________ shot of a Tokyo street in heavy rain, neon signs reflecting in _______, dramatic lighting, shot on 35mm lens, 8k resolution --ar 16:9 --v 6.0",
    beforeImage: "https://picsum.photos/seed/neonrain1/800/600",
    afterImage: "https://picsum.photos/seed/neonrain2/800/600",
    tags: ["cyberpunk", "rain", "city", "neon"],
    category: "Cinematic",
    modelUsed: "Midjourney v6",
    featured: true,
    reelEnabled: true,
    published: true,
    views: 1250,
    unlockCount: 340,
    copyCount: 150,
    shareCount: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: "10002",
    slug: "10002-ethereal-forest-spirit",
    title: "Ethereal Forest Spirit",
    prompt: "A glowing ethereal forest spirit made of starlight and vines, standing in an ancient misty forest, bioluminescent flora, fantasy concept art, intricate details, masterpiece",
    blurPrompt: "A glowing ________ forest spirit made of starlight and vines, standing in an ancient misty forest, ______________ flora, fantasy concept art, intricate details, masterpiece",
    beforeImage: "https://picsum.photos/seed/forest1/800/600",
    afterImage: "https://picsum.photos/seed/forest2/800/600",
    tags: ["magic", "nature", "glow"],
    category: "Fantasy",
    modelUsed: "DALL-E 3",
    featured: true,
    reelEnabled: false,
    published: true,
    views: 890,
    unlockCount: 210,
    copyCount: 85,
    shareCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "10003",
    slug: "10003-brutalist-desert-villa",
    title: "Brutalist Desert Villa",
    prompt: "Architectural photography of a brutalist concrete villa seamlessly integrated into red desert rocks, sunset lighting, sharp shadows, minimalist luxury, hyper-realistic, photorealistic",
    blurPrompt: "Architectural photography of a ________ concrete villa seamlessly integrated into red desert rocks, sunset lighting, sharp shadows, minimalist luxury, ________, photorealistic",
    beforeImage: "https://picsum.photos/seed/brutal1/800/600",
    afterImage: "https://picsum.photos/seed/brutal2/800/600",
    tags: ["architecture", "desert", "concrete"],
    category: "Architecture",
    modelUsed: "Stable Diffusion XL",
    featured: false,
    reelEnabled: true,
    published: true,
    views: 640,
    unlockCount: 180,
    copyCount: 95,
    shareCount: 20,
    createdAt: new Date().toISOString(),
  },
  {
    id: "10004",
    slug: "10004-cyber-samurai-portrait",
    title: "Cyber Samurai Portrait",
    prompt: "Close up portrait of a futuristic samurai with glowing blue visors, wearing high-tech carbon fiber armor, dark moody background, rim lighting, 8k, highly detailed face",
    blurPrompt: "Close up portrait of a futuristic samurai with glowing ____ visors, wearing high-tech ______ fiber armor, dark moody background, rim lighting, 8k, highly detailed face",
    beforeImage: "https://picsum.photos/seed/samurai1/800/600",
    afterImage: "https://picsum.photos/seed/samurai2/800/600",
    tags: ["portrait", "armor", "sci-fi"],
    category: "Portrait",
    modelUsed: "Midjourney v6",
    featured: true,
    reelEnabled: true,
    published: true,
    views: 2100,
    unlockCount: 520,
    copyCount: 310,
    shareCount: 88,
    createdAt: new Date().toISOString(),
  }
];

export function isAdmin(): boolean {
  return sessionStorage.getItem('promptlabs_admin') === 'true';
}

export function setAdmin(status: boolean): void {
  if (status) sessionStorage.setItem('promptlabs_admin', 'true');
  else sessionStorage.removeItem('promptlabs_admin');
}

export function hasUnlocked(postId: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return localStorage.getItem(`unlocked_${today}_${postId}`) === 'true';
}

export function unlockPost(postId: string): void {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(`unlocked_${today}_${postId}`, 'true');
}
