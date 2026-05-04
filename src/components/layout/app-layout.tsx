import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useLogout, useGetProfile } from "@workspace/api-client-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, FileText, FileCode, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const logoutMutation = useLogout();
  const { data: profile } = useGetProfile();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => logout(),
    });
  };

  const navItems = [
    { label: "Dashboard", path: "/app", icon: LayoutDashboard },
    { label: "Pacientes", path: "/app/patients", icon: Users },
    { label: "Documentos", path: "/app/documents", icon: FileText },
    { label: "Modelos", path: "/app/templates", icon: FileCode },
    { label: "Configurações", path: "/app/settings", icon: Settings },
  ];

  const activeItem = navItems.find((item) => location === item.path || (location.startsWith(item.path) && item.path !== "/app")) || navItems[0];
  const professionalName = profile?.fullName || user?.name || "Perfil profissional";
  const professionalInfo = profile?.crp ? `CRP: ${profile.crp}` : "Complete seu perfil";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r-[#DDD6C7]">
          <SidebarHeader className="h-16 flex items-center justify-center border-b px-3" style={{ borderColor: "#DDD6C7", background: "#FFFFFF" }}>
            <div className="flex items-center gap-2 w-full rounded-xl bg-white px-2.5 py-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{ background: "#111111" }}>
                Ψ
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-lg font-bold leading-tight text-foreground">DocusPsi</span>
                <span className="text-[11px] leading-tight text-muted-foreground">Documentos clínicos</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="py-4 px-2" style={{ background: "#FFFFFF" }}>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = location === item.path || (location.startsWith(item.path) && item.path !== "/app");
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={[
                        "relative h-10 rounded-xl px-2.5 font-medium transition-colors",
                        "hover:bg-white hover:text-foreground",
                        "data-[active=true]:bg-white data-[active=true]:text-[#6D28D9]",
                      ].join(" ")}
                    >
                      <Link href={item.path} className="flex items-center gap-3">
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" style={{ background: "#8B5CF6" }} />
                        )}
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background: isActive ? "#EDE9FE" : "#FAF7F0",
                            color: isActive ? "#6D28D9" : "currentColor",
                          }}
                        >
                          <item.icon className="w-4 h-4" />
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-3 border-t" style={{ borderColor: "#DDD6C7", background: "#FFFFFF" }}>
            <div className="flex items-center gap-3 mb-3 rounded-xl border bg-white p-2.5 shadow-sm" style={{ borderColor: "#DDD6C7" }}>
              <Avatar className="h-9 w-9 border" style={{ borderColor: "#DDD6C7" }}>
                <AvatarImage src={profile?.logoUrl || ""} />
                <AvatarFallback>{professionalName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{professionalName}</span>
                <span className="text-xs text-muted-foreground truncate">{professionalInfo}</span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="h-10 rounded-xl text-destructive hover:bg-white hover:text-destructive disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{logoutMutation.isPending ? "Saindo..." : "Sair"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex items-center justify-between gap-4 px-6 border-b bg-card">
            <SidebarTrigger />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold text-foreground">{activeItem.label}</h1>
              <p className="truncate text-xs text-muted-foreground">DocusPsi</p>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
