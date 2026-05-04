import { useQuery } from "@tanstack/react-query";
import type { RenderedDocument } from "@/components/document-types";
import { DocumentHtmlPreview } from "@/components/document-html-preview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { FileText, FileSignature, Receipt, FileSearch, FileHeart, FilePen } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getApiBaseUrl } from "@workspace/api-client-react";

const TYPE_LABELS: Record<string, string> = {
  contrato: "Contrato",
  termo: "Termo",
  autorizacao: "Autorização",
  declaracao: "Declaração",
  recibo: "Recibo",
  atestado: "Atestado",
  relatorio: "Relatório",
};

const TYPE_COLORS: Record<string, string> = {
  contrato: "bg-[#EDE9FE] text-[#6D28D9]",
  termo: "bg-[#EDE9FE] text-[#6D28D9]",
  autorizacao: "bg-amber-100 text-amber-800",
  declaracao: "bg-green-100 text-green-800",
  recibo: "bg-emerald-100 text-emerald-800",
  atestado: "bg-rose-100 text-rose-800",
  relatorio: "bg-slate-100 text-slate-800",
};

const TEMPLATE_SECTIONS: Record<string, { title: string; content: string }[]> = {
  "contrato-terapeutico": [
    { title: "Identificação das Partes", content: "Identifica o profissional e o paciente com dados de CRP e CPF." },
    { title: "Objeto do Contrato", content: "Define a prestação de serviços de psicoterapia individual." },
    { title: "Modalidade e Frequência", content: "Define modalidade (presencial/online/híbrida), duração e frequência." },
    { title: "Honorários e Pagamento", content: "Especifica valor da sessão, forma de pagamento e política de reajuste." },
    { title: "Cancelamentos e Faltas", content: "Define prazo mínimo para cancelamento e política para faltas." },
    { title: "Sigilo Profissional", content: "Estrutura cláusulas de sigilo profissional para revisão e adaptação." },
    { title: "Limites do Sigilo", content: "Define as situações excepcionais em que o sigilo pode ser relativizado." },
    { title: "Comunicação fora da Sessão", content: "Estabelece canal de comunicação e regras para contato entre sessões." },
    { title: "Tratamento de Dados", content: "Organiza informações sobre uso e cuidado com dados pessoais." },
    { title: "Encerramento do Acompanhamento", content: "Define como o acompanhamento poderá ser encerrado por qualquer parte." },
    { title: "Disposições Finais", content: "Cláusulas gerais, observações adicionais e foro para eventuais litígios." },
  ],
  "termo-consentimento": [
    { title: "Finalidade do Atendimento", content: "Apresenta os objetivos e a natureza do processo terapêutico." },
    { title: "Natureza do Serviço Psicológico", content: "Explica o que é a psicoterapia e como ela funciona na prática." },
    { title: "Sigilo Profissional", content: "Garante o sigilo das informações e descreve os limites previstos em lei." },
    { title: "Limites do Sigilo", content: "Descreve as hipóteses excepcionais de quebra de sigilo." },
    { title: "Registros e Prontuário", content: "Informa sobre os registros clínicos mantidos pelo profissional." },
    { title: "Tratamento de Dados", content: "Organiza informações sobre uso e cuidado com dados pessoais." },
    { title: "Direitos da Pessoa Atendida", content: "Lista os direitos do paciente, incluindo liberdade de interromper o processo." },
    { title: "Consentimento Livre e Informado", content: "Declaração formal de consentimento assinada pelo paciente." },
  ],
  "termo-atendimento-online": [
    { title: "Modalidade de Atendimento Online", content: "Apoia a organização do atendimento psicológico online." },
    { title: "Plataforma Utilizada", content: "Especifica a plataforma digital usada para as sessões online." },
    { title: "Responsabilidades Técnicas", content: "Orienta sobre conexão estável, local reservado e equipamento adequado." },
    { title: "Canal Alternativo", content: "Define o contato em caso de falha de conexão durante a sessão." },
    { title: "Confidencialidade e Gravação", content: "Detalha as regras de segurança e proíbe gravação não autorizada." },
    { title: "Situações de Urgência", content: "Orienta sobre canais de emergência (SAMU, CVV) disponíveis." },
    { title: "Sigilo Profissional", content: "Garante as mesmas proteções de sigilo do atendimento presencial." },
    { title: "Consentimento", content: "Declaração formal de aceite das condições do atendimento online." },
  ],
  "autorizacao-menor": [
    { title: "Identificação do Responsável Legal", content: "Identifica o responsável com CPF e grau de parentesco/vínculo." },
    { title: "Autorização Expressa", content: "Declaração formal de autorização para o atendimento psicológico do menor." },
    { title: "Ciência sobre o Atendimento", content: "Informa o responsável sobre as técnicas utilizadas no atendimento de menores." },
    { title: "Sigilo e Comunicação", content: "Define como e quando informações podem ser compartilhadas com responsáveis." },
    { title: "Tratamento de Dados", content: "Organiza informações sobre dados do menor e do responsável." },
    { title: "Disposições Finais", content: "Declaração de autorização livre e voluntária do responsável legal." },
  ],
  "declaracao-comparecimento": [
    { title: "Declaração", content: "Declara o comparecimento ao atendimento com data, horário e modalidade especificados." },
  ],
  "recibo-pagamento": [
    { title: "Recibo", content: "Registra o valor recebido com destaque visual para o montante e forma de pagamento." },
    { title: "Detalhes do Pagamento", content: "Especifica data, forma de pagamento e o profissional responsável." },
    { title: "Declaração de Quitação", content: "Declara o recebimento e dá quitação pelo valor recebido." },
  ],
};

