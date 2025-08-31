import { createRoot } from "react-dom/client";
import App from "./App";
import { ApiClient } from "./lib/apiClient";
import "./index.css";
import "./mock-backend";

// Inicializar ApiClient para verificar backend
ApiClient.checkBackend();

createRoot(document.getElementById("root")!).render(<App />);
