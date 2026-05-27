import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PromptCard from "@/components/PromptCard";
import { hasUnlocked, unlockPost } from "@/lib/store";
import UnlockModal from "@/components/UnlockModal";
import AnimatedNumber from "@/components/AnimatedNumber";
import { ArrowRight, BookOpen, Layers, Zap, Flame, TrendingUp, Unlock } from "lucide-react";
import { usePosts, useCategories } from "@/hooks/usePosts";
import { useRealtimeTrending } from "@/hooks/useRealtimeTrending";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: allPosts, isLoading: postsLoading } = usePosts();
  const { data: categories, isLoading: catsLoading } = useCategories();
  const { posts: trendingPosts, isLoading: trendingLoading } = useRealtimeTrending(3);

  const posts = (allPosts || []).slice(0, 4);
  const categoriesToShow = (categories || []).slice(0, 6);

  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [activeUnlockPost, setActiveUnlockPost] = useState<string | null>(null);

  const handleUnlock = (postId: string) => {
    setActiveUnlockPost(postId);
    setUnlockModalOpen(true);
  };

  const handleUnlocked = () => {
    if (activeUnlockPost) unlockPost(activeUnlockPost);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden pb-24">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-16">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-secondary-foreground mb-6 uppercase tracking-widest">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              Updated daily
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white max-w-5xl leading-[1.1] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Precision-crafted AI prompts engineered for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              visual creativity.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-secondary-foreground max-w-2xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Discover battle-tested prompts, compare before and after results, and elevate your AI generation workflow with editorial quality.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/explore">
              <Button size="lg" className="rounded-full h-14 px-8 text-base font-semibold shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all duration-300">
                Explore Prompts
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="ghost" className="rounded-full h-14 px-8 text-base font-medium text-secondary-foreground hover:text-white">
                How it works <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Trending Now ──────────────────────────────────────────── */}
      <section className="py-20 bg-card border-y border-white/5 relative overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.05)_0%,transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame size={18} className="text-orange-400" />
                <span className="text-xs font-medium text-orange-400 uppercase tracking-widest">Trending Now</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Most unlocked this week
              </h2>
              <p className="text-secondary-foreground mt-2 text-lg">
                The prompts creators are reaching for right now — updated in real time.
              </p>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="rounded-full group border-white/10 hover:border-white/20 hover:bg-white/5 shrink-0">
                See all <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl bg-white/5" />
                ))
              : trendingPosts.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  /* placeholder cards while data arrives */
                  <div key={i} className="rounded-2xl bg-background border border-white/5 p-6 flex flex-col gap-3 opacity-40">
                    <div className="h-4 w-3/4 rounded bg-white/10" />
                    <div className="h-3 w-1/2 rounded bg-white/5" />
                    <div className="h-3 w-2/3 rounded bg-white/5 mt-auto" />
                  </div>
                ))
              : trendingPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/post/${post.id}`}>
                      <div className="group relative rounded-2xl bg-background border border-white/5 hover:border-white/15 hover:bg-white/[0.03] transition-all cursor-pointer p-6 h-full flex flex-col gap-4 overflow-hidden">
                        {/* rank badge */}
                        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black
                          ${i === 0 ? "bg-orange-400/20 text-orange-400" : i === 1 ? "bg-slate-400/20 text-slate-300" : "bg-amber-700/20 text-amber-600"}`}>
                          {i + 1}
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-secondary-foreground uppercase tracking-wider mb-2">{post.category} · {post.modelUsed}</p>
                          <h3 className="text-white font-semibold text-lg leading-snug group-hover:text-primary transition-colors pr-8">
                            {post.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-5 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
                            <Unlock size={11} />
                            <AnimatedNumber value={post.unlockCount || 0} className="font-semibold text-white" />
                            <span>unlocks</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
                            <TrendingUp size={11} />
                            <AnimatedNumber value={post.views || 0} className="font-semibold text-white" />
                            <span>views</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Latest Additions ──────────────────────────────────────── */}
      <section className="py-24 relative z-10 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Latest Additions</h2>
              <p className="text-secondary-foreground max-w-2xl text-lg">
                New prompts tested across Midjourney, DALL-E 3, and SDXL — ready to use.
              </p>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="rounded-full group border-white/10 hover:border-white/20 hover:bg-white/5">
                View All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {postsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-[300px] w-full rounded-xl bg-white/5" />
                    <Skeleton className="h-6 w-3/4 bg-white/5" />
                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                  </div>
                ))
              : posts.map((post, index) => (
                  <PromptCard
                    key={post.id}
                    post={post}
                    index={index}
                    isUnlocked={hasUnlocked(post.id)}
                    onUnlock={() => handleUnlock(post.id)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="py-24 bg-card border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Browse by Category</h2>
            <p className="text-secondary-foreground max-w-2xl mx-auto text-lg">
              Explore specialized prompt engineering techniques tailored to specific visual domains.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {catsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl bg-white/5" />
                ))
              : categoriesToShow.map((cat, index) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-background border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer h-full group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-white/50">
                        <Layers size={24} />
                      </div>
                      <h3 className="text-white font-medium mb-1">{cat.name}</h3>
                      <p className="text-xs text-secondary-foreground">{cat.count} prompts</p>
                    </motion.div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── Guides ────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Educational Guides</h2>
              <p className="text-secondary-foreground max-w-2xl text-lg">
                Master the art of AI prompt engineering with our comprehensive guides.
              </p>
            </div>
            <Link href="/guides">
              <Button variant="outline" className="rounded-full group border-white/10 hover:border-white/20 hover:bg-white/5">
                All Guides <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Prompt Engineering Basics", desc: "Learn the foundational structure of effective AI image prompts.", icon: BookOpen, slug: "prompt-engineering-basics" },
              { title: "Beginner's Guide to AI Prompts", desc: "A zero-to-hero introduction to controlling AI models.", icon: Zap, slug: "beginners-guide" },
              { title: "AI Prompt Writing Guide", desc: "Advanced techniques for style transfer and composition.", icon: Layers, slug: "writing-guide" },
            ].map((guide, idx) => (
              <Link key={idx} href={`/guide/${guide.slug}`}>
                <div className="bg-card border border-white/5 p-8 rounded-2xl hover:border-white/10 hover:bg-white/5 transition-all group cursor-pointer h-full flex flex-col">
                  <guide.icon size={32} className="text-primary mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-3">{guide.title}</h3>
                  <p className="text-secondary-foreground mb-6 flex-1">{guide.desc}</p>
                  <span className="text-primary font-medium text-sm flex items-center group-hover:underline">
                    Read Guide <ArrowRight size={14} className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <UnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onUnlocked={handleUnlocked}
      />
    </div>
  );
}
