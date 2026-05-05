import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { getApiBaseUrl, useCreateLead, useGetKitForm } from "@/api-client-react";
import { DocusPsiLogoImage } from "@/components/docuspsi-logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { maskPhone } from "@/components/app-form";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Download,
  FileCheck,
  FilePen,
  FileText,
  FolderOpen,
  HeartHandshake,
  Loader2,
  Mail,
  MonitorCheck,
  Receipt,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";

const C = {
  bg: "#FFFFFF",
  paper: "#FFFFFF",
  paperMuted: "#FAF7F0",
  border: "#DDD6C7",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#111111",
  accent: "#8B5CF6",
  accentSoft: "#EDE9FE",
  accentText: "#6D28D9",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#D97706",
  danger: "#DC2626",
};

const font = {
  display: "Montserrat, sans-serif",
  body: "Roboto, sans-serif",
  mono: '"PT Mono", monospace',
};

type FormState = {
  name: string;
  email: string;
  whatsapp: string;
  stage: string;
  hardestDocument: string;
  source: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState | "submit", string>>;

function PaperBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
      style={{ background: C.accentSoft, color: C.accentText, border: `1px solid ${C.border}`, fontFamily: font.body }}
    >
      {children}
    </span>
  );
}

function PaperCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: C.paper, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(17,17,17,0.06)", padding: 24, ...style }}
    >
      {children}
    </div>
  );
}

function BtnPrimary({ href, children, onClick, type = "button", disabled }: { href?: string; children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) {
  const className = "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 disabled:opacity-70";
  const style = { background: C.primary, color: "#fff", fontFamily: font.body } as React.CSSProperties;
  if (href) return <Link href={href} className={className} style={style}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={className} style={style}>{children}</button>;
}

function BtnSecondary({ href, children, onClick }: { href?: string; children: React.ReactNode; onClick?: () => void }) {
  const className = "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2";
  const style = { background: C.paperMuted, color: C.text, border: `1px solid ${C.border}`, fontFamily: font.body } as React.CSSProperties;
  if (href) return <Link href={href} className={className} style={style}>{children}</Link>;
  return <button type="button" onClick={onClick} className={className} style={style}>{children}</button>;
}

function SectionWrap({ id, children, muted = false }: { id?: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <section id={id} className="px-6 py-20 md:py-24" style={{ background: muted ? C.paperMuted : "transparent" }}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function SectionHead({ badge, title, sub }: { badge?: string; title: string; sub?: string }) {
  return (
    <div className="mb-12 text-center">
      {badge && <div className="mb-4 flex justify-center"><PaperBadge>{badge}</PaperBadge></div>}
      <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl" style={{ fontFamily: font.display, color: C.text }}>{title}</h2>
      {sub && <p className="mx-auto max-w-2xl text-base leading-relaxed md:text-lg" style={{ fontFamily: font.body, color: C.textMuted }}>{sub}</p>}
    </div>
  );
}

function KitLandingHeader() {
  return (
    <header className="sticky top-0 z-50" style={{ background: "rgba(247,243,234,0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]">
          <DocusPsiLogoImage variant="horizontal" className="h-10 w-40" />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Navegação do kit">
          <Link href="/" className="hidden rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] sm:inline-flex" style={{ fontFamily: font.body, color: C.textMuted }}>
            Conhecer o DocusPsi
          </Link>
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]" style={{ fontFamily: font.body, color: "#fff", background: C.primary }}>
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}

function KitMockup() {
  return (
    <div className="relative mx-auto h-[380px] w-full max-w-[410px]" aria-label="Mockup do Kit Documental para Psicólogas Clínicas">
      <div style={{ position: "absolute", inset: "56px 12px 24px 52px", background: "#EFE7D8", border: `1px solid ${C.border}`, borderRadius: 16, transform: "rotate(-6deg)", boxShadow: "0 14px 30px rgba(17,17,17,0.08)" }} />
      <div style={{ position: "absolute", inset: "36px 36px 54px 24px", background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, transform: "rotate(3deg)", padding: 22, boxShadow: "0 16px 34px rgba(17,17,17,0.10)", backgroundImage: "linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px)", backgroundSize: "100% 30px" }}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: C.accentSoft, color: C.accentText, border: "1px solid #C4B5FD" }}>
            <FileText className="h-5 w-5" />
          </div>
          <span style={{ fontFamily: font.mono, color: C.accentText, fontSize: 11, fontWeight: 700 }}>PDF</span>
        </div>
        <div style={{ height: 6, width: 92, background: C.accent, borderRadius: 999, marginBottom: 16 }} />
        <h2 style={{ fontFamily: font.display, color: C.text, fontSize: 26, lineHeight: 1.1, fontWeight: 800 }}>
          Kit Documental Psi
        </h2>
        <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.6, marginTop: 10 }}>
          Checklist, contrato, termo, recibo e declaração para adaptar à rotina clínica.
        </p>
        <div className="mt-5 grid gap-2">
          {["Checklist documental", "Contrato terapêutico", "Termo de consentimento"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5" style={{ color: C.success }} />
              <span style={{ fontFamily: font.body, color: C.text, fontSize: 12 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, bottom: 22, height: 104, background: C.paperMuted, border: `1px solid ${C.border}`, borderRadius: "8px 8px 18px 18px", boxShadow: "0 14px 28px rgba(17,17,17,0.09)" }}>
        <div style={{ position: "absolute", top: -34, left: -1, width: 164, height: 46, background: C.paperMuted, border: `1px solid ${C.border}`, borderBottom: "none", borderRadius: "12px 12px 0 0" }} />
        <div style={{ position: "absolute", inset: 0, borderTop: `4px solid ${C.accent}`, borderRadius: "8px 8px 18px 18px" }} />
      </div>
      <div className="absolute bottom-3 right-4 flex flex-wrap justify-end gap-2">
        {["PDF", "Editável", "Gratuito"].map((seal) => (
          <span key={seal} className="rounded-full px-3 py-1 text-xs font-bold" style={{ fontFamily: font.body, color: C.accentText, background: C.accentSoft, border: "1px solid #C4B5FD" }}>
            {seal}
          </span>
        ))}
      </div>
    </div>
  );
}

function KitHero({ onFormClick }: { onFormClick: () => void }) {
  const bullets = ["Modelos editáveis", "Linguagem clara", "Organização por paciente", "Pronto para adaptar à sua rotina"];
  return (
    <section className="px-6 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6"><PaperBadge><Sparkles className="h-3 w-3" />KIT GRATUITO</PaperBadge></div>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl" style={{ fontFamily: font.display, color: C.text }}>
            Baixe grátis o Kit Documental para <span style={{ color: C.accent }}>Psicólogas Clínicas</span>
          </h1>
          <p className="mb-7 text-lg leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
            Receba um checklist e modelos essenciais para organizar contratos, termos, recibos e declarações da sua rotina clínica.
          </p>
          <div className="mb-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: C.accentSoft }}>
                  <Check className="h-3.5 w-3.5" style={{ color: C.accentText }} />
                </span>
                <span style={{ fontFamily: font.body, color: C.text, fontSize: 14, fontWeight: 600 }}>{bullet}</span>
              </div>
            ))}
          </div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <BtnPrimary onClick={onFormClick}>Quero receber o kit gratuito <ArrowRight className="h-4 w-4" /></BtnPrimary>
            <BtnSecondary href="/">Conhecer o DocusPsi</BtnSecondary>
          </div>
          <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13 }}>
            Material gratuito para apoio administrativo. Revise os documentos antes de usar.
          </p>
        </div>
        <KitMockup />
      </div>
    </section>
  );
}

