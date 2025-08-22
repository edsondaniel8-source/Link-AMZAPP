// Check if Firebase is configured
const isFirebaseConfigured = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

let auth: any = null;
let initializeApp: any = null;
let getAuth: any = null;
let signInWithRedirect: any = null;
let GoogleAuthProvider: any = null;
let getRedirectResult: any = null;
let signOut: any = null;

// Only import and initialize Firebase if properly configured
if (isFirebaseConfigured) {
  try {
    const firebaseApp = await import("firebase/app");
    const firebaseAuth = await import("firebase/auth");
    
    initializeApp = firebaseApp.initializeApp;
    getAuth = firebaseAuth.getAuth;
    signInWithRedirect = firebaseAuth.signInWithRedirect;
    GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
    getRedirectResult = firebaseAuth.getRedirectResult;
    signOut = firebaseAuth.signOut;

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
}

export { auth };

export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth || !GoogleAuthProvider || !signInWithRedirect) {
    throw new Error("Firebase não configurado");
  }
  const googleProvider = new GoogleAuthProvider();
  return signInWithRedirect(auth, googleProvider);
};

export const logout = async () => {
  if (!isFirebaseConfigured || !auth || !signOut) {
    return;
  }
  return signOut(auth);
};

export const handleRedirectResult = async () => {
  if (!isFirebaseConfigured || !auth || !getRedirectResult) {
    return null;
  }
  return getRedirectResult(auth);
};

export { isFirebaseConfigured };