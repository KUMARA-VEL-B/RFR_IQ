import { cn } from "../utils/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export function MaritimeLogo({ size = "md", className, showText = false }: LogoProps) {
  const dimMap = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-[0_4px_16px_rgba(15,36,64,0.08)] ring-1 ring-slate-900/10 transition-transform group-hover:scale-105",
          dimMap[size]
        )}
      >
        <img
          src="/logo.jpg"
          alt="RFR-IQ Maritime Logo"
          className="h-full w-full object-contain"
        />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      </div>
      {showText && (
        <div>
          <span className="font-serif text-[18px] font-extrabold tracking-tight text-white flex items-center gap-1.5">
            RFR-IQ
          </span>
          <p className="text-[9.5px] font-semibold uppercase leading-tight tracking-[0.12em] text-slate-400">
            Maritime Intelligence
          </p>
        </div>
      )}
    </div>
  );
}
