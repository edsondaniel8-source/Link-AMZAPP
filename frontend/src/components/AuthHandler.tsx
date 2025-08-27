import { useEffect, useState } from "react";
import { onAuthStateChange, handleRedirectResult, isFirebaseConfigured } from "@/lib/firebaseConfig";
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
      console.log('⚠️ Firebase not configured, skipping auth setup');
      setLoading(false);
      return;
    }

    console.log('🔄 AuthHandler: Setting up Firebase auth...');
    let redirectHandled = false;
    let mounted = true;

    const setupAuth = async () => {
      try {
        // Handle redirect result ONCE
        if (!redirectHandled) {
          redirectHandled = true;
          console.log('🔍 Checking for redirect result...');
          
          const result = await handleRedirectResult();
          if (result && mounted) {
            console.log('✅ Found redirect result, checking registration...');
            await checkRegistrationStatus(result);
          }
        }
      } catch (error) {
        if (mounted) {
          console.error("❌ Error handling redirect:", error);
          toast({
            title: "Erro no Login",
            description: "Erro ao processar login com Google",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    };

    // Setup auth state listener with cleanup
    console.log('📡 Setting up auth state listener...');
    const unsubscribe = onAuthStateChange((user: any) => {
      if (!mounted) return;
      
      console.log('👤 AuthHandler: Auth state change detected');
      setFirebaseUser(user);
      
      if (user) {
        console.log('✅ User signed in:', user.email);
        checkRegistrationStatus(user);
      } else {
        console.log('👋 User signed out');
        setLoading(false);
        setNeedsRegistration(false);
      }
    });

    // Run setup
    setupAuth();

    // Cleanup function
    return () => {
      console.log('🧹 AuthHandler cleanup');
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Empty dependency array to run only once

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