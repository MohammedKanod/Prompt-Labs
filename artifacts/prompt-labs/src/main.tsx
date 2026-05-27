import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { seedInitialData } from "./lib/firestore";

// Seed initial data if needed
seedInitialData().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
