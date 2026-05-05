import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoute } from "wouter";
import { useAcceptDocument, useGetPublicDocument } from "@workspace/api-client-react";
import { AlertCircle, Ban, CheckCircle, Download, FileSignature, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentHtmlPreview } from "@/components/document-html-preview";
import { parseRenderedContent } from "@/components/document-types";
import { DocusPsiLogoImage } from "@/components/docuspsi-logo";
import { getApiBaseUrl } from "@workspace/api-client-react";
import { AppCheckbox, AppCpfInput, AppInput } from "@/components/app-form";

const acceptSchema = z.object({
  acceptedName: z.string().min(2, "Nome é obrigatório"),
  acceptedCpf: z.string().optional(),
  acceptedEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  confirmed: z.boolean().refine((value) => value, "Você deve confirmar que leu e aceitou o documento"),
});

function StateCard({
  icon,
  title,
  description,
  tone = "muted",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "muted" | "success" | "danger";
}) {
  const toneClass = {
    muted: "border-border",
    success: "border-green-200",
    danger: "border-red-200",
  }[tone];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className={`w-full max-w-md py-8 text-center ${toneClass}`}>
        <CardContent className="space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            O DocusPsi oferece aceite simples por link para apoio à organização documental. Não se trata de assinatura digital avançada.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function getAcceptedAt(doc: { acceptedAt?: string | null } | undefined) {
  return doc?.acceptedAt || null;
}

export default function PublicAccept() {
  const [, params] = useRoute("/accept/:token");
  const token = params?.token || "";

  const { data: doc, isLoading, error } = useGetPublicDocument(token, {
    query: { enabled: !!token, retry: false },
  });
  const acceptMutation = useAcceptDocument();

  const form = useForm<z.infer<typeof acceptSchema>>({
    resolver: zodResolver(acceptSchema),
    defaultValues: {
      acceptedName: "",
      acceptedCpf: "",
      acceptedEmail: "",
      confirmed: false,
    },
  });

  useEffect(() => {
    document.title = doc ? `${doc.title} | Aceite DocusPsi` : "Aceite de documento | DocusPsi";
  }, [doc]);

  function onSubmit(values: z.infer<typeof acceptSchema>) {
    acceptMutation.mutate({ token, data: values });
  }

  async function downloadPublicPdf() {
    if (!doc) return;
    const res = await fetch(`${getApiBaseUrl()}/public/documents/${token}/pdf`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^\w\s-]/g, "")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e5e7eb] p-4 py-12">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="mx-auto h-12 w-1/2" />
          <Skeleton className="h-[900px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <StateCard
        icon={<AlertCircle className="h-8 w-8 text-muted-foreground" />}
        title="Link indisponível"
        description="O link acessado é inválido, expirou ou não está mais disponível."
      />
    );
  }

  if (doc.status === "revogado") {
    return (
      <StateCard
        icon={<Ban className="h-8 w-8 text-red-600" />}
        title="Documento revogado"
        description="Este documento foi revogado pela(o) profissional e não pode receber novo aceite por este link."
        tone="danger"
      />
    );
  }

  if (doc.status === "aceito" || acceptMutation.isSuccess) {
    const acceptedAt = getAcceptedAt(doc);
    return (
      <StateCard
        icon={<CheckCircle className="h-8 w-8 text-green-600" />}
        title="Aceite registrado"
        description={
          acceptedAt
            ? `O documento "${doc.title}" já possui aceite registrado em ${format(new Date(acceptedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}.`
            : `O aceite simples do documento "${doc.title}" foi registrado.`
        }
        tone="success"
      />
    );
  }

  const rendered = parseRenderedContent(doc.renderedContent);

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <DocusPsiLogoImage variant="icon" className="mx-auto mb-4 h-14 w-14" />
          <h1 className="text-xl font-bold">
            {doc.psychologistName || "Profissional"} enviou um documento para aceite
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {doc.crp && `CRP: ${doc.crp}`}
            {doc.clinicName && ` · ${doc.clinicName}`}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium">
            <FileSignature className="h-4 w-4 text-[#6D28D9]" />
            {doc.title}
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Leia o documento com atenção. O aceite abaixo registra ciência e concordância simples com o conteúdo apresentado, sem equivaler a assinatura digital avançada.
          </p>
        </header>

        {rendered ? (
          <div className="overflow-x-auto rounded-2xl border border-[#DDD6C7] bg-[#FFFFFF] shadow-sm">
            <DocumentHtmlPreview doc={rendered} />
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="whitespace-pre-wrap text-sm italic text-muted-foreground">
                {doc.renderedContent || "Não foi possível renderizar a prévia do documento."}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-[#6D28D9]" />
              Aceite do documento
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para registrar um aceite simples de leitura e concordância.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {acceptMutation.isError && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/30 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <p className="font-medium">Não foi possível registrar o aceite.</p>
                  <p className="text-sm text-muted-foreground">Confira os dados e tente novamente.</p>
                </div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="acceptedName" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome completo *</FormLabel>
                      <FormControl><AppInput {...field} placeholder="Nome como no documento de identidade" autoComplete="name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="acceptedCpf" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF opcional</FormLabel>
                      <FormControl><AppCpfInput value={field.value} onChange={field.onChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="acceptedEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail opcional</FormLabel>
                      <FormControl><AppInput type="email" {...field} placeholder="seu@email.com" autoComplete="email" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="confirmed" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AppCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        error={!!form.formState.errors.confirmed}
                        label={(
                          <span>
                            <span className="font-medium">Li, compreendi e estou de acordo com o conteúdo deste documento.</span>
                            <span className="mt-1 block text-sm text-muted-foreground">
                              Ao clicar em "Li e aceito este documento", você registra um aceite simples de leitura e concordância.
                            </span>
                          </span>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6D28D9]" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Este recurso apoia a organização documental. Ele não substitui orientação jurídica, ética, técnica ou profissional.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-3 sm:flex-row">
                  <Button type="button" variant="outline" onClick={downloadPublicPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                  <Button type="submit" size="lg" disabled={acceptMutation.isPending}>
                    {acceptMutation.isPending ? "Confirmando..." : "Li e aceito este documento"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
