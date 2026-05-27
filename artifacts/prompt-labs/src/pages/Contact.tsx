import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you shortly.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Contact Us</h1>
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto">
            Have a question, feedback, or a brilliant prompt to share? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail className="text-primary" /> Email
              </h3>
              <p className="text-secondary-foreground">hello@promptlabs.design</p>
              <p className="text-secondary-foreground">support@promptlabs.design</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="text-primary" /> HQ
              </h3>
              <p className="text-secondary-foreground">
                124 Design Avenue<br />
                San Francisco, CA 94103<br />
                United States
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-white/5 p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Name</label>
                  <Input required placeholder="John Doe" className="bg-background border-white/10 focus-visible:ring-primary h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email</label>
                  <Input required type="email" placeholder="john@example.com" className="bg-background border-white/10 focus-visible:ring-primary h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Message</label>
                <Textarea required placeholder="How can we help?" className="bg-background border-white/10 focus-visible:ring-primary min-h-[150px] resize-none" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 font-medium bg-primary text-white hover:bg-primary/90">
                {loading ? "Sending..." : <><Send size={16} className="mr-2" /> Send Message</>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
