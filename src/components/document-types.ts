export interface FooterPrefs {
  text?: string;
  showGeneratedBy: boolean;
  showDocumentCode: boolean;
  showIssuedAt: boolean;
  showPageNumber: boolean;
}

export interface ProfessionalHeader {
  fullName: string;
  crp: string;
  clinicName?: string;
  email?: string;
  phone?: string;
  city: string;
  state: string;
  address?: string;
  website?: string;
  instagram?: string;
}

export interface InfoBlock {
  rows: { label: string; value: string }[];
}

export interface DocumentSection {
  title: string;
  content: string;
  highlight?: boolean;
}

export interface SignatureBlock {
  professional: { name: string; crp: string; role: string };
  patient?: { name: string; role: string };
  guardian?: { name: string; role: string };
  city: string;
  state: string;
  date: string;
}

export interface RenderedDocument {
  title: string;
  type: string;
  slug: string;
  sections: DocumentSection[];
  infoBlock: InfoBlock;
  signatureBlock: SignatureBlock;
  notice: string;
  professionalHeader: ProfessionalHeader;
  issueDate: string;
  documentId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  footerPrefs?: FooterPrefs;
}

export function parseRenderedContent(content: string | null | undefined): RenderedDocument | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.sections && parsed.title) return parsed as RenderedDocument;
    return null;
  } catch {
    return null;
  }
}
