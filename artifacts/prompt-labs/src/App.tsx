import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Pages
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Post from "@/pages/Post";
import Reels from "@/pages/Reels";
import Categories from "@/pages/Categories";
import Category from "@/pages/Category";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import Guides from "@/pages/Guides";
import Guide from "@/pages/Guide";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import FAQ from "@/pages/FAQ";
import HowItWorks from "@/pages/HowItWorks";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/explore" component={Explore} />
          <Route path="/post/:id" component={Post} />
          <Route path="/reels" component={Reels} />
          <Route path="/categories" component={Categories} />
          <Route path="/category/:slug" component={Category} />
          <Route path="/about" component={About} />
          <Route path="/admin" component={Admin} />
          <Route path="/guides" component={Guides} />
          <Route path="/guide/:slug" component={Guide} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/faq" component={FAQ} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
