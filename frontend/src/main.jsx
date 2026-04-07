import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "Segoe UI, sans-serif",
              fontSize: "0.875rem",
              borderRadius: "16px",
              padding: "12px 16px",
            },
            success: {
              style: { background: "#0f766e", color: "#fff" },
              iconTheme: { primary: "#fff", secondary: "#0f766e" },
            },
            error: {
              duration: 5000,
              style: { background: "#dc2626", color: "#fff" },
              iconTheme: { primary: "#fff", secondary: "#dc2626" },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
