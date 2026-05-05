import { useEffect } from "react";
import { Link } from "wouter";
import { DocusPsiLogoImage } from "@/components/docuspsi-logo";
import { ArrowLeft, FileText, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

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
};

const font = {
  display: "Montserrat, sans-serif",
  body: "Roboto, sans-serif",
  mono: '"PT Mono", monospace',
};

function LegalShell({
  badge,
  title,
  description,
  children,
}: {
  badge: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen px-5 py-6 md:px-8 md:py-10"
      style={{
        background: C.bg,
        backgroundImage:
          "radial-gradient(rgba(17, 24, 39, 0.035) 1px, transparent 1px), linear-gradient(rgba(139, 92, 246, 0.025) 1px, transparent 1px)",
        backgroundSize: "18px 18px, 100% 32px",
        color: C.text,
        fontFamily: font.body,
      }}
    >
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]">
            <DocusPsiLogoImage variant="horizontal" className="h-10 w-40" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
            style={{ background: C.paper, border: `1px solid ${C.border}`, color: C.text }}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </header>

        <section
          className="mb-6 rounded-3xl p-6 md:p-8"
          style={{ background: C.paper, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(17,17,17,0.06)" }}
        >
          <span
            className="mb-4 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{ background: C.accentSoft, color: C.accentText, border: `1px solid ${C.border}`, fontFamily: font.mono }}
          >
            {badge}
          </span>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl" style={{ fontFamily: font.display }}>
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: C.textMuted }}>
            {description}
          </p>
        </section>

        <section
          className="rounded-3xl p-6 md:p-8"
          style={{ background: C.paper, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(17,17,17,0.06)" }}
        >
          <div className="space-y-8">{children}</div>
        </section>

        <footer className="mt-8 flex flex-col gap-4 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between" style={{ borderColor: C.border, color: C.textMuted }}>
          <DocusPsiLogoImage variant="horizontal" className="h-10 w-40" />
          <div className="flex flex-wrap gap-4">
            <Link href="/privacidade" className="font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]">Privacidade</Link>
            <Link href="/termos" className="font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]">Termos</Link>
            <Link href="/kit-documental" className="font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]">Kit gratuito</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function LegalSection({ icon: Icon, title, children }: { icon: typeof FileText; title: string; children: React.ReactNode }) {
  return (
    <article className="border-b pb-7 last:border-b-0 last:pb-0" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: C.accentSoft, color: C.accentText }}>
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-bold" style={{ fontFamily: font.display, color: C.text }}>
          {title}
        </h2>
      </div>
      <div className="space-y-3 text-sm leading-relaxed md:text-base" style={{ color: C.textMuted }}>
        {children}
      </div>
    </article>
  );
}

export function TermsPage() {
  useEffect(() => {
    document.title = "Termos de uso | DocusPsi";
  }, []);

  return (
    <LegalShell
      badge="Termos de uso"
      title="Termos de uso do DocusPsi"
      description="Estes termos apresentam regras iniciais para uso do DocusPsi, uma ferramenta de apoio administrativo para documentos da rotina psicológica."
    >
      <LegalSection icon={FileText} title="Finalidade do DocusPsi">
        <p>
          O DocusPsi ajuda psicólogas(os) a gerar, organizar, visualizar e baixar documentos profissionais em PDF, com modelos guiados, cabeçalho personalizado, histórico por paciente e aceite simples por link.
        </p>
        <p>
          A plataforma não é prontuário clínico completo, não emite laudos automáticos e não substitui análise técnica, ética, jurídica ou profissional.
        </p>
      </LegalSection>

      <LegalSection icon={ShieldCheck} title="Responsabilidade da(o) profissional">
        <p>
          Os modelos disponibilizados são sugestões estruturadas para apoio administrativo. A revisão, adaptação e responsabilidade pelo conteúdo final de cada documento são sempre da(o) profissional que emite o material.
        </p>
        <p>
          O DocusPsi não garante validade jurídica de documentos, não substitui orientação especializada e não deve ser usado como fonte única para decisões profissionais.
        </p>
      </LegalSection>

      <LegalSection icon={LockKeyhole} title="Conta, acesso e uso adequado">
        <p>
          A pessoa usuária deve informar dados verdadeiros, proteger seu acesso e usar a ferramenta apenas para finalidades compatíveis com a rotina administrativa de documentos.
        </p>
        <p>
          É responsabilidade da(o) profissional conferir dados de pacientes, textos, valores, datas, anexos e informações exibidas antes de emitir, enviar ou baixar qualquer documento.
        </p>
      </LegalSection>

      <LegalSection icon={Mail} title="Contato">
        <p>
          Para dúvidas sobre estes termos, privacidade ou uso inicial do produto, entre em contato pelo e-mail <a className="font-semibold text-[#6D28D9] underline-offset-4 hover:underline" href="mailto:contato@docuspsi.com">contato@docuspsi.com</a>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}

export function PrivacyPage() {
  useEffect(() => {
    document.title = "Política de privacidade | DocusPsi";
  }, []);

  return (
    <LegalShell
      badge="Privacidade"
      title="Política de privacidade do DocusPsi"
      description="Esta política explica, de forma inicial, como dados enviados em formulários e no uso do DocusPsi podem ser tratados para funcionamento do produto."
    >
      <LegalSection icon={LockKeyhole} title="Dados que podem ser coletados">
        <p>
          No formulário do Kit Documental, o DocusPsi pode solicitar nome, e-mail, WhatsApp, origem do contato, estágio profissional e principal necessidade documental.
        </p>
        <p>
          No uso autenticado do produto, a ferramenta pode tratar dados cadastrais da conta, dados profissionais, dados de pacientes informados pela(o) usuária(o) e informações necessárias para gerar documentos.
        </p>
      </LegalSection>

      <LegalSection icon={FileText} title="Finalidade de uso dos dados">
        <p>
          Os dados podem ser usados para registrar interesse no Kit Documental, comunicar novidades do DocusPsi, permitir login, configurar perfil profissional, organizar pacientes e gerar documentos em PDF.
        </p>
        <p>
          O DocusPsi deve usar os dados apenas para finalidades relacionadas ao produto, suporte, segurança, melhoria da experiência e comunicações consentidas.
        </p>
      </LegalSection>

      <LegalSection icon={ShieldCheck} title="Cuidados e responsabilidade">
        <p>
          A plataforma adota uma proposta de apoio administrativo. A(o) profissional continua responsável por inserir apenas dados necessários, revisar documentos antes de emitir e cumprir suas obrigações éticas, técnicas e legais.
        </p>
        <p>
          Links públicos de aceite devem expor somente as informações necessárias ao documento correspondente.
        </p>
      </LegalSection>

      <LegalSection icon={Mail} title="Contato e solicitações">
        <p>
          Para solicitar informações, correções ou remoção de dados em contexto aplicável, envie uma mensagem para <a className="font-semibold text-[#6D28D9] underline-offset-4 hover:underline" href="mailto:contato@docuspsi.com">contato@docuspsi.com</a>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
