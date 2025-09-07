// cors-fix.js - Configuração CORS para Railway

const cors = require('cors');

// ===== CONFIGURAÇÃO CORS COMPLETA =====
const corsOptions = {
  origin: [
    'http://localhost:5000',           // Replit local
    'https://link-amzapp.replit.app',  // Replit production
    'https://*.replit.app',            // Todos os subdomains Replit
    'https://*.replit.dev',            // Replit dev
    'https://link-amzapp-frontend.vercel.app', // Vercel (se usar)
    'https://linkatmz.com',            // Domínio custom (se tiver)
    'https://*.linkatmz.com'           // Subdomains custom
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Aplicar CORS
app.use(cors(corsOptions));

// Headers de segurança adiccionais
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// ===== ENDPOINT TESTE CORS =====
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS funcionando!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});