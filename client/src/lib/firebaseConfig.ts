import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type Auth,
  type User
} from 'firebase/auth';

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

if (!isFirebaseConfigured) {
  console.warn('Firebase configuration is incomplete. Please check your environment variables.');
}

// Initialize Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Configure Google provider
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
}

// Export Firebase instances
export { auth, googleProvider, isFirebaseConfigured };

// Authentication functions
export const signInWithGoogle = async (): Promise<void> => {
  if (!auth || !googleProvider) {
    const errorMsg = 'Firebase not configured or Google provider not available';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    console.error('Google sign-in failed:', {
      code: error?.code,
      message: error?.message,
      details: error
    });
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
};

export const handleRedirectResult = async (): Promise<User | null> => {
  if (!auth) {
    return null;
  }
  
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error('Redirect result handling failed:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Email sign-in failed:', {
      code: error?.code,
      message: error?.message,
      details: error
    });
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Email sign-up failed:', {
      code: error?.code,
      message: error?.message,
      details: error
    });
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

export default app;