function KitContentsSection() {
  const items = [
    { icon: <ClipboardCheck className="h-5 w-5" />, title: "Checklist documental", text: "Uma lista simples para revisar quais documentos você já tem e quais ainda precisa organizar." },
    { icon: <FilePen className="h-5 w-5" />, title: "Modelo de contrato terapêutico", text: "Estrutura inicial para formalizar combinados como modalidade, valores, cancelamentos e sigilo." },
    { icon: <FileCheck className="h-5 w-5" />, title: "Modelo de termo de consentimento", text: "Modelo base para registrar ciência e consentimento sobre o atendimento psicológico." },
    { icon: <Receipt className="h-5 w-5" />, title: "Modelo de recibo", text: "Modelo simples para organizar comprovantes de pagamento dos atendimentos." },
    { icon: <FileText className="h-5 w-5" />, title: "Modelo de declaração de comparecimento", text: "Estrutura objetiva para comprovar data e horário de comparecimento." },
    { icon: <FolderOpen className="h-5 w-5" />, title: "Guia rápido de organização", text: "Sugestão prática para separar documentos por paciente sem se perder em pastas e arquivos soltos." },
  ];
  return (
    <SectionWrap muted>
      <SectionHead title="O que você vai receber" sub="Um ponto de partida para organizar documentos essenciais da prática clínica." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PaperCard key={item.title}>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: C.accentSoft, color: C.accentText }}>{item.icon}</div>
            <h3 className="mb-2 text-base font-bold" style={{ fontFamily: font.display, color: C.text }}>{item.title}</h3>
            <p className="text-sm leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>{item.text}</p>
          </PaperCard>
        ))}
      </div>
    </SectionWrap>
  );
}

function KitAudienceSection() {
  const cards = [
    { icon: <Sparkles className="h-5 w-5" />, title: "Você está começando a atender particular" },
    { icon: <FileText className="h-5 w-5" />, title: "Você ainda usa Word ou Google Docs para documentos" },
    { icon: <Receipt className="h-5 w-5" />, title: "Você emite recibos ou declarações manualmente" },
    { icon: <MonitorCheck className="h-5 w-5" />, title: "Você atende online e quer organizar seus termos" },
    { icon: <BadgeCheck className="h-5 w-5" />, title: "Você quer padronizar seus documentos" },
    { icon: <HeartHandshake className="h-5 w-5" />, title: "Você quer transmitir mais organização no consultório" },
  ];
  return (
    <SectionWrap>
      <SectionHead title="Este kit é para você se..." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <PaperCard key={card.title} className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: C.accentSoft, color: C.accentText }}>{card.icon}</div>
            <p className="text-sm font-semibold leading-relaxed" style={{ fontFamily: font.body, color: C.text }}>{card.title}</p>
          </PaperCard>
        ))}
      </div>
    </SectionWrap>
  );
}

