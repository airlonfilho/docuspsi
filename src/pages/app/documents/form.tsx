import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetTemplate, useListPatients, useCreateDocument, useGetProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentHtmlPreview } from "@/components/document-html-preview";
import type { RenderedDocument } from "@/components/document-types";
import { handleBillingError } from "@/lib/billing-errors";
import {
  AppCombobox,
  AppCpfInput,
  AppCurrencyInput,
  AppDatePicker,
  AppFormActions,
  AppFormSection,
  AppInput,
  AppPhoneInput,
  AppRadioGroup,
  AppSelect,
  AppSelectWithOther,
  AppTextarea,
  AppTimePicker,
  CANCELLATION_NOTICE_OPTIONS,
  COMMUNICATION_CHANNEL_OPTIONS,
  DECLARATION_PURPOSE_OPTIONS,
  FREQUENCY_OPTIONS,
  ONLINE_PLATFORM_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_REFERENCE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  SESSION_DURATION_OPTIONS,
  YES_NO_OPTIONS,
  formatCurrencyValue,
  type AppOption,
} from "@/components/app-form";

type TemplateField = {
  key?: string;
  name?: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};

function getErrorMessage(error: unknown, fallback: string) {
  const typed = error as { data?: { message?: string }; message?: string };
  return typed?.data?.message || typed?.message || fallback;
}

const fieldOptionRules: Array<{ match: RegExp; options: AppOption[]; other?: boolean; radio?: boolean }> = [
  { match: /(modalidade|tipo de atendimento)/i, options: SERVICE_TYPE_OPTIONS },
  { match: /(forma de pagamento|payment\.method|paymentMethod)/i, options: PAYMENT_METHOD_OPTIONS, other: true },
  { match: /(frequ[eê]ncia)/i, options: FREQUENCY_OPTIONS, other: true },
  { match: /(dura[cç][aã]o)/i, options: SESSION_DURATION_OPTIONS, other: true },
  { match: /(anteced[eê]ncia|cancelamento)/i, options: CANCELLATION_NOTICE_OPTIONS, other: true },
  { match: /(canal de comunica[cç][aã]o|canal alternativo)/i, options: COMMUNICATION_CHANNEL_OPTIONS, other: true },
  { match: /(plataforma)/i, options: ONLINE_PLATFORM_OPTIONS, other: true },
  { match: /(parentesco)/i, options: RELATIONSHIP_OPTIONS, other: true },
  { match: /(finalidade)/i, options: DECLARATION_PURPOSE_OPTIONS, other: true },
  { match: /(refer[eê]ncia)/i, options: PAYMENT_REFERENCE_OPTIONS, other: true },
  { match: /(consentimento|confirmado|confirmada|ambiente reservado)/i, options: YES_NO_OPTIONS, radio: true },
];

function normalizeOptions(options?: string[]) {
  return (options || []).map((option) => ({ label: option, value: option }));
}

function getFieldKey(field: TemplateField) {
  return field.key || field.name || field.label;
}

function isCurrencyField(field: TemplateField) {
  const source = `${getFieldKey(field)} ${field.label}`;
  return field.type === "currency" || /(amount|valor|pre[cç]o|recebido|value|session\.value)/i.test(source);
}

function getFieldOptions(field: TemplateField) {
  const source = `${getFieldKey(field)} ${field.label}`;
  if (field.options?.length) {
    const options = normalizeOptions(field.options);
    return { options, other: options.some((option) => /outr[oa]/i.test(option.value)), radio: false };
  }
  const rule = fieldOptionRules.find((item) => item.match.test(source));
  return rule ? { options: rule.options, other: rule.other, radio: rule.radio } : null;
}

function getSuggestion(field: TemplateField) {
  const source = `${getFieldKey(field)} ${field.label}`;
  if (/pol[ií]tica.*cancelamento|cancelamento/i.test(source)) {
    return "Cancelamentos devem ser comunicados com antecedência mínima de 24 horas. Faltas sem aviso prévio poderão ser cobradas integralmente.";
  }
  if (/emerg[eê]ncia|urg[eê]ncia/i.test(source)) {
    return "Em situações de urgência ou emergência, procure imediatamente um serviço de saúde, pronto atendimento ou suporte local de emergência.";
  }
  return "";
}

