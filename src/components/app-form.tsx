import * as React from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const PAPER = {
  background: "#FFFFFF",
  paper: "#FFFFFF",
  paperMuted: "#FAF7F0",
  border: "#DDD6C7",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#111111",
  accent: "#8B5CF6",
  accentSoft: "#EDE9FE",
  accentText: "#6D28D9",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
};

export type AppOption = {
  label: string;
  value: string;
};

export const SERVICE_TYPE_OPTIONS: AppOption[] = [
  { label: "Presencial", value: "presencial" },
  { label: "Online", value: "online" },
  { label: "Híbrido", value: "hibrido" },
];

export const DOCUMENT_STATUS_OPTIONS: AppOption[] = [
  { label: "Rascunho", value: "rascunho" },
  { label: "Gerado", value: "gerado" },
  { label: "Enviado", value: "enviado" },
  { label: "Aguardando aceite", value: "aguardando_aceite" },
  { label: "Aceito", value: "aceito" },
  { label: "Revogado", value: "revogado" },
];

export const DOCUMENT_TYPE_OPTIONS: AppOption[] = [
  { label: "Contrato", value: "contrato" },
  { label: "Termo", value: "termo" },
  { label: "Autorização", value: "autorizacao" },
  { label: "Declaração", value: "declaracao" },
  { label: "Recibo", value: "recibo" },
  { label: "Checklist", value: "checklist" },
  { label: "Guia", value: "guia" },
  { label: "Atestado", value: "atestado" },
  { label: "Relatório", value: "relatorio" },
];

export const PAYMENT_METHOD_OPTIONS: AppOption[] = [
  { label: "Pix", value: "Pix" },
  { label: "Cartão de crédito", value: "Cartão de crédito" },
  { label: "Cartão de débito", value: "Cartão de débito" },
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "Transferência bancária", value: "Transferência bancária" },
  { label: "Plano de saúde", value: "Plano de saúde" },
  { label: "Outro", value: "Outro" },
];

export const FREQUENCY_OPTIONS: AppOption[] = [
  { label: "Semanal", value: "Semanal" },
  { label: "Quinzenal", value: "Quinzenal" },
  { label: "Mensal", value: "Mensal" },
  { label: "Pontual", value: "Pontual" },
  { label: "Conforme demanda", value: "Conforme demanda" },
  { label: "Outro", value: "Outro" },
];

export const SESSION_DURATION_OPTIONS: AppOption[] = [
  { label: "30 minutos", value: "30 minutos" },
  { label: "40 minutos", value: "40 minutos" },
  { label: "45 minutos", value: "45 minutos" },
  { label: "50 minutos", value: "50 minutos" },
  { label: "60 minutos", value: "60 minutos" },
  { label: "90 minutos", value: "90 minutos" },
  { label: "Outro", value: "Outro" },
];

export const CANCELLATION_NOTICE_OPTIONS: AppOption[] = [
  { label: "12 horas", value: "12 horas" },
  { label: "24 horas", value: "24 horas" },
  { label: "48 horas", value: "48 horas" },
  { label: "72 horas", value: "72 horas" },
  { label: "Outro", value: "Outro" },
];

export const RELATIONSHIP_OPTIONS: AppOption[] = [
  { label: "Mãe", value: "Mãe" },
  { label: "Pai", value: "Pai" },
  { label: "Responsável legal", value: "Responsável legal" },
  { label: "Avó/Avô", value: "Avó/Avô" },
  { label: "Tia/Tio", value: "Tia/Tio" },
  { label: "Outro", value: "Outro" },
];

export const BRAZIL_STATE_OPTIONS: AppOption[] = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
].map((value) => ({ label: value, value }));

export const YES_NO_OPTIONS: AppOption[] = [
  { label: "Sim", value: "Sim" },
  { label: "Não", value: "Não" },
];

export const COMMUNICATION_CHANNEL_OPTIONS: AppOption[] = [
  { label: "WhatsApp", value: "WhatsApp" },
  { label: "E-mail", value: "E-mail" },
  { label: "Telefone", value: "Telefone" },
  { label: "Plataforma de atendimento", value: "Plataforma de atendimento" },
  { label: "Outro", value: "Outro" },
];

