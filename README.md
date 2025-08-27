# Link-A Travel Platform

Multi-service marketplace platform for Mozambique connecting transportation, accommodation, events, and partnerships.

## Project Structure

```
link-a-app/
├── frontend/          # React/Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Express.js API
│   ├── index.ts
│   ├── package.json
│   └── (API routes)
├── attached_assets/   # Shared assets
└── package.json       # Workspace configuration
```

## Development

```bash
# Start frontend (port 5000)
npm run dev

# Build frontend
npm run build:frontend

# Build backend  
npm run build:backend

# Build both
npm run build
```

## Deployment

- **Frontend**: Vercel (from `frontend/` directory)
- **Backend**: Railway (from `backend/` directory)
- **Database**: PostgreSQL (Neon)
- **Auth**: Firebase