import type { RenderedDocument } from "./document-types";

export type { RenderedDocument };

const DOCUMENT_CSS = `
.pdf-preview-wrapper *, .pdf-preview-wrapper *::before, .pdf-preview-wrapper *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.pdf-preview-wrapper {
  width: 100%;
  max-width: 100%;
  background: #FFFFFF;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  overflow-x: auto;
}

.pdf-page {
  width: 794px;
  flex: 0 0 auto;
  min-height: 1123px;
  background: #ffffff;
  color: #111827;
  font-family: Inter, Arial, Helvetica, sans-serif;
  padding: 48px;
  padding-bottom: 104px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
  position: relative;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid var(--document-primary-color, #8B5CF6);
  padding-bottom: 20px;
  margin-bottom: 32px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.header-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 6px;
  background: #ffffff;
}

.header-monogram {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.header-title-group {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.professional-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  overflow-wrap: anywhere;
}

.professional-crp {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  display: block;
}

.clinic-name {
  font-size: 13px;
  color: #334155;
  margin-top: 4px;
  display: block;
}

.header-contact {
  text-align: right;
  font-size: 11px;
  color: #64748b;
  line-height: 1.6;
  max-width: 240px;
  overflow-wrap: anywhere;
}

.document-title-area {
  text-align: center;
  margin-bottom: 28px;
}

.document-type-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--document-primary-color, #6D28D9);
  background: #EDE9FE;
  border: 1px solid #DDD6C7;
  border-radius: 999px;
  padding: 6px 12px;
  margin-bottom: 12px;
}

.document-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.document-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
}

.info-card {
  background: #FAF7F0;
  border: 1px solid #DDD6C7;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 28px;
}

.info-card-title {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
}

.info-item {
  font-size: 11px;
  color: #475569;
  line-height: 1.4;
}

.info-label {
  font-weight: 700;
  color: #111827;
}

.document-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.section-text {
  font-size: 12px;
  color: #334155;
  line-height: 1.65;
  text-align: justify;
  margin: 0 0 6px 0;
}

.section-highlight {
  background: #EDE9FE;
  border: 1px solid #DDD6C7;
  border-left: 4px solid var(--document-primary-color, #8B5CF6);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
}

.section-highlight .section-title {
  color: var(--document-primary-color, #2563eb);
  margin-bottom: 10px;
}

.signature-date {
  margin-top: 64px;
  margin-bottom: 32px;
  font-size: 11px;
  color: #64748b;
}

.signature-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  margin-top: 0;
  page-break-inside: avoid;
  break-inside: avoid;
}

.signature-block {
  text-align: center;
  font-size: 11px;
  color: #334155;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  page-break-inside: avoid;
  break-inside: avoid;
}

.signature-image-wrapper {
  min-height: 84px;
  max-height: 104px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.signature-image {
  max-width: 220px;
  max-height: 84px;
  object-fit: contain;
  display: block;
}

.signature-line {
  border-top: 1px solid #334155;
  margin-bottom: 8px;
}

.signature-name {
  font-weight: 700;
  color: #111827;
}

.signature-role {
  color: #64748b;
  margin-top: 2px;
}

.document-footer {
  position: absolute;
  left: 48px;
  right: 48px;
  bottom: 24px;
  border-top: 1px solid #DDD6C7;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 9px;
  color: #94a3b8;
  line-height: 1.4;
  flex-wrap: wrap;
}

.footer-left { max-width: 55%; }
.footer-right { max-width: 45%; text-align: right; }
.footer-left, .footer-right { overflow-wrap: anywhere; }

.acceptance-stamp {
  margin-top: 24px;
  border: 1px solid #10b981;
  background: #ecfdf5;
  color: #065f46;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 11px;
  line-height: 1.6;
}

.document-section,
.info-card,
.section-highlight,
.acceptance-stamp,
.payment-highlight {
  page-break-inside: avoid;
  break-inside: avoid;
}

@page {
  size: A4;
  margin: 0;
}

@media print {
  .pdf-preview-wrapper {
    padding: 0;
    background: #ffffff;
  }

  .pdf-page {
    width: 210mm;
    min-height: 297mm;
    padding: 18mm;
    padding-bottom: 28mm;
    box-shadow: none;
  }

  .document-footer {
    left: 18mm;
    right: 18mm;
    bottom: 10mm;
  }
}

@media screen and (max-width: 860px) {
  .pdf-preview-wrapper {
    justify-content: flex-start;
    padding: 16px;
  }

  .pdf-page {
    width: 794px;
    min-width: 794px;
  }
}

.acceptance-stamp strong {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
}

.payment-highlight {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  margin: 0 0 24px 0;
}

.payment-amount-label {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.payment-amount {
  font-size: 32px;
  font-weight: 800;
  color: var(--document-primary-color, #2563eb);
}
`;

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function contentToParagraphs(content: string): string[] {
  return content.split(/\n\n+/).filter(Boolean);
}

