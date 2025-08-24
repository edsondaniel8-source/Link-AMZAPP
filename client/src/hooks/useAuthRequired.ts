import { useState } from 'react';
import { useAuth } from './useAuth';

export function useAuthRequired() {
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const requireAuth = (action?: string): boolean => {
    if (isAuthenticated) {
      return true;
    }
    
    setShowAuthDialog(true);
    return false;
  };

  const closeAuthDialog = () => {
    setShowAuthDialog(false);
  };

  return {
    requireAuth,
    showAuthDialog,
    closeAuthDialog,
    isAuthenticated
  };
}