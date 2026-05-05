import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { DocusPsiLogoImage } from "@/components/docuspsi-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

function getErrorMessage(error: unknown, fallback: string) {
  const typed = error as { data?: { message?: string }; message?: string };
  return typed?.data?.message || typed?.message || fallback;
}

export default function Login() {
  const { login: setAuthLogin } = useAuth();
  const { toast } = useToast();
  
  const loginMutation = useLogin();

  useEffect(() => {
    document.title = "Entrar | DocusPsi";
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          toast({ title: "Login realizado com sucesso", description: "Bem-vindo de volta!" });
          setAuthLogin(data.token, data.user);
        },
        onError: (error: unknown) => {
          toast({ 
            variant: "destructive", 
            title: "Erro ao fazer login", 
            description: getErrorMessage(error, "Verifique suas credenciais e tente novamente") 
          });
        }
      }
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFFFF] p-4">
      <Card className="w-full max-w-md border-[#DDD6C7] bg-white shadow-sm">
        <CardHeader className="space-y-1 pb-6 text-center">
          <DocusPsiLogoImage variant="icon" className="mx-auto mb-2 h-14 w-14" />
          <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#111111] text-white hover:bg-[#111111]/90" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link href="/register" className="font-medium text-[#6D28D9] hover:underline">
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
