import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";

export type PatientBodyServiceType = "online" | "presencial" | "hibrido";

export interface User {
  id: string;
  name: string;
  email: string;
  hasProfile: boolean;
}

interface Profile extends Partial<User> {
  fullName?: string;
  displayName?: string;
  crp?: string;
  professionalEmail?: string;
  phone?: string;
  documentNumber?: string;
  city?: string;
  state?: string;
  address?: string;
  clinicName?: string;
  website?: string;
  instagram?: string;
  defaultCancellationPolicy?: string;
  documentFooterText?: string;
  documentPrimaryColor?: string;
  documentSecondaryColor?: string;
  showGeneratedBy?: boolean;
  showDocumentCode?: boolean;
  showIssuedAt?: boolean;
  showPageNumber?: boolean;
  showQrCode?: boolean;
  logoUrl?: string;
  signatureUrl?: string;
}

interface Patient {
  id: string;
  fullName: string;
  cpf?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  serviceType: PatientBodyServiceType;
  legalGuardianName?: string;
  legalGuardianCpf?: string;
  legalGuardianRelationship?: string;
  notes?: string;
}

interface TemplateField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  isActive: boolean;
  fieldsSchema: { fields: TemplateField[] };
}

interface DocumentRecord {
  id: string;
  title: string;
  patientId: string;
  templateId: string;
  patient?: Patient;
  template?: Template;
  createdAt: string;
  status: "rascunho" | "gerado" | "enviado" | "aguardando_aceite" | "aceito" | "revogado";
  publicToken?: string | null;
  acceptedAt?: string | null;
  renderedContent?: string | null;
  formData?: Record<string, unknown>;
  psychologistName?: string;
  crp?: string;
  clinicName?: string;
}

interface DbState {
  user: User;
  profile: Profile | null;
  patients: Patient[];
  templates: Template[];
  documents: DocumentRecord[];
}

interface QueryOptions {
  query?: UseQueryOptions<any, any, any, any>;
}

interface LoginInput {
  data: { email: string; password: string };
}

interface RegisterInput {
  data: { name: string; email: string; password: string };
}

interface CreateProfileInput {
  data: Record<string, unknown>;
}

interface UpdateProfileInput {
  data: Record<string, unknown>;
}

interface ChangePasswordInput {
  data: { currentPassword: string; newPassword: string };
}

interface CreatePatientInput {
  data: Partial<Patient>;
}

interface UpdatePatientInput {
  patientId: string;
  data: Partial<Patient>;
}

interface DeletePatientInput {
  patientId: string;
}

interface CreateDocumentInput {
  data: {
    patientId: string;
    templateId: string;
    title: string;
    formData: Record<string, unknown>;
  };
}

interface DocumentMutationInput {
  documentId: string;
}

interface PublicAcceptInput {
  token: string;
  data: {
    acceptedName: string;
    acceptedCpf?: string;
    acceptedEmail?: string;
    confirmed: boolean;
  };
}

interface AcceptDocumentInput {
  token: string;
  data: PublicAcceptInput["data"];
}

interface PublicDocumentResponse {
  document: {
    id: string;
    title: string;
    renderedContent?: string | null;
    status: DocumentRecord["status"];
    acceptedAt?: string | null;
    acceptanceCount?: number;
    professionalSnapshot?: Record<string, unknown>;
    patientSnapshot?: Record<string, unknown>;
  };
  professional?: {
    fullName?: string;
    crp?: string;
    city?: string;
    state?: string;
  };
  acceptanceUrl?: string;
}

interface CreateLeadInput {
  data: {
    name: string;
    email: string;
    phone: string;
    source: string;
    professionStage: string;
    mainPain: string;
    consent: boolean;
  };
}

interface KitFormOption {
  label: string;
  value: string;
}

interface KitFormField {
  name?: string;
  key?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<KitFormOption | string>;
}

interface KitFormResponse {
  fields?: KitFormField[];
  buttonText?: string;
  submitButtonText?: string;
  successMessage?: string;
  message?: string;
}

interface KitLeadResponse {
  message: string;
  leadId?: string;
  downloadUrl?: string;
  kitFiles?: unknown[];
}

interface UploadAssetInput {
  file: File;
}

interface UploadProfileResponse {
  message: string;
  profile: Profile;
}

interface PatientListParams {
  search?: string;
  serviceType?: PatientBodyServiceType;
  patientId?: string;
}

interface DocumentListParams {
  patientId?: string;
  templateType?: string;
  status?: string;
}

