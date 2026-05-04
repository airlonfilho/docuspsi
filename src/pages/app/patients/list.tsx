import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useListPatients, useDeletePatient, type PatientBodyServiceType } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListPatientsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, FileText, Edit, Trash, AlertCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function getServiceLabel(value?: string) {
  if (value === "online") return "Online";
  if (value === "presencial") return "Presencial";
  if (value === "hibrido") return "Híbrido";
  return "Não informado";
}

export default function PatientsList() {
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState<PatientBodyServiceType | "all">("all");
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  
  const { data: patients, isLoading, isError } = useListPatients({
    search: search || undefined,
    serviceType: serviceType === "all" ? undefined : serviceType,
  });
  const deleteMutation = useDeletePatient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = () => {
    if (!patientToDelete) return;
    
    deleteMutation.mutate(
      { patientId: patientToDelete },
      {
        onSuccess: () => {
          toast({ title: "Paciente excluído com sucesso" });
          queryClient.invalidateQueries({ queryKey: getListPatientsQueryKey() });
          setPatientToDelete(null);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Erro ao excluir paciente" });
          setPatientToDelete(null);
        }
      }
    );
  };

  useEffect(() => {
    document.title = "Pacientes | DocusPsi";
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">Gerencie os cadastros dos seus pacientes.</p>
        </div>
        <Button asChild>
          <Link href="/app/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo paciente
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF, e-mail ou telefone..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={serviceType} onValueChange={(value) => setServiceType(value as PatientBodyServiceType | "all")}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as modalidades</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="presencial">Presencial</SelectItem>
            <SelectItem value="hibrido">Híbrido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar pacientes.</p>
              <p className="mt-1 text-sm text-muted-foreground">Confira se o backend está ativo e tente novamente.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[90px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : patients?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <Users className="h-10 w-10 text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-foreground">{search || serviceType !== "all" ? "Nenhum paciente encontrado." : "Você ainda não cadastrou pacientes."}</p>
                      <p className="text-sm text-muted-foreground">{search || serviceType !== "all" ? "Ajuste a busca ou os filtros para ver outros resultados." : "Cadastre o primeiro paciente para organizar o histórico documental."}</p>
                    </div>
                    {!search && serviceType === "all" && (
                      <Button asChild>
                        <Link href="/app/patients/new">Novo paciente</Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              patients?.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <Link href={`/app/patients/${patient.id}`} className="hover:underline text-primary">
                      {patient.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{patient.cpf || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{patient.email || "-"}</span>
                      <span className="text-xs text-muted-foreground">{patient.phone || "Sem telefone"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getServiceLabel(patient.serviceType)}</Badge>
                  </TableCell>
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
                          <Link href={`/app/patients/${patient.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/app/patients/${patient.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/app/documents/new?patientId=${patient.id}`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo documento
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setPatientToDelete(patient.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!patientToDelete} onOpenChange={(open) => !open && setPatientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá o cadastro do paciente. Documentos já gerados para este paciente serão mantidos quando o backend permitir esse comportamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
