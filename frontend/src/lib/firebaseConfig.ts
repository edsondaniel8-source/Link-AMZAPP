import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  type User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

// Log configuration status for debugging
console.log('🔥 Firebase Configuration Status:', {
  configured: isFirebaseConfigured,
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
  authDomain: firebaseConfig.authDomain
});

if (!isFirebaseConfigured) {
  console.warn('⚠️ Firebase configuration is incomplete. Please check your environment variables.');
}

// Initialize Firebase (ensure single instance)
let app: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    // Check if Firebase app already exists
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(firebaseConfig);
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    
    // Configure Google provider
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
}

// Export Firebase instances
export { app, auth, db, googleProvider };

// Authentication functions
export const signInWithGoogle = async (): Promise<void> => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase not configured');
  }
  
  try {
    console.log('🔄 Starting Google sign-in...');
    // Use popup for development, redirect for production
    if (window.location.hostname === 'localhost') {
      await signInWithPopup(auth, googleProvider);
    } else {
      await signInWithRedirect(auth, googleProvider);
    }
  } catch (error: any) {
    console.error('❌ Google sign-in failed:', error);
    
    if (error?.code === 'auth/unauthorized-domain') {
      throw new Error('Domínio não autorizado. Adicione o domínio nas configurações do Firebase.');
    } else if (error?.code === 'auth/operation-not-allowed') {
      throw new Error('Login com Google não está habilitado no Firebase.');
    } else if (error?.code === 'auth/popup-blocked') {
      throw new Error('Pop-up bloqueado pelo navegador.');
    }
    
    throw error;
  }
};

export const checkRedirectResult = async (): Promise<User | null> => {
  if (!auth) return null;
  
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log('✅ Redirect result successful:', result.user.email);
      return result.user;
    }
    return null;
  } catch (error: any) {
    console.error('❌ Redirect result handling failed:', error);
    
    if (error?.code === 'auth/unauthorized-domain') {
      console.error('❌ Domain not authorized in Firebase Console');
    }
    
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (!auth) throw new Error('Firebase not configured');
  
  try {
    await signOut(auth);
    console.log('✅ Signed out successfully');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) throw new Error('Firebase not configured');
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
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
  if (!auth) throw new Error('Firebase not configured');
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
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
  if (!auth) throw new Error('Firebase not configured');
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
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

export const setupAuthListener = (callback: (user: User | null) => void): (() => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, (user) => {
    console.log('👤 Auth state changed:', user ? `Signed in as ${user.email}` : 'Signed out');
    callback(user);
  });
};

// Aliases para compatibilidade
export const handleRedirectResult = checkRedirectResult;
export const onAuthStateChange = setupAuthListener;

export default app;