function KitWhySection() {
  const before = ["Arquivos soltos", "Modelos antigos", "Dados trocados manualmente", "Documentos espalhados no Drive ou WhatsApp"];
  const after = ["Checklist claro", "Modelos base organizados", "Rotina mais padronizada", "Próximo passo para gerar tudo pelo DocusPsi"];
  return (
    <SectionWrap muted>
      <SectionHead
        title="Por que organizar seus documentos desde o início?"
        sub="Documentos bem organizados ajudam a reduzir retrabalho, manter padrão visual e encontrar rapidamente o que foi emitido para cada paciente."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PaperCard>
          <h3 className="mb-5 text-lg font-bold" style={{ fontFamily: font.display, color: C.text }}>Antes</h3>
          <div className="space-y-3">
            {before.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.warning }} />
                <span className="text-sm" style={{ fontFamily: font.body, color: C.textMuted }}>{item}</span>
              </div>
            ))}
          </div>
        </PaperCard>
        <PaperCard style={{ border: `2px solid ${C.accent}` }}>
          <h3 className="mb-5 text-lg font-bold" style={{ fontFamily: font.display, color: C.text }}>Depois</h3>
          <div className="space-y-3">
            {after.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Check className="h-4 w-4" style={{ color: C.success }} />
                <span className="text-sm font-medium" style={{ fontFamily: font.body, color: C.text }}>{item}</span>
              </div>
            ))}
          </div>
        </PaperCard>
      </div>
    </SectionWrap>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium" style={{ fontFamily: font.body, color: C.danger }}>{message}</p>;
}

function mapKitSource(value: string) {
  const map: Record<string, string> = {
    INSTAGRAM: "INSTAGRAM",
    TIKTOK: "TIKTOK",
    REFERRAL: "REFERRAL",
    GOOGLE: "GOOGLE",
    OTHER: "OTHER",
    Instagram: "INSTAGRAM",
    TikTok: "TIKTOK",
    Indicação: "REFERRAL",
    Google: "GOOGLE",
    Outro: "OTHER",
  };
  return map[value] || "OTHER";
}

function mapProfessionStage(value: string) {
  const map: Record<string, string> = {
    NOT_ATTENDING: "NOT_ATTENDING",
    UP_TO_10_PATIENTS: "UP_TO_10_PATIENTS",
    MORE_THAN_10_PATIENTS: "MORE_THAN_10_PATIENTS",
    CLINIC_TEAM: "CLINIC_TEAM",
    "Ainda não": "NOT_ATTENDING",
    "Ainda não atendo": "NOT_ATTENDING",
    "Sim, até 10 pacientes": "UP_TO_10_PATIENTS",
    "Atendo até 10 pacientes": "UP_TO_10_PATIENTS",
    "Sim, mais de 10 pacientes": "MORE_THAN_10_PATIENTS",
    "Atendo mais de 10 pacientes": "MORE_THAN_10_PATIENTS",
    "Tenho clínica/equipe": "CLINIC_TEAM",
  };
  return map[value] || "NOT_ATTENDING";
}

function mapMainPain(value: string) {
  const map: Record<string, string> = {
    CONTRACT: "CONTRACT",
    CONSENT_TERM: "CONSENT_TERM",
    RECEIPT: "RECEIPT",
    DECLARATION: "DECLARATION",
    PATIENT_ORGANIZATION: "PATIENT_ORGANIZATION",
    OTHER: "OTHER",
    "Contrato terapêutico": "CONTRACT",
    "Termo de consentimento": "CONSENT_TERM",
    Recibo: "RECEIPT",
    "Declaração de comparecimento": "DECLARATION",
    ONLINE_TERM: "OTHER",
    MINOR_AUTHORIZATION: "OTHER",
    "Termo online": "OTHER",
    "Autorização para menor": "OTHER",
    "Organização por paciente": "PATIENT_ORGANIZATION",
    Outro: "OTHER",
  };
  return map[value] || "OTHER";
}

type SelectOption = { label: string; value: string };
type KitFieldConfig = {
  name?: string;
  key?: string;
  label?: string;
  placeholder?: string;
  options?: Array<SelectOption | string>;
};

const fallbackStageOptions: SelectOption[] = [
  { label: "Ainda não atendo", value: "NOT_ATTENDING" },
  { label: "Atendo até 10 pacientes", value: "UP_TO_10_PATIENTS" },
  { label: "Atendo mais de 10 pacientes", value: "MORE_THAN_10_PATIENTS" },
  { label: "Tenho clínica/equipe", value: "CLINIC_TEAM" },
];

const fallbackMainPainOptions: SelectOption[] = [
  { label: "Contrato terapêutico", value: "CONTRACT" },
  { label: "Termo de consentimento", value: "CONSENT_TERM" },
  { label: "Recibo", value: "RECEIPT" },
  { label: "Declaração de comparecimento", value: "DECLARATION" },
  { label: "Termo online", value: "ONLINE_TERM" },
  { label: "Autorização para menor", value: "MINOR_AUTHORIZATION" },
  { label: "Organização por paciente", value: "PATIENT_ORGANIZATION" },
  { label: "Outro", value: "OTHER" },
];

