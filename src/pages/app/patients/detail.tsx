import { useEffect } from "react";
import { useRoute } from "wouter";
import { useGetPatient, useListDocuments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, User, Calendar, Phone, Mail, FileText, Plus, Download, Edit, Copy, AlertCircle } from "lucide-react";
import { useDownloadPdf } from "@/hooks/use-download-pdf";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

function getStatusBadge(status: string) {
  switch (status) {
    case 'rascunho': return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Rascunho</Badge>;
    case 'gerado': return <Badge variant="secondary" className="bg-[#EDE9FE] text-[#6D28D9] hover:bg-[#EDE9FE]">Gerado</Badge>;
    case 'enviado': return <Badge variant="secondary" className="bg-[#EDE9FE] text-[#6D28D9] hover:bg-[#EDE9FE]">Enviado</Badge>;
    case 'aguardando_aceite': return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Aguardando aceite</Badge>;
    case 'aceito': return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Aceito</Badge>;
    case 'revogado': return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Revogado</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}

export default function PatientDetail() {
  const [, params] = useRoute("/app/patients/:id");
  const patientId = params?.id || "";
  const { toast } = useToast();

  const { data: patient, isLoading: isLoadingPatient, isError: isPatientError } = useGetPatient(patientId);

  const downloadPdf = useDownloadPdf();

  const { data: documents, isLoading: isLoadingDocs, isError: isDocsError } = useListDocuments({ patientId });

  useEffect(() => {
    document.title = patient ? `${patient.fullName} | DocusPsi` : "Paciente | DocusPsi";
  }, [patient]);

  async function copyAcceptanceLink(token?: string | null) {
    if (!token) return;
    const url = `${window.location.origin}/accept/${token}`;
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copiado", description: "O link público de aceite foi copiado." });
  }

  if (isLoadingPatient) {
    return <div className="p-6 space-y-4">
      <Skeleton className="h-10 w-[300px]" />
      <Skeleton className="h-[200px] w-full" />
    </div>;
  }

  if (isPatientError || !patient) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg border bg-card p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
        <p className="font-medium">Paciente não encontrado.</p>
        <p className="mt-1 text-sm text-muted-foreground">Verifique se o cadastro ainda existe ou tente novamente.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/app/patients">Voltar para pacientes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/app/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{patient.fullName}</h1>
            <p className="text-muted-foreground capitalize">Paciente • {patient.serviceType}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/app/patients/${patient.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/app/documents/new?patientId=${patient.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Documento
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">CPF</p>
                <p className="text-sm text-muted-foreground">{patient.cpf || "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Data de Nascimento</p>
                <p className="text-sm text-muted-foreground">
                  {patient.birthDate ? format(new Date(patient.birthDate), "dd/MM/yyyy") : "Não informada"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">{patient.phone || "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{patient.email || "Não informado"}</p>
              </div>
            </div>
            
            {patient.legalGuardianName && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium">Responsável Legal</p>
                <p className="text-sm text-muted-foreground">{patient.legalGuardianName}</p>
                {patient.legalGuardianRelationship && (
                  <p className="text-xs text-muted-foreground mt-1">Parentesco: {patient.legalGuardianRelationship}</p>
                )}
                {patient.legalGuardianCpf && (
                  <p className="text-xs text-muted-foreground mt-1">CPF: {patient.legalGuardianCpf}</p>
                )}
              </div>
            )}

            {patient.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium">Observações internas</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{patient.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Documentos do Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            {isDocsError ? (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <p className="font-medium">Não foi possível carregar o histórico.</p>
                  <p className="text-sm text-muted-foreground">Tente novamente em alguns instantes.</p>
                </div>
              </div>
            ) : isLoadingDocs ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : documents?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Nenhum documento gerado para este paciente.</p>
                <Button variant="outline" asChild className="mt-4">
                  <Link href={`/app/documents/new?patientId=${patient.id}`}>Gerar primeiro documento</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {documents?.map(doc => (
                  <div key={doc.id} className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <Link href={`/app/documents/${doc.id}`} className="font-medium hover:underline text-primary">
                        {doc.title}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {doc.template?.name} • Criado em {format(new Date(doc.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      {doc.publicToken && doc.status !== 'revogado' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Copiar link de aceite"
                          onClick={() => copyAcceptanceLink(doc.publicToken)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      {doc.status !== 'rascunho' && doc.status !== 'revogado' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Baixar PDF"
                          onClick={() => downloadPdf(doc.id, doc.title)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
