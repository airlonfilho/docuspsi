import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetTemplate, useListPatients, useCreateDocument } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, FileText, Download, Link as LinkIcon, Plus, Eye } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useDownloadPdf } from "@/hooks/use-download-pdf";
import { DocumentHtmlPreview } from "@/components/document-html-preview";
import type { RenderedDocument } from "@/components/document-types";

type TemplateField = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};

function getErrorMessage(error: unknown, fallback: string) {
  const typed = error as { data?: { message?: string }; message?: string };
  return typed?.data?.message || typed?.message || fallback;
}

export default function DocumentForm() {
  const [, params] = useRoute("/app/documents/new/:templateSlug");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const templateSlug = params?.templateSlug || "";
  
  const searchParams = new URLSearchParams(window.location.search);
  const initialPatientId = searchParams.get('patientId');

  const { data: template, isLoading: isLoadingTemplate } = useGetTemplate(templateSlug);
  
  const { data: patients, isLoading: isLoadingPatients } = useListPatients();
  const createMutation = useCreateDocument();
  const downloadPdf = useDownloadPdf();

  const [step, setStep] = useState(1);
  const [patientId, setPatientId] = useState(initialPatientId || "");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [createdDoc, setCreatedDoc] = useState<{ id: string; title: string; publicToken?: string | null } | null>(null);

  const fields = (template?.fieldsSchema?.fields || []) as TemplateField[];
  const selectedPatient = patients?.find((patient) => patient.id === patientId);

  const previewDoc = useMemo<RenderedDocument>(() => {
    const rows = [
      { label: "Paciente", value: selectedPatient?.fullName || "Paciente não selecionado" },
      { label: "CPF", value: selectedPatient?.cpf || "Não informado" },
      { label: "Modalidade", value: selectedPatient?.serviceType || "Não informada" },
      { label: "Documento", value: title || `Documento - ${template?.name || "Novo documento"}` },
    ];

    return {
      title: title || template?.name || "Novo documento",
      type: template?.type || "",
      slug: template?.slug || "preview",
      primaryColor: "#8B5CF6",
      secondaryColor: "#6D28D9",
      issueDate: new Date().toISOString(),
      documentId: "PREVIEW",
      professionalHeader: {
        fullName: "Ana Lima",
        crp: "06/123456",
        clinicName: "Consultório Ana Lima",
        email: "ana@docuspsi.com",
        phone: "(11) 99999-0000",
        city: "São Paulo",
        state: "SP",
      },
      infoBlock: { rows },
      sections: fields.length
        ? fields.map((field) => ({
            title: field.label,
            content: formData[field.key] || (field.required ? "Campo obrigatório pendente de preenchimento." : "Sem informação adicional."),
            highlight: field.required && !formData[field.key],
          }))
        : [{ title: "Conteúdo do documento", content: "Este modelo não possui campos guiados configurados." }],
      signatureBlock: {
        professional: { name: "Ana Lima", crp: "06/123456", role: "Psicóloga" },
        patient: selectedPatient ? { name: selectedPatient.fullName, role: "Paciente" } : undefined,
        city: "São Paulo",
        state: "SP",
        date: new Date().toLocaleDateString("pt-BR"),
      },
      notice: "Prévia demonstrativa. Revise os dados antes de gerar o documento.",
      footerPrefs: {
        text: "Gerado por DocusPsi",
        showGeneratedBy: true,
        showDocumentCode: true,
        showIssuedAt: true,
        showPageNumber: true,
      },
    };
  }, [fields, formData, selectedPatient, template?.name, template?.slug, template?.type, title]);

  useEffect(() => {
    document.title = template ? `Gerar ${template.name} | DocusPsi` : "Novo documento | DocusPsi";
  }, [template]);

  if (isLoadingTemplate) {
    return <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64 w-full" />
    </div>;
  }

  if (!template) {
    return <div className="p-6 text-center py-12">Modelo não encontrado.</div>;
  }

  const handleNext = () => {
    if (step === 1 && !patientId) {
      toast({ variant: "destructive", title: "Atenção", description: "Selecione um paciente para continuar." });
      return;
    }
    if (step === 2) {
      for (const field of fields) {
        if (field.required && !formData[field.key]) {
          toast({ variant: "destructive", title: "Atenção", description: `O campo ${field.label} é obrigatório.` });
          return;
        }
      }
    }
    setStep(step + 1);
  };

  const handleCreate = () => {
    createMutation.mutate(
      {
        data: {
          patientId,
          templateId: template.id,
          title: title || `Documento - ${template.name}`,
          formData
        }
      },
      {
        onSuccess: (doc) => {
          setCreatedDoc({ id: doc.id, title: doc.title, publicToken: doc.publicToken });
          setStep(4);
        },
        onError: (error: unknown) => {
          toast({ variant: "destructive", title: "Erro ao gerar", description: getErrorMessage(error, "Ocorreu um erro.") });
        }
      }
    );
  };

  const copyLink = () => {
    if (createdDoc?.publicToken) {
      navigator.clipboard.writeText(`${window.location.origin}/accept/${createdDoc.publicToken}`);
      toast({ title: "Link copiado!", description: "O link de aceite foi copiado para a área de transferência." });
    }
  };

  const renderField = (field: TemplateField) => {
    const value = formData[field.key] || "";
    const onChange = (val: string) => setFormData({ ...formData, [field.key]: val });

    switch (field.type) {
      case "text":
        return <Input value={value} onChange={e => onChange(e.target.value)} placeholder={field.label} />;
      case "number":
        return <Input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={field.label} />;
      case "date":
        return <Input type="date" value={value} onChange={e => onChange(e.target.value)} />;
      case "time":
        return <Input type="time" value={value} onChange={e => onChange(e.target.value)} />;
      case "textarea":
        return <Textarea value={value} onChange={e => onChange(e.target.value)} placeholder={field.label} className="min-h-[100px]" />;
      case "select":
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {field.options?.map((opt: string) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input value={value} onChange={e => onChange(e.target.value)} />;
    }
  };

  const totalSteps = 3;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {step < 4 && (
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => step > 1 ? setStep(step - 1) : setLocation("/app/documents/new")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerar {template.name}</h1>
            <p className="text-muted-foreground text-sm">Passo {step} de {totalSteps}</p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">1. Selecione o paciente</h2>
              {isLoadingPatients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={patientId} onValueChange={setPatientId}>
                  <SelectTrigger className="w-full h-12 text-lg">
                    <SelectValue placeholder="Selecione um paciente cadastrado" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.fullName} {p.cpf ? `(${p.cpf})` : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={!patientId}>Próximo <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">2. Preencha os dados guiados</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título do Documento (Opcional)</label>
                  <Input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder={`Ex: ${template.name} - Primeira Sessão`} 
                  />
                </div>

                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                <Button onClick={handleNext}>Revisar prévia A4 <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">3. Revise a prévia em A4</h2>
              
              <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                Esta prévia usa seus dados preenchidos e dados profissionais demonstrativos. Após gerar, o documento será renderizado pelo backend com o perfil salvo.
              </div>

              <div className="overflow-x-auto rounded-lg border bg-[#e5e7eb]">
                <DocumentHtmlPreview doc={previewDoc} />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>Editar dados</Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Gerando..." : "Gerar documento"} <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && createdDoc && (
            <div className="space-y-6 text-center py-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Documento criado com sucesso!</h2>
                <p className="text-muted-foreground mt-2">
                  Você já pode visualizar, baixar o PDF ou enviar o link de aceite para o paciente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-left">
                <Button asChild className="h-12">
                  <Link href={`/app/documents/${createdDoc.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Documento
                  </Link>
                </Button>
                <Button variant="outline" className="h-12" onClick={() => downloadPdf(createdDoc.id, createdDoc.title)}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
                {createdDoc.publicToken && (
                  <Button variant="outline" className="h-12" onClick={copyLink}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copiar link de aceite
                  </Button>
                )}
                <Button variant="ghost" className="h-12" onClick={() => {
                  setStep(1);
                  setPatientId(initialPatientId || "");
                  setFormData({});
                  setTitle("");
                  setCreatedDoc(null);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Outro Documento
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