const fallbackSourceOptions: SelectOption[] = [
  { label: "Instagram", value: "INSTAGRAM" },
  { label: "TikTok", value: "TIKTOK" },
  { label: "Indicação", value: "REFERRAL" },
  { label: "Google", value: "GOOGLE" },
  { label: "Outro", value: "OTHER" },
];

const kitOptionLabels: Record<string, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  REFERRAL: "Indicação",
  GOOGLE: "Google",
  OTHER: "Outro",
  NOT_ATTENDING: "Ainda não atendo",
  UP_TO_10_PATIENTS: "Atendo até 10 pacientes",
  MORE_THAN_10_PATIENTS: "Atendo mais de 10 pacientes",
  CLINIC_TEAM: "Tenho clínica/equipe",
  CONTRACT: "Contrato terapêutico",
  CONSENT_TERM: "Termo de consentimento",
  RECEIPT: "Recibo",
  DECLARATION: "Declaração de comparecimento",
  ONLINE_TERM: "Termo online",
  MINOR_AUTHORIZATION: "Autorização para menor",
  PATIENT_ORGANIZATION: "Organização por paciente",
};

function getKitOptionLabel(value: string, label?: string) {
  return kitOptionLabels[value] || (label && kitOptionLabels[label]) || label || value;
}

function normalizeOptions(options: KitFieldConfig["options"] | undefined, fallback: SelectOption[]) {
  if (!options?.length) return fallback;
  return options.map((option) => {
    if (typeof option === "string") return { label: getKitOptionLabel(option), value: option };
    const value = option.value || option.label;
    return { label: getKitOptionLabel(value, option.label), value };
  });
}

