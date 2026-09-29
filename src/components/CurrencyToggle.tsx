import { ArrowLeftRight } from "lucide-react";
import { useCurrency } from "../state/currency";

interface CurrencyToggleProps {
  className?: string;
  showRateBadge?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Interactive button to change the currency from USD to Indian Rupee (INR) or vice-versa.
 */
export function CurrencyToggle({
  className = "",
  showRateBadge = false,
  size = "md",
}: CurrencyToggleProps) {
  const { currency, setCurrency, toggleCurrency, usdToInrRate, isLiveRate } = useCurrency();

  const isUsd = currency === "USD";
  const isInr = currency === "INR";

  const sizeClasses = {
    sm: "px-2 py-1 text-[11px]",
    md: "px-2.5 py-1 text-[12px]",
    lg: "px-3.5 py-1.5 text-[13px]",
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Segmented Dual Switcher Button */}
      <div
        className="relative inline-flex items-center rounded-xl border border-slate-300 bg-slate-100/90 p-0.5 shadow-2xs transition-colors hover:border-slate-400"
        role="group"
        aria-label="Currency selection"
      >
        {/* USD Button */}
        <button
          type="button"
          onClick={() => setCurrency("USD")}
          className={`flex items-center gap-1 rounded-lg ${sizeClasses} font-bold transition-all cursor-pointer ${
            isUsd
              ? "bg-white text-sky-950 shadow-xs ring-1 ring-slate-900/10"
              : "text-slate-600 hover:text-slate-900"
          }`}
          title="Switch currency to United States Dollar ($)"
        >
          <span className="font-mono text-sky-700 font-extrabold">$</span>
          <span>USD</span>
        </button>

        {/* Center Quick-Flip Toggle Action */}
        <button
          type="button"
          onClick={toggleCurrency}
          className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:text-sky-700 hover:bg-white/80 transition-all cursor-pointer"
          title={`Click to flip currency to ${isUsd ? "Indian Rupee (₹)" : "USD ($)"}`}
          aria-label="Switch between USD and Indian Rupee"
        >
          <ArrowLeftRight size={11} strokeWidth={2.5} />
        </button>

        {/* INR (Indian Currency) Button */}
        <button
          type="button"
          onClick={() => setCurrency("INR")}
          className={`flex items-center gap-1 rounded-lg ${sizeClasses} font-bold transition-all cursor-pointer ${
            isInr
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
          title="Switch currency to Indian Rupee (₹)"
        >
          <span className={`font-mono font-extrabold ${isInr ? "text-white" : "text-emerald-700"}`}>
            ₹
          </span>
          <span>INR</span>
        </button>
      </div>

      {/* Optional Reference Rate Pill */}
      {showRateBadge && (
        <span
          className="hidden sm:inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 shadow-2xs"
          title={isLiveRate ? "Live forex rate feed" : "Reference exchange benchmark"}
        >
          <span className="text-slate-400">$1 =</span>
          <span className="font-bold text-slate-900">₹{usdToInrRate.toFixed(2)}</span>
        </span>
      )}
    </div>
  );
}

/**
 * Compact Single-Click Currency Toggle Pill
 * Perfect for tight headers, status bars, and floating controls
 */
export function CompactCurrencyToggle({ className = "" }: { className?: string }) {
  const { currency, toggleCurrency, usdToInrRate } = useCurrency();
  const isUsd = currency === "USD";

  return (
    <button
      type="button"
      onClick={toggleCurrency}
      className={`group flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-extrabold text-slate-800 shadow-2xs transition-all hover:border-sky-400 hover:shadow-xs cursor-pointer ${className}`}
      title={`Current currency is ${currency}. Click to switch to ${isUsd ? "Indian Rupee (₹)" : "US Dollar ($)"}`}
      aria-label="Toggle currency between USD and Indian Currency"
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 group-hover:bg-sky-100 group-hover:text-sky-800 transition-colors">
        <ArrowLeftRight size={10} />
      </span>
      <span className="font-mono text-slate-500">Currency:</span>
      <span
        className={`rounded px-1.5 py-0.2 font-mono font-black ${
          isUsd ? "bg-sky-100 text-sky-900" : "bg-emerald-100 text-emerald-900"
        }`}
      >
        {isUsd ? "$ USD" : "₹ INR"}
      </span>
      <span className="hidden md:inline font-mono text-[9px] text-slate-500">
        ($1 = ₹{usdToInrRate.toFixed(1)})
      </span>
    </button>
  );
}
