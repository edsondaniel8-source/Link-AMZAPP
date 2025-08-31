import { createRoot } from "react-dom/client";
import App from "./App";
import { sharedHealthApi } from "./api/shared/health";
import "./index.css";

// Verificar saúde do backend na inicialização
(async () => {
  try {
    const health = await sharedHealthApi.basic();
    console.log('🔗 Backend conectado:', health.status);
  } catch (error) {
    console.log('🔄 Backend não disponível, usando fallback');
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