export const ONLINE_PLATFORM_OPTIONS: AppOption[] = [
  { label: "Google Meet", value: "Google Meet" },
  { label: "Zoom", value: "Zoom" },
  { label: "Microsoft Teams", value: "Microsoft Teams" },
  { label: "WhatsApp Video", value: "WhatsApp Video" },
  { label: "Outra", value: "Outra" },
];

export const DECLARATION_PURPOSE_OPTIONS: AppOption[] = [
  { label: "Comprovação de comparecimento", value: "Comprovação de comparecimento" },
  { label: "Justificativa de ausência", value: "Justificativa de ausência" },
  { label: "Solicitação do paciente", value: "Solicitação do paciente" },
  { label: "Outro", value: "Outro" },
];

export const PAYMENT_REFERENCE_OPTIONS: AppOption[] = [
  { label: "Sessão de psicoterapia individual", value: "Sessão de psicoterapia individual" },
  { label: "Pacote de sessões", value: "Pacote de sessões" },
  { label: "Avaliação psicológica", value: "Avaliação psicológica" },
  { label: "Atendimento online", value: "Atendimento online" },
  { label: "Outro", value: "Outro" },
];

export const LEAD_SOURCE_OPTIONS: AppOption[] = [
  { label: "Instagram", value: "Instagram" },
  { label: "TikTok", value: "TikTok" },
  { label: "Indicação", value: "Indicação" },
  { label: "Google", value: "Google" },
  { label: "Outro", value: "Outro" },
];

export const PROFESSIONAL_STAGE_OPTIONS: AppOption[] = [
  { label: "Ainda não atendo", value: "Ainda não atendo" },
  { label: "Atendo até 10 pacientes", value: "Atendo até 10 pacientes" },
  { label: "Atendo mais de 10 pacientes", value: "Atendo mais de 10 pacientes" },
  { label: "Tenho clínica/equipe", value: "Tenho clínica/equipe" },
];

export const HARDEST_DOCUMENT_OPTIONS: AppOption[] = [
  { label: "Contrato terapêutico", value: "Contrato terapêutico" },
  { label: "Termo de consentimento", value: "Termo de consentimento" },
  { label: "Recibo", value: "Recibo" },
  { label: "Declaração de comparecimento", value: "Declaração de comparecimento" },
  { label: "Termo online", value: "Termo online" },
  { label: "Autorização para menor", value: "Autorização para menor" },
  { label: "Organização por paciente", value: "Organização por paciente" },
  { label: "Outro", value: "Outro" },
];

const fieldClass = "min-h-11 rounded-xl border-[#DDD6C7] bg-white px-4 text-[#111827] shadow-sm placeholder:text-[#6B7280] focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-0 disabled:bg-[#FAF7F0] disabled:text-[#6B7280]";

export function AppInput({ className, error, ...props }: React.ComponentProps<typeof Input> & { error?: boolean }) {
  return <Input className={cn(fieldClass, error && "border-[#DC2626] focus-visible:ring-[#DC2626]", className)} aria-invalid={error || props["aria-invalid"]} {...props} />;
}

export function AppTextarea({ className, error, ...props }: React.ComponentProps<typeof Textarea> & { error?: boolean }) {
  return <Textarea className={cn("min-h-28 rounded-xl border-[#DDD6C7] bg-white px-4 py-3 text-[#111827] shadow-sm placeholder:text-[#6B7280] focus-visible:ring-2 focus-visible:ring-[#8B5CF6] disabled:bg-[#FAF7F0]", error && "border-[#DC2626] focus-visible:ring-[#DC2626]", className)} aria-invalid={error || props["aria-invalid"]} {...props} />;
}

