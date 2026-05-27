import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export default function UnlockModal({ isOpen, onClose, onUnlocked }: UnlockModalProps) {
  const [status, setStatus] = useState<"idle" | "playing" | "done">("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "playing") {
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus("done");
            setTimeout(() => {
              onUnlocked();
              onClose();
            }, 600);
            return 100;
          }
          return p + 2; // 5 seconds total (50 intervals of 100ms)
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status, onUnlocked, onClose]);

  const handleStart = () => {
    setStatus("playing");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={status === "playing" ? undefined : onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative pointer-events-auto"
            >
              {status !== "playing" && (
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}

              <div className="text-center py-6">
                {status === "idle" && (
                  <>
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Play size={24} className="text-primary ml-1" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Unlock this prompt</h2>
                    <p className="text-secondary-foreground mb-8">Watch a short 5-second ad to reveal the complete prompt engineering details.</p>
                    <Button 
                      size="lg" 
                      className="w-full rounded-full font-semibold bg-white text-black hover:bg-white/90"
                      onClick={handleStart}
                    >
                      Watch Ad to Unlock
                    </Button>
                  </>
                )}

                {status === "playing" && (
                  <>
                    <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Sponsor Message</h2>
                    <div className="w-full bg-black/40 rounded-lg aspect-video mb-6 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
                      <Loader2 size={32} className="text-primary animate-spin mb-4" />
                      <p className="text-white/60 text-sm">Simulating ad experience...</p>
                      
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div 
                          className="h-full bg-primary transition-all duration-100 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-secondary-foreground text-sm font-medium">
                      Unlocking in {Math.ceil(5 - (progress / 20))}s
                    </p>
                  </>
                )}

                {status === "done" && (
                  <>
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Prompt Unlocked!</h2>
                    <p className="text-secondary-foreground">Revealing details...</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
