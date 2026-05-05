import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useCreateProfile, useGetMe } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { DocusPsiLogoImage } from "@/components/docuspsi-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { AppCpfInput, AppInput, AppPhoneInput, AppSelect, BRAZIL_STATE_OPTIONS } from "@/components/app-form";

const profileSchema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório"),
  crp: z.string().min(2, "CRP é obrigatório"),
  professionalEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  documentNumber: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  address: z.string().optional().or(z.literal("")),
  clinicName: z.string().optional().or(z.literal("")),
});

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { updateUser, user } = useAuth();
  const { toast } = useToast();
  
  const createProfileMutation = useCreateProfile();
  const { refetch: refetchMe } = useGetMe({ query: { enabled: false } as any });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || "",
      crp: "",
      professionalEmail: user?.email || "",
      phone: "",
      documentNumber: "",
      city: "",
      state: "",
      address: "",
      clinicName: "",
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    createProfileMutation.mutate(
      { data: values },
      {
        onSuccess: async () => {
          toast({ title: "Perfil criado com sucesso", description: "Bem-vindo ao DocusPsi!" });
          const { data: updatedUser } = await refetchMe();
          if (updatedUser) {
            updateUser(updatedUser);
            setLocation("/app");
          }
        },
        onError: (error: any) => {
          toast({ 
            variant: "destructive", 
            title: "Erro ao criar perfil", 
            description: error?.data?.message || "Verifique os dados e tente novamente" 
          });
        }
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
      <Card className="w-full max-w-2xl shadow-lg border-border">
        <CardHeader className="space-y-1 pb-6 text-center">
          <DocusPsiLogoImage variant="icon" className="mx-auto mb-2 h-14 w-14" />
          <CardTitle className="text-2xl font-bold tracking-tight">Configure seu Perfil</CardTitle>
          <CardDescription>
            Precisamos de alguns dados profissionais para gerar seus documentos corretamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados Pessoais e Profissionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl><AppInput {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="crp" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRP *</FormLabel>
                      <FormControl><AppInput placeholder="Ex: 00/00000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="professionalEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Profissional</FormLabel>
                      <FormControl><AppInput type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl><AppPhoneInput value={field.value} onChange={field.onChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="documentNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF / CNPJ</FormLabel>
                      <FormControl><AppCpfInput value={field.value} onChange={field.onChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Local de Atendimento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="clinicName" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Clínica / Consultório (opcional)</FormLabel>
                      <FormControl><AppInput {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl><AppInput {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado (UF) *</FormLabel>
                      <FormControl><AppSelect value={field.value} onValueChange={field.onChange} placeholder="Selecione a UF" options={BRAZIL_STATE_OPTIONS} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Endereço Completo (opcional)</FormLabel>
                      <FormControl><AppInput {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={createProfileMutation.isPending}>
                {createProfileMutation.isPending ? "Salvando..." : "Concluir Cadastro"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
