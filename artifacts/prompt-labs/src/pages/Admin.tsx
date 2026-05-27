import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { store } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldAlert, LogOut, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const isAuth = store.isAdmin();
    setIsAuthenticated(isAuth);
    if (!isAuth) {
      setLocation("/");
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    store.setAdmin(false);
    setLocation("/");
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

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="bg-card border border-white/10 mb-8 p-1 rounded-lg">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-secondary-foreground">Analytics</TabsTrigger>
          <TabsTrigger value="posts" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-secondary-foreground">Posts</TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-secondary-foreground">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Views", value: "24,592", trend: "+12%" },
              { label: "Total Unlocks", value: "8,304", trend: "+5%" },
              { label: "Prompt Copies", value: "3,192", trend: "+18%" },
              { label: "Shares", value: "942", trend: "+2%" }
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-white/5 rounded-xl p-6">
                <p className="text-secondary-foreground font-medium mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  <span className="text-green-400 text-sm font-medium">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Manage Posts</h2>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => toast({ title: "Mock feature", description: "Create post form would open here." })}>
              <Plus size={16} className="mr-2" /> Create Post
            </Button>
          </div>
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
                  {store.getAllPosts().map(post => (
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
                        <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-white mr-2">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Manage Categories</h2>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => toast({ title: "Mock feature", description: "Create category form would open here." })}>
              <Plus size={16} className="mr-2" /> Add Category
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.getAllCategories().map(cat => (
              <div key={cat.id} className="bg-card border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-secondary-foreground text-sm mb-4">{cat.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-sm font-medium text-primary">{cat.count} posts</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-secondary-foreground hover:text-white px-2">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