const TEMPLATE_META: Record<string, { whenUse: string; observations: string }> = {
  "contrato-terapeutico": {
    whenUse: "Ao iniciar um acompanhamento e formalizar combinados de atendimento, valores, frequência, cancelamento e comunicação.",
    observations: "Revise cláusulas sensíveis, valores e regras do seu consultório antes da emissão.",
  },
  "termo-consentimento": {
    whenUse: "Para registrar ciência e consentimento sobre a natureza do atendimento psicológico.",
    observations: "Adapte a linguagem ao contexto do atendimento e ao perfil da pessoa atendida.",
  },
  "termo-atendimento-online": {
    whenUse: "Quando o atendimento ocorrer online e você precisar organizar orientações de ambiente, conexão, sigilo e canais de contato.",
    observations: "Evite tratar o modelo como declaração automática de conformidade. Revise conforme sua prática e normas aplicáveis.",
  },
  "autorizacao-menor": {
    whenUse: "Quando houver atendimento de menor de idade e for necessário registrar dados do responsável legal.",
    observations: "Confira dados do responsável, parentesco e contexto antes de emitir.",
  },
  "declaracao-comparecimento": {
    whenUse: "Para declarar data e horário de comparecimento a atendimento psicológico.",
    observations: "Inclua apenas informações necessárias e evite expor conteúdo clínico.",
  },
  "recibo-pagamento": {
    whenUse: "Para registrar pagamento de atendimento ou pacote de sessões.",
    observations: "Confira valores, forma de pagamento, datas e dados profissionais antes de baixar o PDF.",
  },
};

function getTemplateIcon(type: string) {
  const cls = "h-5 w-5 text-[#6D28D9]";
  switch (type) {
    case "recibo": return <Receipt className={cls} />;
    case "atestado": return <FileHeart className={cls} />;
    case "relatorio": return <FileSearch className={cls} />;
    case "contrato": return <FileSignature className={cls} />;
    case "declaracao": return <FilePen className={cls} />;
    default: return <FileText className={cls} />;
  }
}

export interface PreviewTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  type: string;
  fieldCount?: number;
}

interface TemplatePreviewDialogProps {
  template: PreviewTemplate | null;
  onClose: () => void;
}