export function AppSelect({ value, onValueChange, placeholder = "Selecione", options, disabled, error }: {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: AppOption[];
  disabled?: boolean;
  error?: boolean;
}) {
  return (
    <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn(fieldClass, "py-2", error && "border-[#DC2626] focus:ring-[#DC2626]")} aria-invalid={error}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-[#DDD6C7] bg-white p-1 text-[#111827] shadow-lg">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="rounded-lg py-2.5 focus:bg-[#EDE9FE] focus:text-[#6D28D9]">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AppSelectWithOther(props: {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: AppOption[];
  otherLabel?: string;
  error?: boolean;
}) {
  const otherValues = new Set(["Outro", "Outra"]);
  const optionValues = new Set(props.options.map((option) => option.value));
  const isCustomValue = !!props.value && !optionValues.has(props.value);
  const selectedValue = isCustomValue ? (props.options.find((option) => otherValues.has(option.value))?.value || "Outro") : props.value;
  const showsOther = selectedValue ? otherValues.has(selectedValue) : false;

  return (
    <div className="space-y-3">
      <AppSelect
        value={selectedValue}
        onValueChange={props.onValueChange}
        placeholder={props.placeholder}
        options={props.options}
        error={props.error}
      />
      {showsOther && (
        <AppInput
          value={isCustomValue ? props.value : ""}
          onChange={(event) => props.onValueChange(event.target.value)}
          placeholder={props.otherLabel || "Descreva a opção"}
          error={props.error}
        />
      )}
    </div>
  );
}

