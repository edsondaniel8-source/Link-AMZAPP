import { config } from 'dotenv';

// ✅ CORREÇÃO: Carregar variáveis de ambiente em TODOS os ambientes
if (process.env.NODE_ENV === 'production') {
  // Produção: carregar do arquivo .env explicitamente
  config({ path: '.env' });
  console.log('🌍 [PRODUCTION] Variáveis de ambiente carregadas do .env');
} else {
  // Desenvolvimento: carregar normalmente
  config();
  console.log('🌍 [DEVELOPMENT] Variáveis de ambiente carregadas');
}

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Import routes function
import { registerRoutes } from "./routes/index";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware - CORS configurado para Railway e desenvolvimento
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        // Domínios de produção
        "https://link-aturismomoz.com",
        "https://www.link-aturismomoz.com",
        "https://link-a-backend-production.up.railway.app",
        
        // Railway backend URL
        process.env.CORS_ORIGIN || "https://link-a-backend-production.up.railway.app",
        
        // Desenvolvimento
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:8000",
        
        // Replit development
        undefined // Para ferramentas de desenvolvimento
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked origin: ${origin}`);
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend build com debug
const staticPath = path.join(__dirname, "../frontend/dist");
console.log(`📂 Servindo arquivos estáticos de: ${staticPath}`);
console.log(`📂 Diretório existe: ${fs.existsSync(staticPath)}`);
if (fs.existsSync(staticPath)) {
  const files = fs.readdirSync(staticPath);
  console.log(`📂 Arquivos encontrados: ${files.join(', ')}`);
}
app.use(express.static(staticPath));

// API Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Link-A Backend API funcionando",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Função principal do servidor
async function startServer() {
  try {
    console.log("🚀 Inicializando Link-A Backend...");
    
    // 🚨 DEBUG: Verificar ambiente e variáveis
    console.log('🌍 [ENV DEBUG] NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('🌍 [ENV DEBUG] PORT:', process.env.PORT || '3001');
    console.log('🌍 [ENV DEBUG] DATABASE_URL existe:', !!process.env.DATABASE_URL);
    console.log('🌍 [ENV DEBUG] FIREBASE_PROJECT_ID existe:', !!process.env.FIREBASE_PROJECT_ID);

    // 1. Registrar todas as rotas da API PRIMEIRO
    await registerRoutes(app);
    
    // 2. Para rotas API não encontradas - SEMPRE retorne JSON
    app.all("/api/*", (req, res) => {
      console.log(`❌ API endpoint não encontrado: ${req.method} ${req.path}`);
      res.status(404).json({
        error: "API endpoint não encontrado",
        path: req.path,
        method: req.method,
        availableEndpoints: [
          "GET /api/health",
          "POST /api/rides-simple/create", 
          "GET /api/rides-simple/search"
        ]
      });
    });

    // 3. Para todas as outras rotas - sirva o SPA (React Router)
    app.get("*", (req, res) => {
      const frontendPath = path.join(__dirname, "../frontend/dist");
      const indexFile = path.join(frontendPath, "index.html");
      
      console.log(`📦 Servindo SPA para rota: ${req.path}`);
      
      // Verificar se é uma rota de API pela URL
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          error: "API endpoint não encontrado",
          path: req.path,
        });
      }
      
      if (!fs.existsSync(frontendPath)) {
        console.error(`❌ Pasta do frontend não existe: ${frontendPath}`);
        return res.status(503).json({ 
          error: "Frontend não disponível", 
          message: "O frontend ainda não foi construído ou deployado",
          path: frontendPath
        });
      }
      
      if (!fs.existsSync(indexFile)) {
        console.error(`❌ index.html não encontrado: ${indexFile}`);
        return res.status(503).json({ 
          error: "Frontend index.html não encontrado", 
          message: "Build do frontend incompleto",
          path: indexFile
        });
      }
      
      // Servir o index.html para todas as rotas (SPA)
      res.sendFile(indexFile);
    });
    
    // 4. Criar servidor HTTP
    const server = app.listen(PORT, "0.0.0.0");

    // Configurar graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(
        `🛑 Recebido sinal ${signal}. Iniciando shutdown elegante...`,
      );

      server.close(() => {
        console.log("✅ Backend servidor fechado com sucesso");
        process.exit(0);
      });

      // Force kill após 5 segundos
      setTimeout(() => {
        console.log("⚡ Forçando encerramento do backend...");
        process.exit(1);
      }, 5000);
    };

    // Registrar handlers de shutdown
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    // Tratamento de erro para porta em uso
    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `❌ Porta ${PORT} já em uso. Use PORT=0 para auto-atribuição ou PORT=8001 para porta alternativa.`,
        );
        console.log("💡 Tentando porta alternativa em 2 segundos...");

        setTimeout(() => {
          server.listen(0, "0.0.0.0", () => {
            const address = server.address();
            const actualPort =
              address && typeof address === "object" ? address.port : "unknown";
            console.log(
              `🌐 Link-A Backend Server running on port ${actualPort} (auto-atribuída)`,
            );
            console.log(`📱 Frontend: http://localhost:${actualPort}/`);
            console.log(`🔌 API: http://localhost:${actualPort}/api/`);
            console.log(`🏥 Health: http://localhost:${actualPort}/api/health`);
            console.log("✅ Todas as APIs configuradas e funcionando");
          });
        }, 2000);
      } else {
        console.error("❌ Erro no servidor:", error);
        process.exit(1);
      }
    });

    // Configurar callback de sucesso
    server.on('listening', () => {
      console.log(`🌐 Link-A Backend Server running on port ${PORT}`);
      console.log(`📱 Frontend: http://localhost:${PORT}/`);
      console.log(`🔌 API: http://localhost:${PORT}/api/`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log("✅ Todas as APIs configuradas e funcionando");
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar servidor:", error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

// Não exportar app antes das rotas serem registradas