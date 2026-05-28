import { useState } from "react";
import { Link, useLocation } from "wouter";
import { OrbitalLogo } from "./OrbitalLogo";
import { Search, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/reels", label: "Reels" },
    { href: "/categories", label: "Categories" },
    { href: "/guides", label: "Guides" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <OrbitalLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold tracking-tight text-white">Prompt Labs</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {links.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  location === link.href ? "text-white" : "text-secondary-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/explore" className="text-secondary-foreground hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </Link>
            <Button variant="default" className="rounded-full px-6 font-medium">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/explore" className="text-secondary-foreground hover:text-white">
            <Search className="h-5 w-5" />
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-white hover:bg-white/5">
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72 bg-background border-white/10 p-0 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                <OrbitalLogo className="h-7 w-7 text-primary" />
                <span className="text-base font-semibold tracking-tight text-white">Prompt Labs</span>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors group ${
                      location === link.href
                        ? "bg-primary/10 text-white"
                        : "text-secondary-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                    <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>

              {/* CTA */}
              <div className="px-4 py-5 border-t border-white/5">
                <Button className="w-full rounded-full font-medium" onClick={() => setMobileOpen(false)}>
                  Subscribe
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}
