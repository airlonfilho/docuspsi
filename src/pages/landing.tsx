import { useState } from "react";
import { Link } from "wouter";
import { DocusPsiLogoImage } from "@/components/docuspsi-logo";
import { useListPlans, type Plan } from "@workspace/api-client-react";
import {
  FileText, FileSignature, Receipt, FileHeart, FilePen,
  Check, ChevronDown, ChevronUp, Menu, X, Download,
  Shield, Users, Clock, Layers, Star, ArrowRight,
  Lock, BookOpen, Sparkles, FileCheck, ClipboardCheck,
  FolderOpen, MonitorCheck, Settings2, BadgeCheck,
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────────────────
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

// ─── Shared UI ────────────────────────────────────────────────────────────────
function PaperBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{ background: C.accentSoft, color: C.accentText, border: `1px solid ${C.border}`, fontFamily: font.body }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
    >
      {children}
    </span>
  );
}

function BtnPrimary({ href, children, onClick, small }: { href?: string; children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  const cls = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer ${small ? "px-4 py-2 text-sm" : "px-6 py-3 text-sm"}`;
  const s = { background: C.primary, color: "#fff", fontFamily: font.body, focusVisibleRingColor: C.accent } as React.CSSProperties;
  if (href) return <Link href={href} className={cls} style={s}>{children}</Link>;
  return <button className={cls} style={s} onClick={onClick}>{children}</button>;
}

function BtnSecondary({ href, children, onClick, small }: { href?: string; children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  const cls = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer ${small ? "px-4 py-2 text-sm" : "px-6 py-3 text-sm"}`;
  const s = { background: C.paperMuted, color: C.text, border: `1px solid ${C.border}`, fontFamily: font.body } as React.CSSProperties;
  if (href) return <Link href={href} className={cls} style={s}>{children}</Link>;
  return <button className={cls} style={s} onClick={onClick}>{children}</button>;
}

function SectionWrap({ id, children, muted }: { id?: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <section
      id={id}
      className="py-20 md:py-28 px-6"
      style={{ background: muted ? C.paperMuted : "transparent" }}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

function SectionHead({ badge, title, sub }: { badge?: string; title: string; sub?: string }) {
  return (
    <div className="text-center mb-14">
      {badge && <div className="flex justify-center mb-4"><PaperBadge>{badge}</PaperBadge></div>}
      <h2 style={{ fontFamily: font.display, color: C.text }} className="text-3xl md:text-4xl font-bold leading-tight mb-4">
        {title}
      </h2>
      {sub && <p style={{ fontFamily: font.body, color: C.textMuted }} className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{sub}</p>}
    </div>
  );
}

function PaperCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: C.paper, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(17,17,17,0.06)", padding: "24px", ...style }}
    >
      {children}
    </div>
  );
}

// ─── 1. Header ────────────────────────────────────────────────────────────────
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: "Kit gratuito", href: "/kit-documental" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Modelos", href: "#modelos" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Preços", href: "#precos" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "rgba(255, 255, 255, 0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}` }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-xl">
          <DocusPsiLogoImage variant="horizontal" className="h-10 w-40" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{ fontFamily: font.body, color: C.textMuted, fontSize: 14, fontWeight: 500 }} className="hover:text-[#111827] transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" style={{ fontFamily: font.body, color: C.textMuted, fontSize: 14, fontWeight: 500 }} className="hover:text-[#111827] transition-colors px-3 py-1.5">
            Entrar
          </Link>
          <BtnPrimary href="/register" small>Começar agora</BtnPrimary>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: C.text }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: C.bg, borderTop: `1px solid ${C.border}` }} className="md:hidden px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{ fontFamily: font.body, color: C.text, fontWeight: 500 }} onClick={() => setMobileOpen(false)} className="py-1">
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t" style={{ borderColor: C.border }}>
            <BtnSecondary href="/login">Entrar</BtnSecondary>
            <BtnPrimary href="/register">Começar agora</BtnPrimary>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Document Mockup (reusable illustration) ──────────────────────────────────