interface DashboardStats {
  totalPatients: number;
  totalDocuments: number;
  documentsThisMonth?: number;
  documentsAwaitingAcceptance: number;
  documentsAccepted: number;
  planName?: string;
  planDocumentLimit?: number | null;
  planDocumentsUsed?: number;
}

const DB_KEY = "psidocs:mock-db";
const TOKEN_KEY = "token";
const USER_KEY = "user";

let baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_TARGET || "/api";
let authTokenGetter: (() => Promise<string | null>) | null = null;

function createSeedDb(): DbState {
  const user: User = {
    id: "user-1",
    name: "Dra. Helena Costa",
    email: "helena@psidocs.local",
    hasProfile: true,
  };

  const profile: Profile = {
    id: user.id,
    name: user.name,
    email: user.email,
    hasProfile: true,
    fullName: user.name,
    displayName: user.name,
    crp: "00/12345",
    professionalEmail: user.email,
    phone: "(11) 99999-0000",
    documentNumber: "123.456.789-00",
    city: "São Paulo",
    state: "SP",
    address: "Rua Exemplo, 123",
    clinicName: "DocusPsi Clínica",
    website: "https://psidocs.local",
    instagram: "@psidocs",
    defaultCancellationPolicy: "Cancelamentos com 24 horas de antecedência.",
    documentFooterText: "Atendimento psicológico com cuidado e precisão.",
    documentPrimaryColor: "#8B5CF6",
    documentSecondaryColor: "#675CF1",
    showGeneratedBy: true,
    showDocumentCode: true,
    showIssuedAt: true,
    showPageNumber: true,
    showQrCode: false,
    logoUrl: null as unknown as string,
    signatureUrl: null as unknown as string,
  };

  const patients: Patient[] = [
    {
      id: "patient-1",
      fullName: "Ana Silva",
      cpf: "111.222.333-44",
      birthDate: "1995-04-18",
      email: "ana.silva@email.com",
      phone: "(11) 98888-7777",
      serviceType: "online",
      notes: "Paciente inicial de demonstração.",
    },
    {
      id: "patient-2",
      fullName: "Bruno Pereira",
      cpf: "222.333.444-55",
      birthDate: "1988-09-03",
      email: "bruno.pereira@email.com",
      phone: "(11) 97777-6666",
      serviceType: "presencial",
    },
  ];

  const templates: Template[] = [
    {
      id: "template-contrato",
      name: "Contrato de Atendimento",
      slug: "contrato-atendimento",
      description: "Contrato para formalização do atendimento psicológico.",
      type: "contrato",
      isActive: true,
      fieldsSchema: {
        fields: [
          { key: "sessionCount", label: "Quantidade de sessões", type: "number", required: true },
          { key: "frequency", label: "Frequência", type: "select", required: true, options: ["Semanal", "Quinzenal", "Mensal"] },
        ],
      },
    },
    {
      id: "template-atestado",
      name: "Atestado Psicológico",
      slug: "atestado-psicologico",
      description: "Atestado simples para comprovação de comparecimento.",
      type: "atestado",
      isActive: true,
      fieldsSchema: {
        fields: [
          { key: "period", label: "Período", type: "text", required: true },
          { key: "reason", label: "Motivo", type: "textarea", required: true },
        ],
      },
    },
    {
      id: "template-relatorio",
      name: "Relatório Clínico",
      slug: "relatorio-clinico",
      description: "Relatório com resumo da evolução do paciente.",
      type: "relatorio",
      isActive: true,
      fieldsSchema: {
        fields: [
          { key: "summary", label: "Resumo", type: "textarea", required: true },
        ],
      },
    },
  ];

  const documents: DocumentRecord[] = [
    buildDocumentRecord({
      id: "doc-1",
      title: "Atestado Psicológico - Ana Silva",
      patientId: "patient-1",
      templateId: "template-atestado",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: "gerado",
      publicToken: "public-ana-1",
      renderedContent: buildRenderedContent({
        title: "Atestado Psicológico",
        slug: "atestado-psicologico",
        template: templates[1],
        patient: patients[0],
        profile,
        issueDate: new Date().toISOString(),
        formData: { period: "07 a 10 de maio", reason: "Comparecimento em consulta" },
      }),
      formData: { period: "07 a 10 de maio", reason: "Comparecimento em consulta" },
      psychologistName: profile.fullName,
      crp: profile.crp,
      clinicName: profile.clinicName,
    }, patients, templates),
    buildDocumentRecord({
      id: "doc-2",
      title: "Relatório Clínico - Bruno Pereira",
      patientId: "patient-2",
      templateId: "template-relatorio",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      status: "aguardando_aceite",
      publicToken: "public-bruno-1",
      renderedContent: buildRenderedContent({
        title: "Relatório Clínico",
        slug: "relatorio-clinico",
        template: templates[2],
        patient: patients[1],
        profile,
        issueDate: new Date().toISOString(),
        formData: { summary: "Paciente apresenta boa evolução." },
      }),
      formData: { summary: "Paciente apresenta boa evolução." },
      psychologistName: profile.fullName,
      crp: profile.crp,
      clinicName: profile.clinicName,
    }, patients, templates),
  ];

  return { user, profile, patients, templates, documents };
}

