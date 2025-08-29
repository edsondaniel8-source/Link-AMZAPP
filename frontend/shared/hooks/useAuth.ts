import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getCurrentDomains } from '../utils/constants';

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
  setupUserRoles: (roles: string[]) => Promise<void>;
  needsRoleSetup: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSetup, setNeedsRoleSetup] = useState(false);

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
      const domains = getCurrentDomains();
      const response = await fetch(`${domains.api}/api/auth/validate`, {
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
      const domains = getCurrentDomains();
      const response = await fetch(`${domains.api}/api/auth/login`, {
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
    const domains = getCurrentDomains();
    window.location.href = domains.client;
  };

  const switchRole = async (role: string) => {
    if (user?.roles.includes(role)) {
      redirectBasedOnRole(role);
    }
  };

  const setupUserRoles = async (roles: string[]) => {
    try {
      const token = localStorage.getItem('auth_token');
      const domains = getCurrentDomains();
      
      const response = await fetch(`${domains.api}/api/auth/setup-roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roles })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setNeedsRoleSetup(false);
        
        // Redirecionar baseado no primeiro role
        if (userData.user.roles && userData.user.roles.length > 0) {
          redirectBasedOnRole(userData.user.roles[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao configurar roles:', error);
      throw error;
    }
  };

  const redirectBasedOnRole = (role: string) => {
    const domains = getCurrentDomains();
    const domainMap = {
      client: domains.client,
      driver: domains.driver,
      hotel: domains.hotel,
      event: domains.event,
      admin: domains.admin
    };

    const targetDomain = domainMap[role as keyof typeof domainMap];
    if (targetDomain && window.location.origin !== targetDomain) {
      window.location.href = targetDomain;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole, setupUserRoles, needsRoleSetup }}>
      {children}
    </AuthContext.Provider>
  );
}