export function AppCombobox({ value, onValueChange, placeholder = "Selecione", searchPlaceholder = "Buscar...", emptyText = "Nenhum resultado.", options, error }: {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: AppOption[];
  error?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={error}
          className={cn(fieldClass, "justify-between font-normal", !selected && "text-[#6B7280]", error && "border-[#DC2626]")}
        >
          <span className="truncate">{selected?.label || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] rounded-xl border-[#DDD6C7] bg-white p-0" align="start">
        <Command className="rounded-xl bg-white">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className="rounded-lg py-2.5 data-[selected=true]:bg-[#EDE9FE] data-[selected=true]:text-[#6D28D9]"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function parseDateValue(value?: string) {
  if (!value) return undefined;
  const parsed = parse(value, "yyyy-MM-dd", new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function AppDatePicker({ value, onChange, placeholder = "Selecione a data", optional = false, error }: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
  error?: boolean;
}) {
  const date = parseDateValue(value);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className={cn(fieldClass, "justify-start text-left font-normal", !date && "text-[#6B7280]", error && "border-[#DC2626]")} aria-invalid={error}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto rounded-xl border-[#DDD6C7] bg-white p-2" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(next) => onChange(next ? format(next, "yyyy-MM-dd") : "")}
          captionLayout="dropdown"
          locale={ptBR}
          className="[--cell-size:2.5rem]"
        />
        {optional && value && (
          <div className="border-t border-[#DDD6C7] p-2">
            <Button type="button" variant="ghost" className="w-full" onClick={() => onChange("")}>Limpar data</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function buildTimeOptions() {
  const options: AppOption[] = [];
  for (let hour = 6; hour <= 23; hour += 1) {
    for (const minute of [0, 15, 30, 45]) {
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      options.push({ label: value, value });
    }
  }
  return options;
}

export function AppTimePicker({ value, onChange, placeholder = "Selecione o horário", error }: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}) {
  return <AppCombobox value={value} onValueChange={onChange} placeholder={placeholder} searchPlaceholder="Buscar horário..." options={buildTimeOptions()} error={error} />;
}

export function AppCurrencyInput({ value, onChange, error, ...props }: Omit<React.ComponentProps<typeof AppInput>, "value" | "onChange"> & {
  value?: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = React.useState(value || "");
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (!focused) setDraft(value || "");
  }, [focused, value]);

  function formatCurrency(input: string) {
    if (!input.trim()) return "";
    return formatCurrencyValue(input);
  }

  return (
    <AppInput
      {...props}
      value={draft}
      inputMode="decimal"
      error={error}
      placeholder="R$ 0,00"
      onChange={(event) => {
        const next = event.target.value.replace(/[^\d.,R$\s-]/g, "");
        setDraft(next);
        onChange(next);
      }}
      onFocus={(event) => {
        setFocused(true);
        props.onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        const formatted = formatCurrency(event.target.value);
        setDraft(formatted);
        onChange(formatted);
        props.onBlur?.(event);
      }}
    />
  );
}

export function formatCurrencyValue(value: string) {
  const raw = value.replace(/[^\d,.-]/g, "");
  if (!raw.trim()) return "";
  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");
  const decimalIndex = Math.max(lastComma, lastDot);
  const decimalPart = decimalIndex >= 0 ? raw.slice(decimalIndex + 1).replace(/\D/g, "") : "";
  const hasDecimal = decimalIndex >= 0 && decimalPart.length > 0 && decimalPart.length <= 2;
  const integerPart = hasDecimal ? raw.slice(0, decimalIndex).replace(/\D/g, "") : raw.replace(/\D/g, "");
  const normalized = hasDecimal ? `${integerPart || "0"}.${decimalPart.padEnd(2, "0")}` : integerPart;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
}

export function maskCpf(value: string) {
  return value.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function AppCpfInput({ value, onChange, ...props }: Omit<React.ComponentProps<typeof AppInput>, "value" | "onChange"> & {
  value?: string;
  onChange: (value: string) => void;
}) {
  return <AppInput {...props} value={value || ""} inputMode="numeric" placeholder="000.000.000-00" onChange={(event) => onChange(maskCpf(event.target.value))} />;
}

export function AppPhoneInput({ value, onChange, ...props }: Omit<React.ComponentProps<typeof AppInput>, "value" | "onChange"> & {
  value?: string;
  onChange: (value: string) => void;
}) {
  return <AppInput {...props} value={value || ""} inputMode="tel" placeholder="(00) 00000-0000" onChange={(event) => onChange(maskPhone(event.target.value))} />;
}

export function AppRadioGroup({ value, onValueChange, options }: {
  value?: string;
  onValueChange: (value: string) => void;
  options: AppOption[];
}) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange} className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-[#DDD6C7] bg-white px-4 py-3 text-sm text-[#111827] has-[[data-state=checked]]:border-[#8B5CF6] has-[[data-state=checked]]:bg-[#EDE9FE]">
          <RadioGroupItem value={option.value} />
          {option.label}
        </label>
      ))}
    </RadioGroup>
  );
}

export function AppCheckbox({ checked, onCheckedChange, label, error }: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: React.ReactNode;
  error?: boolean;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border bg-[#FAF7F0] p-4 text-sm leading-relaxed text-[#111827]", error ? "border-[#DC2626]" : "border-[#DDD6C7]")}>
      <Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(Boolean(value))} aria-invalid={error} />
      <span>{label}</span>
    </label>
  );
}

export function AppColorPicker({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input type="color" value={value || PAPER.accent} onChange={(event) => onChange(event.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-[#DDD6C7] bg-white p-1" />
      <AppInput value={value || ""} onChange={(event) => onChange(event.target.value)} className="font-mono" placeholder="#8B5CF6" />
    </div>
  );
}

export function AppFileUpload({ preview, onChoose, onRemove, loading, title, description, accept = "image/png,image/jpg,image/jpeg,image/webp" }: {
  preview?: string | null;
  onChoose: () => void;
  onRemove?: () => void;
  loading?: boolean;
  title: string;
  description: string;
  accept?: string;
}) {
  return (
    <div className="rounded-xl border border-[#DDD6C7] bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-[#DDD6C7] bg-[#FAF7F0]">
          {preview ? <img src={preview} alt={title} className="h-full w-full rounded-xl object-contain p-2" /> : <Upload className="h-7 w-7 text-[#6D28D9]" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#111827]">{title}</p>
          <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
          <p className="mt-1 text-xs text-[#6B7280]">PNG, JPG, JPEG ou WEBP. Máx. 2MB.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={onChoose} disabled={loading}>
              <Upload className="h-4 w-4" />
              {loading ? "Enviando..." : "Enviar arquivo"}
            </Button>
            {preview && onRemove && (
              <Button type="button" variant="ghost" onClick={onRemove} disabled={loading}>
                <X className="h-4 w-4" />
                Remover
              </Button>
            )}
          </div>
        </div>
      </div>
      <input type="hidden" accept={accept} />
    </div>
  );
}

export function AppFormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-[#DDD6C7] bg-white p-5">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
        {description && <p className="mt-1 text-sm text-[#6B7280]">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function AppFormActions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{children}</div>;
}
