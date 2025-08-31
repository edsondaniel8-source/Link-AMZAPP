// Plugin Vite para iniciar backend automaticamente
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

let backendProcess: ChildProcess | null = null;

export function backendPlugin() {
  return {
    name: 'backend-starter',
    buildStart() {
      if (!backendProcess) {
        console.log('🚀 Iniciando Backend PostgreSQL...');
        
        const backendPath = path.resolve(__dirname, '../backend');
        const tsxPath = path.resolve(__dirname, '../node_modules/.bin/tsx');
        
        backendProcess = spawn(tsxPath, ['index.ts'], {
          cwd: backendPath,
          env: { 
            ...process.env, 
            PORT: '3001', 
            NODE_ENV: 'development' 
          },
          stdio: 'inherit'
        });

        backendProcess.on('exit', () => {
          console.log('⚠️ Backend parou');
          backendProcess = null;
        });
        
        // Cleanup ao fechar Vite
        process.on('exit', () => {
          if (backendProcess) {
            backendProcess.kill();
          }
        });
      }
    }
  };
}