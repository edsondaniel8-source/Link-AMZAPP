import { useEffect, useState } from "react";
import { onAuthStateChanged, handleRedirectResult, isFirebaseConfigured } from "@/lib/firebaseSafe";
import { useToast } from "@/hooks/use-toast";
import RegistrationForm from "./RegistrationForm";
import { apiRequest } from "@/lib/queryClient";

interface AuthHandlerProps {
  children: React.ReactNode;
}

export default function AuthHandler({ children }: AuthHandlerProps) {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    // Handle redirect result from Google login
    handleRedirectResult().then((result) => {
      if (result?.user) {
        checkRegistrationStatus(result.user);
      }
    }).catch((error) => {
      console.error("Error handling redirect:", error);
      toast({
        title: "Erro no Login",
        description: "Erro ao processar login com Google",
        variant: "destructive",
      });
    });

    // Listen for auth state changes
    let unsubscribe: (() => void) | undefined;
    onAuthStateChanged((user) => {
      setFirebaseUser(user);
      if (user) {
        checkRegistrationStatus(user);
      } else {
        setLoading(false);
        setNeedsRegistration(false);
      }
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const checkRegistrationStatus = async (user: any) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/auth/check-registration', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNeedsRegistration(data.needsRegistration);
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      setNeedsRegistration(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (firebaseUser && needsRegistration) {
    return (
      <RegistrationForm 
        firebaseUser={firebaseUser} 
        onComplete={() => {
          setNeedsRegistration(false);
          window.location.reload();
        }}
      />
    );
  }

  return <>{children}</>;
}