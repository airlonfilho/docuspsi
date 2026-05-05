import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getGetProfileQueryKey,
  useChangePassword,
  useDeleteLogo,
  useDeleteSignature,
  useGetProfile,
  useUpdateProfile,
  useUploadLogo,
  useUploadSignature,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { FileText, PenLine, Upload, X, User } from "lucide-react";
import {
  AppColorPicker,
  AppCpfInput,
  AppPhoneInput,
  AppSelect,
  AppTextarea,
  BRAZIL_STATE_OPTIONS,
} from "@/components/app-form";

const profileSchema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório"),
  displayName: z.string().optional().or(z.literal("")),
  crp: z.string().min(2, "CRP é obrigatório"),
  professionalEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  documentNumber: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  address: z.string().optional().or(z.literal("")),
  clinicName: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
});

const documentSchema = z.object({
  documentFooterText: z.string().optional().or(z.literal("")),
  defaultCancellationPolicy: z.string().optional().or(z.literal("")),
  documentPrimaryColor: z.string().optional().or(z.literal("")),
  documentSecondaryColor: z.string().optional().or(z.literal("")),
  showGeneratedBy: z.boolean().optional(),
  showDocumentCode: z.boolean().optional(),
  showIssuedAt: z.boolean().optional(),
  showPageNumber: z.boolean().optional(),
  showQrCode: z.boolean().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual obrigatória"),
  newPassword: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres"),
});

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] || "P").toUpperCase();
}

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadLogoMutation = useUploadLogo();
  const uploadSignatureMutation = useUploadSignature();
  const deleteLogoMutation = useDeleteLogo();
  const deleteSignatureMutation = useDeleteSignature();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Configurações | DocusPsi";
  }, []);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "", crp: "", professionalEmail: "", phone: "", documentNumber: "",
      displayName: "", city: "", state: "", address: "", clinicName: "", website: "", instagram: ""
    },
  });

  const documentForm = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentFooterText: "",
      defaultCancellationPolicy: "",
      documentPrimaryColor: "#8B5CF6",
      documentSecondaryColor: "#675CF1",
      showGeneratedBy: true,
      showDocumentCode: true,
      showIssuedAt: true,
      showPageNumber: true,
      showQrCode: false,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" }
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        fullName: profile.fullName || "",
        displayName: profile.displayName || "",
        crp: profile.crp || "",
        professionalEmail: profile.professionalEmail || "",
        phone: profile.phone || "",
        documentNumber: profile.documentNumber || "",
        city: profile.city || "",
        state: profile.state || "",
        address: profile.address || "",
        clinicName: profile.clinicName || "",
        website: profile.website || "",
        instagram: profile.instagram || "",
      });
      documentForm.reset({
        documentFooterText: profile.documentFooterText || "",
        defaultCancellationPolicy: profile.defaultCancellationPolicy || "",
        documentPrimaryColor: profile.documentPrimaryColor || "#8B5CF6",
        documentSecondaryColor: profile.documentSecondaryColor || "#675CF1",
        showGeneratedBy: profile.showGeneratedBy ?? true,
        showDocumentCode: profile.showDocumentCode ?? true,
        showIssuedAt: profile.showIssuedAt ?? true,
        showPageNumber: profile.showPageNumber ?? true,
        showQrCode: profile.showQrCode ?? false,
      });
      if (profile.logoUrl) setLogoPreview(profile.logoUrl);
      if (profile.signatureUrl) setSignaturePreview(profile.signatureUrl);
    }
  }, [profile]);

  function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    updateProfileMutation.mutate(
      { data: { ...values, logoUrl: logoPreview || undefined, signatureUrl: signaturePreview || undefined } },
      {
        onSuccess: () => { toast({ title: "Perfil atualizado com sucesso" }); },
        onError: () => { toast({ variant: "destructive", title: "Erro ao atualizar perfil" }); }
      }
    );
  }

  function onDocumentSubmit(values: z.infer<typeof documentSchema>) {
    const currentProfile = profileForm.getValues();
    updateProfileMutation.mutate(
      {
        data: {
          fullName: currentProfile.fullName || profile?.fullName || "",
          crp: currentProfile.crp || profile?.crp || "",
          city: currentProfile.city || profile?.city || "",
          state: currentProfile.state || profile?.state || "",
          ...values,
          displayName: currentProfile.displayName || profile?.displayName || "",
          logoUrl: logoPreview || undefined,
          signatureUrl: signaturePreview || undefined,
        }
      },
      {
        onSuccess: () => { toast({ title: "Personalização dos documentos salva com sucesso." }); },
        onError: () => { toast({ variant: "destructive", title: "Erro ao salvar personalização" }); }
      }
    );
  }

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    changePasswordMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Senha alterada com sucesso" });
          passwordForm.reset();
        },
        onError: (err: any) => {
          toast({ variant: "destructive", title: "Erro ao alterar senha", description: err?.data?.message });
        }
      }
    );
  }

  function validateImageFile(file: File) {
    if (!["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.type)) {
      toast({ variant: "destructive", title: "Formato inválido", description: "Use PNG, JPG, JPEG ou WEBP." });
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: "Tamanho máximo: 2MB." });
      return false;
    }
    return true;
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImageFile(file)) return;

    uploadLogoMutation.mutate(
      { file },
      {
        onSuccess: ({ profile }) => {
          setLogoPreview(profile.logoUrl || null);
          queryClient.setQueryData(getGetProfileQueryKey(), profile);
          toast({ title: "Logo enviada com sucesso" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Erro ao enviar logo" });
        },
      },
    );
  }

  function handleSignatureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImageFile(file)) return;

    uploadSignatureMutation.mutate(
      { file },
      {
        onSuccess: ({ profile }) => {
          setSignaturePreview(profile.signatureUrl || null);
          queryClient.setQueryData(getGetProfileQueryKey(), profile);
          toast({ title: "Assinatura enviada com sucesso" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Erro ao enviar assinatura" });
        },
      },
    );
  }

  function removeLogo() {
    deleteLogoMutation.mutate(undefined, {
      onSuccess: ({ profile }) => {
        setLogoPreview(null);
        queryClient.setQueryData(getGetProfileQueryKey(), profile);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast({ title: "Logo removida" });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Erro ao remover logo" });
      },
    });
  }

  function removeSignature() {
    deleteSignatureMutation.mutate(undefined, {
      onSuccess: ({ profile }) => {
        setSignaturePreview(null);
        queryClient.setQueryData(getGetProfileQueryKey(), profile);
        if (signatureInputRef.current) signatureInputRef.current.value = "";
        toast({ title: "Assinatura removida" });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Erro ao remover assinatura" });
      },
    });
  }

  if (isLoading) {
    return <div className="p-6 space-y-4 max-w-4xl mx-auto"><Skeleton className="h-96 w-full" /></div>;
  }

  const primaryColor = documentForm.watch("documentPrimaryColor") || "#8B5CF6";
  const secondaryColor = documentForm.watch("documentSecondaryColor") || "#675CF1";
  const showGeneratedBy = documentForm.watch("showGeneratedBy");
  const showDocumentCode = documentForm.watch("showDocumentCode");
  const showIssuedAt = documentForm.watch("showIssuedAt");
  const showPageNumber = documentForm.watch("showPageNumber");
  const showQrCode = documentForm.watch("showQrCode");
  const footerText = documentForm.watch("documentFooterText");
  const fullName = profileForm.watch("fullName") || profile?.fullName || "Nome do Profissional";
  const displayName = profileForm.watch("displayName") || profile?.displayName || fullName;
  const crp = profileForm.watch("crp") || profile?.crp || "00/00000";
  const clinicName = profileForm.watch("clinicName") || profile?.clinicName || "";
  const professionalEmail = profileForm.watch("professionalEmail") || profile?.professionalEmail || "";
  const phone = profileForm.watch("phone") || profile?.phone || "";
  const city = profileForm.watch("city") || profile?.city || "";
  const state = profileForm.watch("state") || profile?.state || "";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e preferências do sistema.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Perfil Profissional</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo da Clínica / Profissional</CardTitle>
              <CardDescription>Aparecerá no cabeçalho dos seus documentos PDF.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {logoPreview ? (
                    <div className="relative h-20 w-20">
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="h-20 w-20 rounded-lg object-cover border"
                      />
                      <button
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="h-20 w-20 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {fullName ? getInitials(fullName) : <User className="h-8 w-8" />}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {logoPreview ? "Logo enviada e aplicada ao perfil." : "Sem logo: as iniciais serão usadas no PDF."}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadLogoMutation.isPending}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadLogoMutation.isPending ? "Enviando..." : "Enviar logo"}
                    </Button>
                    {logoPreview && (
                      <Button type="button" variant="ghost" size="sm" onClick={removeLogo} disabled={deleteLogoMutation.isPending}>
                        {deleteLogoMutation.isPending ? "Removendo..." : "Remover"}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, JPEG ou WEBP. Máx 2MB.</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assinatura visual</CardTitle>
              <CardDescription>Imagem opcional para aparecer na área de assinatura dos documentos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-full max-w-xs items-center justify-center rounded-lg border bg-muted/30 p-3">
                  {signaturePreview ? (
                    <img src={signaturePreview} alt="Assinatura" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <PenLine className="h-6 w-6" />
                      <span className="text-xs">Sem assinatura enviada</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {signaturePreview ? "Assinatura enviada e aplicada ao perfil." : "Você pode usar uma imagem PNG, JPG, JPEG ou WEBP."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => signatureInputRef.current?.click()}
                      disabled={uploadSignatureMutation.isPending}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadSignatureMutation.isPending ? "Enviando..." : "Enviar assinatura"}
                    </Button>
                    {signaturePreview && (
                      <Button type="button" variant="ghost" size="sm" onClick={removeSignature} disabled={deleteSignatureMutation.isPending}>
                        {deleteSignatureMutation.isPending ? "Removendo..." : "Remover"}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Máximo 2MB. Prefira imagem com fundo transparente.</p>
                  <input
                    ref={signatureInputRef}
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleSignatureChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados Profissionais</CardTitle>
              <CardDescription>Estes dados aparecerão no cabeçalho dos seus documentos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="displayName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome exibido</FormLabel>
                        <FormControl><Input {...field} placeholder="Ex: Dra. Ana Lima" /></FormControl>
                        <FormDescription>Usado no cabeçalho dos documentos. Se vazio, usa o nome completo.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="crp" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CRP *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="documentNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ</FormLabel>
                        <FormControl><AppCpfInput value={field.value} onChange={field.onChange} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="professionalEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Profissional</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone / WhatsApp</FormLabel>
                        <FormControl><AppPhoneInput value={field.value} onChange={field.onChange} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="clinicName" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Nome da Clínica (opcional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado (UF) *</FormLabel>
                        <FormControl><AppSelect value={field.value} onValueChange={field.onChange} placeholder="Selecione a UF" options={BRAZIL_STATE_OPTIONS} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="address" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Endereço</FormLabel>
                        <FormControl><Input {...field} placeholder="Rua, número, bairro" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="website" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site</FormLabel>
                        <FormControl><Input {...field} placeholder="https://meusite.com.br" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="instagram" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl><Input {...field} placeholder="@seu.perfil" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? "Salvando..." : "Salvar Perfil"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Form {...documentForm}>
            <form onSubmit={documentForm.handleSubmit(onDocumentSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cores dos Documentos</CardTitle>
                  <CardDescription>Cores usadas no cabeçalho e destaques dos PDFs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={documentForm.control} name="documentPrimaryColor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor Principal</FormLabel>
                        <FormControl><AppColorPicker value={field.value} onChange={field.onChange} /></FormControl>
                        <FormDescription>Cabeçalho, accent bar e destaques</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={documentForm.control} name="documentSecondaryColor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor Secundária</FormLabel>
                        <FormControl><AppColorPicker value={field.value} onChange={field.onChange} /></FormControl>
                        <FormDescription>Badge de tipo do documento</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="rounded-xl border bg-white p-4">
                    <div className="mx-auto max-w-[520px] rounded-lg border bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3 border-b pb-4" style={{ borderColor: `${primaryColor}40` }}>
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo na prévia do cabeçalho" className="h-12 w-12 rounded-lg object-contain border" />
                        ) : (
                          <div
                            className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {displayName ? getInitials(displayName) : "Ψ"}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{displayName}</p>
                          <p className="text-xs text-muted-foreground">CRP {crp}{clinicName ? ` · ${clinicName}` : ""}</p>
                          <p className="text-xs text-muted-foreground">
                            {[professionalEmail, phone, city && state ? `${city}/${state}` : city || state].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: secondaryColor }}
                        >
                          CONTRATO
                        </span>
                      </div>
                      <div className="space-y-2 py-5">
                        <div className="h-2 w-2/3 rounded-full bg-muted" />
                        <div className="h-2 w-full rounded-full bg-muted" />
                        <div className="h-2 w-5/6 rounded-full bg-muted" />
                      </div>
                      <div className="flex items-end justify-between gap-4 pt-4">
                        <div className="h-px flex-1" style={{ backgroundColor: primaryColor }} />
                        <div className="w-36 text-center">
                          {signaturePreview ? (
                            <img src={signaturePreview} alt="Assinatura na prévia" className="mx-auto mb-1 max-h-10 max-w-full object-contain" />
                          ) : (
                            <PenLine className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                          )}
                          <p className="border-t pt-1 text-[10px] text-muted-foreground">{displayName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      Prévia simplificada do cabeçalho, corpo, assinatura e rodapé do documento.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rodapé dos Documentos</CardTitle>
                  <CardDescription>Configure o que aparece no rodapé dos PDFs gerados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={documentForm.control} name="documentFooterText" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto personalizado do rodapé</FormLabel>
                      <FormControl>
                        <AppTextarea
                          {...field}
                          placeholder="Ex: Atendimento particular — www.meusite.com.br"
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormDescription>Deixe em branco para usar o texto padrão "Gerado por DocusPsi".</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Informações adicionais no rodapé</p>

                    <FormField control={documentForm.control} name="showGeneratedBy" render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel className="text-sm font-normal">Exibir "Gerado por DocusPsi"</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={documentForm.control} name="showDocumentCode" render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel className="text-sm font-normal">Exibir código interno do documento</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={documentForm.control} name="showIssuedAt" render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel className="text-sm font-normal">Exibir data/hora de emissão</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={documentForm.control} name="showPageNumber" render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel className="text-sm font-normal">Exibir número da página</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={documentForm.control} name="showQrCode" render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel className="text-sm font-normal">Exibir QR Code de verificação</FormLabel>
                          <p className="text-xs text-muted-foreground">Disponível em documentos com link público gerado</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <div className="rounded-lg border bg-muted/30 px-4 py-2.5">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Prévia do rodapé:</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        {[
                          footerText || (showGeneratedBy ? "Gerado por DocusPsi" : null),
                          showDocumentCode ? "Documento A1B2C3D4" : null,
                          showIssuedAt ? `Emitido em ${new Date().toLocaleDateString("pt-BR")}` : null,
                          showPageNumber ? "Página 1 de 1" : null,
                        ].filter(Boolean).join("  ·  ") || "Nenhuma informação no rodapé"}
                      </p>
                      {showQrCode && (
                        <div className="grid h-9 w-9 shrink-0 grid-cols-3 gap-0.5 rounded border bg-white p-1" aria-label="Prévia de QR Code">
                          {Array.from({ length: 9 }).map((_, index) => (
                            <span key={index} className={index % 2 === 0 ? "bg-foreground" : "bg-muted"} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Política de Cancelamento Padrão</CardTitle>
                  <CardDescription>Texto padrão usado em novos contratos (pode ser editado por documento).</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField control={documentForm.control} name="defaultCancellationPolicy" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AppTextarea {...field} placeholder="Sua política de faltas e remarcações..." className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Salvando..." : "Salvar Personalização"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Altere sua senha de acesso.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-sm">
                  <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha Atual</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={changePasswordMutation.isPending}>Alterar Senha</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
