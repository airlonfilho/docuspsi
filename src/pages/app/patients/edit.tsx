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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome completo *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="birthDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl><Input type="email" placeholder="email@exemplo.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl><Input placeholder="(00) 00000-0000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="serviceType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade de atendimento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Responsável legal, se aplicável</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="legalGuardianName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do responsável</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="legalGuardianCpf" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF do responsável</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="legalGuardianRelationship" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parentesco</FormLabel>
                      <FormControl><Input placeholder="Mãe, pai, responsável..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações internas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Anotações que não aparecerão nos documentos..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link href={`/app/patients/${patientId}`}>Cancelar</Link>
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
