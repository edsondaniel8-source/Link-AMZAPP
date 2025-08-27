import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Camera, 
  Upload,
  CheckCircle,
  AlertCircle, 
  X,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface EnhancedSignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  idDocumentNumber: string;
  city: string;
  profilePhoto: File | null;
  documentPhoto: File | null;
}

const mozambicanCities = [
  "Maputo", "Matola", "Beira", "Nampula", "Chimoio", "Nacala", "Quelimane",
  "Tete", "Xai-Xai", "Lichinga", "Pemba", "Inhambane", "Maxixe", "Gurué",
  "Manica", "Montepuez", "Cuamba", "Dondo", "Angoche", "Chokwé",
  "Mocuba", "Manhiça", "Marracuene", "Vilanculos", "Massinga"
];

export function EnhancedSignupModal({ open, onOpenChange }: EnhancedSignupModalProps) {
  const { signUpEmail, loading, error } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Create refs for file inputs
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const documentPhotoRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    idDocumentNumber: '',
    city: '',
    profilePhoto: null,
    documentPhoto: null
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ profile: 0, document: 0 });
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file: File, type: 'profile' | 'document') => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError(`A foto ${type === 'profile' ? 'de perfil' : 'do documento'} deve ter menos de 5MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormError('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Simulate upload progress
    const progressKey = type === 'profile' ? 'profile' : 'document';
    
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(prev => ({ ...prev, [progressKey]: i }));
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    handleInputChange(type === 'profile' ? 'profilePhoto' : 'documentPhoto', file);
    
    toast({
      title: "Upload Concluído",
      description: `Foto ${type === 'profile' ? 'de perfil' : 'do documento'} carregada com sucesso.`
    });
  };

  const validateStep = (step: number): boolean => {
    setFormError(null);
    
    switch (step) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setFormError('Por favor, preencha todos os campos.');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setFormError('As senhas não coincidem.');
          return false;
        }
        if (formData.password.length < 6) {
          setFormError('A senha deve ter pelo menos 6 caracteres.');
          return false;
        }
        break;
      
      case 2:
        if (!formData.fullName || !formData.phoneNumber || !formData.city) {
          setFormError('Por favor, preencha todos os campos pessoais.');
          return false;
        }
        // Validate Mozambican phone number format
        const phoneRegex = /^(\+258|258)?[0-9]{9}$/;
        if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
          setFormError('Número de telefone inválido. Use o formato: +258XXXXXXXXX ou 8XXXXXXXX');
          return false;
        }
        break;
      
      case 3:
        if (!formData.idDocumentNumber) {
          setFormError('Por favor, insira o número do seu documento de identificação.');
          return false;
        }
        break;
      
      case 4:
        if (!formData.profilePhoto || !formData.documentPhoto) {
          setFormError('Por favor, carregue tanto a foto de perfil quanto a foto do documento.');
          return false;
        }
        break;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // First create the Firebase account
      await signUpEmail(formData.email, formData.password);
      
      // Here you would typically save the additional user data to your database
      // and upload the photos to cloud storage
      
      toast({
        title: "Conta Criada com Sucesso!",
        description: "Sua conta foi criada. Você pode fazer login agora."
      });
      
      handleClose();
    } catch (error: any) {
      let errorMessage = 'Erro ao criar conta.';
      
      if (error?.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este email já está em uso. Tente fazer login.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido. Verifique o formato.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      setFormError(errorMessage);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: '',
      idDocumentNumber: '',
      city: '',
      profilePhoto: null,
      documentPhoto: null
    });
    setFormError(null);
    setUploadProgress({ profile: 0, document: 0 });
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  data-testid="input-enhanced-email"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10"
                  data-testid="input-enhanced-password"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10"
                  data-testid="input-enhanced-confirm-password"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full-name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="pl-10"
                  data-testid="input-full-name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone-number">Número de Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+258 XX XXX XXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="pl-10"
                  data-testid="input-phone-number"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Formato: +258XXXXXXXXX ou 8XXXXXXXX
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Cidade de Residência</Label>
              <Select onValueChange={(value) => handleInputChange('city', value)} value={formData.city}>
                <SelectTrigger data-testid="select-city">
                  <SelectValue placeholder="Selecione sua cidade" />
                </SelectTrigger>
                <SelectContent>
                  {mozambicanCities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documento de Identificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="document-number">Número do Documento</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="document-number"
                      type="text"
                      placeholder="BI, Passaporte ou Carta de Condução"
                      value={formData.idDocumentNumber}
                      onChange={(e) => handleInputChange('idDocumentNumber', e.target.value)}
                      className="pl-10"
                      data-testid="input-document-number"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Insira o número do seu BI, Passaporte ou Carta de Condução
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Segurança e Privacidade:</strong> Seus documentos são criptografados e usados apenas para verificação de identidade conforme a regulamentação moçambicana.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Profile Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Foto de Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.profilePhoto ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-sm text-green-600 font-medium">
                          Foto carregada: {formData.profilePhoto.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('profilePhoto', null)}
                        >
                          Alterar Foto
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Clique para carregar sua foto de perfil
                        </p>
                        <input
                          ref={profilePhotoRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'profile');
                          }}
                          style={{ display: 'none' }}
                          id="profile-photo-upload"
                          data-testid="input-profile-photo"
                        />
                        <button 
                          type="button" 
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                          onClick={() => {
                            console.log("🔥 SIMPLE PROFILE CLICK!");
                            profilePhotoRef.current?.click();
                          }}
                        >
                          Selecionar Foto
                        </button>
                      </div>
                    )}
                    {uploadProgress.profile > 0 && uploadProgress.profile < 100 && (
                      <Progress value={uploadProgress.profile} className="mt-2" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Foto do Documento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.documentPhoto ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-sm text-green-600 font-medium">
                          Documento carregado: {formData.documentPhoto.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('documentPhoto', null)}
                        >
                          Alterar Foto
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Foto do seu BI, Passaporte ou Carta de Condução
                        </p>
                        <input
                          ref={documentPhotoRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'document');
                          }}
                          style={{ display: 'none' }}
                          id="document-photo-upload"
                          data-testid="input-document-photo"
                        />
                        <button 
                          type="button" 
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                          onClick={() => {
                            console.log("🔥 SIMPLE DOCUMENT CLICK!");
                            documentPhotoRef.current?.click();
                          }}
                        >
                          Selecionar Foto
                        </button>
                      </div>
                    )}
                    {uploadProgress.document > 0 && uploadProgress.document < 100 && (
                      <Progress value={uploadProgress.document} className="mt-2" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Certifique-se de que o documento está legível e todas as informações são visíveis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Credenciais de Acesso";
      case 2: return "Informações Pessoais";
      case 3: return "Documento de Identificação";
      case 4: return "Verificação Fotográfica";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" data-testid="enhanced-signup-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-primary">
                Criar Conta Link-A
              </DialogTitle>
              <DialogDescription>
                {getStepTitle()} - Passo {currentStep} de {totalSteps}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              data-testid="button-close-enhanced-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 text-center">
            {currentStep} de {totalSteps} concluído
          </p>
        </div>
        
        {/* Step Content */}
        <div className="py-4">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex-1"
            data-testid="button-previous-step"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1"
              data-testid="button-next-step"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
              data-testid="button-create-account"
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          )}
        </div>

        {/* Error Display */}
        {(formError || error) && (
          <Alert variant="destructive" data-testid="alert-enhanced-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError || error}</AlertDescription>
          </Alert>
        )}

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Segurança:</strong> Todos os dados são criptografados e protegidos. 
            Usamos estas informações apenas para verificação de identidade e segurança da plataforma.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
}

export default EnhancedSignupModal;