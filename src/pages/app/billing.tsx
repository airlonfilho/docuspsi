import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CreditCard,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  Plan,
  Subscription,
  useGetCurrentSubscription,
  useListPlans,
  useOpenBillingPortal,
  useUpgradePlan,
} from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const fallbackPlans: Plan[] = [
  {
    key: "ESSENTIAL",
    name: "Essencial",
    price: 29,
    currency: "BRL",
    interval: "month",
    features: ["20 documentos/mes", "30 pacientes", "PDF profissional"],
  },
  {
    key: "PRO",
    name: "Pro",
    price: 59,
    currency: "BRL",
    interval: "month",
    recommended: true,
    features: ["Documentos ilimitados", "Pacientes ilimitados", "Aceite simples por link"],
  },
];

function formatCurrency(plan: Plan) {
  if (typeof plan.price !== "number") return "Consultar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: plan.currency || "BRL",
    maximumFractionDigits: 0,
  }).format(plan.price);
}

function formatInterval(interval?: string) {
  if (interval === "month") return "/mês";
  if (interval === "year") return "/ano";
  return interval ? `/${interval}` : "";
}

function formatRenewal(value: string | null) {
  if (!value) return "Sem renovação agendada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem renovação agendada";
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

function statusLabel(status?: string) {
  const normalized = status || "FREE";
  const labels: Record<string, string> = {
    FREE: "Gratuito",
    ACTIVE: "Ativa",
    TRIALING: "Teste",
    PAST_DUE: "Pagamento pendente",
    CANCELED: "Cancelada",
    INCOMPLETE: "Incompleta",
    UNPAID: "Não paga",
  };
  return labels[normalized] || normalized;
}

function statusBadge(subscription?: Subscription) {
  const status = subscription?.status || "FREE";
  const className = status === "ACTIVE"
    ? "bg-green-100 text-green-800 hover:bg-green-100"
    : status === "FREE"
      ? "bg-muted text-muted-foreground hover:bg-muted"
      : "bg-amber-100 text-amber-800 hover:bg-amber-100";
  return <Badge variant="secondary" className={className}>{statusLabel(status)}</Badge>;
}

function getCheckoutError(error: unknown) {
  const status = (error as { status?: number })?.status;
  if (status === 401) return "Você precisa entrar novamente para fazer upgrade.";
  if (status === 400) return "Plano inválido. Atualize a página e tente novamente.";
  if (status === 500) return "Erro ao criar checkout. Tente novamente em alguns instantes.";
  return (error as { data?: { message?: string }; message?: string })?.data?.message
    || (error as { message?: string })?.message
    || "Não foi possível iniciar o checkout.";
}

function PlanCard({
  plan,
  currentPlan,
  onUpgrade,
  loading,
}: {
  plan: Plan;
  currentPlan?: string;
  onUpgrade: (planKey: string) => void;
  loading: boolean;
}) {
  const isCurrent = currentPlan === plan.key;
  return (
    <Card className={plan.recommended ? "relative border-[#8B5CF6] shadow-sm" : "relative border-border shadow-sm"}>
      {plan.recommended && (
        <div className="absolute right-4 top-4">
          <Badge className="bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]">Recomendado</Badge>
        </div>
      )}
      <CardHeader className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#6D28D9]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>{plan.key}</CardDescription>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{formatCurrency(plan)}</span>
          <span className="text-sm text-muted-foreground">{formatInterval(plan.interval)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          {(plan.features || []).map((feature) => (
            <div key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <Button
          className={plan.recommended ? "w-full bg-[#111111] text-white hover:bg-[#111111]/90" : "w-full"}
          variant={plan.recommended ? "default" : "outline"}
          onClick={() => onUpgrade(plan.key)}
          disabled={loading || isCurrent}
        >
          {isCurrent ? "Plano atual" : loading ? "Abrindo checkout..." : "Fazer upgrade"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Billing() {
  const { toast } = useToast();
  const { data: plansData, isLoading: isLoadingPlans, isError: isPlansError } = useListPlans();
  const { data: subscriptionData, isLoading: isLoadingSubscription, isError: isSubscriptionError } = useGetCurrentSubscription();
  const upgradeMutation = useUpgradePlan();
  const portalMutation = useOpenBillingPortal();

  useEffect(() => {
    document.title = "Cobrança | DocusPsi";
  }, []);

  const plans = plansData?.length ? plansData : fallbackPlans;
  const subscription = subscriptionData?.subscription;
  const currentPlan = subscription?.plan || "FREE";
  const canManageBilling = !!subscription?.stripeCustomerId || !!subscription?.stripeSubscriptionId || currentPlan !== "FREE";

  function handleUpgrade(planKey: string) {
    upgradeMutation.mutate(
      { data: { plan: planKey, billingCycle: "monthly" } },
      {
        onSuccess: (data) => {
          window.location.href = data.checkoutUrl;
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Não foi possível iniciar o upgrade",
            description: getCheckoutError(error),
          });
        },
      },
    );
  }

  function handlePortal() {
    portalMutation.mutate(undefined, {
      onSuccess: (data) => {
        window.location.href = data.portalUrl;
      },
      onError: (error: unknown) => {
        const message = (error as { data?: { message?: string }; message?: string })?.data?.message
          || (error as { message?: string })?.message
          || "Tente novamente em alguns instantes.";
        toast({ variant: "destructive", title: "Erro ao abrir cobrança", description: message });
      },
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cobrança</h1>
          <p className="text-muted-foreground">Gerencie seu plano, assinatura e cobrança via Stripe.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/app">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>

      {isSubscriptionError && (
        <Card className="border-destructive/30">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar sua assinatura.</p>
              <p className="mt-1 text-sm text-muted-foreground">Atualize a página ou tente novamente em instantes.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Assinatura atual</CardTitle>
            <CardDescription>Informações sincronizadas com o backend.</CardDescription>
          </div>
          {isLoadingSubscription ? <Skeleton className="h-6 w-20" /> : statusBadge(subscription)}
        </CardHeader>
        <CardContent>
          {isLoadingSubscription ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Plano atual</p>
                  <p className="mt-1 text-2xl font-bold">{currentPlan}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="mt-1 text-2xl font-bold">{statusLabel(subscription?.status)}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Próxima renovação</p>
                  <p className="mt-1 text-lg font-semibold">{formatRenewal(subscription?.currentPeriodEnd || null)}</p>
                </div>
              </div>

              {subscription?.cancelAtPeriodEnd && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Sua assinatura será cancelada ao fim do período atual.
                </div>
              )}

              {!!subscription?.features?.length && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Recursos liberados</p>
                  <div className="flex flex-wrap gap-2">
                    {subscription.features.map((feature) => (
                      <Badge key={feature} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={handlePortal} disabled={!canManageBilling || portalMutation.isPending}>
                  <CreditCard className="h-4 w-4" />
                  {portalMutation.isPending ? "Abrindo..." : "Gerenciar cobrança"}
                </Button>
                <Button variant="outline" asChild>
                  <a href="#planos">
                    Ver planos
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div id="planos" className="space-y-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Planos disponíveis</h2>
          <p className="text-sm text-muted-foreground">
            {isPlansError ? "Não foi possível carregar a API de planos; exibindo uma referência temporária." : "Escolha o plano ideal para sua rotina documental."}
          </p>
        </div>
        {isLoadingPlans ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-80 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.key}
                plan={plan}
                currentPlan={currentPlan}
                onUpgrade={handleUpgrade}
                loading={upgradeMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BillingSuccess() {
  const { data, refetch, isFetching } = useGetCurrentSubscription();
  const [elapsed, setElapsed] = useState(0);

  const confirmed = useMemo(() => {
    const subscription = data?.subscription;
    return !!subscription && subscription.plan !== "FREE" && subscription.status !== "FREE";
  }, [data?.subscription]);

  useEffect(() => {
    document.title = "Pagamento confirmado | DocusPsi";
  }, []);

  useEffect(() => {
    void refetch();
    if (confirmed || elapsed >= 20) return;
    const timer = window.setTimeout(() => {
      setElapsed((current) => current + 2);
      void refetch();
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [confirmed, elapsed, refetch]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
        {confirmed ? <Check className="h-7 w-7" /> : <RefreshCw className={`h-7 w-7 ${isFetching ? "animate-spin" : ""}`} />}
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {confirmed ? "Pagamento confirmado" : "Confirmando pagamento"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {confirmed
            ? `Sua assinatura ${data?.subscription.plan} já está disponível.`
            : "A assinatura pode levar alguns segundos para aparecer enquanto o webhook da Stripe é processado."}
        </p>
      </div>
      {!confirmed && elapsed >= 20 && (
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Ainda não recebemos a confirmação. Volte para cobrança e atualize novamente em alguns instantes.
        </div>
      )}
      <Button asChild>
        <Link href="/app/billing">Voltar para cobrança</Link>
      </Button>
    </div>
  );
}

export function BillingCancel() {
  useEffect(() => {
    document.title = "Checkout cancelado | DocusPsi";
  }, []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <AlertCircle className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout cancelado</h1>
        <p className="mt-2 text-muted-foreground">Nenhuma cobrança foi concluída. Você pode escolher um plano quando quiser.</p>
      </div>
      <Button asChild>
        <Link href="/app/billing">Voltar para planos</Link>
      </Button>
    </div>
  );
}
