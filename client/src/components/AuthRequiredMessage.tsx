import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginModal from "./LoginModal";
import { Shield, User, FileCheck, Lock } from "lucide-react";

interface AuthRequiredMessageProps {
  title?: string;
  message?: string;
  requireVerification?: boolean;
  onBack?: () => void;
}

export default function AuthRequiredMessage({ 
  title = "Autenticação Necessária",
  message = "Precisa de iniciar sessão para aceder a esta funcionalidade por questões de segurança.",
  requireVerification = false,
  onBack 
}: AuthRequiredMessageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSuccess = (userData: any) => {
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('user_data', JSON.stringify(userData));
    window.location.reload();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${requireVerification ? 'bg-yellow-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {requireVerification ? (
                  <FileCheck className="w-8 h-8 text-yellow-600" />
                ) : (
                  <Shield className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              
              <div className="space-y-3">
                {requireVerification ? (
                  <Button
                    onClick={() => window.location.href = "/profile/verification"}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    data-testid="button-verification-required"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Verificar Perfil
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-primary hover:bg-primary-dark"
                    data-testid="button-auth-required-login"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Iniciar Sessão
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full"
                  data-testid="button-auth-required-back"
                >
                  Voltar
                </Button>
              </div>
              
              <div className={`mt-6 p-4 ${requireVerification ? 'bg-yellow-50' : 'bg-blue-50'} rounded-lg`}>
                <div className={`flex items-center space-x-2 ${requireVerification ? 'text-yellow-800' : 'text-blue-800'}`}>
                  <Lock className="w-4 h-4" />
                  <p className="text-sm font-medium">Segurança Link-A</p>
                </div>
                <p className={`text-xs ${requireVerification ? 'text-yellow-700' : 'text-blue-700'} mt-1`}>
                  {requireVerification ? 
                    "A verificação de documentos é obrigatória para oferecer serviços na plataforma." :
                    "Todos os utilizadores devem estar autenticados para garantir a segurança da plataforma."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {!requireVerification && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}