function DocumentMockup({ scale = 1 }: { scale?: number }) {
  return (
    <div
      style={{
        width: 320, height: 430, background: C.paper, borderRadius: 10,
        border: `1px solid ${C.border}`, boxShadow: "0 10px 28px rgba(17,17,17,0.10)",
        padding: 24, transform: `scale(${scale})`, transformOrigin: "top center",
        fontFamily: font.body, position: "relative", overflow: "hidden",
        backgroundImage: "linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px)",
        backgroundSize: "100% 32px",
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${C.accent}`, paddingBottom: 12, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: C.accentSoft, border: `1px solid #C4B5FD`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accentText, fontWeight: 800, fontSize: 13 }}>AL</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>Ana Lima</div>
            <div style={{ fontSize: 9, color: C.textMuted }}>CRP 06/123456</div>
            <div style={{ fontSize: 9, color: C.textMuted }}>Consultório Ana Lima</div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 9, color: C.textMuted, lineHeight: 1.6 }}>
          <div>demo@docuspsi.com</div>
          <div>(11) 99999-0000</div>
          <div>São Paulo/SP</div>
        </div>
      </div>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ display: "inline-block", fontSize: 8, fontWeight: 700, color: C.accentText, background: C.accentSoft, border: "1px solid #C4B5FD", borderRadius: 999, padding: "3px 8px", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>CONTRATO TERAPÊUTICO</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Contrato Terapêutico</div>
        <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>Emitido em 02/05/2026</div>
      </div>
      {/* Info card */}
      <div style={{ background: C.paperMuted, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: C.text, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Identificação</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 9, color: C.textMuted }}>
          <div><strong style={{ color: C.text }}>Paciente:</strong> Mariana Souza</div>
          <div><strong style={{ color: C.text }}>CPF:</strong> 123.456.789-00</div>
          <div><strong style={{ color: C.text }}>Valor/sessão:</strong> R$ 200,00</div>
          <div><strong style={{ color: C.text }}>Modalidade:</strong> Presencial</div>
        </div>
      </div>
      {/* Body lines */}
      {[100, 80, 95, 60, 88, 75].map((w, i) => (
        <div key={i} style={{ height: 5, background: i % 2 === 0 ? "#E7E0D2" : "#ECE7DD", borderRadius: 3, width: `${w}%`, marginBottom: 6 }} />
      ))}
      {/* Badges */}
      <div style={{ position: "absolute", bottom: 14, right: 14, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
        <div style={{ background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: 6, padding: "3px 8px", fontSize: 8, fontWeight: 700, color: "#15803D", display: "flex", alignItems: "center", gap: 4 }}>
          <Check style={{ width: 8, height: 8 }} /> PDF pronto
        </div>
        <div style={{ background: C.accentSoft, border: `1px solid #C4B5FD`, borderRadius: 6, padding: "3px 8px", fontSize: 8, fontWeight: 700, color: C.accentText, display: "flex", alignItems: "center", gap: 4 }}>
          <FileCheck style={{ width: 8, height: 8 }} /> Aceite digital
        </div>
      </div>
    </div>
  );
}

// ─── 2. Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="mb-6"><PaperBadge><Sparkles className="h-3 w-3" />Feito para psicólogas(os) clínicos</PaperBadge></div>
            <h1 style={{ fontFamily: font.display, color: C.text, lineHeight: 1.15 }} className="text-4xl md:text-5xl font-bold mb-6">
              Crie documentos profissionais para sua prática clínica em{" "}
              <span style={{ color: C.accent }}>poucos minutos</span>
            </h1>
            <p style={{ fontFamily: font.body, color: C.textMuted, lineHeight: 1.7 }} className="text-lg mb-8">
              Gere contratos, termos, recibos e declarações em PDF, com modelos guiados, cabeçalho personalizado, aceite por link e histórico organizado por paciente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <BtnPrimary href="/register">Começar grátis <ArrowRight className="h-4 w-4" /></BtnPrimary>
              <BtnSecondary href="/kit-documental">Baixar kit gratuito</BtnSecondary>
            </div>
            <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13 }}>
              Comece com modelos essenciais para organizar sua rotina clínica.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {[
                { icon: <BadgeCheck className="h-3.5 w-3.5" />, text: "Sem cartão no início" },
                { icon: <FilePen className="h-3.5 w-3.5" />, text: "Modelos editáveis" },
                { icon: <FileCheck className="h-3.5 w-3.5" />, text: "PDF profissional" },
              ].map((item) => (
                <span key={item.text} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ fontFamily: font.body, color: C.text, background: C.paper, border: `1px solid ${C.border}` }}>
                  <span style={{ color: C.accentText }}>{item.icon}</span>{item.text}
                </span>
              ))}
            </div>
          </div>
          {/* Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div style={{ position: "relative" }}>
              <DocumentMockup />
              {/* Shadow card behind */}
              <div style={{
                position: "absolute", top: 8, left: 8, width: 320, height: 430,
                background: C.paperMuted, border: `1px solid ${C.border}`, borderRadius: 12,
                zIndex: -1,
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Free Lead Kit ───────────────────────────────────────────────────────────
function FreeKit() {
  const kitItems = [
    "Checklist documental",
    "Modelo de contrato terapêutico",
    "Modelo de termo de consentimento",
    "Modelo de recibo",
    "Modelo de declaração de comparecimento",
  ];

  return (
    <SectionWrap muted>
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <div>
          <div className="mb-5"><PaperBadge><ClipboardCheck className="h-3 w-3" />Baixe grátis o Kit Documental para Psicólogas Clínicas</PaperBadge></div>
          <h2 style={{ fontFamily: font.display, color: C.text, fontWeight: 800, lineHeight: 1.18 }} className="text-3xl md:text-4xl mb-5">
            Comece organizando seus documentos com um kit gratuito
          </h2>
          <p style={{ fontFamily: font.body, color: C.textMuted, lineHeight: 1.7 }} className="text-base md:text-lg mb-6">
            Receba um checklist e modelos essenciais para contrato terapêutico, termo de consentimento, recibo e declaração de comparecimento.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
            {kitItems.map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-xl px-3 py-2" style={{ background: C.paper, border: `1px solid ${C.border}`, fontFamily: font.body }}>
                <Check className="h-4 w-4 shrink-0" style={{ color: C.success }} />
                <span className="text-sm" style={{ color: C.text }}>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <BtnPrimary href="/kit-documental">Baixar kit gratuito <Download className="h-4 w-4" /></BtnPrimary>
            <BtnSecondary href="#como-funciona">Ver como o DocusPsi automatiza isso</BtnSecondary>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="relative h-[340px] w-full max-w-[390px]" aria-hidden="true">
            <div style={{ position: "absolute", inset: "34px 18px 0 42px", background: "#EFE7D8", border: `1px solid ${C.border}`, borderRadius: 14, transform: "rotate(-5deg)", boxShadow: "0 12px 24px rgba(17,17,17,0.07)" }} />
            <div style={{ position: "absolute", inset: "18px 40px 26px 22px", background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, transform: "rotate(4deg)", padding: 22, boxShadow: "0 12px 26px rgba(17,17,17,0.09)" }}>
              <div style={{ height: 8, width: 84, background: C.accent, borderRadius: 999, marginBottom: 18 }} />
              <div style={{ fontFamily: font.display, fontWeight: 800, color: C.text, fontSize: 22, lineHeight: 1.15 }}>Kit Documental para Psicólogas Clínicas</div>
              <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
                {[96, 74, 88, 64].map((w) => (
                  <div key={w} style={{ height: 7, width: `${w}%`, background: "#E8E0D2", borderRadius: 999 }} />
                ))}
              </div>
              <div style={{ position: "absolute", right: 18, bottom: 18, color: C.accentText, background: C.accentSoft, border: "1px solid #C4B5FD", borderRadius: 999, padding: "5px 10px", fontFamily: font.body, fontWeight: 800, fontSize: 11 }}>
                PDF + modelos
              </div>
            </div>
            <div style={{ position: "absolute", left: 22, right: 30, bottom: 10, height: 92, background: C.paperMuted, border: `1px solid ${C.border}`, borderRadius: "8px 8px 18px 18px", boxShadow: "0 10px 24px rgba(17,17,17,0.08)" }}>
              <div style={{ position: "absolute", top: -34, left: 0, width: 150, height: 48, background: C.paperMuted, border: `1px solid ${C.border}`, borderBottom: "none", borderRadius: "12px 12px 0 0" }} />
              <div style={{ position: "absolute", inset: 0, borderTop: `4px solid ${C.accent}` }} />
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── 3. Document Preview ──────────────────────────────────────────────────────
function DocumentPreview() {
  const features = ["Cabeçalho personalizado", "Dados do paciente", "Seções organizadas", "Rodapé profissional", "Download em PDF"];
  return (
    <SectionWrap muted>
      <SectionHead
        badge="Prévia real"
        title="Seu documento com aparência profissional"
        sub="Cada modelo é renderizado como uma folha A4 com cabeçalho, identificação, seções, assinaturas e rodapé personalizado."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <DocumentMockup />
        </div>
        <div className="flex flex-col gap-4">
          <div style={{ fontFamily: font.body }}>
            <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20 }}>
              O documento renderizado inclui todos os seus dados profissionais e do paciente, com layout consistente em todas as situações.
            </p>
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check style={{ width: 12, height: 12, color: C.accentText }} />
                </div>
                <span style={{ color: C.text, fontWeight: 500, fontSize: 15 }}>{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <BtnPrimary href="/register">Gerar meu primeiro documento</BtnPrimary>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── 4. Pain Points ───────────────────────────────────────────────────────────
function PainPoints() {
  const pains = [
    { icon: <Layers className="h-5 w-5" />, title: "Modelos espalhados", text: "Contratos, termos e recibos ficam em arquivos diferentes, com versões difíceis de acompanhar." },
    { icon: <Clock className="h-5 w-5" />, title: "Retrabalho manual", text: "Nomes, datas, valores e dados do paciente precisam ser ajustados a cada emissão." },
    { icon: <FolderOpen className="h-5 w-5" />, title: "Falta de histórico por paciente", text: "Depois de enviar, nem sempre fica claro qual documento foi emitido para cada pessoa." },
    { icon: <Star className="h-5 w-5" />, title: "Aparência improvisada", text: "Arquivos adaptados às pressas podem enfraquecer a percepção de organização do consultório." },
  ];
  return (
    <SectionWrap>
      <SectionHead
        title="Documentos clínicos não precisam ficar espalhados"
        sub="Se hoje você depende de arquivos antigos, pastas no Drive, mensagens no WhatsApp ou modelos soltos, o DocusPsi centraliza essa rotina."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pains.map((p, i) => (
          <PaperCard key={i}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: C.danger, marginBottom: 14 }}>
              {p.icon}
            </div>
            <h3 style={{ fontFamily: font.display, color: C.text, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{p.title}</h3>
            <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>{p.text}</p>
          </PaperCard>
        ))}
      </div>
    </SectionWrap>
  );
}

// ─── 5. How It Works ──────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", title: "Escolha um modelo", text: "Selecione contrato, termo, recibo, declaração ou autorização." },
    { n: "02", title: "Preencha os dados guiados", text: "Informe paciente, valores, datas, modalidade e demais dados necessários." },
    { n: "03", title: "Revise a prévia em A4", text: "Confira a aparência do documento antes de finalizar." },
    { n: "04", title: "Baixe o PDF ou envie o link", text: "Gere o arquivo profissional ou compartilhe um link para aceite simples." },
  ];
  return (
    <SectionWrap id="como-funciona" muted>
      <SectionHead badge="Simples e rápido" title="Do modelo ao PDF em poucos passos" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div key={i} style={{ position: "relative" }}>
            <PaperCard>
              <div style={{ fontFamily: font.mono, fontSize: 28, fontWeight: 700, color: C.border, marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontFamily: font.display, color: C.text, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.65 }}>{s.text}</p>
            </PaperCard>
            {i < 3 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight style={{ color: C.border, width: 20, height: 20 }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <BtnPrimary href="/register">Testar fluxo de documentos <ArrowRight className="h-4 w-4" /></BtnPrimary>
      </div>
    </SectionWrap>
  );
}

// ─── 6. Templates ─────────────────────────────────────────────────────────────
function Templates() {
  const templates = [
    {
      icon: <FileSignature className="h-5 w-5" />,
      cat: "Contrato", name: "Contrato Terapêutico",
      desc: "Formalize valores, modalidade, cancelamentos, sigilo e regras do atendimento.",
      items: ["Honorários", "Cancelamentos", "Sigilo profissional"],
    },
    {
      icon: <FileText className="h-5 w-5" />,
      cat: "Termo", name: "Termo de Consentimento",
      desc: "Informe o paciente sobre o processo terapêutico e registre o consentimento.",
      items: ["Natureza do serviço", "Sigilo e limites", "Consentimento livre"],
    },
    {
      icon: <FileText className="h-5 w-5" />,
      cat: "Termo", name: "Termo de Atendimento Online",
      desc: "Apoia a organização do atendimento psicológico online com informações essenciais.",
      items: ["Plataforma utilizada", "Confidencialidade", "Cuidados do atendimento"],
    },
    {
      icon: <FileHeart className="h-5 w-5" />,
      cat: "Autorização", name: "Autorização para Menor",
      desc: "Registre formalmente a autorização do responsável legal para o atendimento.",
      items: ["Identificação do responsável", "Autorização expressa", "LGPD"],
    },
    {
      icon: <FilePen className="h-5 w-5" />,
      cat: "Declaração", name: "Declaração de Comparecimento",
      desc: "Comprove o comparecimento ao atendimento com data e horário.",
      items: ["Data e horário", "Modalidade", "Assinatura profissional"],
    },
    {
      icon: <Receipt className="h-5 w-5" />,
      cat: "Recibo", name: "Recibo de Pagamento",
      desc: "Registre o valor recebido com forma de pagamento e declaração de quitação.",
      items: ["Valor recebido", "Forma de pagamento", "Quitação"],
    },
  ];

  const catColors: Record<string, { bg: string; text: string }> = {
    Contrato: { bg: C.accentSoft, text: C.accentText },
    Termo: { bg: "#EDE9FE", text: "#6D28D9" },
    Autorização: { bg: "#FEF3C7", text: "#B45309" },
    Declaração: { bg: "#DCFCE7", text: "#15803D" },
    Recibo: { bg: "#D1FAE5", text: "#047857" },
  };

  return (
    <SectionWrap id="modelos">
      <SectionHead
        badge="Biblioteca"
        title="Modelos essenciais para a rotina clínica"
        sub="Comece com os documentos mais usados no atendimento psicológico particular, online ou presencial."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((t, i) => {
          const c = catColors[t.cat] || { bg: C.accentSoft, text: C.accentText };
          return (
            <PaperCard key={i} className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", color: c.text }}>
                  {t.icon}
                </div>
                <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, fontFamily: font.body }}>
                  {t.cat}
                </span>
              </div>
              <h3 style={{ fontFamily: font.display, color: C.text, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t.name}</h3>
              <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 14, flex: 1 }}>{t.desc}</p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                {t.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 mb-1.5">
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: font.body, fontSize: 12, color: C.textMuted }}>{item}</span>
                  </div>
                ))}
              </div>
            </PaperCard>
          );
        })}
      </div>
      <div className="flex justify-center mt-10">
        <div className="text-center">
          <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
            Todos os modelos são editáveis e devem ser revisados pela(o) profissional antes da emissão.
          </p>
          <BtnPrimary href="/register">Começar com estes modelos <ArrowRight className="h-4 w-4" /></BtnPrimary>
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── 7. Benefits ──────────────────────────────────────────────────────────────
function Benefits() {
  const items = [
    { icon: <FileCheck className="h-5 w-5" />, title: "Documentos com padrão profissional", text: "Cabeçalho, seções e rodapé consistentes em todos os seus documentos." },
    { icon: <Users className="h-5 w-5" />, title: "Histórico organizado por paciente", text: "Acesse todos os documentos de um paciente em um único lugar." },
    { icon: <Sparkles className="h-5 w-5" />, title: "Cabeçalho e rodapé personalizados", text: "Logo, cores e dados do consultório aplicados automaticamente." },
    { icon: <Download className="h-5 w-5" />, title: "Download em PDF", text: "Baixe o documento gerado com um clique, pronto para enviar." },
    { icon: <Lock className="h-5 w-5" />, title: "Aceite digital por link", text: "Envie um link seguro para o paciente confirmar a leitura." },
    { icon: <Clock className="h-5 w-5" />, title: "Menos retrabalho administrativo", text: "Preencha uma vez, gere quantos documentos precisar." },
  ];
  return (
    <SectionWrap id="beneficios" muted>
      <SectionHead
        badge="Vantagens"
        title="Mais organização para sua prática clínica"
        sub="Mais tempo para o cuidado, menos tempo ajustando arquivos."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <PaperCard key={i} className="flex gap-4">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accentText, flexShrink: 0 }}>
              {item.icon}
            </div>
            <div>
              <h3 style={{ fontFamily: font.display, color: C.text, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.title}</h3>
              <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>{item.text}</p>
            </div>
          </PaperCard>
        ))}
      </div>
    </SectionWrap>
  );
}

