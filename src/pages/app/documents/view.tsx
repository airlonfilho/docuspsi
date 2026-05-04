import { useEffect } from "react";
import { useRoute } from "wouter";
import { useGetDocument, useGenerateDocument, useRevokeDocument } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetDocumentQueryKey } from "@workspace/api-client-react";
import { DocumentHtmlPreview } from "@/components/document-html-preview";
import { parseRenderedContent } from "@/components/document-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Link as LinkIcon, Ban, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useDownloadPdf } from "@/hooks/use-download-pdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

function getStatusBadge(status: string) {
  switch (status) {
    case 'rascunho': return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Rascunho</Badge>;
    case 'gerado': return <Badge variant="secondary" className="bg-[#EDE9FE] text-[#6D28D9]">Gerado</Badge>;
    case 'enviado': return <Badge variant="secondary" className="bg-[#EDE9FE] text-[#6D28D9]">Enviado</Badge>;
    case 'aguardando_aceite': return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Aguardando Aceite</Badge>;
    case 'aceito': return <Badge variant="secondary" className="bg-green-100 text-green-800">Aceito</Badge>;
    case 'revogado': return <Badge variant="secondary" className="bg-red-100 text-red-800">Revogado</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}

export default function DocumentView() {
  const [, params] = useRoute("/app/documents/:id");
  const docId = params?.id || "";
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: doc, isLoading, isError } = useGetDocument(docId);

  const generateMutation = useGenerateDocument();
  const revokeMutation = useRevokeDocument();
  const downloadPdf = useDownloadPdf();

  useEffect(() => {
    document.title = doc ? `${doc.title} | DocusPsi` : "Documento | DocusPsi";
  }, [doc]);

  const handleGenerate = () => {
    generateMutation.mutate(
      { documentId: docId },
      {
        onSuccess: () => {
          toast({ title: "Documento finalizado com sucesso" });
          queryClient.invalidateQueries({ queryKey: getGetDocumentQueryKey(docId) });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Erro ao finalizar documento", description: "Tente novamente em instantes." });
        },
      }
    );
  };

  const handleRevoke = () => {
    revokeMutation.mutate(
      { documentId: docId },
      {
        onSuccess: () => {
          toast({ title: "Documento revogado" });
          queryClient.invalidateQueries({ queryKey: getGetDocumentQueryKey(docId) });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Erro ao revogar documento", description: "Tente novamente em instantes." });
        },
      }
    );
  };

  const handleCopyLink = () => {
    if (doc?.publicToken) {
      const link = `${window.location.origin}/accept/${doc.publicToken}`;
      navigator.clipboard.writeText(link);
      toast({ title: "Link copiado", description: "O link público foi copiado para a área de transferência." });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[900px] w-full" />
      </div>
    );
  }

  if (isError || !doc) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg border bg-card p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
        <p className="font-medium">Documento não encontrado.</p>
        <p className="mt-1 text-sm text-muted-foreground">Verifique se o documento ainda existe ou tente novamente.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/app/documents">Voltar para documentos</Link>
        </Button>
      </div>
    );
  }

  const rendered = parseRenderedContent(doc.renderedContent);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/app/documents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{doc.title}</h1>
              {getStatusBadge(doc.status)}
            </div>
            <p className="text-muted-foreground text-sm">
              {doc.template?.name} • Para {doc.patient?.fullName} • {format(new Date(doc.createdAt), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {doc.status === 'rascunho' && (
            <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
              {generateMutation.isPending ? "Finalizando..." : "Finalizar Documento"}
            </Button>
          )}

          {doc.status !== 'rascunho' && doc.status !== 'revogado' && (
            <>
              {doc.publicToken && (
                <Button variant="outline" onClick={handleCopyLink}>
                  <LinkIcon className="mr-2 h-4 w-4" /> Copiar link
                </Button>
              )}
              <Button onClick={() => downloadPdf(doc.id, doc.title)}>
                <Download className="mr-2 h-4 w-4" /> Baixar PDF
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Ban className="mr-2 h-4 w-4" /> Revogar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revogar Documento?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação invalidará o link público de aceite e marcará o documento como revogado. O histórico continuará visível para organização administrativa.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRevoke} disabled={revokeMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {revokeMutation.isPending ? "Revogando..." : "Sim, revogar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      {doc.status === 'aceito' && doc.acceptedAt && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6 flex items-center gap-3 text-green-800">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium">Documento Aceito</p>
              <p className="text-sm opacity-90">
                Aceito em {format(new Date(doc.acceptedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {doc.status === 'revogado' && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6 flex items-center gap-3 text-red-800">
            <Ban className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium">Documento Revogado</p>
              <p className="text-sm opacity-90">Este documento não é mais válido ou acessível externamente.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Prévia do Documento</CardTitle>
              <CardDescription>Layout exato que será gerado no PDF.</CardDescription>
            </div>
            {doc.status !== 'rascunho' && doc.status !== 'revogado' && (
              <Button size="sm" onClick={() => downloadPdf(doc.id, doc.title)}>
                <Download className="mr-2 h-3.5 w-3.5" /> Baixar PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto bg-[#e5e7eb]">
          {rendered ? (
            <DocumentHtmlPreview doc={rendered} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-lg font-medium text-muted-foreground">Documento ainda não finalizado</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Clique em "Finalizar Documento" para gerar a prévia visual e ativar o download do PDF.
              </p>
              {doc.status === 'rascunho' && (
                <Button className="mt-6" onClick={handleGenerate} disabled={generateMutation.isPending}>
                  {generateMutation.isPending ? "Finalizando..." : "Finalizar Documento"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
