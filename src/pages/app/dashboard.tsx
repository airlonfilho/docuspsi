import { useEffect } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCode,
  FileText,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { useGetDashboardStats, useGetRecentDocuments, useListPatients } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

function getStatusBadge(status: string) {
  switch (status) {
    case "rascunho":
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Rascunho</Badge>;
    case "gerado":
      return <Badge variant="secondary" className="bg-[#EDE9FE] text-[#6D28D9] hover:bg-[#EDE9FE]">Gerado</Badge>;
    case "enviado":
      return <Badge variant="secondary" className="bg-[#EDE9FE] text-[#6D28D9] hover:bg-[#EDE9FE]">Enviado</Badge>;
    case "aguardando_aceite":
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Aguardando aceite</Badge>;
    case "aceito":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Aceito</Badge>;
    case "revogado":
      return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Revogado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(value?: string) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}

function ErrorCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-destructive/30 bg-card">
      <CardContent className="flex items-start gap-3 p-5">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
  tone = "default",
}: {
  title: string;
  value: number | string;
  description: string;
  icon: typeof Users;
  loading: boolean;
  tone?: "default" | "accent" | "warning" | "success";
}) {
  const toneClass = {
    default: "bg-muted text-muted-foreground",
    accent: "bg-[#EDE9FE] text-[#6D28D9]",
    warning: "bg-amber-100 text-amber-700",
    success: "bg-green-100 text-green-700",
  }[tone];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <Button className="h-auto w-full justify-start rounded-xl border-border py-4 text-left" variant="outline" asChild>
      <Link href={href}>
        <span className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9]">
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span className="font-semibold">{title}</span>
          <span className="text-xs font-normal text-muted-foreground">{description}</span>
        </span>
      </Link>
    </Button>
  );
}

export default function Dashboard() {
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isStatsError,
  } = useGetDashboardStats();
  const {
    data: recentDocs,
    isLoading: isLoadingDocs,
    isError: isDocsError,
  } = useGetRecentDocuments();
  const {
    data: patients,
    isLoading: isLoadingPatients,
    isError: isPatientsError,
  } = useListPatients();

  useEffect(() => {
    document.title = "Dashboard | DocusPsi";
  }, []);

  const recentPatients = (patients || []).slice(0, 4);
  const documentsThisMonth = stats?.documentsThisMonth ?? stats?.totalDocuments ?? 0;
  const planName = stats?.planName || "Essencial";
  const planLimit = stats?.planDocumentLimit ?? 20;
  const planUsed = stats?.planDocumentsUsed ?? documentsThisMonth;
  const planValue = planLimit ? `${planUsed}/${planLimit}` : "Ilimitado";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão rápida da sua rotina documental.</p>
        </div>
        <Button asChild className="bg-[#111111] text-white hover:bg-[#111111]/90">
          <Link href="/app/documents/new">
            <Plus className="h-4 w-4" />
            Novo documento
          </Link>
        </Button>
      </div>

      {isStatsError && (
        <ErrorCard
          title="Não foi possível carregar os indicadores."
          description="Confira se o backend está ativo e tente novamente em instantes."
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total de pacientes"
          value={stats?.totalPatients ?? 0}
          description="Pacientes cadastrados"
          icon={Users}
          loading={isLoadingStats}
        />
        <MetricCard
          title="Documentos no mês"
          value={documentsThisMonth}
          description="Gerados neste período"
          icon={FileText}
          loading={isLoadingStats}
          tone="accent"
        />
        <MetricCard
          title="Aguardando aceite"
          value={stats?.documentsAwaitingAcceptance ?? 0}
          description="Pendentes de retorno"
          icon={Clock}
          loading={isLoadingStats}
          tone="warning"
        />
        <MetricCard
          title="Documentos aceitos"
          value={stats?.documentsAccepted ?? 0}
          description="Aceites registrados"
          icon={CheckCircle2}
          loading={isLoadingStats}
          tone="success"
        />
        <MetricCard
          title={`Plano ${planName}`}
          value={planValue}
          description={planLimit ? "Uso mensal de documentos" : "Documentos ilimitados"}
          icon={AlertCircle}
          loading={isLoadingStats}
          tone="accent"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="border-border bg-card shadow-sm lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Últimos documentos</CardTitle>
              <CardDescription>Documentos criados recentemente.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/documents">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isDocsError ? (
              <ErrorCard title="Não foi possível carregar os documentos." description="Tente atualizar a página em alguns instantes." />
            ) : isLoadingDocs ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => <Skeleton key={item} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : !recentDocs?.length ? (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyTitle>Nenhum documento gerado ainda.</EmptyTitle>
                  <EmptyDescription>Escolha um modelo e gere o primeiro PDF com dados guiados.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild className="bg-[#111111] text-white hover:bg-[#111111]/90">
                    <Link href="/app/documents/new">Criar primeiro documento</Link>
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="space-y-3">
                {recentDocs.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/app/documents/${doc.id}`}
                    className="flex flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{doc.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {doc.patient?.fullName || "Paciente não informado"} • {formatDate(doc.createdAt)}
                      </p>
                    </div>
                    <div className="shrink-0">{getStatusBadge(doc.status)}</div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:col-span-3">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Ações rápidas</CardTitle>
              <CardDescription>Atalhos para as tarefas mais comuns.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <QuickAction href="/app/patients/new" icon={Users} title="Novo paciente" description="Cadastre dados básicos e contato." />
              <QuickAction href="/app/documents/new" icon={FileText} title="Novo documento" description="Escolha um modelo e preencha os campos." />
              <QuickAction href="/app/templates" icon={FileCode} title="Ver modelos" description="Contrato, termo, recibo e declaração." />
              <QuickAction href="/app/settings" icon={Settings} title="Configurar perfil" description="Cabeçalho, rodapé e dados profissionais." />
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Pacientes recentes</CardTitle>
                <CardDescription>Últimos cadastros disponíveis.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/app/patients">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isPatientsError ? (
                <ErrorCard title="Não foi possível carregar pacientes." description="Tente novamente em instantes." />
              ) : isLoadingPatients ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => <Skeleton key={item} className="h-12 w-full rounded-xl" />)}
                </div>
              ) : !recentPatients.length ? (
                <Empty className="border border-dashed py-8">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Users />
                    </EmptyMedia>
                    <EmptyTitle>Você ainda não cadastrou pacientes.</EmptyTitle>
                    <EmptyDescription>Comece cadastrando um paciente para vincular documentos ao histórico.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button variant="outline" asChild>
                      <Link href="/app/patients/new">Novo paciente</Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <div className="space-y-2">
                  {recentPatients.map((patient) => (
                    <Link
                      key={patient.id}
                      href={`/app/patients/${patient.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{patient.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{patient.email || patient.phone || "Sem contato informado"}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 capitalize">{patient.serviceType}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
