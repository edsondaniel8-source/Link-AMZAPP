import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged, isFirebaseConfigured } from "@/lib/firebaseSafe";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);

  // Try Replit Auth first
  const { data: replitUser, isLoading: replitLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Firebase Auth listener
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setFirebaseLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch('/api/firebase/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setDbUser(userData);
          }
        } catch (error) {
          console.error("Error fetching Firebase user data:", error);
        }
      } else {
        setDbUser(null);
      }
      
      setFirebaseLoading(false);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Return the first authenticated user found
  const user = replitUser || dbUser;
  const isLoading = replitLoading || firebaseLoading;
  const isAuthenticated = !!replitUser || !!firebaseUser;

  return {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
  };
}