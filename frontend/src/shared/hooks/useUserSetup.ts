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
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

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
      const response = await fetch('/api/auth/setup-user-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roles })
      });

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