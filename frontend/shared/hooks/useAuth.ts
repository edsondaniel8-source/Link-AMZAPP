import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  profileImageUrl?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Validar token com backend
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        
        // Redirecionar baseado no papel principal
        redirectBasedOnRole(data.user.roles[0]);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = 'https://link-aturismomoz.com';
  };

  const switchRole = async (role: string) => {
    if (user?.roles.includes(role)) {
      redirectBasedOnRole(role);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    const domains = {
      client: 'https://link-aturismomoz.com',
      driver: 'https://driver.link-aturismomoz.com',
      hotel: 'https://hotel.link-aturismomoz.com', 
      event: 'https://event.link-aturismomoz.com',
      admin: 'https://admin.link-aturismomoz.com'
    };

    const targetDomain = domains[role as keyof typeof domains];
    if (targetDomain && window.location.origin !== targetDomain) {
      window.location.href = targetDomain;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}