function buildDocumentRecord(
  record: Omit<DocumentRecord, "patient" | "template">,
  patients: Patient[],
  templates: Template[],
): DocumentRecord {
  return {
    ...record,
    patient: patients.find((patient) => patient.id === record.patientId),
    template: templates.find((template) => template.id === record.templateId),
  };
}

function buildRenderedContent(input: {
  title: string;
  slug: string;
  template: Template;
  patient: Patient;
  profile: Profile;
  issueDate: string;
  formData: Record<string, unknown>;
}): string {
  return JSON.stringify({
    title: input.title,
    type: input.template.type,
    slug: input.slug,
    sections: [
      {
        title: "Dados do Atendimento",
        content: `Paciente ${input.patient.fullName}`,
      },
      {
        title: "Conteúdo",
        content: Object.entries(input.formData)
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join("\n"),
      },
    ],
    infoBlock: {
      rows: [
        { label: "Paciente", value: input.patient.fullName },
        { label: "CRP", value: input.profile.crp || "" },
      ],
    },
    signatureBlock: {
      professional: {
        name: input.profile.fullName || input.profile.name || "",
        crp: input.profile.crp || "",
        role: "Psicóloga",
      },
      patient: { name: input.patient.fullName, role: "Paciente" },
      city: input.profile.city || "",
      state: input.profile.state || "",
      date: input.issueDate,
    },
    notice: input.profile.defaultCancellationPolicy || "",
    professionalHeader: {
      fullName: input.profile.fullName || "",
      crp: input.profile.crp || "",
      clinicName: input.profile.clinicName,
      email: input.profile.professionalEmail || input.profile.email,
      phone: input.profile.phone,
      city: input.profile.city || "",
      state: input.profile.state || "",
      address: input.profile.address,
      website: input.profile.website,
      instagram: input.profile.instagram,
    },
    issueDate: input.issueDate,
    primaryColor: input.profile.documentPrimaryColor,
    secondaryColor: input.profile.documentSecondaryColor,
    logoUrl: input.profile.logoUrl,
    footerPrefs: {
      text: input.profile.documentFooterText,
      showGeneratedBy: input.profile.showGeneratedBy ?? true,
      showDocumentCode: input.profile.showDocumentCode ?? true,
      showIssuedAt: input.profile.showIssuedAt ?? true,
      showPageNumber: input.profile.showPageNumber ?? true,
    },
  });
}

function readDb(): DbState {
  if (typeof window === "undefined") {
    return createSeedDb();
  }

  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    const seed = createSeedDb();
    window.localStorage.setItem(DB_KEY, JSON.stringify(seed));
    window.localStorage.setItem(USER_KEY, JSON.stringify(seed.user));
    return seed;
  }

  try {
    return JSON.parse(raw) as DbState;
  } catch {
    const seed = createSeedDb();
    window.localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
}

function writeDb(nextDb: DbState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(nextDb));
  window.localStorage.setItem(USER_KEY, JSON.stringify(nextDb.user));
}

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function getAuthedUser(db: DbState): User {
  if (typeof window === "undefined") {
    return db.user;
  }

  const storedUser = window.localStorage.getItem(USER_KEY);
  if (!storedUser) return db.user;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    return db.user;
  }
}

async function getAuthToken() {
  if (authTokenGetter) {
    return authTokenGetter();
  }
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getApiBaseUrl() {
  return baseUrl.replace(/\/$/, "");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!headers.has("Content-Type") && options.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new CustomEvent("docuspsi:auth-expired"));
    }

    const message = payload && typeof payload === "object" && "message" in payload
      ? String((payload as { message?: unknown }).message)
      : "Erro ao comunicar com o backend";
    const error = new Error(message) as Error & { data?: unknown; status?: number };
    error.data = payload;
    error.status = response.status;
    throw error;
  }

  return payload as T;
}