function resolveKitDownloadUrl(downloadUrl: string) {
  if (/^https?:\/\//i.test(downloadUrl)) return downloadUrl;
  const apiBaseUrl = getApiBaseUrl();
  if (/^https?:\/\//i.test(apiBaseUrl)) {
    const base = new URL(apiBaseUrl);
    if (downloadUrl.startsWith("/api/") && base.pathname.replace(/\/$/, "").endsWith("/api")) {
      return `${base.origin}${downloadUrl}`;
    }
    return `${apiBaseUrl}${downloadUrl.startsWith("/") ? downloadUrl : `/${downloadUrl}`}`;
  }
  return downloadUrl;
}

function KitLeadForm() {
  const [, setLocation] = useLocation();
  const { data: kitForm } = useGetKitForm({ query: { retry: false } });
  const createLead = useCreateLead();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    whatsapp: "",
    stage: "",
    hardestDocument: "",
    source: "",
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const fields = (kitForm?.fields || []) as KitFieldConfig[];
  const getField = (...names: string[]) => fields.find((field) => names.includes(field.name || "") || names.includes(field.key || ""));
  const stageField = getField("professionStage", "stage");
  const mainPainField = getField("mainPain", "hardestDocument");
  const sourceField = getField("source");
  const stageOptions = normalizeOptions(stageField?.options, fallbackStageOptions);
  const mainPainOptions = normalizeOptions(mainPainField?.options, fallbackMainPainOptions);
  const sourceOptions = normalizeOptions(sourceField?.options, fallbackSourceOptions);
  const submitButtonText = kitForm?.buttonText || kitForm?.submitButtonText || "Receber kit gratuito";

  const setValue = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Informe seu nome.";
    if (!form.email.trim()) next.email = "Informe seu e-mail.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Informe um e-mail válido.";
    if (!form.whatsapp.trim()) next.whatsapp = "Informe seu WhatsApp.";
    if (!form.stage) next.stage = "Selecione uma opção.";
    if (!form.hardestDocument) next.hardestDocument = "Selecione uma opção.";
    if (!form.source) next.source = "Selecione uma origem.";
    if (!form.consent) next.consent = "Você precisa aceitar para continuar.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await createLead.mutateAsync({
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.whatsapp.trim(),
          source: mapKitSource(form.source),
          professionStage: mapProfessionStage(form.stage),
          mainPain: mapMainPain(form.hardestDocument),
          consent: form.consent,
        },
      });
      if (response.downloadUrl) {
        window.location.href = resolveKitDownloadUrl(response.downloadUrl);
      }
      window.setTimeout(() => setLocation("/obrigado-kit"), response.downloadUrl ? 900 : 0);
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status === 404 || status === 405) {
        window.setTimeout(() => setLocation("/obrigado-kit"), 500);
        return;
      }
      setErrors((current) => ({
        ...current,
        submit: "Não foi possível registrar seu interesse agora. Tente novamente em alguns instantes.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]";
  const labelStyle = { fontFamily: font.body, color: C.text, fontSize: 13, fontWeight: 700 } as React.CSSProperties;
  const selectTriggerClass = "mt-2 h-auto min-h-[46px] rounded-xl px-4 py-3 text-sm shadow-none focus:ring-2 focus:ring-[#8B5CF6]";

  function KitSelectField({
    label,
    value,
    onChange,
    options,
    error,
    placeholder = "Selecione",
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
  }) {
    return (
      <div>
        <span style={labelStyle}>{label}</span>
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger
            className={selectTriggerClass}
            style={{
              borderColor: error ? C.danger : C.border,
              background: C.paper,
              color: C.text,
              fontFamily: font.body,
            }}
            aria-invalid={Boolean(error)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className="rounded-xl border p-1 shadow-lg"
            style={{ borderColor: C.border, background: C.paper, color: C.text, fontFamily: font.body }}
          >
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-lg py-2.5 text-sm focus:bg-[#EDE9FE] focus:text-[#6D28D9]"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={error} />
      </div>
    );
  }

  return (
    <SectionWrap id="formulario">
      <div className="mx-auto max-w-3xl">
        <PaperCard style={{ padding: 0, overflow: "hidden", border: `2px solid ${C.accent}` }}>
          <div className="px-6 py-6 md:px-8" style={{ background: C.accentSoft, borderBottom: `1px solid ${C.border}` }}>
            <PaperBadge><Mail className="h-3 w-3" />Lista de interesse</PaperBadge>
            <h2 className="mt-4 text-3xl font-bold" style={{ fontFamily: font.display, color: C.text }}>Receba o kit gratuito</h2>
            <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ fontFamily: font.body, color: C.textMuted }}>
              Preencha seus dados para liberar o download do Kit Documental para Psicólogas Clínicas.
            </p>
          </div>
          <form className="grid gap-5 px-6 py-6 md:px-8" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label style={labelStyle}>
                Nome
                <input
                  value={form.name}
                  onChange={(event) => setValue("name", event.target.value)}
                  className={inputBase}
                  style={{ borderColor: errors.name ? C.danger : C.border, background: C.paper }}
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                />
                <FieldError message={errors.name} />
              </label>
              <label style={labelStyle}>
                E-mail
                <input
                  value={form.email}
                  onChange={(event) => setValue("email", event.target.value)}
                  className={inputBase}
                  style={{ borderColor: errors.email ? C.danger : C.border, background: C.paper }}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  inputMode="email"
                />
                <FieldError message={errors.email} />
              </label>
            </div>
            <label style={labelStyle}>
              WhatsApp
              <input
                value={form.whatsapp}
                onChange={(event) => setValue("whatsapp", maskPhone(event.target.value))}
                className={inputBase}
                style={{ borderColor: errors.whatsapp ? C.danger : C.border, background: C.paper }}
                aria-invalid={Boolean(errors.whatsapp)}
                autoComplete="tel"
                inputMode="tel"
              />
              <FieldError message={errors.whatsapp} />
            </label>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <KitSelectField
                label="Você já atende pacientes?"
                value={form.stage}
                onChange={(value) => setValue("stage", value)}
                options={stageOptions}
                error={errors.stage}
              />
              <KitSelectField
                label="Qual documento mais te dá trabalho?"
                value={form.hardestDocument}
                onChange={(value) => setValue("hardestDocument", value)}
                options={mainPainOptions}
                error={errors.hardestDocument}
              />
              <KitSelectField
                label="Origem"
                value={form.source}
                onChange={(value) => setValue("source", value)}
                options={sourceOptions}
                error={errors.source}
              />
            </div>
            <label className="flex items-start gap-3 rounded-xl p-4" style={{ background: C.paperMuted, border: `1px solid ${errors.consent ? C.danger : C.border}`, fontFamily: font.body, color: C.text }}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => setValue("consent", event.target.checked)}
                className="mt-1 h-4 w-4 rounded border"
                aria-invalid={Boolean(errors.consent)}
              />
              <span className="text-sm leading-relaxed">Aceito receber o kit gratuito e comunicações sobre o DocusPsi por e-mail ou WhatsApp.</span>
            </label>
            <FieldError message={errors.consent} />
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <BtnPrimary type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {loading ? "Liberando download..." : submitButtonText}
              </BtnPrimary>
              <p className="text-xs leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
                Após o envio, o download será iniciado pelo link seguro retornado pela API.
              </p>
            </div>
            <FieldError message={errors.submit} />
          </form>
        </PaperCard>
      </div>
    </SectionWrap>
  );
}

function KitHowToUseSection() {
  const steps = ["Baixe o material", "Leia o checklist", "Adapte os modelos à sua realidade", "Revise antes de emitir", "Organize por paciente"];
  return (
    <SectionWrap muted>
      <SectionHead title="Como usar o kit na sua rotina" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
        {steps.map((step, index) => (
          <PaperCard key={step}>
            <div className="mb-3" style={{ fontFamily: font.mono, color: C.border, fontWeight: 800, fontSize: 28 }}>{String(index + 1).padStart(2, "0")}</div>
            <h3 className="text-sm font-bold leading-snug" style={{ fontFamily: font.display, color: C.text }}>{step}</h3>
          </PaperCard>
        ))}
      </div>
      <div className="mt-8 rounded-2xl px-5 py-4 text-center" style={{ background: C.paper, border: `1px solid ${C.border}` }}>
        <p className="text-sm leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
          Os modelos são sugestões estruturadas para apoio administrativo. A responsabilidade pelo conteúdo final é da(o) profissional.
        </p>
      </div>
    </SectionWrap>
  );
}

function KitBridgeSection() {
  const benefits = [
    { icon: <FilePen className="h-5 w-5" />, text: "Modelos guiados" },
    { icon: <BadgeCheck className="h-5 w-5" />, text: "Cabeçalho personalizado" },
    { icon: <FolderOpen className="h-5 w-5" />, text: "Histórico por paciente" },
    { icon: <UserCheck className="h-5 w-5" />, text: "Aceite simples por link" },
  ];
  return (
    <SectionWrap>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <PaperBadge><Sparkles className="h-3 w-3" />Próximo passo</PaperBadge>
          <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl" style={{ fontFamily: font.display, color: C.text }}>
            Quer gerar esses documentos automaticamente?
          </h2>
          <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ fontFamily: font.body, color: C.textMuted }}>
            Com o DocusPsi, você escolhe um modelo, preenche campos guiados, visualiza a folha A4 e baixa o PDF com seus dados profissionais.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <BtnPrimary href="/">Conhecer o DocusPsi</BtnPrimary>
            <BtnSecondary href="/register">Criar minha conta</BtnSecondary>
          </div>
        </div>
        <PaperCard>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-3 rounded-xl p-4" style={{ background: C.paperMuted, border: `1px solid ${C.border}` }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: C.accentSoft, color: C.accentText }}>{benefit.icon}</div>
                <span className="text-sm font-bold" style={{ fontFamily: font.body, color: C.text }}>{benefit.text}</span>
              </div>
            ))}
          </div>
        </PaperCard>
      </div>
    </SectionWrap>
  );
}

function KitFAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: "O kit é gratuito?", a: "Sim. O kit é gratuito e serve como material inicial de apoio para organização documental." },
    { q: "Os modelos já estão prontos para usar?", a: "Eles são modelos base e editáveis. Revise e adapte antes de emitir qualquer documento." },
    { q: "O kit substitui orientação jurídica, ética ou profissional?", a: "Não. O kit oferece sugestões estruturadas para apoio administrativo. A responsabilidade pelo conteúdo final é da(o) profissional." },
    { q: "Como recebo o arquivo do kit?", a: "Depois do envio do formulário, o DocusPsi usa o link de download retornado pela API para iniciar o download do arquivo ZIP no navegador." },
    { q: "Qual a diferença entre o kit e o DocusPsi?", a: "O kit entrega modelos base para edição manual. O DocusPsi transforma isso em um fluxo guiado para gerar documentos em PDF, com cabeçalho personalizado, histórico por paciente e aceite por link." },
  ];
  return (
    <SectionWrap muted>
      <SectionHead title="Perguntas frequentes" />
      <div className="mx-auto max-w-2xl space-y-3">
        {items.map((item, index) => (
          <PaperCard key={item.q} style={{ padding: 0 }}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
              aria-expanded={open === index}
              aria-controls={`kit-faq-${index}`}
              onClick={() => setOpen(open === index ? -1 : index)}
            >
              <span className="text-sm font-bold" style={{ fontFamily: font.display, color: C.text }}>{item.q}</span>
              {open === index ? <ChevronUp className="h-4 w-4 shrink-0" style={{ color: C.accent }} /> : <ChevronDown className="h-4 w-4 shrink-0" style={{ color: C.textMuted }} />}
            </button>
            {open === index && (
              <div id={`kit-faq-${index}`} className="px-5 pb-5 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <p className="text-sm leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>{item.a}</p>
              </div>
            )}
          </PaperCard>
        ))}
      </div>
    </SectionWrap>
  );
}

function KitResponsibleNotice() {
  return (
    <SectionWrap>
      <div className="mx-auto max-w-4xl rounded-2xl p-5" style={{ background: C.paper, border: `1px solid ${C.border}` }}>
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0" style={{ color: C.warning }} />
          <p className="text-sm leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
            <strong style={{ color: C.text }}>Aviso:</strong> o Kit Documental para Psicólogas Clínicas é um material de apoio administrativo. Ele não substitui orientação jurídica, ética, técnica ou profissional. Revise todos os documentos antes de usar.
          </p>
        </div>
      </div>
    </SectionWrap>
  );
}

function KitFooter() {
  return (
    <footer className="px-6 py-10" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <DocusPsiLogoImage variant="horizontal" className="h-10 w-40" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
            Documentos profissionais para psicólogas(os), com modelos guiados, PDF e organização por paciente.
          </p>
        </div>
        <div className="md:text-right">
          <div className="flex flex-wrap gap-4 md:justify-end">
            {[
              { label: "Conhecer o DocusPsi", href: "/" },
              { label: "Kit gratuito", href: "/kit-documental" },
              { label: "Entrar", href: "/login" },
              { label: "Criar conta", href: "/register" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]" style={{ fontFamily: font.body, color: C.textMuted }}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
            DocusPsi é uma ferramenta de apoio administrativo. Revise os documentos antes de emitir.
          </p>
        </div>
      </div>
    </footer>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: C.bg,
        backgroundImage: "radial-gradient(rgba(17,17,17,0.035) 1px, transparent 1px)",
        backgroundSize: "6px 6px",
      }}
    >
      {children}
    </div>
  );
}

