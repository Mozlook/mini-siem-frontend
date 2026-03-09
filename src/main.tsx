import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import { queryClient } from "./queryClient";
import { AuthProvider } from "./auth/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            containerClassName="z-[9999] mt-14"
            toastOptions={{
              duration: 5000,

              className:
                "!rounded-lg !border !border-slate-800 !bg-slate-950/90 !text-slate-100 " +
                "!shadow-lg backdrop-blur !px-3 !py-2 text-sm",

              success: {
                iconTheme: { primary: "#22c55e", secondary: "#020617" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#020617" },
              },
              loading: {
                iconTheme: { primary: "#e2e8f0", secondary: "#020617" },
              },
            }}
          />
          <App />
        </AuthProvider>
      </BrowserRouter>
      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  </StrictMode>,
);
