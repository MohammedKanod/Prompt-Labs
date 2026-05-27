import React from "react";
import { Link, useLocation } from "wouter";
import { OrbitalLogo } from "./OrbitalLogo";
import { Search, Menu } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/reels", label: "Reels" },
    { href: "/categories", label: "Categories" },
    { href: "/guides", label: "Guides" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <OrbitalLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold tracking-tight text-white">Prompt Labs</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {links.map((link) => (
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

        <div className="md:hidden flex items-center gap-4">
          <Link href="/explore" className="text-secondary-foreground hover:text-white">
            <Search className="h-5 w-5" />
          </Link>
          <Button variant="ghost" size="icon" className="text-secondary-foreground">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
