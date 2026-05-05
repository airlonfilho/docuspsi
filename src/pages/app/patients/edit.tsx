import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useGetPatient, useUpdatePatient } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
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
  birthDate: z.string().optional().or(z.literal("")),
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

export default function PatientEdit() {
  const [, params] = useRoute("/app/patients/:id/edit");
  const [, setLocation] = useLocation();
  const patientId = params?.id || "";
  const { toast } = useToast();
  const { data: patient, isLoading } = useGetPatient(patientId);
  const updateMutation = useUpdatePatient();

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

  useEffect(() => {
    document.title = "Editar paciente | DocusPsi";
  }, []);

  useEffect(() => {
    if (!patient) return;
    form.reset({
      fullName: patient.fullName || "",
      cpf: patient.cpf || "",
      birthDate: patient.birthDate || "",
      email: patient.email || "",
      phone: patient.phone || "",
      serviceType: patient.serviceType || "online",
      legalGuardianName: patient.legalGuardianName || "",
      legalGuardianCpf: patient.legalGuardianCpf || "",
      legalGuardianRelationship: patient.legalGuardianRelationship || "",
      notes: patient.notes || "",
    });
  }, [form, patient]);

  function onSubmit(values: z.infer<typeof patientSchema>) {
    updateMutation.mutate(
      { patientId, data: values },
      {
        onSuccess: () => {
          toast({ title: "Paciente atualizado com sucesso" });
          setLocation(`/app/patients/${patientId}`);
        },
        onError: (error: unknown) => {
          toast({
            variant: "destructive",
            title: "Erro ao atualizar paciente",
            description: getErrorMessage(error, "Verifique os dados e tente novamente"),
          });
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg border bg-card p-8 text-center text-muted-foreground">
        Paciente não encontrado.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/app/patients/${patientId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar paciente</h1>
          <p className="text-muted-foreground">Atualize os dados administrativos do paciente.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AppFormSection title="Dados do paciente" description="Dados usados para preencher documentos e histórico.">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome completo *</FormLabel>
                    <FormControl><AppInput {...field} /></FormControl>
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
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl><AppDatePicker value={field.value} onChange={field.onChange} optional /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
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
                    <FormLabel>Modalidade de atendimento</FormLabel>
                    <FormControl><AppSelect value={field.value} onValueChange={field.onChange} placeholder="Selecione a modalidade" options={SERVICE_TYPE_OPTIONS} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              </AppFormSection>

              <AppFormSection title="Responsável legal" description="Dados opcionais para documentos de menores ou responsáveis.">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="legalGuardianName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do responsável</FormLabel>
                      <FormControl><AppInput {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="legalGuardianCpf" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF do responsável</FormLabel>
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
                  <FormLabel>Observações internas</FormLabel>
                  <FormControl>
                    <AppTextarea placeholder="Anotações que não aparecerão nos documentos..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <AppFormActions>
                <Button variant="outline" asChild>
                  <Link href={`/app/patients/${patientId}`}>Cancelar</Link>
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </AppFormActions>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