function queryString(params?: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

function currentProfile(db: DbState): Profile {
  return db.profile || {
    id: db.user.id,
    name: db.user.name,
    email: db.user.email,
    hasProfile: db.user.hasProfile,
  };
}

function mapDocument(db: DbState, document: DocumentRecord): DocumentRecord {
  return {
    ...document,
    patient: db.patients.find((patient) => patient.id === document.patientId),
    template: db.templates.find((template) => template.id === document.templateId),
  };
}

function filterPatients(db: DbState, params?: PatientListParams) {
  const search = params?.search?.toLowerCase().trim();
  return db.patients.filter((patient) => {
    if (params?.serviceType && patient.serviceType !== params.serviceType) return false;
    if (!search) return true;
    return [patient.fullName, patient.cpf, patient.email, patient.phone]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });
}

function filterDocuments(db: DbState, params?: DocumentListParams) {
  let docs = [...db.documents].map((document) => mapDocument(db, document));
  if (params?.patientId) {
    docs = docs.filter((document) => document.patientId === params.patientId);
  }
  if (params?.status) {
    docs = docs.filter((document) => document.status === params.status);
  }
  if (params?.templateType) {
    docs = docs.filter((document) => document.template?.type === params.templateType);
  }
  return docs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function ensureDocumentAccess(document: DocumentRecord) {
  if (!document.publicToken || document.status === "revogado") {
    throw new Error("Documento indisponível");
  }
}

function normalizePublicDocument(payload: DocumentRecord | PublicDocumentResponse): DocumentRecord {
  if ("document" in payload) {
    const professional = payload.professional || {};
    return {
      id: payload.document.id,
      title: payload.document.title,
      patientId: "",
      templateId: "",
      createdAt: new Date().toISOString(),
      status: payload.document.status,
      publicToken: null,
      acceptedAt: payload.document.acceptedAt || null,
      renderedContent: payload.document.renderedContent || null,
      psychologistName: professional.fullName,
      crp: professional.crp,
      clinicName: [professional.city, professional.state].filter(Boolean).join("/"),
    };
  }

  return payload;
}

export function setBaseUrl(url: string) {
  baseUrl = url;
}

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  authTokenGetter = getter;
}

export function getListPatientsQueryKey(params?: PatientListParams) {
  return ["patients", params?.search || "", params?.serviceType || "all"] as const;
}

export function getGetDocumentQueryKey(documentId: string) {
  return ["documents", documentId] as const;
}

export function getGetProfileQueryKey() {
  return ["profile"] as const;
}

export function getGetMeQueryKey() {
  return ["me"] as const;
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ data }: LoginInput) => {
      const result = await request<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, result.token);
        window.localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      }
      return result;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({ data }: RegisterInput) => {
      const result = await request<{ token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, result.token);
        window.localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      }
      return result;
    },
  });
}

export function useGetMe(options?: QueryOptions) {
  return useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: async () => request<User>("/auth/me"),
    ...options?.query,
  });
}

