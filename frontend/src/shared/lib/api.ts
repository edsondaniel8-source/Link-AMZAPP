// src/lib/api.ts
import { auth } from "./firebaseConfig";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://link-amzapp-production.up.railway.app";

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
    const token = await getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
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