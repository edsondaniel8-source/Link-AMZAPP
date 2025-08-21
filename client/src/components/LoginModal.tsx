import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Phone, Mail, User, Lock, Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    identifier: "", // email or phone
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual Google OAuth
      // For now, simulate Google login with mock data
      const mockGoogleUser = {
        id: 'google-user-' + Date.now(),
        name: 'Maria Santos',
        email: 'maria.santos@gmail.com',
        phone: '', // Google users might not have phone initially
        isVerified: false,
        verificationStatus: 'pending' as const,
        canOfferServices: false,
        loginMethod: 'google'
      };
      
      setTimeout(() => {
        toast({
          title: "Login Google Realizado",
          description: "Bem-vindo ao Link-A através da sua conta Google!"
        });
        
        setIsLoading(false);
        onSuccess?.(mockGoogleUser);
        onClose();
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erro no Login Google",
        description: "Não foi possível conectar com o Google. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const validateMozambiquePhone = (phone: string) => {
    // Mozambique phone formats: +258XXXXXXXXX, 258XXXXXXXXX, 8XXXXXXXX, 8XXXXXXX
    const phoneRegex = /^(\+?258)?[8][0-9]{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Add +258 if not present
    if (cleaned.startsWith('8') && cleaned.length >= 8) {
      return `+258${cleaned}`;
    } else if (cleaned.startsWith('258')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('+258')) {
      return cleaned;
    }
    
    return phone;
  };

  const handleLogin = async () => {
    if (!loginData.identifier || !loginData.password) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock login success with user data
      const mockUser = {
        id: 'user-123',
        name: loginData.identifier.includes('@') ? 'João Silva' : 'Maria Santos',
        email: loginData.identifier.includes('@') ? loginData.identifier : 'user@example.com',
        phone: loginData.identifier.includes('@') ? '+258 84 123 4567' : formatPhoneNumber(loginData.identifier),
        isVerified: false,
        verificationStatus: 'pending' as const,
        canOfferServices: false
      };
      
      setTimeout(() => {
        toast({
          title: "Login Realizado",
          description: "Bem-vindo de volta ao Link-A!"
        });
        
        setIsLoading(false);
        onSuccess?.(mockUser);
        onClose();
      }, 2000);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erro de Login",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async () => {
    // Validation
    if (!registerData.firstName || !registerData.lastName || !registerData.email || 
        !registerData.phone || !registerData.password) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (!validateMozambiquePhone(registerData.phone)) {
      toast({
        title: "Número Inválido",
        description: "Por favor, insira um número de telefone válido de Moçambique.",
        variant: "destructive"
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Senha Muito Curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Senhas Não Coincidem",
        description: "As senhas inseridas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual registration API call
      console.log('Registration attempt:', {
        ...registerData,
        phone: formatPhoneNumber(registerData.phone)
      });
      
      // Mock registration success
      const newUser = {
        id: 'user-' + Date.now(),
        name: `${registerData.firstName} ${registerData.lastName}`,
        email: registerData.email,
        phone: formatPhoneNumber(registerData.phone),
        isVerified: false,
        verificationStatus: 'pending' as const,
        canOfferServices: false
      };
      
      setTimeout(() => {
        toast({
          title: "Conta Criada",
          description: "Conta criada com sucesso! Agora precisa verificar os seus documentos.",
        });
        
        setIsLoading(false);
        onSuccess?.(newUser);
        onClose();
        
        // Redirect to verification page
        window.location.href = "/profile/verification";
      }, 2000);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erro no Registo",
        description: "Ocorreu um erro ao criar a conta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string, isRegister = false) => {
    if (isRegister) {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    } else {
      setLoginData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Acesso Seguro - Link-A</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registar</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Iniciar Sessão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Login Button */}
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-red-300 hover:bg-red-50 text-red-700"
                  data-testid="button-google-login"
                >
                  <FaGoogle className="w-4 h-4 mr-2 text-red-500" />
                  Continuar com Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Ou continue com</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="identifier">Email ou Telefone</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="exemplo@email.com ou +258 8X XXX XXXX"
                    value={loginData.identifier}
                    onChange={(e) => handleInputChange("identifier", e.target.value)}
                    data-testid="input-login-identifier"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use o seu email ou número de telefone moçambicano
                  </p>
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={loginData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      data-testid="input-login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full"
                  data-testid="button-login-submit"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      A Entrar...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Entrar
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button className="text-sm text-primary hover:underline">
                    Esqueci a minha senha
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Criar Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Registration Button */}
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-red-300 hover:bg-red-50 text-red-700"
                  data-testid="button-google-register"
                >
                  <FaGoogle className="w-4 h-4 mr-2 text-red-500" />
                  Registar com Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Ou registe-se com email</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      placeholder="Nome"
                      value={registerData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value, true)}
                      data-testid="input-register-firstname"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apelido</Label>
                    <Input
                      id="lastName"
                      placeholder="Apelido"
                      value={registerData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value, true)}
                      data-testid="input-register-lastname"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemplo@email.com"
                      value={registerData.email}
                      onChange={(e) => handleInputChange("email", e.target.value, true)}
                      className="pl-10"
                      data-testid="input-register-email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefone (Moçambique)</Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+258 8X XXX XXXX"
                      value={registerData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value, true)}
                      className="pl-10"
                      data-testid="input-register-phone"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: +258 8X XXX XXXX ou 8XXXXXXXX
                  </p>
                </div>

                <div>
                  <Label htmlFor="registerPassword">Senha</Label>
                  <div className="relative">
                    <Input
                      id="registerPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={registerData.password}
                      onChange={(e) => handleInputChange("password", e.target.value, true)}
                      data-testid="input-register-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repita a senha"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value, true)}
                    data-testid="input-register-confirm-password"
                  />
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full"
                  data-testid="button-register-submit"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      A Criar Conta...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Criar Conta
                    </>
                  )}
                </Button>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Após criar a conta, será necessário verificar os seus documentos para usar todos os serviços.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}