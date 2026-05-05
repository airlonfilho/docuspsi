import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { getApiBaseUrl } from "@workspace/api-client-react";
import { handleBillingError } from "@/lib/billing-errors";

export function useDownloadPdf() {
  const { token } = useAuth();
  const { toast } = useToast();

  return async function downloadPdf(docId: string, title: string) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/documents/${docId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user");
          window.dispatchEvent(new CustomEvent("docuspsi:auth-expired"));
        }
        const contentType = res.headers.get("content-type") || "";
        const payload = contentType.includes("application/json")
          ? await res.json().catch(() => null)
          : await res.text().catch(() => "");
        const message = payload && typeof payload === "object" && "message" in payload
          ? String((payload as { message?: unknown }).message)
          : "Erro ao baixar PDF";
        const error = new Error(message) as Error & { status?: number; data?: unknown };
        error.status = res.status;
        error.data = payload;
        throw error;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^\w\s\-]/g, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      handleBillingError(error, toast, "Não foi possível baixar o PDF", "Tente novamente.");
    }
  };
}
