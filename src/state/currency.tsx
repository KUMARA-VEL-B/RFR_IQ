import { createContext, useContext, useState, type ReactNode } from "react";
import { useLiveFx } from "../services/liveFxService";

export type Currency = "USD" | "INR";

export interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  usdToInrRate: number;
  isLiveRate: boolean;
  rateSource: string;
  formatCurrency: (
    amountInUsd: number,
    options?: {
      decimals?: number;
      suffix?: string;
      compact?: boolean;
      showOriginal?: boolean;
    }
  ) => string;
  convertAmount: (amountInUsd: number) => number;
}

const DEFAULT_USD_INR_RATE = 86.50;
const STORAGE_KEY = "rfr_iq_currency_preference";

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "USD" || stored === "INR") {
        return stored;
      }
    }
    return "USD";
  });

  const fx = useLiveFx();

  const usdToInrRate =
    fx.status === "ok" && typeof fx.data?.INR === "number" && fx.data.INR > 0
      ? fx.data.INR
      : DEFAULT_USD_INR_RATE;

  const isLiveRate = fx.status === "ok";
  const rateSource = fx.status === "ok" ? fx.data.source : "Reference Exchange Benchmark (ECB/RBI)";

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  };

  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "INR" : "USD");
  };

  const convertAmount = (amountInUsd: number): number => {
    if (!Number.isFinite(amountInUsd)) return 0;
    if (currency === "INR") {
      return amountInUsd * usdToInrRate;
    }
    return amountInUsd;
  };

  const formatCurrency = (
    amountInUsd: number,
    options?: {
      decimals?: number;
      suffix?: string;
      compact?: boolean;
      showOriginal?: boolean;
    }
  ): string => {
    if (!Number.isFinite(amountInUsd)) return "—";

    const decimals = options?.decimals ?? 0;
    const suffix = options?.suffix ?? "";
    const compact = options?.compact ?? false;
    const showOriginal = options?.showOriginal ?? false;

    if (currency === "USD") {
      const formatted = compact && Math.abs(amountInUsd) >= 1_000_000
        ? `$${(amountInUsd / 1_000_000).toFixed(1)}M`
        : compact && Math.abs(amountInUsd) >= 1_000
        ? `$${(amountInUsd / 1_000).toFixed(0)}K`
        : `$${amountInUsd.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}`;

      const res = `${formatted}${suffix}`;
      if (showOriginal) {
        const inrEquivalent = amountInUsd * usdToInrRate;
        const inrStr =
          inrEquivalent >= 10_000_000
            ? `₹${(inrEquivalent / 10_000_000).toFixed(2)} Cr`
            : inrEquivalent >= 100_000
            ? `₹${(inrEquivalent / 100_000).toFixed(1)}L`
            : `₹${Math.round(inrEquivalent).toLocaleString("en-IN")}`;
        return `${res} (≈ ${inrStr})`;
      }
      return res;
    } else {
      // Indian Rupee (INR)
      const inrAmount = amountInUsd * usdToInrRate;

      let inrFormatted: string;
      if (compact) {
        if (Math.abs(inrAmount) >= 10_000_000) {
          inrFormatted = `₹${(inrAmount / 10_000_000).toFixed(2)} Cr`;
        } else if (Math.abs(inrAmount) >= 100_000) {
          inrFormatted = `₹${(inrAmount / 100_000).toFixed(2)} Lakh`;
        } else {
          inrFormatted = `₹${Math.round(inrAmount).toLocaleString("en-IN")}`;
        }
      } else {
        if (Math.abs(inrAmount) >= 10_000_000) {
          inrFormatted = `₹${(inrAmount / 10_000_000).toFixed(2)} Cr (₹${Math.round(inrAmount).toLocaleString("en-IN")})`;
        } else if (Math.abs(inrAmount) >= 1_000_000) {
          inrFormatted = `₹${(inrAmount / 100_000).toFixed(2)} Lakh (₹${Math.round(inrAmount).toLocaleString("en-IN")})`;
        } else {
          inrFormatted = `₹${inrAmount.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}`;
        }
      }

      const res = `${inrFormatted}${suffix}`;
      if (showOriginal) {
        return `${res} ($${amountInUsd.toLocaleString("en-US")})`;
      }
      return res;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        usdToInrRate,
        isLiveRate,
        rateSource,
        formatCurrency,
        convertAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
