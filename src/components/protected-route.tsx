import { useEffect } from "react";
import { useLocation, Route } from "wouter";
import { useAuth } from "@/contexts/auth-context";

export function ProtectedRoute({ component: Component, requireProfile = true, layout: Layout, ...rest }: any) {
  const [location, setLocation] = useLocation();
  const { token, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      setLocation("/login");
    } else if (requireProfile && user && !user.hasProfile && location !== "/onboarding") {
      setLocation("/onboarding");
    } else if (!requireProfile && user?.hasProfile && location === "/onboarding") {
      setLocation("/app");
    }
  }, [token, user, location, setLocation, requireProfile, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-2xl border bg-card px-5 py-4 text-sm font-medium text-muted-foreground shadow-sm">
          Verificando sessão...
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-2xl border bg-card px-5 py-4 text-sm font-medium text-muted-foreground shadow-sm">
          Redirecionando para o login...
        </div>
      </div>
    );
  }

  const content = (params: any) => <Component params={params} />;

  return (
    <Route {...rest}>
      {(params) => Layout ? <Layout>{content(params)}</Layout> : content(params)}
    </Route>
  );
}
