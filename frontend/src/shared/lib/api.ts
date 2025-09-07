// src/lib/api.ts
import { auth } from "./firebaseConfig";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://link-amzapp-production.up.railway.app";

console.log('🌐 API Base URL:', API_BASE_URL);

// Função para obter o token ID do utilizador atual
async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}


export const api = {
  get: async <T = any>(endpoint: string): Promise<T> => {
    const token = await getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    return response.json();
  },

  post: async <T = any>(endpoint: string, data: any): Promise<T> => {
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      console.log('🔄 API POST Request:', {
        url: `${API_BASE_URL}${endpoint}`,
        headers: Object.keys(headers),
        hasToken: !!token,
        data
      });

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ API Success:', result);
      return result;
    } catch (error) {
      console.error('🔥 API Request Failed:', error);
      throw error;
    }
  },

  put: async <T = any>(endpoint: string, data: any): Promise<T> => {
    const token = await getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async <T = any>(endpoint: string): Promise<T> => {
    const token = await getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    return response.json();
  },
};