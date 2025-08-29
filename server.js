// server.js - Ponto de entrada principal para Railway
// Este arquivo executa o backend compilado com todas as funcionalidades

// Apenas importa e executa o backend compilado
import('./backend/dist/index.js')
  .then(() => {
    console.log('✅ Link-A Server iniciado com sucesso');
  })
  .catch((error) => {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  });