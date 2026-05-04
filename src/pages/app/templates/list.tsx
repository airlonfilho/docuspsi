import { useEffect, useState } from "react";
import { useListTemplates } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, FileSignature, Receipt, FileSearch, FileHeart, FilePen, Search, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { TemplatePreviewDialog } from "./template-preview-dialog";
import type { PreviewTemplate } from "./template-preview-dialog";

type TemplateType = "todos" | "contrato" | "termo" | "autorizacao" | "declaracao" | "recibo" | "atestado" | "relatorio";

const TYPE_LABELS: Record<string, string> = {
  contrato: "Contrato",
  termo: "Termo",
  autorizacao: "Autorização",
  declaracao: "Declaração",
  recibo: "Recibo",
  atestado: "Atestado",
  relatorio: "Relatório",
};

const TYPE_COLORS: Record<string, string> = {
  contrato: "bg-[#EDE9FE] text-[#6D28D9]",
  termo: "bg-[#EDE9FE] text-[#6D28D9]",
  autorizacao: "bg-amber-100 text-amber-800",
  declaracao: "bg-green-100 text-green-800",
  recibo: "bg-emerald-100 text-emerald-800",
  atestado: "bg-rose-100 text-rose-800",
  relatorio: "bg-slate-100 text-slate-800",
};

function getTemplateIcon(type: string) {
  const className = "h-6 w-6 text-[#6D28D9]";
  switch (type) {
    case "recibo": return <Receipt className={className} />;
    case "atestado": return <FileHeart className={className} />;
    case "relatorio": return <FileSearch className={className} />;
    case "contrato": return <FileSignature className={className} />;
    case "declaracao": return <FilePen className={className} />;
    default: return <FileText className={className} />;
  }
}

export default function TemplatesList() {
  const { data: templates, isLoading, isError } = useListTemplates();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<TemplateType>("todos");
  const [previewTemplate, setPreviewTemplate] = useState<PreviewTemplate | null>(null);

  const allTypes: TemplateType[] = ["todos", "contrato", "termo", "autorizacao", "declaracao", "recibo"];

  useEffect(() => {
    document.title = "Modelos | DocusPsi";
  }, []);

  const filtered = templates?.filter((t) => {
    if (!t.isActive) return false;
    if (
      search &&
      !t.name.toLowerCase().includes(search.toLowerCase()) &&
      !t.description?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (activeType !== "todos" && t.type !== activeType) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modelos de documentos</h1>
        <p className="text-muted-foreground">
          Escolha um modelo guiado, visualize a folha A4 e gere documentos em PDF para sua rotina administrativa.
        </p>
      </div>

      <Card className="border-[#DDD6C7] bg-card shadow-sm">
        <CardContent className="flex items-start gap-3 p-4">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#6D28D9]" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Todos os modelos são editáveis e devem ser revisados pela(o) profissional antes da emissão. O DocusPsi oferece apoio administrativo e não substitui análise ética, técnica ou jurídica.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar modelos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allTypes.map((type) => (
            <Button
              key={type}
              variant={activeType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(type)}
              className="capitalize"
            >
              {type === "todos" ? "Todos" : TYPE_LABELS[type] || type}
            </Button>
          ))}
        </div>
      </div>

      {isError ? (
        <Card className="border-destructive/30">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar os modelos.</p>
              <p className="mt-1 text-sm text-muted-foreground">Confira se o backend está ativo e tente novamente em instantes.</p>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col h-[260px]">
              <CardHeader className="flex-1">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Nenhum modelo encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? `Nenhum resultado para "${search}".`
              : "Execute o seed inicial ou cadastre modelos para começar."}
          </p>
          {search && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setActiveType("todos");
              }}
            >
              Limpar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((template) => (
            <Card
              key={template.id}
              className="flex flex-col border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-[#EDE9FE]">
                    {getTemplateIcon(template.type)}
                  </div>
                  <Badge
                    className={`text-xs font-medium ${TYPE_COLORS[template.type] || "bg-gray-100 text-gray-800"}`}
                    variant="secondary"
                  >
                    {TYPE_LABELS[template.type] || template.type}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-snug">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1.5 text-sm">
                  {template.description}
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {template.fieldsSchema?.fields?.length || 0} campos guiados
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Prévia A4
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    PDF
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex gap-2 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    setPreviewTemplate({
                      id: template.id,
                      name: template.name,
                      slug: template.slug,
                      description: template.description,
                      type: template.type,
                      fieldCount: template.fieldsSchema?.fields?.length || 0,
                    })
                  }
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  Visualizar
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link href={`/app/documents/new/${template.slug}`}>Usar modelo</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <TemplatePreviewDialog
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}
