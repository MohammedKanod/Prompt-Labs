import React from "react";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">Privacy Policy</h1>
      
      <div className="prose prose-invert prose-lg max-w-none text-secondary-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>At Prompt Labs, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.</p>

        <h2 className="text-white">Information We Collect</h2>
        <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.</p>

        <h2 className="text-white">How We Use Your Information</h2>
        <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:</p>
        <ul>
          <li>Communicate with you;</li>
          <li>Screen our orders for potential risk or fraud; and</li>
          <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
        </ul>

        <h2 className="text-white">Data Storage</h2>
        <p>Prompt Labs utilizes local storage mechanisms to track your unlocked prompts. This data never leaves your device unless explicitly synchronized with an account (if applicable).</p>

        <h2 className="text-white">Changes</h2>
        <p>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</p>
        
        <h2 className="text-white">Contact Us</h2>
        <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at privacy@promptlabs.design.</p>
      </div>
    </div>
  );
}
