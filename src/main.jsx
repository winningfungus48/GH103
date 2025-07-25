import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import { initNavigationListeners } from "./utils/navigation";

// Set basename for GitHub Pages deployment
const basename = import.meta.env.PROD ? "/GH103" : "/";

// Initialize navigation listeners for debugging and recovery
initNavigationListeners();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
