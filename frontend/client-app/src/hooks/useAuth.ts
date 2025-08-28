import { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { 
  onAuthStateChange, 
  signInWithGoogle, 
  signInWithEmail,
  signUpWithEmail,
  signOutUser, 
  resetPassword,
  handleRedirectResult,
  isFirebaseConfigured 
} from '../lib/firebaseConfig';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  signIn: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthState({
        user: null,
        loading: false,
        error: 'Firebase not configured',
      });
      return;
    }

    let mounted = true;

    // Handle redirect result on component mount
    const handleInitialRedirect = async () => {
      try {
        await handleRedirectResult();
      } catch (error) {
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : 'Redirect handling failed',
          }));
        }
      }
    };

    handleInitialRedirect();

    // Listen to auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      if (mounted) {
        setAuthState({
          user,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (): Promise<void> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await signInWithGoogle();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const signInEmail = async (email: string, password: string): Promise<void> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email sign in failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const signUpEmail = async (email: string, password: string): Promise<void> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email sign up failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const resetPasswordEmail = async (email: string): Promise<void> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await resetPassword(email);
      setAuthState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await signOutUser();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signInEmail,
    signUpEmail,
    resetPassword: resetPasswordEmail,
    signOut,
    isAuthenticated: !!authState.user,
  };
};

export default useAuth;