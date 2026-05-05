export type TemplateFieldType = "text" | "textarea" | "select" | "radio" | "date" | "time" | "currency" | "cpf" | "phone" | "checkbox" | "combobox";

export interface LibraryTemplateField {
  key: string;
  name: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  options?: string[];
}

export interface LibraryTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  category: string;
  contentHtml: string;
  fieldsSchema: { fields: LibraryTemplateField[] };
  structure: string[];
  usageNotes: string;
  isActive: boolean;
  modality?: string;
  audience?: string;
  useCase?: string;
  tags?: string[];
}

const paymentOptions = ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro", "Transferência bancária", "Plano de saúde", "Outro"];
const modalityOptions = ["Presencial", "Online", "Híbrido"];
const durationOptions = ["30 minutos", "40 minutos", "45 minutos", "50 minutos", "60 minutos", "90 minutos", "Outro"];
const frequencyOptions = ["Semanal", "Quinzenal", "Mensal", "Pontual", "Conforme demanda", "Outro"];
const noticeOptions = ["12 horas", "24 horas", "48 horas", "72 horas", "Outro"];
const platformOptions = ["Google Meet", "Zoom", "Microsoft Teams", "WhatsApp Video", "Outra"];
const channelOptions = ["WhatsApp", "E-mail", "Telefone", "Plataforma de atendimento", "Outro"];
const relationshipOptions = ["Mãe", "Pai", "Responsável legal", "Avó/Avô", "Tia/Tio", "Outro"];
const referenceOptions = ["Sessão de psicoterapia individual", "Pacote de sessões", "Avaliação psicológica", "Atendimento online", "Outro"];

function f(name: string, label: string, type: TemplateFieldType, required = true, options?: string[]): LibraryTemplateField {
  return { key: name, name, label, type, required, options };
}

const commonFields = {
  issueDate: f("document.issueDate", "Data de emissão", "date"),
  modality: f("session.modality", "Modalidade", "select", true, modalityOptions),
  sessionValue: f("session.value", "Valor da sessão", "currency"),
  duration: f("session.duration", "Duração da sessão", "select", true, durationOptions),
  frequency: f("session.frequency", "Frequência", "select", true, frequencyOptions),
  paymentMethod: f("payment.method", "Forma de pagamento", "select", true, paymentOptions),
  paymentDate: f("payment.date", "Data do pagamento", "date"),
  cancellationNotice: f("cancellation.minimumNotice", "Antecedência para cancelamento", "select", true, noticeOptions),
  cancellationPolicy: f("cancellation.policy", "Política de cancelamento", "textarea"),
  communicationChannel: f("communication.channel", "Canal de comunicação", "select", true, channelOptions),
  platform: f("online.platform", "Plataforma utilizada", "select", true, platformOptions),
  backupChannel: f("online.backupChannel", "Canal alternativo", "select", true, channelOptions),
  emergencyGuidance: f("online.emergencyGuidance", "Orientação para urgência/emergência", "textarea"),
  officeAddress: f("office.address", "Endereço do consultório", "text"),
  responsibleName: f("guardian.name", "Nome do responsável legal", "text"),
  responsibleCpf: f("guardian.cpf", "CPF do responsável legal", "cpf"),
  relationship: f("guardian.relationship", "Grau de parentesco", "select", true, relationshipOptions),
  notes: f("document.notes", "Observações adicionais", "textarea", false),
};

function html(sections: string[], intro: string): string {
  return sections.map((section, index) => `
<section class="document-section">
  <h2 class="section-title">${index + 1}. ${section}</h2>
  <p class="section-text">${index === 0 ? intro : sectionText(section)}</p>
</section>`).join("\n");
}

