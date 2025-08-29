import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 8080; // Usar porta fixa para evitar conflito com Vite

// Servir arquivos estáticos do React build
app.use(express.static(path.join(__dirname, 'backend', 'dist')));

// Health check simples
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Link-A Unified Server funcionando',
    timestamp: new Date().toISOString(),
    note: 'Frontend servido via Express estático'
  });
});

// SPA Catch-all handler - serve index.html para todas as rotas não-API
app.get('*', (req, res) => {
  // Não interceptar outras rotas de API
  if (req.path.startsWith('/api/') && req.path !== '/api/health') {
    return res.status(404).json({ 
      error: 'API endpoint não encontrado - backend completo não carregado',
      path: req.path,
      note: 'Esta é uma versão simplificada apenas para servir o frontend'
    });
  }
  
  // Para qualquer outra rota, servir index.html (React SPA)
  res.sendFile(path.join(__dirname, 'backend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Link-A Unified Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}/`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`📝 Note: Esta é uma versão simplificada para testar o frontend SPA`);
});