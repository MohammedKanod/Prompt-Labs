import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "What is Prompt Labs?",
      a: "Prompt Labs is a premium, admin-curated archive of high-quality text prompts designed to yield exceptional results in AI image generators like Midjourney, DALL-E, and Stable Diffusion."
    },
    {
      q: "How does unlocking work?",
      a: "When you find a prompt you like, you can click 'Unlock'. You'll watch a simulated 5-second sponsor message, after which the full prompt text is revealed. The unlock persists on your device until midnight."
    },
    {
      q: "Are the prompts guaranteed to work?",
      a: "Because AI models constantly update, exact pixel-for-pixel recreation isn't guaranteed. However, our prompts are rigorously tested to ensure they consistently produce high-quality imagery in the specified styles."
    },
    {
      q: "Can I use the generated images commercially?",
      a: "Yes. The images you generate using our prompts belong to you, subject to the terms of the specific AI tool you are using (e.g., Midjourney's terms of service)."
    },
    {
      q: "Do I need to create an account?",
      a: "No! Prompt Labs is designed to be frictionless. Your unlocked prompts are securely stored in your browser's local storage."
    },
    {
      q: "How often are new prompts added?",
      a: "Our editorial team adds new, tested prompts on a weekly basis, organizing them into specific stylistic categories."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-secondary-foreground">Everything you need to know about the product and billing.</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-white/5 rounded-xl px-6 data-[state=open]:bg-white/[0.02]">
            <AccordionTrigger className="text-white hover:text-white hover:no-underline font-semibold text-lg py-6">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-secondary-foreground text-base leading-relaxed pb-6">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