// ─── 8. Acceptance ────────────────────────────────────────────────────────────
function Acceptance() {
  return (
    <SectionWrap>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="mb-5"><PaperBadge><Lock className="h-3 w-3" />Aceite digital</PaperBadge></div>
          <h2 style={{ fontFamily: font.display, color: C.text, fontWeight: 700, fontSize: 32, lineHeight: 1.25, marginBottom: 16 }}>
            Envie para aceite sem complicar a rotina
          </h2>
          <p style={{ fontFamily: font.body, color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
            Compartilhe um link para o paciente visualizar o documento e registrar um aceite simples de leitura e concordância.
          </p>
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400E", fontFamily: font.body, lineHeight: 1.6 }}>
            Esse recurso apoia a organização documental e não substitui análise jurídica, ética ou profissional.
          </div>
          <div className="mt-6">
            <BtnPrimary href="#precos">Ver planos com aceite <ArrowRight className="h-4 w-4" /></BtnPrimary>
          </div>
        </div>
        {/* Acceptance mockup */}
        <PaperCard style={{ maxWidth: 360, margin: "0 auto" }}>
          <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font.body, marginBottom: 4 }}>Documento para aceite</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: font.display }}>Contrato Terapêutico</div>
            <div style={{ fontSize: 12, color: C.textMuted, fontFamily: font.body }}>Mariana Souza</div>
          </div>
          <div style={{ background: C.paperMuted, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
            {[100, 85, 90, 70, 95].map((w, i) => (
              <div key={i} style={{ height: 5, background: C.border, borderRadius: 3, width: `${w}%`, marginBottom: 5 }} />
            ))}
          </div>
          <div className="space-y-3 mb-4">
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${C.accent}`, background: C.accentSoft, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check style={{ width: 10, height: 10, color: C.accentText }} />
              </div>
              <span style={{ fontSize: 12, color: C.text, fontFamily: font.body }}>Declaro que li e aceito este documento.</span>
            </div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.textMuted, fontFamily: font.body }}>
              Nome completo *
            </div>
          </div>
          <button
            style={{ width: "100%", background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 600, fontSize: 13, fontFamily: font.body, cursor: "default" }}
          >
            Li e aceito este documento
          </button>
          <div className="flex justify-center mt-3">
            <span style={{ background: C.successSoft, color: C.success, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, fontFamily: font.body }}>
              ✓ Aceito
            </span>
          </div>
        </PaperCard>
      </div>
    </SectionWrap>
  );
}

// ─── 9. Customization ────────────────────────────────────────────────────────
function Customization() {
  return (
    <SectionWrap muted>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Config card */}
        <PaperCard style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: font.display, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Configurações do consultório
          </div>
          {[
            { label: "Nome profissional", val: "Ana Lima" },
            { label: "CRP", val: "06/123456" },
            { label: "Clínica", val: "Consultório Ana Lima" },
            { label: "E-mail", val: "ana@exemplo.com.br" },
            { label: "Telefone", val: "(11) 99999-0000" },
            { label: "Cidade/UF", val: "São Paulo/SP" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.textMuted, fontFamily: font.body }}>{f.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: font.body }}>{f.val}</span>
            </div>
          ))}
          {/* Color preview */}
          <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: C.accent, border: `1px solid ${C.border}` }} />
            <div style={{ width: 28, height: 28, borderRadius: 8, background: C.accentSoft, border: `1px solid ${C.border}` }} />
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: font.body }}>Cores dos documentos</span>
          </div>
          {/* Mini header preview */}
          <div style={{ marginTop: 14, background: "#F8FAFC", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", borderLeft: `3px solid ${C.accent}` }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: font.body, marginBottom: 4 }}>Prévia do cabeçalho</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: C.accentSoft, border: "1px solid #C4B5FD", display: "flex", alignItems: "center", justifyContent: "center", color: C.accentText, fontSize: 9, fontWeight: 800 }}>AL</div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.text, fontFamily: font.body }}>Ana Lima</div>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: font.body }}>CRP 06/123456 · Consultório Ana Lima</div>
              </div>
            </div>
          </div>
        </PaperCard>

        <div>
          <div className="mb-5"><PaperBadge><Sparkles className="h-3 w-3" />Personalização</PaperBadge></div>
          <h2 style={{ fontFamily: font.display, color: C.text, fontWeight: 700, fontSize: 32, lineHeight: 1.25, marginBottom: 16 }}>
            Documentos com a identidade do seu consultório
          </h2>
          <p style={{ fontFamily: font.body, color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
            Configure seus dados uma vez e aplique automaticamente em todos os documentos gerados.
          </p>
          <div className="space-y-2.5">
            {["Logo ou monograma", "Nome profissional", "CRP", "Clínica ou consultório", "E-mail e telefone", "Cidade/UF", "Rodapé personalizado", "Cores do documento"].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check style={{ width: 12, height: 12, color: C.accentText }} />
                </div>
                <span style={{ fontFamily: font.body, color: C.text, fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── 10. Responsibility ───────────────────────────────────────────────────────
function Responsibility() {
  const cards = [
    { icon: <BookOpen className="h-5 w-5" />, title: "Modelos editáveis", text: "Use os modelos como ponto de partida e revise antes de emitir." },
    { icon: <Shield className="h-5 w-5" />, title: "Organização por paciente", text: "Documentos ficam vinculados ao paciente dentro do sistema." },
    { icon: <FileText className="h-5 w-5" />, title: "Avisos responsáveis", text: "O sistema não substitui avaliação, orientação ética ou revisão profissional." },
  ];
  return (
    <SectionWrap>
      <SectionHead
        title="Feito com responsabilidade para a rotina da Psicologia"
        sub="O DocusPsi organiza modelos administrativos e documentos de apoio. A revisão final é sempre da(o) profissional."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {cards.map((c, i) => (
          <PaperCard key={i}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", color: C.success, marginBottom: 14 }}>
              {c.icon}
            </div>
            <h3 style={{ fontFamily: font.display, color: C.text, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{c.title}</h3>
            <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.65 }}>{c.text}</p>
          </PaperCard>
        ))}
      </div>
      <div style={{ background: C.paperMuted, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>
          Os modelos são sugestões estruturadas para apoio administrativo. A responsabilidade pelo conteúdo final é da(o) profissional.
        </p>
      </div>
    </SectionWrap>
  );
}

// ─── 11. Audience ────────────────────────────────────────────────────────────
function Audience() {
  const cards = [
    { icon: <Receipt className="h-5 w-5" />, title: "Você atende particular", text: "E precisa emitir contratos, termos, recibos ou declarações com frequência." },
    { icon: <FileText className="h-5 w-5" />, title: "Você usa Word ou Google Docs", text: "E perde tempo adaptando documentos antigos manualmente." },
    { icon: <MonitorCheck className="h-5 w-5" />, title: "Você atende online", text: "E precisa organizar termos, consentimentos e documentos por paciente." },
    { icon: <Sparkles className="h-5 w-5" />, title: "Você está começando sua clínica", text: "E quer transmitir mais organização desde os primeiros atendimentos." },
    { icon: <Settings2 className="h-5 w-5" />, title: "Você quer padronizar documentos", text: "Com cabeçalho, rodapé, dados profissionais e visual consistente." },
    { icon: <Clock className="h-5 w-5" />, title: "Você quer reduzir retrabalho", text: "Preenchendo dados guiados e gerando PDFs profissionais com poucos cliques." },
  ];
  return (
    <SectionWrap muted>
      <SectionHead title="O DocusPsi é ideal para você se..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <PaperCard key={card.title}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accentText, marginBottom: 14 }}>
              {card.icon}
            </div>
            <h3 style={{ fontFamily: font.display, color: C.text, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{card.title}</h3>
            <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.65 }}>{card.text}</p>
          </PaperCard>
        ))}
      </div>
    </SectionWrap>
  );
}

// ─── 11. Pricing ──────────────────────────────────────────────────────────────
function Pricing() {
  const { data: apiPlans, isError } = useListPlans();
  const fallbackPlans: Plan[] = [
    {
      key: "ESSENTIAL",
      name: "Essencial",
      price: 29,
      currency: "BRL",
      interval: "month",
      recommended: false,
      features: ["Até 20 documentos por mês", "Até 30 pacientes", "4 modelos essenciais", "PDF profissional", "Cabeçalho simples"],
    },
    {
      key: "PRO",
      name: "Pro",
      price: 59,
      currency: "BRL",
      interval: "month",
      recommended: true,
      features: ["Documentos ilimitados", "Pacientes ilimitados", "Todos os modelos", "Logo, cabeçalho e rodapé personalizados", "Histórico por paciente", "Aceite simples por link"],
    },
    {
      key: "CLINIC",
      name: "Clínica",
      price: 149,
      currency: "BRL",
      interval: "month",
      recommended: false,
      features: ["Até 3 profissionais", "Tudo do Pro", "Identidade da clínica", "Modelos padronizados", "Gestão por profissional", "Suporte prioritário"],
    },
  ];
  const plans = apiPlans?.length ? apiPlans : fallbackPlans;
  const formatPlanPrice = (plan: Plan) => {
    if (typeof plan.price !== "number") return "Consultar";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: plan.currency || "BRL",
      maximumFractionDigits: 0,
    }).format(plan.price);
  };
  const formatPlanPeriod = (plan: Plan) => {
    if (plan.interval === "month") return "/mês";
    if (plan.interval === "year") return "/ano";
    return plan.interval ? `/${plan.interval}` : "";
  };

  return (
    <SectionWrap id="precos">
      <SectionHead
        badge="Oferta de lançamento"
        title="Escolha o plano ideal para você"
        sub="Comece validando sua rotina documental com planos simples e sem complexidade."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.key}
            style={{
              background: C.paper,
              border: p.recommended ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
              borderRadius: 20, padding: "28px 24px",
              boxShadow: p.recommended ? "0 10px 30px rgba(139,92,246,0.18)" : "0 1px 4px rgba(17,17,17,0.06)",
              position: "relative",
            }}
          >
            {p.recommended && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>
                <span style={{ background: C.accent, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, fontFamily: font.body }}>Mais escolhido</span>
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontFamily: font.display, fontWeight: 800, fontSize: 32, color: C.text }}>{formatPlanPrice(p)}</span>
                <span style={{ fontFamily: font.body, fontSize: 14, color: C.textMuted }}>{formatPlanPeriod(p)}</span>
              </div>
              <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.55, marginTop: 10 }}>
                {p.recommended ? "Ideal para profissionalizar a rotina documental." : "Para organizar documentos com mais previsibilidade."}
              </p>
              {p.recommended && <p style={{ fontFamily: font.body, color: C.accentText, fontSize: 12, fontWeight: 700, marginTop: 8 }}>Ideal para a maioria das psicólogas clínicas.</p>}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 20 }}>
              {(p.features || []).map((item) => (
                <div key={item} className="flex items-start gap-2.5 mb-2.5">
                  <Check style={{ width: 14, height: 14, color: p.recommended ? C.accent : C.success, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: font.body, fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/register"
              style={{
                display: "block", textAlign: "center", padding: "10px 0",
                borderRadius: 10, fontWeight: 600, fontSize: 13, fontFamily: font.body,
                background: p.recommended ? C.accent : C.primary,
                color: "#fff", textDecoration: "none",
              }}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2"
            >
              {p.recommended ? "Começar no Pro" : `Começar no ${p.name}`}
            </Link>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontFamily: font.body, color: C.textMuted, fontSize: 12, marginTop: 16 }}>
        {isError ? "Exibindo uma referência de planos enquanto a API não responde." : "Plano anual com 2 meses grátis em breve."}
      </p>
    </SectionWrap>
  );
}

// ─── 12. FAQ ──────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { q: "O DocusPsi substitui orientação jurídica, ética ou profissional?", a: "Não. O DocusPsi oferece modelos editáveis e organização documental. A revisão e responsabilidade pelo conteúdo final são da(o) profissional." },
    { q: "Posso personalizar os documentos?", a: "Sim. Você pode configurar seus dados profissionais, logo, cores, rodapé e campos dos documentos." },
    { q: "Os documentos são gerados em PDF?", a: "Sim. Após preencher os campos, você pode visualizar e baixar o documento em PDF." },
    { q: "Funciona para atendimento online?", a: "Sim. O DocusPsi ajuda a organizar documentos de apoio para atendimento online, incluindo termos, consentimentos e dados do paciente." },
    { q: "Consigo organizar documentos por paciente?", a: "Sim. Cada documento gerado fica vinculado ao paciente correspondente, com histórico completo." },
    { q: "Existe teste grátis?", a: "Na fase inicial, o DocusPsi pode oferecer acesso de lançamento ou teste para primeiras usuárias. Ajuste esta resposta conforme a regra atual do produto." },
  ];
  return (
    <SectionWrap id="faq">
      <SectionHead badge="Dúvidas" title="Perguntas frequentes" />
      <div className="max-w-2xl mx-auto space-y-3">
        {items.map((item, i) => (
          <PaperCard key={i} style={{ padding: "0", cursor: "pointer" }}>
            <button
              className="w-full text-left flex items-center justify-between gap-4"
              style={{ padding: "18px 20px", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
            >
              <span style={{ fontFamily: font.display, color: C.text, fontWeight: 600, fontSize: 14 }}>{item.q}</span>
              {open === i ? <ChevronUp style={{ color: C.accent, flexShrink: 0, width: 18, height: 18 }} /> : <ChevronDown style={{ color: C.textMuted, flexShrink: 0, width: 18, height: 18 }} />}
            </button>
            {open === i && (
              <div id={`faq-panel-${i}`} style={{ padding: "0 20px 18px", borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>{item.a}</p>
              </div>
            )}
          </PaperCard>
        ))}
      </div>
    </SectionWrap>
  );
}

// ─── 13. Final CTA ────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <SectionWrap muted>
      <div
        style={{ background: C.primary, borderRadius: 24, padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}
      >
        {/* Decorative dots */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div style={{ position: "relative" }}>
          <div className="flex justify-center mb-6">
            <span style={{ background: C.accentSoft, color: C.accentText, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999, fontFamily: font.body }}>
              Comece agora
            </span>
          </div>
          <h2 style={{ fontFamily: font.display, color: "#fff", fontWeight: 800, fontSize: 32, lineHeight: 1.2, marginBottom: 16 }}>
            Saia dos modelos soltos e organize seus documentos clínicos
          </h2>
          <p style={{ fontFamily: font.body, color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Comece com o kit gratuito ou crie sua conta para gerar documentos profissionais com poucos cliques.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", color: C.primary, padding: "12px 28px", borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: font.body, textDecoration: "none" }}
            >
              Criar conta <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/kit-documental"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.25)", padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, fontFamily: font.body, textDecoration: "none" }}
            >
              Baixar kit gratuito
            </Link>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

// ─── 14. Footer ───────────────────────────────────────────────────────────────
function LandingFooter() {
  const links = [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Modelos", href: "#modelos" },
    { label: "Preços", href: "#precos" },
    { label: "Kit gratuito", href: "/kit-documental" },
    { label: "Entrar", href: "/login" },
    { label: "Criar conta", href: "/register" },
  ];
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "48px 24px 32px" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DocusPsiLogoImage variant="horizontal" className="h-10 w-40" />
            </div>
            <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
              Documentos profissionais para psicólogas(os), com modelos guiados, PDF e organização por paciente.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Produto</div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((l) => (
                <a key={l.label} href={l.href} style={{ fontFamily: font.body, color: C.textMuted, fontSize: 13 }} className="hover:text-[#111827] transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 11 }}>
            DocusPsi é uma ferramenta de apoio administrativo. Revise os documentos antes de emitir.
          </p>
          <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: 12 }}>
            © {new Date().getFullYear()} DocusPsi. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: C.bg,
        backgroundImage: "radial-gradient(rgba(17,17,17,0.035) 1px, transparent 1px)",
        backgroundSize: "6px 6px",
      }}
    >
      <Header />
      <main>
        <Hero />
        <FreeKit />
        <PainPoints />
        <DocumentPreview />
        <HowItWorks />
        <Templates />
        <Benefits />
        <Acceptance />
        <Customization />
        <Responsibility />
        <Audience />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