async function fetchTemplatePreview(slug: string, token: string | null): Promise<RenderedDocument> {
  const res = await fetch(`${getApiBaseUrl()}/templates/${slug}/preview`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Erro ao carregar preview");
  return res.json() as Promise<RenderedDocument>;
}

function buildFallbackPreview(template: PreviewTemplate, sections: { title: string; content: string }[]): RenderedDocument {
  return {
    title: template.name,
    type: TYPE_LABELS[template.type] || template.type,
    slug: template.slug,
    primaryColor: "#8B5CF6",
    secondaryColor: "#6D28D9",
    issueDate: new Date().toISOString(),
    documentId: "PREVIEW-A4",
    professionalHeader: {
      fullName: "Ana Lima",
      crp: "06/123456",
      clinicName: "Consultório Ana Lima",
      email: "ana@docuspsi.com",
      phone: "(11) 99999-0000",
      city: "São Paulo",
      state: "SP",
    },
    infoBlock: {
      rows: [
        { label: "Paciente", value: "Mariana Souza" },
        { label: "CPF", value: "000.000.000-00" },
        { label: "Modalidade", value: "Online" },
        { label: "Data", value: new Date().toLocaleDateString("pt-BR") },
      ],
    },
    sections: sections.length
      ? sections.map((section) => ({ title: section.title, content: section.content }))
      : [
          {
            title: "Conteúdo do modelo",
            content: template.description || "Modelo estruturado para preenchimento guiado e geração em PDF.",
          },
        ],
    signatureBlock: {
      professional: { name: "Ana Lima", crp: "06/123456", role: "Psicóloga" },
      patient: { name: "Mariana Souza", role: "Paciente" },
      city: "São Paulo",
      state: "SP",
      date: new Date().toLocaleDateString("pt-BR"),
    },
    notice: "Prévia demonstrativa com dados fictícios. Revise e adapte o conteúdo antes de emitir.",
    footerPrefs: {
      text: "Gerado por DocusPsi",
      showGeneratedBy: true,
      showDocumentCode: true,
      showIssuedAt: true,
      showPageNumber: true,
    },
  };
}

function PreviewSkeleton() {
  return (
    <div className="bg-gray-100 p-6 min-h-[500px]">
      <div className="bg-white rounded shadow-md p-8 flex flex-col gap-5 max-w-[794px] mx-auto">
        <div className="flex justify-between items-start border-b pb-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="text-right space-y-1.5">
            <Skeleton className="h-3 w-32 ml-auto" />
            <Skeleton className="h-3 w-24 ml-auto" />
            <Skeleton className="h-3 w-20 ml-auto" />
          </div>
        </div>
        <div className="flex justify-center mt-1">
          <Skeleton className="h-6 w-44 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
        <div className="border rounded-lg p-4 mt-1">
          <Skeleton className="h-4 w-20 mb-3" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 mt-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TemplatePreviewDialog({ template, onClose }: TemplatePreviewDialogProps) {
  const { token } = useAuth();
  const { data: preview, isLoading, isError } = useQuery<RenderedDocument>({
    queryKey: ["template-preview", template?.slug],
    queryFn: () => fetchTemplatePreview(template!.slug, token),
    enabled: !!template?.slug,
    staleTime: 1000 * 60 * 10,
  });

  const sections = template ? (TEMPLATE_SECTIONS[template.slug] ?? []) : [];
  const meta = template ? TEMPLATE_META[template.slug] : null;
  const fallbackPreview = template ? buildFallbackPreview(template, sections) : null;
  const displayPreview = preview || (isError ? fallbackPreview : null);

  return (
    <Dialog open={!!template} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[92vw] w-full p-0 gap-0 overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        <DialogHeader className="px-5 py-3.5 border-b shrink-0">
          <div className="flex items-center gap-3 pr-8">
            {template && (
              <div className="p-1.5 rounded-lg shrink-0 bg-[#EDE9FE]">
                {getTemplateIcon(template.type)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-semibold truncate leading-tight">
                {template?.name}
              </DialogTitle>
              {template && (
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    className={`text-[11px] py-0 px-1.5 ${TYPE_COLORS[template.type] ?? ""}`}
                    variant="secondary"
                  >
                    {TYPE_LABELS[template.type] ?? template.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                    {template.description}
                  </span>
                </div>
              )}
            </div>
            {template && (
              <Button size="sm" className="shrink-0" asChild>
                <Link href={`/app/documents/new/${template.slug}`} onClick={onClose}>
                  Usar modelo
                </Link>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto lg:overflow-hidden min-h-0">
          <div className="flex flex-col lg:grid lg:grid-cols-[3fr_2fr] lg:h-full">
            <div className="lg:overflow-y-auto border-b lg:border-b-0 lg:border-r bg-gray-50">
              {isLoading ? (
                <PreviewSkeleton />
              ) : displayPreview ? (
                <div>
                  {isError && (
                    <div className="m-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      Não foi possível carregar a prévia do backend. Exibindo uma prévia demonstrativa com dados fictícios.
                    </div>
                  )}
                  <div style={{ zoom: "0.72", transformOrigin: "top left" }}>
                    <DocumentHtmlPreview doc={displayPreview} />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="lg:overflow-y-auto flex flex-col">
              <div className="p-5 flex flex-col gap-4 flex-1">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Sobre este modelo
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {template?.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline">{template?.fieldCount || 0} campos guiados</Badge>
                    <Badge variant="outline">Preview A4</Badge>
                    <Badge variant="outline">PDF profissional</Badge>
                  </div>
                </div>

                {meta && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                          Quando usar
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">{meta.whenUse}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                          Observações
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{meta.observations}</p>
                      </div>
                    </div>
                  </>
                )}

                {sections.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
                        Estrutura do documento
                      </p>
                      <div className="space-y-1.5">
                        {sections.map((section, i) => (
                          <div
                            key={i}
                            className="flex gap-2.5 p-2.5 rounded-lg border bg-card hover:bg-accent/20 transition-colors"
                          >
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground leading-snug">
                                {section.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                                {section.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 border-t bg-muted/20 shrink-0">
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                  Modelo editável para apoio administrativo. A responsabilidade pelo conteúdo final é da(o) profissional.
                </p>
                <Button className="w-full" asChild>
                  <Link
                    href={template ? `/app/documents/new/${template.slug}` : "#"}
                    onClick={onClose}
                  >
                    Usar este modelo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
