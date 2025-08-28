# 🚀 Link-A: Guia de Deploy - Estrutura Híbrida

## 📁 Estrutura Final do Projeto

```
link-a-platform/
├── frontend/
│   ├── client-app/          # App principal (passageiros)
│   ├── driver-app/          # App motoristas  
│   ├── hotel-app/           # App hotéis
│   ├── event-app/           # App eventos
│   ├── admin-app/           # App administração
│   └── shared/              # Componentes compartilhados
├── backend/
│   └── src/
│       ├── modules/         # Módulos por funcionalidade
│       │   ├── auth/        # Autenticação
│       │   ├── clients/     # APIs para clientes
│       │   ├── drivers/     # APIs para motoristas
│       │   ├── hotels/      # APIs para hotéis
│       │   ├── events/      # APIs para eventos
│       │   └── admin/       # APIs para administração
│       └── shared/          # Código compartilhado
└── deployment/              # Configurações de deploy
```

## 🌐 Configuração de Domínios

### Produção
- **App Principal**: `https://link-aturismomoz.com`
- **App Motoristas**: `https://driver.link-aturismomoz.com`
- **App Hotéis**: `https://hotel.link-aturismomoz.com`
- **App Eventos**: `https://event.link-aturismomoz.com`
- **App Admin**: `https://admin.link-aturismomoz.com`
- **API Backend**: `https://api.link-aturismomoz.com`

### Desenvolvimento
- **App Principal**: `http://localhost:5000`
- **App Motoristas**: `http://localhost:5001`
- **App Hotéis**: `http://localhost:5002`
- **App Eventos**: `http://localhost:5003`
- **App Admin**: `http://localhost:5004`
- **API Backend**: `http://localhost:3001`

## 🔄 Fluxo de Autenticação

### 1. Login Unificado
```javascript
// Usuário faz login em qualquer app
POST /api/auth/login
{ "email": "user@email.com", "password": "123456" }

// Backend responde com token + papel principal
{ 
  "token": "jwt.token.here", 
  "user": { 
    "id": "user-123",
    "roles": ["driver", "client"],
    "primaryRole": "driver"
  } 
}
```

### 2. Redirecionamento Automático
```javascript
// Frontend redireciona baseado no papel principal
if (user.primaryRole === 'driver') {
  window.location.href = 'https://driver.link-aturismomoz.com';
} else if (user.primaryRole === 'hotel') {
  window.location.href = 'https://hotel.link-aturismomoz.com';
}
```

### 3. Verificação de Acesso
- Cada app verifica se o usuário tem o papel necessário
- Se não tem, redireciona para app principal do usuário
- Sistemas de fallback para múltiplos papéis

## 📱 Deploy das Apps Frontend

### Vercel (Recomendado)
```bash
# Deploy cada app separadamente
cd frontend/client-app && vercel --prod
cd frontend/driver-app && vercel --prod
cd frontend/hotel-app && vercel --prod
```

### Configuração de Domínios no Vercel
1. **client-app** → `link-aturismomoz.com`
2. **driver-app** → `driver.link-aturismomoz.com`
3. **hotel-app** → `hotel.link-aturismomoz.com`
4. **event-app** → `event.link-aturismomoz.com`
5. **admin-app** → `admin.link-aturismomoz.com`

## 🔧 Deploy do Backend

### Railway (Recomendado)
```bash
# Deploy backend único
cd backend && railway deploy

# Configurar domínio
railway domain add api.link-aturismomoz.com
```

## 🏃‍♂️ Execução em Desenvolvimento

### Backend
```bash
cd backend
npm install
npm run dev  # Roda em localhost:3001
```

### Frontend - Múltiplas Apps
```bash
# Terminal 1 - App Principal
cd frontend/client-app && npm run dev

# Terminal 2 - App Motoristas  
cd frontend/driver-app && npm run dev

# Terminal 3 - App Hotéis
cd frontend/hotel-app && npm run dev
```

## ✅ Benefícios da Nova Estrutura

### ✅ **Verificação Simplificada**
- ❌ Removido sistema de verificação redundante
- ✅ Documentos enviados no registro inicial
- ✅ Usuários já verificados automaticamente

### ✅ **Múltiplas Apps Especializadas**
- 🧑‍💼 **Client App**: Busca e reserva de serviços
- 🚗 **Driver App**: Gestão de viagens e ganhos
- 🏨 **Hotel App**: Gestão de reservas e acomodações
- 🎪 **Event App**: Criação e gestão de eventos
- ⚙️ **Admin App**: Administração da plataforma

### ✅ **Backend Modularizado**
- 📁 APIs organizadas por funcionalidade
- 🔧 Fácil manutenção e escalabilidade
- 🚀 Deploy independente de módulos

### ✅ **Experiência do Usuário**
- 🔄 Login único com redirecionamento automático
- 📱 Interfaces otimizadas por papel
- ⚡ Performance melhorada (apps menores)

## 🔐 Segurança

- 🛡️ Autenticação centralizada via Firebase
- 🔑 Verificação de papéis em cada app
- 🚫 Bloqueio automático de acesso não autorizado
- 🔄 Redirecionamento seguro entre apps

## 📊 Monitoramento

- 📈 Logs centralizados no backend
- 🎯 Métricas específicas por app
- 🚨 Alertas de erro por módulo
- 📋 Dashboard de administração