import faviconUrl from "./assets/favicon.png";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

const ensureFavicon = () => {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
  const link = existing ?? document.createElement("link");

  link.rel = "icon";
  link.type = "image/png";
  link.href = faviconUrl;

  if (!existing) {
    document.head.appendChild(link);
  }
};

ensureFavicon();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);

window.setTimeout(() => {
  document.body.classList.add("app-ready");
}, 4500);
