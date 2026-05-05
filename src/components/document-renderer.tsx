interface DocumentSection {
  title: string;
  content: string;
  highlight?: boolean;
}

interface InfoBlock {
  rows: { label: string; value: string }[];
}

interface ProfessionalHeader {
  fullName: string;
  crp: string;
  clinicName?: string;
  email?: string;
  phone?: string;
  city: string;
  state: string;
  signatureUrl?: string;
}

interface SignatureBlock {
  professional: { name: string; crp: string; role: string; signatureUrl?: string };
  patient?: { name: string; role: string };
  guardian?: { name: string; role: string };
  city: string;
  state: string;
  date: string;
}

export interface RenderedDocumentShape {
  title: string;
  type: string;
  slug: string;
  professionalHeader: ProfessionalHeader;
  infoBlock: InfoBlock;
  sections: DocumentSection[];
  signatureBlock: SignatureBlock;
  notice: string;
  issueDate: string;
  documentId?: string;
}

export function parseRenderedContent(content: string | null | undefined): RenderedDocumentShape | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.sections && parsed.title) return parsed as RenderedDocumentShape;
    return null;
  } catch {
    return null;
  }
}

interface DocumentRendererProps {
  doc: RenderedDocumentShape;
  compact?: boolean;
}

export function DocumentRenderer({ doc, compact = false }: DocumentRendererProps) {
  const h = doc.professionalHeader;
  const sig = doc.signatureBlock;
  const signatureUrl = sig.professional.signatureUrl || h.signatureUrl;

  return (
    <div className="font-sans text-sm text-slate-900 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            Ψ
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 leading-tight">{h.fullName}</p>
            <p className="text-slate-500 text-xs mt-0.5">
              CRP {h.crp}{h.clinicName ? ` · ${h.clinicName}` : ""}
            </p>
            <p className="text-slate-400 text-xs">
              {[h.email, h.phone, `${h.city}/${h.state}`].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="inline-block bg-violet-600 text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-0.5 rounded-full mb-2">
            {doc.type}
          </span>
          <h2 className={`font-bold text-slate-900 leading-tight ${compact ? "text-base" : "text-lg"}`}>
            {doc.title}
          </h2>
        </div>
      </div>

      {doc.infoBlock.rows.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-blue-600 flex-shrink-0 rounded-l-lg" />
            <div className="flex-1 divide-y divide-slate-100">
              {doc.infoBlock.rows.map((row, i) => (
                <div key={i} className="flex items-baseline gap-3 px-4 py-2">
                  <span className="text-xs font-semibold text-slate-500 w-40 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-slate-900 font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {doc.sections.map((section, i) => (
          <div
            key={i}
            className={
              section.highlight
                ? "rounded-lg border border-blue-200 bg-blue-50 p-4 relative overflow-hidden"
                : ""
            }
          >
            {section.highlight && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 rounded-l" />
            )}
            <p className={`font-bold text-xs uppercase tracking-wide mb-2 ${section.highlight ? "text-blue-700 ml-1" : "text-slate-700"}`}>
              {section.title}
            </p>
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${section.highlight ? "text-slate-800 ml-1" : "text-slate-700"}`}>
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-5 space-y-4">
        <p className="text-xs text-slate-500">{sig.city}/{sig.state}, {sig.date}</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex min-h-32 flex-col justify-end text-center">
            <div className="mb-2 flex min-h-20 items-end justify-center">
              {signatureUrl && <img src={signatureUrl} alt="Assinatura da profissional" className="max-h-20 max-w-56 object-contain" />}
            </div>
            <div className="border-t border-slate-300 pt-3">
              <p className="font-semibold text-sm text-slate-900">{sig.professional.name}</p>
              <p className="text-xs text-slate-500">CRP {sig.professional.crp}</p>
              <p className="text-xs text-slate-400">{sig.professional.role}</p>
            </div>
          </div>
          {(sig.patient || sig.guardian) && (
            <div>
              <div className="border-t border-slate-300 pt-3">
                <p className="font-semibold text-sm text-slate-900">
                  {(sig.patient || sig.guardian)!.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(sig.patient || sig.guardian)!.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {doc.notice && doc.notice.length < 120 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-400 italic leading-relaxed">{doc.notice}</p>
        </div>
      )}
    </div>
  );
}
