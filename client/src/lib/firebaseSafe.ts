// Safe Firebase wrapper that doesn't import Firebase until needed
export const isFirebaseConfigured = !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
);

let firebaseInitialized = false;
let auth: any = null;

export const initFirebase = async () => {
  if (!isFirebaseConfigured || firebaseInitialized) {
    return null;
  }

  try {
    const { initializeApp } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firebaseInitialized = true;
    return auth;
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    return null;
  }
};

export const getFirebaseAuth = async () => {
  if (!auth && isFirebaseConfigured) {
    await initFirebase();
  }
  return auth;
};

export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase não configurado");
  }

  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Falha ao inicializar Firebase");
  }

  const { signInWithRedirect, GoogleAuthProvider } = await import("firebase/auth");
  const googleProvider = new GoogleAuthProvider();
  return signInWithRedirect(auth, googleProvider);
};

export const logout = async () => {
  const auth = await getFirebaseAuth();
  if (!auth) return;

  const { signOut } = await import("firebase/auth");
  return signOut(auth);
};

export const handleRedirectResult = async () => {
  const auth = await getFirebaseAuth();
  if (!auth) return null;

  const { getRedirectResult } = await import("firebase/auth");
  return getRedirectResult(auth);
};

export const onAuthStateChanged = async (callback: (user: any) => void) => {
  const auth = await getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }

  const { onAuthStateChanged: firebaseOnAuthStateChanged } = await import("firebase/auth");
  return firebaseOnAuthStateChanged(auth, callback);
};