#!/usr/bin/env node

// Simple script to start the frontend development server
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Link-A development server...');

// Change to frontend directory and start dev server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (error) => {
  console.error('Failed to start frontend:', error);
});

frontend.on('exit', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('Shutting down...');
  frontend.kill();
  process.exit(0);
});