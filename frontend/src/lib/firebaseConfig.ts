import { initializeApp, type FirebaseApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  type Auth,
  type User
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

// Log configuration status for debugging
console.log('Firebase Configuration Status:', {
  configured: isFirebaseConfigured,
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
  authDomain: firebaseConfig.authDomain
});

if (!isFirebaseConfigured) {
  console.warn('Firebase configuration is incomplete. Please check your environment variables.');
  console.warn('Missing variables:', {
    apiKey: !firebaseConfig.apiKey,
    projectId: !firebaseConfig.projectId,
    appId: !firebaseConfig.appId
  });
}

// Initialize Firebase (ensure single instance)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    // Check if Firebase app already exists
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log('Using existing Firebase app instance');
      app = existingApps[0];
    } else {
      console.log('Initializing new Firebase app');
      app = initializeApp(firebaseConfig);
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    
    // Configure Google provider
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    
    // Provide specific error guidance
    if (error instanceof Error) {
      if (error.message.includes('API key not valid')) {
        console.error('❌ Invalid API Key - Check VITE_FIREBASE_API_KEY');
      } else if (error.message.includes('Project ID')) {
        console.error('❌ Invalid Project ID - Check VITE_FIREBASE_PROJECT_ID');
      } else if (error.message.includes('App ID')) {
        console.error('❌ Invalid App ID - Check VITE_FIREBASE_APP_ID');
      }
    }
  }
}

// Export Firebase instances
export { app, auth, db, googleProvider, isFirebaseConfigured };

// Authentication functions with better error handling
export const signInWithGoogle = async (): Promise<void> => {
  if (!auth || !googleProvider) {
    const errorMsg = 'Firebase not configured or Google provider not available';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    console.log('🔄 Starting Google sign-in...');
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    console.error('❌ Google sign-in failed:', {
      code: error?.code,
      message: error?.message,
      details: error
    });
    
    // Provide user-friendly error messages
    if (error?.code === 'auth/unauthorized-domain') {
      throw new Error('Domínio não autorizado. Verifique as configurações do Firebase.');
    } else if (error?.code === 'auth/operation-not-allowed') {
      throw new Error('Login com Google não está habilitado no Firebase.');
    } else if (error?.code === 'auth/popup-blocked') {
      throw new Error('Pop-up bloqueado pelo navegador.');
    }
    
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    console.log('🔄 Signing out...');
    await signOut(auth);
    console.log('✅ Signed out successfully');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
    throw error;
  }
};

// Prevent multiple redirect handling
let redirectHandled = false;

export const handleRedirectResult = async (): Promise<User | null> => {
  if (!auth) {
    console.warn('Auth not configured for redirect result');
    return null;
  }
  
  // Prevent multiple calls
  if (redirectHandled) {
    console.log('🔄 Redirect already handled, skipping...');
    return null;
  }
  
  try {
    console.log('🔄 Handling redirect result...');
    redirectHandled = true;
    
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log('✅ Redirect result successful:', result.user.email);
      return result.user;
    } else {
      console.log('ℹ️ No redirect result available');
    }
    return null;
  } catch (error: any) {
    console.error('❌ Redirect result handling failed:', {
      code: error?.code,
      message: error?.message
    });
    
    // Reset flag on error so it can be retried
    redirectHandled = false;
    
    // Handle specific redirect errors
    if (error?.code === 'auth/unauthorized-domain') {
      console.error('❌ Domain not authorized in Firebase Console');
    } else if (error?.code === 'auth/web-storage-unsupported') {
      console.error('❌ Web storage not supported in this browser');
    }
    
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    console.log('🔄 Email sign-in for:', email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Email sign-in successful');
    return result.user;
  } catch (error: any) {
    console.error('❌ Email sign-in failed:', {
      code: error?.code,
      message: error?.message
    });
    
    // Provide Portuguese error messages
    switch (error?.code) {
      case 'auth/user-not-found':
        throw new Error('Utilizador não encontrado. Verifique o email.');
      case 'auth/wrong-password':
        throw new Error('Senha incorreta. Tente novamente.');
      case 'auth/invalid-email':
        throw new Error('Email inválido. Verifique o formato.');
      case 'auth/user-disabled':
        throw new Error('Esta conta foi desabilitada.');
      case 'auth/too-many-requests':
        throw new Error('Muitas tentativas. Tente novamente mais tarde.');
      default:
        throw error;
    }
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    console.log('🔄 Email sign-up for:', email);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Email sign-up successful');
    return result.user;
  } catch (error: any) {
    console.error('❌ Email sign-up failed:', {
      code: error?.code,
      message: error?.message
    });
    
    // Provide Portuguese error messages
    switch (error?.code) {
      case 'auth/email-already-in-use':
        throw new Error('Este email já está em uso. Tente fazer login.');
      case 'auth/weak-password':
        throw new Error('Senha muito fraca. Use pelo menos 6 caracteres.');
      case 'auth/invalid-email':
        throw new Error('Email inválido. Verifique o formato.');
      case 'auth/operation-not-allowed':
        throw new Error('Registo com email não está habilitado.');
      default:
        throw error;
    }
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    console.log('🔄 Password reset for:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent');
  } catch (error: any) {
    console.error('❌ Password reset failed:', {
      code: error?.code,
      message: error?.message
    });
    
    // Provide Portuguese error messages
    switch (error?.code) {
      case 'auth/user-not-found':
        throw new Error('Não encontramos uma conta com este email.');
      case 'auth/invalid-email':
        throw new Error('Email inválido. Verifique o formato.');
      case 'auth/too-many-requests':
        throw new Error('Muitas tentativas. Tente novamente mais tarde.');
      default:
        throw error;
    }
  }
};

// Prevent multiple listeners
let listenerCount = 0;

export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  if (!auth) {
    console.warn('Auth not configured for state change listener');
    callback(null);
    return () => {};
  }
  
  listenerCount++;
  console.log(`🔄 Setting up auth state listener #${listenerCount}`);
  
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('👤 Auth state changed:', user ? `Signed in as ${user.email}` : 'Signed out');
    callback(user);
  });
  
  // Return cleanup function
  return () => {
    listenerCount--;
    console.log(`🧹 Cleaning up auth listener, remaining: ${listenerCount}`);
    unsubscribe();
  };
};

// Debug function to test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  if (!isFirebaseConfigured) {
    console.error('❌ Firebase not configured');
    return false;
  }

  try {
    if (!auth) {
      console.error('❌ Auth instance not available');
      return false;
    }

    // Test auth connection by checking current user
    console.log('🔄 Testing Firebase connection...');
    const currentUser = auth.currentUser;
    console.log('✅ Firebase connection test passed');
    console.log('Current user:', currentUser ? currentUser.email : 'No user signed in');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};

export default app;