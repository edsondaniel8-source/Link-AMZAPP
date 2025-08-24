import { useEffect, useState } from "react";
import { onAuthStateChanged, getFirebaseAuth } from "../lib/firebaseSafe";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let mounted = true;
    
    const initAuth = async () => {
      try {
        const unsub = await onAuthStateChanged((user) => {
          if (mounted) {
            setFirebaseUser(user);
            setAuthLoading(false);
          }
        });
        if (mounted) {
          unsubscribe = unsub;
        }
      } catch (error) {
        console.warn("Auth state change failed:", error);
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.warn("Error unsubscribing from auth:", error);
        }
      }
    };
  }, []);

  // Only query user data if Firebase user exists
  const { data: user, isLoading: userDataLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!firebaseUser,
    retry: false,
  });

  const isLoading = authLoading || (firebaseUser && userDataLoading);
  const isAuthenticated = !!firebaseUser && !!user;

  return {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
  };
}