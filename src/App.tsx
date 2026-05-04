import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { AppLayout } from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import KitLanding, { BioLinksPage, KitThankYouPage } from "@/pages/kit-documental";
import { PrivacyPage, TermsPage } from "@/pages/legal";

// Auth
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Onboarding from "@/pages/auth/onboarding";

// App
import Dashboard from "@/pages/app/dashboard";
import PatientsList from "@/pages/app/patients/list";
import PatientNew from "@/pages/app/patients/new";
import PatientDetail from "@/pages/app/patients/detail";
import PatientEdit from "@/pages/app/patients/edit";
import DocumentsList from "@/pages/app/documents/list";
import DocumentsNew from "@/pages/app/documents/new";
import DocumentForm from "@/pages/app/documents/form";
import DocumentView from "@/pages/app/documents/view";
import TemplatesList from "@/pages/app/templates/list";
import Settings from "@/pages/app/settings";

// Public
import PublicAccept from "@/pages/public/accept";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/links" component={BioLinksPage} />
      <Route path="/kit-documental" component={KitLanding} />
      <Route path="/obrigado-kit" component={KitThankYouPage} />
      <Route path="/privacidade" component={PrivacyPage} />
      <Route path="/termos" component={TermsPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <ProtectedRoute path="/onboarding" component={Onboarding} requireProfile={false} />
      
      <ProtectedRoute path="/app" component={Dashboard} layout={AppLayout} />
      <ProtectedRoute path="/app/patients" component={PatientsList} layout={AppLayout} />
      <ProtectedRoute path="/app/patients/new" component={PatientNew} layout={AppLayout} />
      <ProtectedRoute path="/app/patients/:id/edit" component={PatientEdit} layout={AppLayout} />
      <ProtectedRoute path="/app/patients/:id" component={PatientDetail} layout={AppLayout} />
      
      <ProtectedRoute path="/app/documents" component={DocumentsList} layout={AppLayout} />
      <ProtectedRoute path="/app/documents/new" component={DocumentsNew} layout={AppLayout} />
      <ProtectedRoute path="/app/documents/new/:templateSlug" component={DocumentForm} layout={AppLayout} />
      <ProtectedRoute path="/app/documents/:id" component={DocumentView} layout={AppLayout} />
      
      <ProtectedRoute path="/app/templates" component={TemplatesList} layout={AppLayout} />
      <ProtectedRoute path="/app/settings" component={Settings} layout={AppLayout} />

      <Route path="/accept/:token" component={PublicAccept} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
