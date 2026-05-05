import { Link } from "wouter";
import type { Toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

type ToastFn = (props: Toast) => void;

export function handleBillingError(error: unknown, toast: ToastFn, fallbackTitle: string, fallbackDescription: string) {
  const typed = error as { status?: number; data?: { message?: string }; message?: string };

  if (typed?.status === 402) {
    toast({
      variant: "destructive",
      title: "Upgrade necessário",
      description: "Sua assinatura precisa estar ativa para usar este recurso.",
      action: (
        <ToastAction altText="Ver planos" asChild>
          <Link href="/app/billing">Ver planos</Link>
        </ToastAction>
      ),
    });
    return true;
  }

  if (typed?.status === 403) {
    toast({
      variant: "destructive",
      title: "Recurso indisponível no seu plano",
      description: "Seu plano atual não inclui este recurso.",
      action: (
        <ToastAction altText="Comparar planos" asChild>
          <Link href="/app/billing">Comparar planos</Link>
        </ToastAction>
      ),
    });
    return true;
  }

  toast({
    variant: "destructive",
    title: fallbackTitle,
    description: typed?.data?.message || typed?.message || fallbackDescription,
  });
  return false;
}
