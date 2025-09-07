import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Verificar saúde do backend na inicialização
(async () => {
  try {
    const response = await fetch('/api/health');
    const health = await response.json();
    console.log('🔗 Backend conectado:', health.status);
  } catch (error) {
    console.log('🔄 Backend não disponível, usando fallback');
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
