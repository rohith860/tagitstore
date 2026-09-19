import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { LanguageProvider } from "./context/LanguageContext";

// =====================================================
// LOAD SAVED DARK MODE BEFORE REACT STARTS
// =====================================================

try {
  const savedSettings =
    localStorage.getItem("tagit-settings");

  if (savedSettings) {
    const data = JSON.parse(savedSettings);

    if (data.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
} catch (error) {
  console.error(
    "Failed to load saved theme:",
    error
  );
}

// =====================================================
// RENDER APP
// =====================================================

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);