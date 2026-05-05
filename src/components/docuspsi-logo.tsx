import { cn } from "@/lib/utils";

type DocusPsiLogoVariant = "horizontal" | "vertical" | "icon";

const logoSources: Record<DocusPsiLogoVariant, string> = {
  horizontal: "/logohorizontalsemfundo.svg",
  vertical: "/logoverticalsemfundo.svg",
  icon: "/logoiconesemfundo.svg",
};

const defaultSizes: Record<DocusPsiLogoVariant, string> = {
  horizontal: "h-10 w-40",
  vertical: "h-24 w-32",
  icon: "h-12 w-12",
};

export function DocusPsiLogoImage({
  variant = "horizontal",
  className,
  imgClassName,
  alt = "DocusPsi",
}: {
  variant?: DocusPsiLogoVariant;
  className?: string;
  imgClassName?: string;
  alt?: string;
}) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", defaultSizes[variant], className)}>
      <img
        src={logoSources[variant]}
        alt={alt}
        className={cn("h-full w-full object-contain", imgClassName)}
        loading="eager"
      />
    </span>
  );
}
