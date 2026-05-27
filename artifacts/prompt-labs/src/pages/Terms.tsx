import React from "react";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">Terms of Service</h1>
      
      <div className="prose prose-invert prose-lg max-w-none text-secondary-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-white">1. Agreement to Terms</h2>
        <p>By viewing or using this website, which can be accessed at promptlabs.design, you are agreeing to be bound by these website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.</p>

        <h2 className="text-white">2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Prompt Labs's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose or for any public display;</li>
          <li>attempt to reverse engineer any software contained on Prompt Labs's website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
        <p>This will let Prompt Labs to terminate upon violations of any of these restrictions.</p>

        <h2 className="text-white">3. Prompt Usage</h2>
        <p>The text prompts provided on this site are designed for use with AI generation tools. Once unlocked, you may use these prompts to generate images for personal or commercial use. However, you may not scrape, bulk download, or redistribute the prompt database itself.</p>

        <h2 className="text-white">4. Disclaimer</h2>
        <p>All the materials on Prompt Labs's website are provided "as is". Prompt Labs makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Prompt Labs does not make any representations concerning the accuracy or reliability of the use of the materials on its website or otherwise relating to such materials or any sites linked to this website.</p>

        <h2 className="text-white">5. Limitations</h2>
        <p>Prompt Labs or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Prompt Labs's website, even if Prompt Labs or an authorize representative of this website has been notified, orally or written, of the possibility of such damage.</p>
      </div>
    </div>
  );
}
