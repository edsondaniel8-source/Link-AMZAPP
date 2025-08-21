import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, User, FileCheck } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  redirectTo?: string;
}

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  verificationStatus: "pending" | "in_review" | "verified" | "rejected";
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireVerification = false,
  redirectTo = "/"
}: ProtectedRouteProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock authentication state - replace with actual auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    // Mock authentication check - replace with actual auth check
    const checkAuth = async () => {
      try {
        // TODO: Replace with actual authentication check
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Mock user data - replace with actual API call
          setUser({
            id: "user-123",
            name: "João Silva",
            email: "joao@example.com", 
            phone: "+258 84 123 4567",
            isVerified: false,
            verificationStatus: "pending"
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowLoginModal(false);
    localStorage.setItem('auth_token', 'mock_token_123');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  // Authentication required but user not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Autenticação Necessária
                </h2>
                <p className="text-gray-600 mb-6">
                  Precisa de iniciar sessão para aceder a esta funcionalidade por questões de segurança.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                    data-testid="button-auth-required-login"
                  >
                    <User className="w-4 h-4" />
                    <span>Iniciar Sessão</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = redirectTo}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg"
                    data-testid="button-auth-required-back"
                  >
                    Voltar à Página Inicial
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Shield className="w-4 h-4" />
                    <p className="text-sm font-medium">Segurança Link-A</p>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Todos os utilizadores devem estar autenticados e verificados para garantir a segurança da plataforma.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={(userData: any) => handleLoginSuccess(userData)}
        />
      </>
    );
  }

  // Verification required but user not verified
  if (requireVerification && user && !user.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Verificação Necessária
              </h2>
              <p className="text-gray-600 mb-6">
                Precisa de verificar a sua identidade e documentos para usar esta funcionalidade.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "/profile/verification"}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                  data-testid="button-verification-required-verify"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Verificar Perfil</span>
                </button>
                
                <button
                  onClick={() => window.location.href = redirectTo}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg"
                  data-testid="button-verification-required-back"
                >
                  Voltar à Página Inicial
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <FileCheck className="w-4 h-4" />
                  <p className="text-sm font-medium">Status: {getVerificationStatusText(user.verificationStatus)}</p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  A verificação garante a segurança de todos os utilizadores da plataforma.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

function getVerificationStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "Documentos em falta";
    case "in_review":
      return "Em análise";
    case "verified":
      return "Verificado";
    case "rejected":
      return "Rejeitado - contacte o suporte";
    default:
      return "Estado desconhecido";
  }
}