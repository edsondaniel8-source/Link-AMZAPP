import { useEffect, useState } from "react";
import { onAuthStateChanged, getFirebaseAuth } from "../lib/firebaseSafe";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    }).then((unsub) => {
      unsubscribe = unsub;
    }).catch(() => {
      setAuthLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
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