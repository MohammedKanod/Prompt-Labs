import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { isAdmin, setAdmin, Post, Category } from "@/lib/store";
import { useRealtimeAnalytics } from "@/hooks/useRealtimeAnalytics";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ShieldAlert, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Unlock, 
  Copy, 
  Share2, 
  TrendingUp,
  Image as ImageIcon,
  Loader2,
  Check,
  ChevronRight,
  Database,
  RefreshCw,
  AlertTriangle,
  Terminal,
  CheckCircle2,
  Radio,
  WifiOff,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useAllPostsAdmin, 
  useCategories, 
  useCreatePost, 
  useUpdatePost, 
  useDeletePost,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useQueryClient
} from "@/hooks/usePosts";
import { forceSeedData, clearAllData } from "@/lib/firestore";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadImage } from "@/lib/storage";

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  const { data: posts, isLoading: postsLoading } = useAllPostsAdmin();
  const { data: categories, isLoading: catsLoading } = useCategories();

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const createCatMutation = useCreateCategory();
  const updateCatMutation = useUpdateCategory();
  const deleteCatMutation = useDeleteCategory();

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  useEffect(() => {
    const isAuth = isAdmin();
    setIsAuthenticated(isAuth);
    if (!isAuth) {
      setLocation("/");
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    setAdmin(false);
    setLocation("/");
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostMutation.mutateAsync(id);
        toast({ title: "Post deleted" });
      } catch (error) {
        toast({ title: "Error deleting post", variant: "destructive" });
      }
    }
  };

  const handleDeleteCat = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCatMutation.mutateAsync(id);
        toast({ title: "Category deleted" });
      } catch (error) {
        toast({ title: "Error deleting category", variant: "destructive" });
      }
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="text-primary" /> Admin Dashboard
          </h1>
          <p className="text-secondary-foreground mt-2">Manage prompts, categories, and site content.</p>
        </div>
        <Button variant="outline" className="border-white/10" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="bg-card border border-white/10 mb-8 p-1 rounded-lg flex-wrap h-auto gap-1">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-secondary-foreground">Analytics</TabsTrigger>
          <TabsTrigger value="posts" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-secondary-foreground">Posts</TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-secondary-foreground">Categories</TabsTrigger>
          <TabsTrigger value="homepage" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-secondary-foreground">Homepage</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-secondary-foreground">Settings & Data</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="posts">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Manage Posts</h2>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white" 
              onClick={() => {
                setEditingPost(null);
                setIsPostDialogOpen(true);
              }}
            >
              <Plus size={16} className="mr-2" /> Create Post
            </Button>
          </div>
          
          {postsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-secondary-foreground">
                  <thead className="text-xs uppercase bg-white/5 text-white/70">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Views</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {posts?.map(post => (
                      <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                        <td className="px-6 py-4">{post.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{post.views}</td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-secondary-foreground hover:text-white mr-2"
                            onClick={() => {
                              setEditingPost(post);
                              setIsPostDialogOpen(true);
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Manage Categories</h2>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                setEditingCat(null);
                setIsCatDialogOpen(true);
              }}
            >
              <Plus size={16} className="mr-2" /> Add Category
            </Button>
          </div>
          {catsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories?.map(cat => (
                <div key={cat.id} className="bg-card border border-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{cat.name}</h3>
                  <p className="text-secondary-foreground text-sm mb-4">{cat.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-sm font-medium text-primary">{cat.count} posts</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-secondary-foreground hover:text-white px-2"
                        onClick={() => {
                          setEditingCat(cat);
                          setIsCatDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 px-2"
                        onClick={() => handleDeleteCat(cat.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="homepage">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Homepage Featured Posts</h2>
            <p className="text-secondary-foreground text-sm">Toggle which posts appear in the featured sections on the homepage.</p>
          </div>
          <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left text-secondary-foreground">
              <thead className="text-xs uppercase bg-white/5 text-white/70">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts?.map(post => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                    <td className="px-6 py-4">{post.category}</td>
                    <td className="px-6 py-4 text-center">
                      <Switch 
                        checked={post.featured} 
                        onCheckedChange={(val) => updatePostMutation.mutate({ id: post.id, data: { featured: val } })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>

      <PostDialog 
        isOpen={isPostDialogOpen} 
        onClose={() => setIsPostDialogOpen(false)} 
        post={editingPost}
        categories={categories || []}
      />

      <CategoryDialog
        isOpen={isCatDialogOpen}
        onClose={() => setIsCatDialogOpen(false)}
        category={editingCat}
      />
    </div>
  );
}

function AnalyticsTab() {
  const { totals, topPosts, posts, isConnected, isLoading, error, lastUpdated } = useRealtimeAnalytics();

  const stats = [
    { label: "Total Views",    value: totals.views,   icon: Eye,      color: "text-blue-400",   bg: "bg-blue-400/10"   },
    { label: "Total Unlocks",  value: totals.unlocks, icon: Unlock,   color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Prompt Copies",  value: totals.copies,  icon: Copy,     color: "text-green-400",  bg: "bg-green-400/10"  },
    { label: "Shares",         value: totals.shares,  icon: Share2,   color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Live status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <><Loader2 size={14} className="animate-spin text-secondary-foreground" />
            <span className="text-sm text-secondary-foreground">Connecting to Firestore...</span></>
          ) : isConnected ? (
            <><div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </div>
              <Radio size={13} className="text-green-400" />
              <span className="text-sm text-green-400 font-medium">Live</span>
              <span className="text-xs text-secondary-foreground">· updates in real time</span>
            </>
          ) : (
            <><WifiOff size={14} className="text-red-400" />
            <span className="text-sm text-red-400">{error ?? "Disconnected"}</span></>
          )}
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
            <Clock size={11} />
            Last updated {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-white/5 overflow-hidden group relative">
            {/* subtle flash when value changes */}
            <div className="absolute inset-0 rounded-xl pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-secondary-foreground">{stat.label}</CardTitle>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={15} className={stat.color} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 rounded bg-white/5 animate-pulse" />
              ) : (
                <AnimatedNumber
                  value={stat.value}
                  className="text-2xl font-bold text-white tabular-nums"
                />
              )}
              <p className="text-xs text-secondary-foreground mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-green-400" />
                <span className="text-muted">{posts.length} prompt{posts.length !== 1 ? "s" : ""} tracked</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top posts table */}
      <Card className="bg-card border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-lg">Top Performing Prompts</CardTitle>
          {isConnected && (
            <span className="text-xs text-secondary-foreground bg-white/5 rounded-full px-3 py-1">
              Sorted by views · live
            </span>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : topPosts.length === 0 ? (
            <p className="text-secondary-foreground text-sm py-4 text-center">No posts yet. Seed demo data or create a post to see stats here.</p>
          ) : (
            <div className="space-y-3">
              {topPosts.map((post, i) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/[0.08] transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{post.title}</p>
                      <p className="text-xs text-secondary-foreground">{post.category} · {post.modelUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 ml-4">
                    <div className="text-center min-w-[48px]">
                      <p className="text-[10px] text-secondary-foreground uppercase tracking-wider mb-0.5">Views</p>
                      <AnimatedNumber value={post.views || 0} className="text-sm font-bold text-white tabular-nums" />
                    </div>
                    <div className="text-center min-w-[48px]">
                      <p className="text-[10px] text-secondary-foreground uppercase tracking-wider mb-0.5">Unlocks</p>
                      <AnimatedNumber value={post.unlockCount || 0} className="text-sm font-bold text-white tabular-nums" />
                    </div>
                    <div className="text-center min-w-[48px]">
                      <p className="text-[10px] text-secondary-foreground uppercase tracking-wider mb-0.5">Copies</p>
                      <AnimatedNumber value={post.copyCount || 0} className="text-sm font-bold text-white tabular-nums" />
                    </div>
                    <ChevronRight size={16} className="text-secondary-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PostDialog({ isOpen, onClose, post, categories }: { isOpen: boolean, onClose: () => void, post: Post | null, categories: Category[] }) {
  const { toast } = useToast();
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    prompt: "",
    blurPrompt: "",
    beforeImage: "",
    afterImage: "",
    tags: [],
    category: "",
    modelUsed: "",
    featured: false,
    reelEnabled: false,
    published: true,
  });

  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  useEffect(() => {
    if (post) {
      setFormData(post);
      setGeneratedId(post.id);
      setTagInput(post.tags.join(", "));
    } else {
      const newId = Math.floor(10000 + Math.random() * 90000).toString();
      setGeneratedId(newId);
      setFormData({
        title: "",
        prompt: "",
        blurPrompt: "",
        beforeImage: "",
        afterImage: "",
        tags: [],
        category: categories[0]?.name || "",
        modelUsed: "Midjourney v6",
        featured: false,
        reelEnabled: false,
        published: true,
        views: 0,
        unlockCount: 0,
        copyCount: 0,
        shareCount: 0,
        createdAt: new Date().toISOString(),
      });
      setTagInput("");
    }
  }, [post, categories, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'beforeImage' | 'afterImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const path = `posts/${generatedId}/${field === 'beforeImage' ? 'before' : 'after'}.webp`;
      const url = await uploadImage(file, path);
      setFormData(prev => ({ ...prev, [field]: url }));
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Error uploading image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput.split(",").map(t => t.trim()).filter(t => t !== "");
    const slug = `${generatedId}-${formData.title?.toLowerCase().replace(/\s+/g, "-")}`;
    
    const finalData = { ...formData, tags, slug, id: generatedId } as Post;

    try {
      if (post) {
        await updateMutation.mutateAsync({ id: post.id, data: finalData });
        toast({ title: "Post updated" });
      } else {
        await createMutation.mutateAsync(finalData);
        toast({ title: "Post created" });
      }
      onClose();
    } catch (error) {
      toast({ title: "Error saving post", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Create New Post"}</DialogTitle>
          <DialogDescription className="text-secondary-foreground">Fill in the details for your AI prompt showcase.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                required
                className="bg-background border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>ID (Auto-generated)</Label>
              <div className="h-10 px-3 flex items-center bg-white/5 border border-white/10 rounded-md">
                <Badge variant="secondary">{generatedId}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prompt Text</Label>
            <Textarea 
              value={formData.prompt} 
              onChange={e => setFormData({ ...formData, prompt: e.target.value })} 
              required
              className="bg-background border-white/10 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Blur Prompt Preview (Partial version shown to locked users)</Label>
            <Textarea 
              value={formData.blurPrompt} 
              onChange={e => setFormData({ ...formData, blurPrompt: e.target.value })} 
              required
              className="bg-background border-white/10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label>Before Image</Label>
              <div className="space-y-2">
                <Input 
                  placeholder="Image URL" 
                  value={formData.beforeImage} 
                  onChange={e => setFormData({ ...formData, beforeImage: e.target.value })}
                  className="bg-background border-white/10"
                />
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <Input type="file" onChange={e => handleImageUpload(e, 'beforeImage')} className="bg-background border-white/10" />
              </div>
              {formData.beforeImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                  <img src={formData.beforeImage} alt="Before preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>After Image</Label>
              <div className="space-y-2">
                <Input 
                  placeholder="Image URL" 
                  value={formData.afterImage} 
                  onChange={e => setFormData({ ...formData, afterImage: e.target.value })}
                  className="bg-background border-white/10"
                />
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <Input type="file" onChange={e => handleImageUpload(e, 'afterImage')} className="bg-background border-white/10" />
              </div>
              {formData.afterImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                  <img src={formData.afterImage} alt="After preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={val => setFormData({ ...formData, category: val })}>
                <SelectTrigger className="bg-background border-white/10">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 text-white">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Model Used</Label>
              <Input 
                value={formData.modelUsed} 
                onChange={e => setFormData({ ...formData, modelUsed: e.target.value })}
                className="bg-background border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (Comma separated)</Label>
            <Input 
              value={tagInput} 
              onChange={e => setTagInput(e.target.value)}
              placeholder="cinematic, neon, tokyo"
              className="bg-background border-white/10"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tagInput.split(",").map((tag, i) => tag.trim() && (
                <Badge key={i} variant="outline" className="border-white/10 text-secondary-foreground">
                  #{tag.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured</Label>
              <Switch 
                id="featured" 
                checked={formData.featured} 
                onCheckedChange={val => setFormData({ ...formData, featured: val })} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reel">Reel Enabled</Label>
              <Switch 
                id="reel" 
                checked={formData.reelEnabled} 
                onCheckedChange={val => setFormData({ ...formData, reelEnabled: val })} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Published</Label>
              <Switch 
                id="published" 
                checked={formData.published} 
                onCheckedChange={val => setFormData({ ...formData, published: val })} 
              />
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-white/5">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10 text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || createMutation.isPending || updateMutation.isPending} className="bg-primary text-white">
              {(createMutation.isPending || updateMutation.isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {post ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CategoryDialog({ isOpen, onClose, category }: { isOpen: boolean, onClose: () => void, category: Category | null }) {
  const { toast } = useToast();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
    slug: "",
    count: 0
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: "",
        description: "",
        slug: "",
        count: 0
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.name?.toLowerCase().replace(/\s+/g, "-") || "";
    const finalData = { ...formData, slug } as Category;

    try {
      if (category) {
        await updateMutation.mutateAsync({ id: category.id, data: finalData });
        toast({ title: "Category updated" });
      } else {
        await createMutation.mutateAsync(finalData);
        toast({ title: "Category created" });
      }
      onClose();
    } catch (error) {
      toast({ title: "Error saving category", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required
              className="bg-background border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              required
              className="bg-background border-white/10"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10 text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-primary text-white">
              {category ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const FIRESTORE_RULES = `rules_version = '2';
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
}`;

const STORAGE_RULES = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}`;

function SettingsTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [seedResult, setSeedResult] = useState<{ posts: number; categories: number } | null>(null);
  const [copiedRules, setCopiedRules] = useState<"firestore" | "storage" | null>(null);
  const [copiedIndexes, setCopiedIndexes] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm(`This will add ${8} demo posts and ${6} categories to Firestore. Existing data is kept.\n\nContinue?`)) return;
    setSeeding(true);
    setSeedResult(null);
    try {
      const result = await forceSeedData();
      setSeedResult(result);
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: `Seeded ${result.posts} posts and ${result.categories} categories` });
    } catch (err: unknown) {
      toast({ title: "Seed failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  const handleClear = async () => {
    const confirmed = window.confirm(
      "WARNING: This will permanently delete ALL posts and categories from Firestore.\n\nThis cannot be undone. Are you absolutely sure?"
    );
    if (!confirmed) return;
    const doubleConfirm = window.confirm("Last chance — delete everything?");
    if (!doubleConfirm) return;

    setClearing(true);
    try {
      await clearAllData();
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "All data cleared from Firestore" });
    } catch (err: unknown) {
      toast({ title: "Clear failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setClearing(false);
    }
  };

  const copyToClipboard = async (text: string, type: "firestore" | "storage" | "indexes") => {
    await navigator.clipboard.writeText(text);
    if (type === "indexes") { setCopiedIndexes(true); setTimeout(() => setCopiedIndexes(false), 2000); }
    else { setCopiedRules(type); setTimeout(() => setCopiedRules(null), 2000); }
  };

  const indexJson = JSON.stringify({
    indexes: [
      { collectionGroup: "posts", queryScope: "COLLECTION", fields: [{ fieldPath: "published", order: "ASCENDING" }, { fieldPath: "createdAt", order: "DESCENDING" }] },
      { collectionGroup: "posts", queryScope: "COLLECTION", fields: [{ fieldPath: "published", order: "ASCENDING" }, { fieldPath: "featured", order: "ASCENDING" }, { fieldPath: "createdAt", order: "DESCENDING" }] },
      { collectionGroup: "posts", queryScope: "COLLECTION", fields: [{ fieldPath: "published", order: "ASCENDING" }, { fieldPath: "reelEnabled", order: "ASCENDING" }, { fieldPath: "createdAt", order: "DESCENDING" }] },
    ],
    fieldOverrides: []
  }, null, 2);

  const steps = [
    { label: "Create Firestore Database", detail: "Firebase Console → Build → Firestore Database → Create database → choose region → Start in test mode → Enable" },
    { label: "Set Firestore Security Rules", detail: "Firestore → Rules tab → paste the rules below → Publish" },
    { label: "Enable Firebase Storage", detail: "Firebase Console → Build → Storage → Get started → choose region → Done" },
    { label: "Set Storage Security Rules", detail: "Storage → Rules tab → paste the rules below → Publish" },
    { label: "Seed Demo Data (optional)", detail: "Come back here and click the Seed button below to populate 8 demo posts and 6 categories" },
  ];

  return (
    <div className="space-y-10">
      {/* Setup Checklist */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Firebase Setup Checklist</h2>
        <p className="text-secondary-foreground text-sm mb-6">Complete these steps once to make Prompt Labs fully functional with your Firebase project.</p>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-4 bg-card border border-white/5 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
              <div>
                <p className="text-white font-medium">{step.label}</p>
                <p className="text-secondary-foreground text-sm mt-0.5">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Firestore Rules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-primary" />
            <h3 className="text-white font-semibold">Firestore Security Rules</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-secondary-foreground hover:text-white"
            onClick={() => copyToClipboard(FIRESTORE_RULES, "firestore")}
          >
            {copiedRules === "firestore" ? <><CheckCircle2 size={14} className="mr-1.5 text-green-400" />Copied</> : <><Copy size={14} className="mr-1.5" />Copy</>}
          </Button>
        </div>
        <pre className="bg-[#0a0c10] border border-white/10 rounded-xl p-5 text-sm text-[#C2C7CF] overflow-x-auto leading-relaxed font-mono whitespace-pre">{FIRESTORE_RULES}</pre>
      </div>

      {/* Storage Rules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-primary" />
            <h3 className="text-white font-semibold">Firebase Storage Rules</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-secondary-foreground hover:text-white"
            onClick={() => copyToClipboard(STORAGE_RULES, "storage")}
          >
            {copiedRules === "storage" ? <><CheckCircle2 size={14} className="mr-1.5 text-green-400" />Copied</> : <><Copy size={14} className="mr-1.5" />Copy</>}
          </Button>
        </div>
        <pre className="bg-[#0a0c10] border border-white/10 rounded-xl p-5 text-sm text-[#C2C7CF] overflow-x-auto leading-relaxed font-mono whitespace-pre">{STORAGE_RULES}</pre>
      </div>

      {/* Composite Indexes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Database size={16} className="text-primary" />
              <h3 className="text-white font-semibold">Firestore Composite Indexes</h3>
            </div>
            <p className="text-secondary-foreground text-xs mt-1 ml-6">Paste into <code className="text-white/60">firestore.indexes.json</code> in your project root for future filtered queries.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-secondary-foreground hover:text-white shrink-0"
            onClick={() => copyToClipboard(indexJson, "indexes")}
          >
            {copiedIndexes ? <><CheckCircle2 size={14} className="mr-1.5 text-green-400" />Copied</> : <><Copy size={14} className="mr-1.5" />Copy</>}
          </Button>
        </div>
        <pre className="bg-[#0a0c10] border border-white/10 rounded-xl p-5 text-sm text-[#C2C7CF] overflow-x-auto leading-relaxed font-mono whitespace-pre">{indexJson}</pre>
      </div>

      {/* Data Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seed */}
        <div className="bg-card border border-white/5 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <RefreshCw size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Seed Demo Data</h3>
              <p className="text-secondary-foreground text-xs">Adds 8 demo posts + 6 categories to Firestore.</p>
            </div>
          </div>
          {seedResult && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 rounded-lg px-3 py-2">
              <CheckCircle2 size={14} />
              Seeded {seedResult.posts} posts, {seedResult.categories} categories
            </div>
          )}
          <Button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            data-testid="button-seed-data"
          >
            {seeding ? <><Loader2 size={14} className="mr-2 animate-spin" />Seeding...</> : "Seed Demo Data"}
          </Button>
        </div>

        {/* Clear */}
        <div className="bg-card border border-red-500/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Clear All Data</h3>
              <p className="text-secondary-foreground text-xs">Permanently deletes all posts and categories.</p>
            </div>
          </div>
          <Button
            onClick={handleClear}
            disabled={clearing}
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            data-testid="button-clear-data"
          >
            {clearing ? <><Loader2 size={14} className="mr-2 animate-spin" />Clearing...</> : "Clear All Data"}
          </Button>
        </div>
      </div>
    </div>
  );
}