export function useCreateProfile() {
  return useMutation({
    mutationFn: async ({ data }: CreateProfileInput) => {
      return request<Profile>("/profile", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useGetProfile(options?: QueryOptions) {
  return useQuery({
    queryKey: getGetProfileQueryKey(),
    queryFn: async () => request<Profile>("/profile"),
    ...options?.query,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async ({ data }: UpdateProfileInput) => {
      return request<Profile>("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useUploadLogo() {
  return useMutation({
    mutationFn: async ({ file }: UploadAssetInput) => {
      const formData = new FormData();
      formData.append("file", file);
      return request<UploadProfileResponse>("/uploads/logo", {
        method: "POST",
        body: formData,
      });
    },
  });
}

export function useUploadSignature() {
  return useMutation({
    mutationFn: async ({ file }: UploadAssetInput) => {
      const formData = new FormData();
      formData.append("file", file);
      return request<UploadProfileResponse>("/uploads/signature", {
        method: "POST",
        body: formData,
      });
    },
  });
}

export function useDeleteLogo() {
  return useMutation({
    mutationFn: async () => request<UploadProfileResponse>("/uploads/logo", { method: "DELETE" }),
  });
}

export function useDeleteSignature() {
  return useMutation({
    mutationFn: async () => request<UploadProfileResponse>("/uploads/signature", { method: "DELETE" }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ data }: ChangePasswordInput) => {
      return request<{ success: boolean }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await request<{ success: boolean }>("/auth/logout", { method: "POST" }).catch(() => null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
      }
      return true;
    },
  });
}

export function useListPatients(params?: PatientListParams, options?: QueryOptions) {
  return useQuery({
    queryKey: getListPatientsQueryKey(params),
    queryFn: async () => request<Patient[]>(`/patients${queryString({ search: params?.search, serviceType: params?.serviceType })}`),
    ...options?.query,
  });
}

export function useGetPatient(patientId: string, options?: QueryOptions) {
  return useQuery({
    queryKey: ["patient", patientId] as const,
    queryFn: async () => request<Patient>(`/patients/${patientId}`),
    enabled: !!patientId,
    ...options?.query,
  });
}

export function useCreatePatient() {
  return useMutation({
    mutationFn: async ({ data }: CreatePatientInput) => {
      return request<Patient>("/patients", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useUpdatePatient() {
  return useMutation({
    mutationFn: async ({ patientId, data }: UpdatePatientInput) => {
      return request<Patient>(`/patients/${patientId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useDeletePatient() {
  return useMutation({
    mutationFn: async ({ patientId }: DeletePatientInput) => {
      return request<{ success: boolean }>(`/patients/${patientId}`, { method: "DELETE" });
    },
  });
}

export function useListTemplates(options?: QueryOptions) {
  return useQuery({
    queryKey: ["templates"] as const,
    queryFn: async () => request<Template[]>("/templates"),
    ...options?.query,
  });
}

export function useGetTemplate(templateSlug: string, options?: QueryOptions) {
  return useQuery({
    queryKey: ["template", templateSlug] as const,
    queryFn: async () => request<Template>(`/templates/${templateSlug}`),
    enabled: !!templateSlug,
    ...options?.query,
  });
}

export function useCreateDocument() {
  return useMutation({
    mutationFn: async ({ data }: CreateDocumentInput) => {
      return request<DocumentRecord>("/documents", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useListDocuments(params?: DocumentListParams, options?: QueryOptions) {
  return useQuery({
    queryKey: ["documents", params?.patientId || "all", params?.templateType || "all", params?.status || "all"] as const,
    queryFn: async () => request<DocumentRecord[]>(`/documents${queryString({ patientId: params?.patientId, templateType: params?.templateType, status: params?.status })}`),
    ...options?.query,
  });
}

export function useGetDocument(documentId: string, options?: QueryOptions) {
  return useQuery({
    queryKey: getGetDocumentQueryKey(documentId),
    queryFn: async () => request<DocumentRecord>(`/documents/${documentId}`),
    enabled: !!documentId,
    ...options?.query,
  });
}

export function useGenerateDocument() {
  return useMutation({
    mutationFn: async ({ documentId }: DocumentMutationInput) => {
      return request<DocumentRecord>(`/documents/${documentId}/generate`, { method: "POST" });
    },
  });
}

export function useRevokeDocument() {
  return useMutation({
    mutationFn: async ({ documentId }: DocumentMutationInput) => {
      return request<DocumentRecord>(`/documents/${documentId}/revoke`, { method: "POST" });
    },
  });
}

export function useGetPublicDocument(token: string, options?: QueryOptions) {
  return useQuery({
    queryKey: ["public-document", token] as const,
    queryFn: async () => normalizePublicDocument(await request<DocumentRecord | PublicDocumentResponse>(`/public/documents/${token}`)),
    enabled: !!token,
    ...options?.query,
  });
}

export function useAcceptDocument() {
  return useMutation({
    mutationFn: async ({ token, data }: AcceptDocumentInput) => {
      return request<{ message: string; acceptedAt?: string; sealUrl?: string }>(`/public/documents/${token}/accept`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useGetKitForm(options?: QueryOptions) {
  return useQuery({
    queryKey: ["public-kit-form"] as const,
    queryFn: async () => request<KitFormResponse>("/public/kit-form"),
    ...options?.query,
  });
}

export function useCreateLead() {
  return useMutation({
    mutationFn: async ({ data }: CreateLeadInput) => {
      return request<KitLeadResponse>("/public/kit-form/submit", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useGetDashboardStats(options?: QueryOptions) {
  return useQuery({
    queryKey: ["dashboard-stats"] as const,
    queryFn: async (): Promise<DashboardStats> => request<DashboardStats>("/dashboard/stats"),
    ...options?.query,
  });
}

export function useGetRecentDocuments(options?: QueryOptions) {
  return useQuery({
    queryKey: ["recent-documents"] as const,
    queryFn: async () => request<DocumentRecord[]>("/dashboard/recent-documents"),
    ...options?.query,
  });
}