export default function DocumentForm() {
  const [, params] = useRoute("/app/documents/new/:templateSlug");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const templateSlug = params?.templateSlug || "";
  
  const searchParams = new URLSearchParams(window.location.search);
  const initialPatientId = searchParams.get('patientId');

  const { data: template, isLoading: isLoadingTemplate } = useGetTemplate(templateSlug);
  const { data: profile } = useGetProfile();
  
  const { data: patients, isLoading: isLoadingPatients } = useListPatients();
  const createMutation = useCreateDocument();

  const [step, setStep] = useState(1);
  const [patientId, setPatientId] = useState(initialPatientId || "");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");

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
            content: formData[getFieldKey(field)] || (field.required ? "Campo obrigatório pendente de preenchimento." : "Sem informação adicional."),
            highlight: field.required && !formData[getFieldKey(field)],
          }))
        : [{ title: "Conteúdo do documento", content: "Este modelo não possui campos guiados configurados." }],
      signatureBlock: {
        professional: {
          name: profile?.fullName || "Ana Lima",
          crp: profile?.crp || "06/123456",
          role: "Psicóloga",
          signatureUrl: profile?.signatureUrl,
        },
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
      signatureUrl: profile?.signatureUrl,
    };
  }, [fields, formData, profile, selectedPatient, template?.name, template?.slug, template?.type, title]);

  useEffect(() => {
    document.title = template ? `Gerar ${template.name} | DocusPsi` : "Novo documento | DocusPsi";
  }, [template]);

  if (isLoadingTemplate) {
    return <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
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
        if (field.required && !formData[getFieldKey(field)]) {
          toast({ variant: "destructive", title: "Atenção", description: `O campo ${field.label} é obrigatório.` });
          return;
        }
      }
    }
    setStep(step + 1);
  };

  const handleCreate = () => {
    const normalizedFormData = fields.reduce<Record<string, string>>((next, field) => {
      const key = getFieldKey(field);
      const value = formData[key] || "";
      next[key] = isCurrencyField(field) && value ? formatCurrencyValue(value) : value;
      return next;
    }, {});

    createMutation.mutate(
      {
        data: {
          patientId,
          templateId: template.id,
          title: title || `Documento - ${template.name}`,
          formData: normalizedFormData
        }
      },
      {
        onSuccess: (doc) => {
          toast({ title: "Documento criado com sucesso", description: "Abrindo os detalhes do documento." });
          setLocation(`/app/documents/${doc.id}`);
        },
        onError: (error: unknown) => {
          handleBillingError(error, toast, "Erro ao gerar", getErrorMessage(error, "Ocorreu um erro."));
        }
      }
    );
  };

  const renderField = (field: TemplateField) => {
    const fieldKey = getFieldKey(field);
    const value = formData[fieldKey] || "";
    const onChange = (val: string) => setFormData({ ...formData, [fieldKey]: val });
    const normalizedType = field.type?.toLowerCase();

    switch (normalizedType) {
      case "currency":
        return <AppCurrencyInput value={value} onChange={onChange} />;
      case "date":
        return <AppDatePicker value={value} onChange={onChange} placeholder={`Selecione ${field.label.toLowerCase()}`} />;
      case "time":
        return <AppTimePicker value={value} onChange={onChange} placeholder={`Selecione ${field.label.toLowerCase()}`} />;
      case "cpf":
        return <AppCpfInput value={value} onChange={onChange} />;
      case "phone":
        return <AppPhoneInput value={value} onChange={onChange} />;
      case "radio": {
        const options = field.options?.length ? normalizeOptions(field.options) : getFieldOptions(field)?.options || YES_NO_OPTIONS;
        return <AppRadioGroup value={value} onValueChange={onChange} options={options} />;
      }
      case "select": {
        const config = getFieldOptions(field);
        const options = field.options?.length ? normalizeOptions(field.options) : config?.options || [];
        return (config?.other || options.some((option) => /outr[oa]/i.test(option.value)))
          ? <AppSelectWithOther value={value} onValueChange={onChange} placeholder="Selecione..." options={options} otherLabel={`Descreva ${field.label.toLowerCase()}`} />
          : <AppSelect value={value} onValueChange={onChange} placeholder="Selecione..." options={options} />;
      }
      case "combobox":
        return <AppCombobox value={value} onValueChange={onChange} placeholder="Selecione..." options={normalizeOptions(field.options)} />;
      case "checkbox":
        return <AppRadioGroup value={value} onValueChange={onChange} options={YES_NO_OPTIONS} />;
      case "textarea": {
        const suggestion = getSuggestion(field);
        return (
          <div className="space-y-2">
            {suggestion && !value && (
              <Button type="button" variant="outline" size="sm" onClick={() => onChange(suggestion)}>
                Usar sugestão
              </Button>
            )}
            <AppTextarea value={value} onChange={e => onChange(e.target.value)} placeholder={suggestion || field.label} className="min-h-[100px]" />
          </div>
        );
      }
      case "number":
        return <AppInput type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={field.label} />;
      case "text":
        break;
      default:
        break;
    }

    if (isCurrencyField(field)) {
      return <AppCurrencyInput value={value} onChange={onChange} />;
    }
    const optionConfig = getFieldOptions(field);
    if (optionConfig?.radio) {
      return <AppRadioGroup value={value} onValueChange={onChange} options={optionConfig.options} />;
    }

    if (optionConfig) {
      return optionConfig.other ? (
        <AppSelectWithOther
          value={value}
          onValueChange={onChange}
          placeholder={`Selecione ${field.label.toLowerCase()}`}
          options={optionConfig.options}
          otherLabel={`Descreva ${field.label.toLowerCase()}`}
        />
      ) : (
        <AppSelect
          value={value}
          onValueChange={onChange}
          placeholder={`Selecione ${field.label.toLowerCase()}`}
          options={optionConfig.options}
        />
      );
    }

    const source = `${fieldKey} ${field.label}`.toLowerCase();
    if (/cpf|cnpj/i.test(source)) {
      return <AppCpfInput value={value} onChange={onChange} />;
    }
    if (/telefone|whats/i.test(source)) {
      return <AppPhoneInput value={value} onChange={onChange} />;
    }
    if (/hor[aá]rio|hora|in[ií]cio|fim/i.test(source)) {
      return <AppTimePicker value={value} onChange={onChange} />;
    }
    return <AppInput value={value} onChange={e => onChange(e.target.value)} placeholder={field.label} />;
  };

  const totalSteps = 3;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => step > 1 ? setStep(step - 1) : setLocation("/app/documents/new")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerar {template.name}</h1>
          <p className="text-muted-foreground text-sm">Passo {step} de {totalSteps}</p>
        </div>
      </div>

      <Card className="overflow-visible">
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">1. Selecione o paciente</h2>
              {isLoadingPatients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <AppCombobox
                  value={patientId}
                  onValueChange={setPatientId}
                  placeholder="Selecione um paciente cadastrado"
                  searchPlaceholder="Buscar paciente por nome ou CPF..."
                  emptyText="Nenhum paciente encontrado."
                  options={(patients || []).map((patient) => ({
                    value: patient.id,
                    label: `${patient.fullName}${patient.cpf ? ` (${patient.cpf})` : ""}`,
                  }))}
                />
              )}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                <Button onClick={handleNext} disabled={!patientId}>Próximo <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">2. Preencha os dados guiados</h2>
              
              <AppFormSection title="Dados do documento" description="Selecione opções prontas sempre que possível e personalize apenas os textos necessários.">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título do Documento (Opcional)</label>
                  <AppInput
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder={`Ex: ${template.name} - Primeira Sessão`} 
                  />
                </div>

                {fields.map((field) => (
                  <div key={getFieldKey(field)} className="space-y-2">
                    <label className="text-sm font-medium">
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </AppFormSection>

              <AppFormActions>
                <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                <Button onClick={handleNext}>Revisar prévia A4 <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </AppFormActions>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">3. Revise a prévia em A4</h2>
              
              <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                Esta prévia usa seus dados preenchidos e dados profissionais demonstrativos. Após gerar, o documento será renderizado pelo backend com o perfil salvo.
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#DDD6C7] bg-[#FFFFFF]">
                <DocumentHtmlPreview doc={previewDoc} />
              </div>

              <AppFormActions>
                <Button variant="outline" onClick={() => setStep(2)}>Editar dados</Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Gerando..." : "Gerar documento"} <Check className="ml-2 h-4 w-4" />
                </Button>
              </AppFormActions>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
