import React from "react";
import { Link } from "wouter";
import { OrbitalLogo } from "./OrbitalLogo";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <OrbitalLogo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight text-white">Prompt Labs</span>
            </Link>
            <p className="text-sm text-secondary-foreground max-w-xs leading-relaxed">
              The finest AI prompts for image generation — tested, refined, and ready to use. Built for designers, artists, and creators who demand results.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/explore" className="text-sm text-secondary-foreground hover:text-white transition-colors">All Prompts</Link></li>
              <li><Link href="/categories" className="text-sm text-secondary-foreground hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/reels" className="text-sm text-secondary-foreground hover:text-white transition-colors">Reels</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/guides" className="text-sm text-secondary-foreground hover:text-white transition-colors">Guides</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-secondary-foreground hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/faq" className="text-sm text-secondary-foreground hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-secondary-foreground hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-secondary-foreground hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-secondary-foreground hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-secondary-foreground hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">© {new Date().getFullYear()} Prompt Labs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted">Design with precision.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
