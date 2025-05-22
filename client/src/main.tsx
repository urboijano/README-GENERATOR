import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add GitHub-style font family
document.documentElement.classList.add('font-sans');

createRoot(document.getElementById("root")!).render(<App />);
