import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface UserSetupState {
  needsRoleSetup: boolean;
  loading: boolean;
  error: string | null;
}

export const useUserSetup = () => {
  const { user, isAuthenticated } = useAuth();
  const [setupState, setSetupState] = useState<UserSetupState>({
    needsRoleSetup: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSetupState({
        needsRoleSetup: false,
        loading: false,
        error: null
      });
      return;
    }

    const checkUserSetup = async () => {
      try {
        const token = await user.getIdToken();
        console.log("🔍 Verificando perfil do usuário...");
        let response;
        
        try {
          // Primeiro tenta Railway
          const RAILWAY_URL = 'https://link-a-backend-production.up.railway.app';
          response = await fetch(`${RAILWAY_URL}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`Railway auth falhou: ${response.status}`);
          }
          console.log("✅ Railway auth funcionou!");
          
        } catch (railwayError) {
          console.log("⚠️ Railway auth falhou, usando backend local...", railwayError);
          
          // Fallback para backend local
          response = await fetch('http://localhost:3001/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        if (response.ok) {
          const userData = await response.json();
          // Se usuário não tem roles ou só tem um array vazio, precisa configurar
          const needsSetup = !userData.roles || userData.roles.length === 0;
          
          setSetupState({
            needsRoleSetup: needsSetup,
            loading: false,
            error: null
          });
        } else {
          // Se usuário não existe no backend, precisa configurar
          setSetupState({
            needsRoleSetup: true,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error checking user setup:', error);
        setSetupState({
          needsRoleSetup: false,
          loading: false,
          error: 'Failed to check user setup'
        });
      }
    };

    checkUserSetup();
  }, [user, isAuthenticated]);

  const setupUserRoles = async (roles: string[]) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const token = await user.getIdToken();
      console.log("🚀 Configurando roles do usuário...", roles);
      let registerResponse, response;
      
      try {
        // Primeiro tenta Railway
        const RAILWAY_URL = 'https://link-a-backend-production.up.railway.app';
        console.log("📡 Tentando Railway para registrar usuário...");
        
        registerResponse = await fetch(`${RAILWAY_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          })
        });

        if (!registerResponse.ok) {
          throw new Error('Failed to register user in Railway');
        }

        // Depois atualiza os roles
        response = await fetch(`${RAILWAY_URL}/api/auth/roles`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ roles })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update roles in Railway');
        }
        
        console.log("✅ Railway setup funcionou!");
        
      } catch (railwayError) {
        console.log("⚠️ Railway setup falhou, usando backend local...", railwayError);
        
        // Fallback para backend local
        registerResponse = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          })
        });

        if (!registerResponse.ok) {
          throw new Error('Failed to register user locally');
        }

        response = await fetch('http://localhost:3001/api/auth/roles', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ roles })
        });
      }

      if (response.ok) {
        setSetupState(prev => ({
          ...prev,
          needsRoleSetup: false
        }));
        
        // Refresh the page to update the entire app state
        window.location.reload();
      } else {
        throw new Error('Failed to setup roles');
      }
    } catch (error) {
      console.error('Error setting up roles:', error);
      throw error;
    }
  };

  return {
    ...setupState,
    setupUserRoles,
    userEmail: user?.email || ''
  };
};