function BioLinkButton({ href, icon, title, description, primary = false }: { href: string; icon: React.ReactNode; title: string; description: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className="group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 active:scale-[0.99]"
      style={{
        background: primary ? C.primary : C.paper,
        color: primary ? "#FFFFFF" : C.text,
        border: primary ? `1px solid ${C.primary}` : `1px solid ${C.border}`,
        boxShadow: primary ? "0 10px 24px rgba(17,17,17,0.14)" : "0 1px 4px rgba(17,17,17,0.06)",
      }}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: primary ? C.accent : C.accentSoft,
          color: primary ? "#FFFFFF" : C.accentText,
          border: primary ? "1px solid rgba(255,255,255,0.18)" : "1px solid #C4B5FD",
        }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold" style={{ fontFamily: font.display }}>{title}</span>
        <span className="mt-1 block text-xs leading-relaxed" style={{ fontFamily: font.body, color: primary ? "rgba(255,255,255,0.74)" : C.textMuted }}>{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function BioLinksPage() {
  useEffect(() => {
    document.title = "Links úteis | DocusPsi";
  }, []);

  const trust = [
    { icon: <FilePen className="h-4 w-4" />, text: "Modelos editáveis" },
    { icon: <FileCheck className="h-4 w-4" />, text: "PDF profissional" },
    { icon: <FolderOpen className="h-4 w-4" />, text: "Organização por paciente" },
  ];

  return (
    <PageShell>
      <main className="flex min-h-screen items-center justify-center px-5 py-8">
        <div className="w-full max-w-[460px]">
          <PaperCard style={{ padding: 22 }}>
            <div className="mb-6 flex justify-center">
              <DocusPsiLogoImage variant="vertical" className="h-28 w-36" />
            </div>
            <div className="text-center">
              <PaperBadge>DOCUMENTOS PARA PSICÓLOGAS(OS)</PaperBadge>
              <h1 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl" style={{ fontFamily: font.display, color: C.text }}>
                Organize seus documentos clínicos com mais profissionalismo
              </h1>
              <p className="mt-3 text-sm leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
                Acesse o kit gratuito, conheça o DocusPsi ou crie sua conta para gerar documentos em PDF com modelos guiados.
              </p>
            </div>

            <div className="mt-7 grid gap-3">
              <BioLinkButton
                href="/kit-documental"
                primary
                icon={<Download className="h-5 w-5" />}
                title="Baixar Kit Documental gratuito"
                description="Checklist e modelos essenciais para psicólogas clínicas."
              />
              <BioLinkButton
                href="/"
                icon={<FileText className="h-5 w-5" />}
                title="Conhecer o DocusPsi"
                description="Veja como gerar contratos, termos e recibos em PDF."
              />
              <BioLinkButton
                href="/register"
                icon={<UserCheck className="h-5 w-5" />}
                title="Criar minha conta"
                description="Comece a testar os modelos guiados."
              />
              <BioLinkButton
                href="/login"
                icon={<Mail className="h-5 w-5" />}
                title="Entrar"
                description="Já tem acesso? Entre na sua conta."
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {trust.map((item) => (
                <div key={item.text} className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2" style={{ background: C.paperMuted, border: `1px solid ${C.border}` }}>
                  <span style={{ color: C.accentText }}>{item.icon}</span>
                  <span className="text-[11px] font-semibold" style={{ fontFamily: font.body, color: C.text }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl p-4" style={{ background: C.paperMuted, border: `1px solid ${C.border}` }}>
              <p className="text-center text-xs leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
                O DocusPsi é uma ferramenta de apoio administrativo. Revise todos os documentos antes de emitir.
              </p>
            </div>
          </PaperCard>

          <footer className="mt-5 text-center">
            <p className="text-xs" style={{ fontFamily: font.body, color: C.textMuted }}>© 2026 DocusPsi</p>
            <div className="mt-2 flex justify-center gap-4">
              <Link href="/privacidade" className="text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]" style={{ fontFamily: font.body, color: C.textMuted }}>Privacidade</Link>
              <Link href="/termos" className="text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]" style={{ fontFamily: font.body, color: C.textMuted }}>Termos</Link>
            </div>
          </footer>
        </div>
      </main>
    </PageShell>
  );
}

function MiniDocumentMockup() {
  return (
    <div
      className="relative mx-auto w-full max-w-[300px] rounded-xl p-5"
      style={{
        background: C.paper,
        border: `1px solid ${C.border}`,
        boxShadow: "0 12px 28px rgba(17,17,17,0.10)",
        backgroundImage: "linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px)",
        backgroundSize: "100% 30px",
      }}
      aria-label="Prévia visual de documento DocusPsi"
    >
      <div className="mb-4 flex items-start justify-between gap-3" style={{ borderBottom: `2px solid ${C.accent}`, paddingBottom: 12 }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold" style={{ background: C.accentSoft, color: C.accentText, border: "1px solid #C4B5FD" }}>
            AL
          </div>
          <div>
            <div className="text-xs font-bold" style={{ fontFamily: font.body, color: C.text }}>Ana Lima</div>
            <div className="text-[10px]" style={{ fontFamily: font.body, color: C.textMuted }}>CRP 06/123456</div>
          </div>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ fontFamily: font.body, color: C.accentText, background: C.accentSoft, border: "1px solid #C4B5FD" }}>
          CONTRATO
        </span>
      </div>
      <div className="mb-4 rounded-lg p-3" style={{ background: C.paperMuted, border: `1px solid ${C.border}` }}>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ fontFamily: font.body, color: C.text }}>Identificação</div>
        <div className="text-[11px]" style={{ fontFamily: font.body, color: C.textMuted }}><strong style={{ color: C.text }}>Paciente:</strong> Mariana Souza</div>
      </div>
      {[100, 86, 94, 72, 88].map((width) => (
        <div key={width} className="mb-2 h-1.5 rounded-full" style={{ width: `${width}%`, background: "#E7E0D2" }} />
      ))}
      <div className="mt-5 flex justify-end">
        <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold" style={{ fontFamily: font.body, color: C.success, background: C.successSoft, border: "1px solid #86EFAC" }}>
          <Check className="h-3 w-3" /> PDF pronto
        </span>
      </div>
    </div>
  );
}

export function KitThankYouPage() {
  useEffect(() => {
    document.title = "Interesse registrado | DocusPsi";
  }, []);

  return (
    <PageShell>
      <KitLandingHeader />
      <main>
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <PaperCard className="text-center" style={{ padding: "42px 28px", border: `2px solid ${C.accent}` }}>
              <div className="mb-6 flex justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: C.accentSoft, color: C.accentText, border: `1px solid ${C.border}` }}>
                  <Check className="h-7 w-7" />
                </span>
              </div>
              <PaperBadge><Mail className="h-3 w-3" />INTERESSE REGISTRADO</PaperBadge>
              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl" style={{ fontFamily: font.display, color: C.text }}>
                Seu interesse no Kit Documental foi registrado
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
                Obrigado! Se o cadastro foi concluído com sucesso, o download do Kit Documental para Psicólogas Clínicas foi iniciado no seu navegador.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
                Enquanto isso, você pode conhecer o DocusPsi e ver como transformar modelos manuais em documentos profissionais em PDF.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <BtnPrimary href="/">Conhecer o DocusPsi</BtnPrimary>
                <BtnSecondary href="/register">Criar minha conta</BtnSecondary>
                <BtnSecondary href="/kit-documental">Voltar para o kit</BtnSecondary>
              </div>
            </PaperCard>
          </div>
        </section>
        <SectionWrap muted>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <PaperBadge><Sparkles className="h-3 w-3" />Próximo passo</PaperBadge>
              <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl" style={{ fontFamily: font.display, color: C.text }}>Quer deixar de editar modelos manualmente?</h2>
              <p className="mt-4 text-base leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
                No DocusPsi, você escolhe um modelo, preenche campos guiados e gera documentos em PDF com cabeçalho personalizado, histórico por paciente e aceite simples por link.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "Modelos guiados",
                  "Cabeçalho e rodapé personalizados",
                  "Histórico por paciente",
                  "Download em PDF",
                  "Aceite simples por link",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 rounded-xl p-3" style={{ background: C.paper, border: `1px solid ${C.border}` }}>
                    <Check className="h-4 w-4 shrink-0" style={{ color: C.success }} />
                    <span className="text-sm font-semibold" style={{ fontFamily: font.body, color: C.text }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7">
                <BtnPrimary href="/#como-funciona">Ver como funciona <ArrowRight className="h-4 w-4" /></BtnPrimary>
              </div>
            </div>
            <MiniDocumentMockup />
          </div>
        </SectionWrap>
        <SectionWrap>
          <div className="mx-auto max-w-4xl rounded-2xl p-5" style={{ background: C.paper, border: `1px solid ${C.border}` }}>
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0" style={{ color: C.warning }} />
              <p className="text-sm leading-relaxed" style={{ fontFamily: font.body, color: C.textMuted }}>
                O Kit Documental e o DocusPsi são recursos de apoio administrativo. A responsabilidade pelo conteúdo final dos documentos é sempre da(o) profissional.
              </p>
            </div>
          </div>
        </SectionWrap>
      </main>
      <KitFooter />
    </PageShell>
  );
}

export default function KitLanding() {
  useEffect(() => {
    document.title = "Kit Documental gratuito para Psicólogas Clínicas | DocusPsi";
  }, []);

  const formRef = useRef<HTMLDivElement | null>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <PageShell>
      <KitLandingHeader />
      <main>
        <KitHero onFormClick={scrollToForm} />
        <KitContentsSection />
        <KitAudienceSection />
        <KitWhySection />
        <div ref={formRef}>
          <KitLeadForm />
        </div>
        <KitHowToUseSection />
        <KitBridgeSection />
        <KitFAQ />
        <KitResponsibleNotice />
      </main>
      <KitFooter />
    </PageShell>
  );
}