function SectionContent({ content }: { content: string }) {
  const paragraphs = contentToParagraphs(content);
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className="section-text">
          {para.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

function formatDocumentDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

export interface AcceptanceInfo {
  name: string;
  date: string;
  cpf?: string;
  ip?: string;
}

interface Props {
  doc: RenderedDocument;
  acceptanceInfo?: AcceptanceInfo;
}

export function DocumentHtmlPreview({ doc, acceptanceInfo }: Props) {
  const primary = doc.primaryColor || "#8B5CF6";
  const secondary = doc.secondaryColor || "#675CF1";
  const h = doc.professionalHeader;
  const sig = doc.signatureBlock;
  const secondSigner = sig.patient || sig.guardian;
  const prefs = doc.footerPrefs;
  const signatureUrl = sig.professional.signatureUrl || doc.signatureUrl || h.signatureUrl;

  const amountRow = doc.slug === "recibo-pagamento"
    ? doc.infoBlock.rows.find((r) => r.label === "Valor recebido")
    : undefined;

  const footerLeft = prefs?.text || (prefs?.showGeneratedBy !== false ? "Gerado por DocusPsi" : "");
  const footerRightParts: string[] = [];
  if (prefs?.showDocumentCode !== false && doc.documentId) {
    footerRightParts.push(`Doc. ${doc.documentId.substring(0, 8).toUpperCase()}`);
  }
  if (prefs?.showIssuedAt !== false) {
    footerRightParts.push(`Emitido em ${formatDocumentDate(doc.issueDate)}`);
  }
  if (prefs?.showPageNumber !== false) {
    footerRightParts.push("Página 1");
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DOCUMENT_CSS }} />
      <div className="pdf-preview-wrapper">
        <div
          className="pdf-page"
          style={{ "--document-primary-color": primary } as React.CSSProperties}
        >
          <header className="document-header">
            <div className="header-brand">
              {doc.logoUrl ? (
                <img src={doc.logoUrl} className="header-logo" alt="Logo" />
              ) : (
                <div
                  className="header-monogram"
                  style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
                >
                  {getInitials(h.clinicName || h.fullName)}
                </div>
              )}
              <div className="header-title-group">
                <p className="professional-name">{h.fullName}</p>
                <span className="professional-crp">CRP {h.crp}</span>
                {h.clinicName && <span className="clinic-name">{h.clinicName}</span>}
              </div>
            </div>
            <div className="header-contact">
              {h.email && <div>{h.email}</div>}
              {h.phone && <div>{h.phone}</div>}
              {(h.city || h.state) && <div>{h.city}/{h.state}</div>}
              {h.address && <div>{h.address}</div>}
              {h.website && <div>{h.website}</div>}
              {h.instagram && <div>{h.instagram}</div>}
            </div>
          </header>

          <main className="document-content">
            <div className="document-title-area">
              <div className="document-type-badge">{doc.type}</div>
              <h1 className="document-title">{doc.title}</h1>
              <p className="document-subtitle">Emitido em {formatDocumentDate(doc.issueDate)}</p>
            </div>

            <section className="info-card">
              <div className="info-card-title">Identificação</div>
              <div className="info-grid">
                {doc.infoBlock.rows.map((row, i) => (
                  <div key={i} className="info-item">
                    <span className="info-label">{row.label}:</span> {row.value}
                  </div>
                ))}
              </div>
            </section>

            {amountRow && (
              <div className="payment-highlight">
                <div className="payment-amount-label">Valor recebido</div>
                <div className="payment-amount">{amountRow.value}</div>
              </div>
            )}

            {doc.sections.map((section, i) =>
              section.highlight ? (
                <div key={i} className="section-highlight">
                  <h2 className="section-title">{section.title}</h2>
                  <SectionContent content={section.content} />
                </div>
              ) : (
                <section key={i} className="document-section">
                  <h2 className="section-title">{section.title}</h2>
                  <SectionContent content={section.content} />
                </section>
              )
            )}

            {acceptanceInfo && (
              <div className="acceptance-stamp">
                <strong>Aceite Digital Registrado</strong>
                Aceito por: {acceptanceInfo.name}
                {acceptanceInfo.cpf && ` · CPF: ${acceptanceInfo.cpf}`}
                <br />
                Data e hora: {acceptanceInfo.date}
                {acceptanceInfo.ip && ` · IP: ${acceptanceInfo.ip}`}
              </div>
            )}

            <div className="signature-date">
              {sig.city || sig.state ? `${sig.city}${sig.city && sig.state ? "/" : ""}${sig.state}, ${formatDocumentDate(sig.date)}` : `Data: ${formatDocumentDate(sig.date)}`}
            </div>
            <div className="signature-area">
              <div className="signature-block">
                <div className="signature-image-wrapper">
                  {signatureUrl && <img src={signatureUrl} className="signature-image" alt="Assinatura da profissional" />}
                </div>
                <div className="signature-line" />
                <div className="signature-name">{sig.professional.name}</div>
                <div className="signature-role">CRP {sig.professional.crp}</div>
                <div className="signature-role">{sig.professional.role}</div>
              </div>
              {secondSigner && (
                <div className="signature-block">
                  <div className="signature-image-wrapper" />
                  <div className="signature-line" />
                  <div className="signature-name">{secondSigner.name}</div>
                  <div className="signature-role">{secondSigner.role}</div>
                </div>
              )}
            </div>
          </main>

          <footer className="document-footer">
            <div className="footer-left">{footerLeft}</div>
            <div className="footer-right">{footerRightParts.join(" · ")}</div>
          </footer>
        </div>
      </div>
    </>
  );
}
