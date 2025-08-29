#!/bin/bash
echo "🚀 Railway: Building Link-A..."

# Build frontend
cd frontend && npm install && npm run build
cd ..

# Copy to backend
cp -r frontend/dist/* backend/dist/

# Build backend  
cd backend && npm install && npm run build

echo "✅ Build completo!"