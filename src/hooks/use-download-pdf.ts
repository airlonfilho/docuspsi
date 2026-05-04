import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { getApiBaseUrl } from "@workspace/api-client-react";

export function useDownloadPdf() {
  const { token } = useAuth();
  const { toast } = useToast();

  return async function downloadPdf(docId: string, title: string) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/documents/${docId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^\w\s\-]/g, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast({ variant: "destructive", title: "Erro ao baixar PDF", description: "Tente novamente." });
    }
  };
}
