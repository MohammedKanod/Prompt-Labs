import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <motion.div 
      className={`relative flex items-center w-full max-w-2xl mx-auto ${className}`}
      animate={{ 
        scale: isFocused ? 1.02 : 1,
        boxShadow: isFocused ? "0 0 0 1px rgba(59,130,246,0.5), 0 10px 30px -10px rgba(59,130,246,0.2)" : "0 0 0 1px rgba(255,255,255,0.1), 0 4px 10px -5px rgba(0,0,0,0.5)"
      }}
      transition={{ duration: 0.2 }}
      style={{ borderRadius: "1rem" }}
    >
      <div className="absolute left-4 text-white/40 pointer-events-none">
        <Search size={20} className={isFocused ? "text-primary transition-colors" : ""} />
      </div>
      
      <Input
        type="text"
        placeholder="Search prompts by keyword, tag, or model..."
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-14 pl-12 pr-12 bg-black/20 backdrop-blur-sm border-none text-white placeholder:text-white/30 text-lg rounded-2xl focus-visible:ring-0 shadow-inner"
      />
      
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