function sectionText(section: string) {
  const lower = section.toLowerCase();
  if (lower.includes("sigilo")) return "As informações compartilhadas no atendimento devem ser tratadas conforme o sigilo profissional, observados seus limites éticos e legais.";
  if (lower.includes("dados")) return "Os dados pessoais e sensíveis serão utilizados para organização do atendimento e emissão documental, com cuidado, acesso restrito e finalidade compatível.";
  if (lower.includes("pagamento") || lower.includes("honorários")) return "Os honorários, valores, datas e forma de pagamento devem seguir os combinados registrados nos campos deste documento.";
  if (lower.includes("cancel") || lower.includes("faltas") || lower.includes("remarca")) return "Cancelamentos, atrasos, faltas e remarcações seguem a política informada pela(o) profissional e combinada com a pessoa atendida.";
  if (lower.includes("online") || lower.includes("plataforma") || lower.includes("técnicas") || lower.includes("conexão")) return "O atendimento remoto depende de ambiente reservado, conexão adequada, plataforma definida e canal alternativo para intercorrências.";
  if (lower.includes("urgência") || lower.includes("emergência")) return "Em situações de urgência ou emergência, a pessoa atendida deve procurar serviço de saúde, pronto atendimento ou suporte local de emergência.";
  if (lower.includes("consentimento") || lower.includes("autorização")) return "A pessoa atendida ou responsável declara ciência das informações apresentadas e poderá solicitar esclarecimentos antes da emissão.";
  if (lower.includes("declaração")) return "Declara-se apenas a informação administrativa necessária, sem exposição de diagnóstico, conteúdo clínico ou detalhes do processo psicológico.";
  return "Esta seção organiza os combinados administrativos do atendimento psicológico, devendo ser revisada e adaptada pela(o) profissional antes da emissão.";
}

function template(input: Omit<LibraryTemplate, "id" | "isActive">): LibraryTemplate {
  return {
    id: `template-${input.slug}`,
    isActive: true,
    ...input,
  };
}

function make(input: {
  slug: string;
  name: string;
  description: string;
  type: string;
  category: string;
  structure: string[];
  fields: LibraryTemplateField[];
  modality?: string;
  audience?: string;
  useCase?: string;
  tags?: string[];
  usageNotes?: string;
  intro?: string;
}): LibraryTemplate {
  return template({
    ...input,
    contentHtml: html(input.structure, input.intro || `Pelo presente modelo editável, {{professional.fullName}}, CRP {{professional.crp}}, organiza informações administrativas referentes à pessoa atendida {{patient.fullName}}.`),
    fieldsSchema: { fields: input.fields },
    usageNotes: input.usageNotes || "Modelo editável para apoio administrativo. Revise antes de emitir.",
  });
}

const contractSections = {
  presencial: ["Identificação das Partes", "Objeto do Contrato", "Local e Modalidade do Atendimento", "Frequência e Duração das Sessões", "Honorários e Forma de Pagamento", "Cancelamentos, Atrasos e Faltas", "Sigilo Profissional", "Comunicação Fora da Sessão", "Tratamento de Dados Pessoais", "Encerramento do Acompanhamento", "Disposições Finais"],
  online: ["Identificação das Partes", "Objeto do Contrato", "Modalidade Online", "Condições Técnicas para Atendimento", "Ambiente Reservado e Confidencialidade", "Intercorrências de Conexão", "Honorários e Forma de Pagamento", "Cancelamentos e Faltas", "Sigilo Profissional", "Situações de Urgência e Emergência", "Tratamento de Dados Pessoais", "Disposições Finais"],
  hibrido: ["Identificação das Partes", "Objeto do Contrato", "Modalidade Híbrida", "Atendimento Presencial", "Atendimento Online", "Frequência e Duração", "Honorários e Forma de Pagamento", "Cancelamentos e Remarcações", "Sigilo Profissional", "Tratamento de Dados Pessoais", "Disposições Finais"],
  pacote: ["Identificação das Partes", "Objeto do Contrato", "Quantidade de Sessões", "Validade do Pacote", "Modalidade do Atendimento", "Honorários e Forma de Pagamento", "Remarcações, Faltas e Cancelamentos", "Sigilo Profissional", "Tratamento de Dados", "Disposições Finais"],
  simples: ["Partes", "Serviço Prestado", "Sessões e Pagamento", "Cancelamentos", "Sigilo", "Disposições Finais"],
};

