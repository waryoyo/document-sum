import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter } from "react-router";
import AppRouter from "@/router/AppRouter";
import { Toaster } from "@/components/ui/toaster";
import { pdfjs } from "react-pdf";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppRouter />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
