import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useListDocuments } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, FileText, Download, Link as LinkIcon, Eye, AlertCircle } from "lucide-react";
import { useDownloadPdf } from "@/hooks/use-download-pdf";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

export default function DocumentsList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("todos");
  const { data: documents, isLoading, isError } = useListDocuments({
    status: status === "todos" ? undefined : status,
  });
  const downloadPdf = useDownloadPdf();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Documentos | DocusPsi";
  }, []);

  const filteredDocuments = useMemo(() => {
    const term = search.toLowerCase().trim();
    return (documents || []).filter((doc) => {
      if (!term) return true;
      return [doc.title, doc.patient?.fullName, doc.template?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [documents, search, status]);

  async function copyLink(token?: string | null) {
    if (!token) return;
    await navigator.clipboard.writeText(`${window.location.origin}/accept/${token}`);
    toast({ title: "Link copiado", description: "O link público de aceite foi copiado." });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">Contratos, termos, recibos e declarações gerados.</p>
        </div>
        <Button asChild>
          <Link href="/app/documents/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo documento
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Buscar por título, paciente ou modelo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
            <SelectItem value="gerado">Gerado</SelectItem>
            <SelectItem value="enviado">Enviado</SelectItem>
            <SelectItem value="aguardando_aceite">Aguardando aceite</SelectItem>
            <SelectItem value="aceito">Aceito</SelectItem>
            <SelectItem value="revogado">Revogado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar os documentos.</p>
              <p className="mt-1 text-sm text-muted-foreground">Confira se o backend está ativo e tente novamente.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <FileText className="h-10 w-10 text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-foreground">{search || status !== "todos" ? "Nenhum documento encontrado." : "Você ainda não gerou documentos."}</p>
                      <p className="text-sm text-muted-foreground">{search || status !== "todos" ? "Ajuste a busca ou os filtros para ver outros resultados." : "Escolha um modelo para gerar seu primeiro documento em PDF."}</p>
                    </div>
                    {!search && status === "todos" && (
                      <Button asChild>
                        <Link href="/app/documents/new">Novo documento</Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <Link href={`/app/documents/${doc.id}`} className="hover:underline text-primary">
                      {doc.title}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">{doc.template?.name}</div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/app/patients/${doc.patientId}`} className="hover:underline">
                      {doc.patient?.fullName || "Desconhecido"}
                    </Link>
                  </TableCell>
                  <TableCell>{format(new Date(doc.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/app/documents/${doc.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </Link>
                        </DropdownMenuItem>
                        {doc.status !== 'rascunho' && (
                          <DropdownMenuItem onClick={() => downloadPdf(doc.id, doc.title)}>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar PDF
                          </DropdownMenuItem>
                        )}
                        {doc.publicToken && doc.status !== "revogado" && (
                          <DropdownMenuItem onClick={() => copyLink(doc.publicToken)}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Copiar link
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