export const TEMPLATE_LIBRARY: LibraryTemplate[] = [
  make({ slug: "contrato-terapeutico-presencial", name: "Contrato Terapêutico - Atendimento Presencial", description: "Contrato completo para atendimento clínico presencial em consultório.", type: "contrato", category: "Contrato", modality: "Presencial", audience: "Adulto", useCase: "Atendimento individual", tags: ["Presencial", "Completo", "Editável"], structure: contractSections.presencial, fields: [commonFields.officeAddress, commonFields.sessionValue, commonFields.duration, commonFields.frequency, commonFields.paymentMethod, commonFields.cancellationPolicy, commonFields.communicationChannel, commonFields.issueDate] }),
  make({ slug: "contrato-terapeutico-online", name: "Contrato Terapêutico - Atendimento Online", description: "Contrato para atendimento remoto com plataforma, canal alternativo e orientação de emergência.", type: "contrato", category: "Contrato", modality: "Online", audience: "Adulto", useCase: "Atendimento individual", tags: ["Online", "Completo", "Editável"], structure: contractSections.online, fields: [commonFields.platform, commonFields.backupChannel, commonFields.sessionValue, commonFields.duration, commonFields.frequency, commonFields.paymentMethod, commonFields.cancellationPolicy, commonFields.emergencyGuidance, commonFields.issueDate] }),
  make({ slug: "contrato-terapeutico-hibrido", name: "Contrato Terapêutico - Atendimento Híbrido", description: "Modelo para alternância entre atendimento presencial e online.", type: "contrato", category: "Contrato", modality: "Híbrido", audience: "Adulto", useCase: "Atendimento individual", tags: ["Híbrido", "Consultório", "Online"], structure: contractSections.hibrido, fields: [commonFields.officeAddress, f("online.platform", "Plataforma online", "select", true, platformOptions), commonFields.sessionValue, commonFields.duration, commonFields.frequency, commonFields.paymentMethod, commonFields.cancellationPolicy, commonFields.issueDate] }),
  make({ slug: "contrato-terapeutico-pacote-sessoes", name: "Contrato Terapêutico - Pacote de Sessões", description: "Modelo para pacote mensal, quinzenal ou por quantidade de sessões.", type: "contrato", category: "Contrato", modality: "Não se aplica", audience: "Adulto", useCase: "Pacote de sessões", tags: ["Pacote", "Pagamento", "Editável"], structure: contractSections.pacote, fields: [f("package.sessionCount", "Quantidade de sessões", "text"), f("payment.amount", "Valor do pacote", "currency"), commonFields.paymentMethod, f("package.validUntil", "Validade do pacote", "date"), commonFields.modality, f("cancellation.policy", "Política de remarcação", "textarea"), commonFields.issueDate] }),
  make({ slug: "contrato-terapeutico-simples", name: "Contrato Terapêutico - Versão Simples", description: "Contrato objetivo para registrar combinados essenciais.", type: "contrato", category: "Contrato", modality: "Não se aplica", audience: "Adulto", useCase: "Atendimento individual", tags: ["Simples", "Objetivo", "Editável"], structure: contractSections.simples, fields: [commonFields.modality, commonFields.sessionValue, commonFields.duration, commonFields.frequency, commonFields.paymentMethod, commonFields.cancellationNotice, commonFields.issueDate] }),

  make({ slug: "termo-consentimento-adulto", name: "Termo de Consentimento Livre e Informado - Adulto", description: "Termo para paciente adulto, com sigilo, registros, dados pessoais e consentimento.", type: "termo", category: "Termo de Consentimento", modality: "Não se aplica", audience: "Adulto", useCase: "Atendimento individual", tags: ["Adulto", "Consentimento", "Editável"], structure: ["Finalidade do Atendimento", "Natureza do Serviço Psicológico", "Sigilo Profissional", "Limites do Sigilo", "Registros e Documentos", "Tratamento de Dados Pessoais", "Direitos da Pessoa Atendida", "Consentimento"], fields: [f("care.purpose", "Finalidade do atendimento", "textarea"), f("records.consent", "Consentimento para registros", "radio", true, ["Sim", "Não"]), f("data.consent", "Consentimento para tratamento de dados", "radio", true, ["Sim", "Não"]), commonFields.notes, commonFields.issueDate] }),
  make({ slug: "termo-consentimento-online", name: "Termo de Consentimento - Atendimento Online", description: "Consentimento específico para atendimento remoto.", type: "termo", category: "Termo de Consentimento", modality: "Online", audience: "Adulto", useCase: "Atendimento individual", tags: ["Online", "Consentimento"], structure: ["Ciência sobre a Modalidade Online", "Plataforma Utilizada", "Ambiente Reservado", "Condições Técnicas", "Intercorrências de Conexão", "Sigilo Profissional", "Urgência e Emergência", "Tratamento de Dados", "Consentimento"], fields: [commonFields.platform, f("online.privateEnvironment", "Ambiente reservado confirmado", "radio", true, ["Sim", "Não"]), commonFields.emergencyGuidance, commonFields.issueDate] }),
  make({ slug: "termo-consentimento-menor", name: "Termo de Consentimento - Menor de Idade", description: "Modelo para consentimento de responsável legal por criança ou adolescente.", type: "termo", category: "Termo de Consentimento", modality: "Não se aplica", audience: "Menor de idade", useCase: "Atendimento individual", tags: ["Menor", "Responsável", "Consentimento"], structure: ["Identificação da Criança ou Adolescente", "Identificação do Responsável Legal", "Ciência sobre o Atendimento", "Sigilo e Comunicação com Responsáveis", "Tratamento de Dados Pessoais", "Consentimento do Responsável"], fields: [commonFields.responsibleName, commonFields.responsibleCpf, commonFields.relationship, commonFields.modality, commonFields.issueDate] }),
  make({ slug: "termo-consentimento-dados-comunicacao", name: "Termo de Consentimento - Uso de Dados e Comunicação", description: "Termo para alinhar dados pessoais, contato e envio de documentos.", type: "termo", category: "Termo de Consentimento", modality: "Não se aplica", audience: "Adulto", useCase: "Organização", tags: ["Dados", "Comunicação", "LGPD"], structure: ["Dados Coletados", "Finalidade do Tratamento", "Canais de Comunicação", "Envio de Documentos", "Armazenamento e Organização", "Direitos da Pessoa Atendida", "Consentimento"], fields: [commonFields.communicationChannel, f("documents.deliveryChannel", "Canal de envio de documentos", "select", true, channelOptions), f("data.notes", "Observações sobre dados e comunicação", "textarea", false), commonFields.issueDate] }),
  make({ slug: "termo-consentimento-simples", name: "Termo de Consentimento - Versão Simples", description: "Termo curto para rotina clínica, com linguagem objetiva.", type: "termo", category: "Termo de Consentimento", modality: "Não se aplica", audience: "Adulto", useCase: "Atendimento individual", tags: ["Simples", "Consentimento"], structure: ["Finalidade", "Sigilo", "Registros", "Dados Pessoais", "Consentimento"], fields: [f("care.purpose", "Finalidade", "textarea"), f("data.consent", "Consentimento para dados pessoais", "radio", true, ["Sim", "Não"]), commonFields.issueDate] }),

  make({ slug: "termo-online-psicoterapia-individual", name: "Termo Online - Psicoterapia Individual", description: "Termo para psicoterapia individual realizada online.", type: "termo-online", category: "Termo Online", modality: "Online", audience: "Adulto", useCase: "Atendimento individual", tags: ["Online", "Psicoterapia"], structure: ["Modalidade Online", "Plataforma Utilizada", "Condições Técnicas", "Ambiente Reservado", "Sigilo", "Intercorrências", "Urgência e Emergência", "Consentimento"], fields: [commonFields.platform, commonFields.backupChannel, commonFields.emergencyGuidance, f("online.privateEnvironment", "Ambiente reservado confirmado", "radio", true, ["Sim", "Não"]), commonFields.issueDate] }),
  make({ slug: "termo-online-primeira-consulta", name: "Termo Online - Primeira Consulta / Triagem", description: "Termo para sessão inicial online, com limites de triagem e encaminhamentos.", type: "termo-online", category: "Termo Online", modality: "Online", audience: "Adulto", useCase: "Primeira consulta", tags: ["Online", "Triagem"], structure: ["Finalidade da Primeira Consulta", "Modalidade Online", "Limites da Triagem", "Encaminhamentos", "Condições Técnicas", "Sigilo", "Consentimento"], fields: [commonFields.platform, f("screening.purpose", "Finalidade da primeira consulta", "textarea"), commonFields.backupChannel, commonFields.issueDate] }),
  make({ slug: "termo-online-adolescente-responsavel", name: "Termo Online - Adolescente com Responsável", description: "Termo online para adolescente com ciência do responsável legal.", type: "termo-online", category: "Termo Online", modality: "Online", audience: "Adolescente", useCase: "Atendimento individual", tags: ["Online", "Adolescente", "Responsável"], structure: ["Identificação do Adolescente", "Responsável Legal", "Ciência sobre Atendimento Online", "Privacidade no Ambiente", "Comunicação com Responsável", "Sigilo e seus Limites", "Urgência e Emergência", "Consentimento"], fields: [commonFields.responsibleName, commonFields.responsibleCpf, commonFields.relationship, commonFields.platform, commonFields.emergencyGuidance, commonFields.issueDate] }),
  make({ slug: "termo-online-simples", name: "Termo Online - Versão Simples", description: "Termo curto para atendimento remoto.", type: "termo-online", category: "Termo Online", modality: "Online", audience: "Adulto", useCase: "Atendimento individual", tags: ["Online", "Simples"], structure: ["Modalidade", "Plataforma", "Sigilo", "Condições Técnicas", "Consentimento"], fields: [commonFields.platform, commonFields.backupChannel, commonFields.issueDate] }),

  make({ slug: "autorizacao-menor-crianca", name: "Autorização - Atendimento Psicológico de Criança", description: "Autorização de responsável para atendimento psicológico de criança.", type: "autorizacao", category: "Autorização", modality: "Não se aplica", audience: "Criança", useCase: "Atendimento individual", tags: ["Criança", "Responsável"], structure: ["Identificação da Criança", "Identificação do Responsável", "Autorização para Atendimento", "Ciência sobre a Natureza do Serviço", "Comunicação com Responsável", "Tratamento de Dados", "Assinatura"], fields: [commonFields.responsibleName, commonFields.responsibleCpf, commonFields.relationship, commonFields.modality, commonFields.issueDate] }),
  make({ slug: "autorizacao-menor-adolescente", name: "Autorização - Atendimento Psicológico de Adolescente", description: "Autorização para atendimento de adolescente, com sigilo e autonomia progressiva.", type: "autorizacao", category: "Autorização", modality: "Não se aplica", audience: "Adolescente", useCase: "Atendimento individual", tags: ["Adolescente", "Responsável"], structure: ["Identificação do Adolescente", "Identificação do Responsável", "Autorização", "Sigilo e Autonomia Progressiva", "Comunicação com Responsável", "Tratamento de Dados", "Assinatura"], fields: [commonFields.responsibleName, commonFields.responsibleCpf, commonFields.relationship, commonFields.modality, commonFields.issueDate] }),
  make({ slug: "autorizacao-menor-online", name: "Autorização - Atendimento Online de Menor", description: "Autorização para atendimento online de menor de idade.", type: "autorizacao", category: "Autorização", modality: "Online", audience: "Menor de idade", useCase: "Atendimento individual", tags: ["Online", "Menor", "Responsável"], structure: ["Identificação do Menor", "Responsável Legal", "Autorização para Atendimento Online", "Plataforma Utilizada", "Ambiente Reservado", "Intercorrências Técnicas", "Sigilo e Comunicação", "Consentimento"], fields: [commonFields.responsibleName, commonFields.responsibleCpf, commonFields.relationship, commonFields.platform, commonFields.backupChannel, commonFields.issueDate] }),

  make({ slug: "declaracao-comparecimento-simples", name: "Declaração de Comparecimento - Simples", description: "Declaração objetiva de comparecimento, sem detalhes clínicos.", type: "declaracao", category: "Declaração", modality: "Não se aplica", audience: "Adulto", useCase: "Comparecimento", tags: ["Comparecimento", "Objetiva"], usageNotes: "Evite incluir diagnóstico ou detalhes clínicos em declarações simples.", structure: ["Declaração"], fields: [f("session.date", "Data do atendimento", "date"), commonFields.issueDate], intro: "Declaro, para os fins solicitados, que {{patient.fullName}} compareceu ao atendimento psicológico na data informada, sem exposição de conteúdo clínico." }),
  make({ slug: "declaracao-comparecimento-horario", name: "Declaração de Comparecimento - Com Horário", description: "Declaração com data, horário de início e fim.", type: "declaracao", category: "Declaração", modality: "Não se aplica", audience: "Adulto", useCase: "Comparecimento", tags: ["Comparecimento", "Horário"], usageNotes: "Inclua apenas informações necessárias para comprovação administrativa.", structure: ["Declaração"], fields: [f("session.date", "Data da sessão", "date"), f("session.startTime", "Horário de início", "time"), f("session.endTime", "Horário de fim", "time"), commonFields.modality, commonFields.issueDate] }),
  make({ slug: "declaracao-acompanhamento-sem-detalhes", name: "Declaração de Acompanhamento Psicológico - Sem Detalhes Clínicos", description: "Declara acompanhamento psicológico em realização sem diagnóstico ou conteúdo clínico.", type: "declaracao", category: "Declaração", modality: "Não se aplica", audience: "Adulto", useCase: "Atendimento individual", tags: ["Acompanhamento", "Sem detalhes clínicos"], usageNotes: "Não inclua diagnóstico, hipótese clínica ou detalhes do processo.", structure: ["Declaração"], fields: [f("care.startedAt", "Data de início", "date"), commonFields.modality, commonFields.issueDate] }),
  make({ slug: "declaracao-atendimento-online", name: "Declaração de Atendimento Online", description: "Declara atendimento psicológico realizado online de forma objetiva.", type: "declaracao", category: "Declaração", modality: "Online", audience: "Adulto", useCase: "Comparecimento", tags: ["Online", "Comparecimento"], usageNotes: "Mantenha o texto objetivo e sem conteúdo clínico.", structure: ["Declaração"], fields: [f("session.date", "Data", "date"), f("session.startTime", "Horário", "time"), commonFields.platform, commonFields.issueDate] }),

  make({ slug: "recibo-sessao-avulsa", name: "Recibo de Pagamento - Sessão Avulsa", description: "Recibo para pagamento de sessão individual.", type: "recibo", category: "Recibo", modality: "Não se aplica", audience: "Adulto", useCase: "Atendimento individual", tags: ["Sessão avulsa", "Pagamento"], structure: ["Recibo", "Detalhes do Pagamento", "Declaração de Quitação"], fields: [f("payer.name", "Pagador", "text"), f("payment.amount", "Valor recebido", "currency"), f("payment.amountInWords", "Valor por extenso", "text"), commonFields.paymentDate, commonFields.paymentMethod, f("payment.reference", "Referência", "select", true, referenceOptions), commonFields.issueDate] }),
  make({ slug: "recibo-pacote-sessoes", name: "Recibo de Pagamento - Pacote de Sessões", description: "Recibo para pacote de sessões.", type: "recibo", category: "Recibo", modality: "Não se aplica", audience: "Adulto", useCase: "Pacote de sessões", tags: ["Pacote", "Pagamento"], structure: ["Recibo", "Detalhes do Pacote", "Declaração de Recebimento"], fields: [f("payer.name", "Pagador", "text"), f("payment.amount", "Valor recebido", "currency"), f("payment.amountInWords", "Valor por extenso", "text"), f("package.sessionCount", "Quantidade de sessões", "text"), f("package.period", "Período de referência", "text"), commonFields.paymentMethod, commonFields.paymentDate, commonFields.issueDate] }),
  make({ slug: "recibo-reembolso-plano-saude", name: "Recibo de Pagamento - Plano de Saúde / Reembolso", description: "Recibo para comprovação de pagamento, sem promessa de aceitação pelo plano.", type: "recibo", category: "Recibo", modality: "Não se aplica", audience: "Adulto", useCase: "Reembolso", tags: ["Reembolso", "Plano de saúde"], usageNotes: "Não promete aceitação pelo plano de saúde. Revise dados e exigências do solicitante.", structure: ["Recibo", "Referência do Atendimento", "Observações para Reembolso"], fields: [f("payer.name", "Pagador", "text"), f("payment.amount", "Valor", "currency"), commonFields.paymentDate, f("payment.reference", "Referência do atendimento", "select", true, referenceOptions), f("package.sessionCount", "Quantidade de sessões", "text"), f("professional.documentNumber", "CPF/CNPJ do profissional", "text"), commonFields.notes, commonFields.issueDate], intro: "Documento emitido para fins de comprovação de pagamento, conforme informações prestadas." }),

  make({ slug: "checklist-documental-inicial", name: "Checklist Documental Inicial", description: "Checklist para organização documental inicial da rotina clínica.", type: "guia", category: "Guia/Checklist", modality: "Não se aplica", audience: "Clínica", useCase: "Organização", tags: ["Checklist", "Organização"], structure: ["Dados profissionais", "Contrato", "Termos", "Recibos", "Declarações", "Organização por paciente", "Revisão final"], fields: [commonFields.issueDate], intro: "Checklist editável para apoiar a organização administrativa inicial da rotina documental." }),
  make({ slug: "guia-organizacao-paciente", name: "Guia de Organização por Paciente", description: "Guia para padronizar armazenamento e emissão por paciente.", type: "guia", category: "Guia/Checklist", modality: "Não se aplica", audience: "Clínica", useCase: "Organização", tags: ["Guia", "Organização"], structure: ["Crie uma pasta por paciente", "Separe documentos administrativos", "Mantenha nomes padronizados", "Registre datas de emissão", "Evite espalhar arquivos em múltiplos canais", "Revise permissões de acesso"], fields: [commonFields.issueDate], intro: "Guia editável para apoiar a organização administrativa dos documentos por paciente." }),
  make({ slug: "checklist-atendimento-online", name: "Checklist de Atendimento Online", description: "Checklist para revisar pontos administrativos antes do atendimento remoto.", type: "guia", category: "Guia/Checklist", modality: "Online", audience: "Adulto", useCase: "Atendimento individual", tags: ["Online", "Checklist"], structure: ["Termo online", "Plataforma definida", "Canal alternativo", "Orientação de emergência", "Ambiente reservado", "Dados de contato atualizados", "Consentimento registrado"], fields: [commonFields.platform, commonFields.backupChannel, commonFields.emergencyGuidance, commonFields.issueDate], intro: "Checklist editável para apoiar a preparação administrativa de atendimentos online." }),
];

export function mergeTemplateLibrary<T extends { slug: string }>(remoteTemplates: T[] | undefined): Array<T | LibraryTemplate> {
  const remote = remoteTemplates || [];
  const remoteSlugs = new Set(remote.map((template) => template.slug));
  return [...remote, ...TEMPLATE_LIBRARY.filter((template) => !remoteSlugs.has(template.slug))];
}

export function getLibraryTemplateBySlug(slug: string) {
  return TEMPLATE_LIBRARY.find((template) => template.slug === slug);
}
