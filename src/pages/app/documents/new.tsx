import { useEffect } from "react";
import { useListTemplates } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { AlertCircle, ArrowLeft, FileText, FileSignature, Receipt, FileSearch, FileHeart } from "lucide-react";

function getTemplateIcon(type: string) {
  const className = "h-8 w-8 text-[#6D28D9]";
  switch (type) {
    case 'recibo': return <Receipt className={className} />;
    case 'atestado': return <FileHeart className={className} />;
    case 'relatorio': return <FileSearch className={className} />;
    case 'contrato': return <FileSignature className={className} />;
    case 'termo-online': return <FileText className={className} />;
    case 'guia': return <FileSearch className={className} />;
    default: return <FileText className={className} />;
  }
}

export default function DocumentsNew() {
  const { data: templates, isLoading, isError } = useListTemplates();

  useEffect(() => {
    document.title = "Novo documento | DocusPsi";
  }, []);

  // Add query params forward if they exist
  const searchParams = new URLSearchParams(window.location.search);
  const patientId = searchParams.get('patientId');
  const qs = patientId ? `?patientId=${patientId}` : '';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/app/documents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escolha um modelo</h1>
          <p className="text-muted-foreground">Selecione o tipo de documento que deseja gerar.</p>
        </div>
      </div>

      {isError ? (
        <Card className="border-destructive/30">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar os modelos.</p>
              <p className="mt-1 text-sm text-muted-foreground">Confira se o backend está ativo e tente novamente.</p>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col h-[240px]">
              <CardHeader className="flex-1">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : templates?.filter(t => t.isActive).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium">Nenhum modelo disponível.</p>
          <p className="mt-1 text-sm text-muted-foreground">Cadastre ou ative modelos no backend para gerar documentos.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates?.filter(t => t.isActive).map((template) => (
            <Card key={template.id} className="flex flex-col hover:border-primary/50 transition-colors group cursor-pointer border-border shadow-sm">
              <CardHeader className="flex-1">
                <div className="mb-4 p-3 bg-[#EDE9FE] w-fit rounded-lg transition-colors">
                  {getTemplateIcon(template.type)}
                </div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription className="line-clamp-3 mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/app/documents/new/${template.slug}${qs}`}>
                    Usar este modelo
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
