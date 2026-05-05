import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useCreatePatient } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import {
  AppCpfInput,
  AppDatePicker,
  AppFormActions,
  AppFormSection,
  AppInput,
  AppPhoneInput,
  AppSelect,
  AppSelectWithOther,
  AppTextarea,
  RELATIONSHIP_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from "@/components/app-form";

const patientSchema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório"),
  cpf: z.string().optional().or(z.literal("")),
  birthDate: z.string().min(10, "Data de nascimento é obrigatória"), // basic YYYY-MM-DD check
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  serviceType: z.enum(["online", "presencial", "hibrido"]),
  legalGuardianName: z.string().optional().or(z.literal("")),
  legalGuardianCpf: z.string().optional().or(z.literal("")),
  legalGuardianRelationship: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

function getErrorMessage(error: unknown, fallback: string) {
  const typed = error as { data?: { message?: string }; message?: string };
  return typed?.data?.message || typed?.message || fallback;
}

export default function PatientNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createMutation = useCreatePatient();

  useEffect(() => {
    document.title = "Novo paciente | DocusPsi";
  }, []);

  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      birthDate: "",
      email: "",
      phone: "",
      serviceType: "online",
      legalGuardianName: "",
      legalGuardianCpf: "",
      legalGuardianRelationship: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof patientSchema>) {
    createMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          toast({ title: "Paciente cadastrado com sucesso" });
          setLocation(`/app/patients/${data.id}`);
        },
        onError: (error: unknown) => {
          toast({ 
            variant: "destructive", 
            title: "Erro ao cadastrar paciente", 
            description: getErrorMessage(error, "Verifique os dados e tente novamente") 
          });
        }
      }
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/app/patients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo paciente</h1>
          <p className="text-muted-foreground">Cadastre um novo paciente para gerar documentos.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <AppFormSection title="Dados do paciente" description="Informe dados essenciais para preencher documentos automaticamente.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl><AppInput {...field} placeholder="Nome completo do paciente" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl><AppCpfInput value={field.value} onChange={field.onChange} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="birthDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento *</FormLabel>
                    <FormControl><AppDatePicker value={field.value} onChange={field.onChange} placeholder="Selecione a data de nascimento" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><AppInput type="email" placeholder="email@exemplo.com" {...field} /></FormControl>
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
                <FormField control={form.control} name="serviceType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade de Atendimento</FormLabel>
                    <FormControl><AppSelect value={field.value} onValueChange={field.onChange} placeholder="Selecione a modalidade" options={SERVICE_TYPE_OPTIONS} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              </AppFormSection>

              <AppFormSection title="Responsável legal" description="Use quando o paciente for menor de idade ou houver responsável cadastrado.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="legalGuardianName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Responsável Legal</FormLabel>
                      <FormControl><AppInput {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="legalGuardianCpf" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF do Responsável Legal</FormLabel>
                      <FormControl><AppCpfInput value={field.value} onChange={field.onChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="legalGuardianRelationship" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parentesco</FormLabel>
                      <FormControl><AppSelectWithOther value={field.value} onValueChange={field.onChange} placeholder="Selecione o parentesco" options={RELATIONSHIP_OPTIONS} otherLabel="Descreva o parentesco" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </AppFormSection>

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Internas (opcional)</FormLabel>
                  <FormControl>
                    <AppTextarea placeholder="Anotações sobre o paciente que não aparecerão nos documentos..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <AppFormActions>
                <Button variant="outline" asChild>
                  <Link href="/app/patients">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Salvando..." : "Salvar Paciente"}
                </Button>
              </AppFormActions>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
