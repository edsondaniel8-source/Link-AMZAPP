import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const loginSchema = z.object({
  phone: z.string().min(9, "Número de telefone deve ter pelo menos 9 dígitos"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const { signInWithEmail, isFirebaseConfigured } = await import('../lib/firebaseConfig');
      
      if (!isFirebaseConfigured) {
        toast({
          title: "Firebase Não Configurado",
          description: "Configure as chaves do Firebase para usar autenticação",
          variant: "destructive",
        });
        return;
      }

      // Usar o telefone como email temporariamente ou implementar busca por telefone
      // Por enquanto, mostrar mensagem para usar Google
      toast({
        title: "Login com Email",
        description: "Use a opção 'Entrar com Google' para acesso mais rápido e seguro.",
        variant: "default",
      });
      
    } catch (error) {
      toast({
        title: "Erro no Login",
        description: "Erro ao fazer login. Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { signInWithGoogle, isFirebaseConfigured } = await import('../lib/firebaseConfig');
      
      if (!isFirebaseConfigured) {
        toast({
          title: "Firebase Não Configurado",
          description: "Configure as chaves do Firebase para usar autenticação Google",
          variant: "destructive",
        });
        return;
      }

      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Erro no Login",
        description: "Erro ao inicializar login com Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Entrar no Link-A
          </CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Trazendo o Futuro do turismo para Moçambique
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
            data-testid="button-google-login"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                ou
              </span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="phone">Número de Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+258 84 123 4567"
                {...form.register("phone")}
                data-testid="input-phone-login"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                data-testid="input-password-login"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
              data-testid="button-manual-login"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Não tem conta?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Criar uma conta
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}