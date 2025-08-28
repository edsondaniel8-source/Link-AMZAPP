// Configurações dos domínios para produção e desenvolvimento
export const APP_DOMAINS = {
  development: {
    client: 'http://localhost:5000',
    driver: 'http://localhost:5001', 
    hotel: 'http://localhost:5002',
    event: 'http://localhost:5003',
    admin: 'http://localhost:5004',
    api: 'http://localhost:3001'
  },
  production: {
    client: 'https://link-aturismomoz.com',
    driver: 'https://driver.link-aturismomoz.com',
    hotel: 'https://hotel.link-aturismomoz.com', 
    event: 'https://event.link-aturismomoz.com',
    admin: 'https://admin.link-aturismomoz.com',
    api: 'https://api.link-aturismomoz.com'
  }
};

export const getCurrentDomains = () => {
  return process.env.NODE_ENV === 'production' 
    ? APP_DOMAINS.production 
    : APP_DOMAINS.development;
};

// Role mappings
export const ROLE_APP_MAPPING = {
  client: 'client',
  driver: 'driver', 
  hotel: 'hotel',
  event: 'event',
  admin: 'admin'
} as const;

// API endpoints base
export const API_BASE_URL = getCurrentDomains().api;