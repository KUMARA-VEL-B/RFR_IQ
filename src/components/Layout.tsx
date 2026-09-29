import { useState } from "react";
import { useLiveFx } from "../services/liveFxService";
import {
  LayoutDashboard, LineChart, Ship, MapPin, FlaskConical,
  ShieldAlert, Gavel, Menu, X, Bell, ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "../utils/cn";
import { CurrencyToggle } from "./CurrencyToggle";
import { MaritimeTicker } from "./MaritimeTicker";

export type PageKey = "overview" | "forecast" | "vessel" | "ports" | "simulator" | "risk" | "decision";

export const NAV: { key: PageKey; label: string; icon: typeof Ship; desc: string }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, desc: "Operational Overview" },
  { key: "forecast", label: "Freight Forecast", icon: LineChart, desc: "Market History" },
  { key: "vessel", label: "Vessel Intelligence", icon: Ship, desc: "Vessel Feasibility" },
  { key: "ports", label: "Port Intelligence", icon: MapPin, desc: "Capacity & Constraint Check" },
  { key: "simulator", label: "Scenario Simulator", icon: FlaskConical, desc: "What-If Analysis" },
  { key: "risk", label: "Risk Intelligence", icon: ShieldAlert, desc: "Market & Weather Risk" },
  { key: "decision", label: "Decision Center", icon: Gavel, desc: "Charter Decision" },
];

export const PAGE_TITLES: Record<PageKey, { title: string; sub: string }> = {
  overview: { title: "Freight Intelligence Command Center", sub: "Operational conditions, weather & market datasets" },
  forecast: { title: "Freight Market Terminal", sub: "Historical freight market reference" },
  vessel: { title: "Vessel Charter Optimizer", sub: "Vessel traffic reference & regional availability" },
  ports: { title: "East Coast Port Intelligence", sub: "Port infrastructure & environmental conditions" },
  simulator: { title: "What-If Command Center", sub: "Compare planning scenarios" },
  risk: { title: "Maritime Risk Command", sub: "Macroeconomic indicators & commodity prices" },
  decision: { title: "Charter Decision Center", sub: "ENTER / WAIT / WATCH derived from operational inputs" },
};

function SidebarContent({ page, go, close, onGoHome }: { page: PageKey; go: (p: PageKey) => void; close?: () => void; onGoHome?: () => void }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* watermark India hint */}
      <svg viewBox="0 0 200 260" className="pointer-events-none absolute -bottom-10 -right-14 h-[300px] w-[220px] opacity-[0.03]">
        <path d="M70 20 C100 10 135 12 155 28 C172 42 180 62 176 84 C188 100 184 124 174 144 C164 166 158 186 150 208 C144 226 132 238 118 240 C106 242 100 230 96 212 C90 188 84 164 78 140 C72 114 66 88 64 62 C63 46 62 30 70 20 Z"
          fill="none" stroke="#0284c7" strokeWidth="2" />
      </svg>

      {/* Logo */}
      <div
        className={cn("flex items-center gap-3 px-5 pb-4 pt-6 transition-opacity", onGoHome && "cursor-pointer group")}
        onClick={onGoHome}
        title={onGoHome ? "Return to Landing Page" : undefined}
      >
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-900/10 transition-transform group-hover:scale-105">
          <img src="/logo.jpg" alt="RFR-IQ Logo" className="h-full w-full object-contain" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div>
          <p className="font-serif text-[18px] font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
            RFR-IQ
          </p>
          <p className="text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-slate-500">Freight &amp; Vessel<br />Decision Support</p>
        </div>
      </div>

      {/* Return to Landing Page Button */}
      {onGoHome && (
        <div className="px-4 pb-3">
          <button
            onClick={() => { onGoHome(); close?.(); }}
            className="group flex w-full items-center justify-between rounded-xl border border-sky-200 bg-sky-50/70 px-3 py-2 text-sky-800 transition-all hover:border-sky-300 hover:bg-sky-100/70 shadow-2xs cursor-pointer"
          >
            <span className="flex items-center gap-2 text-[12px] font-bold">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Landing Page</span>
            </span>
            <span className="rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-sky-700">
              Overview
            </span>
          </button>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Navigation</p>
        {NAV.map((item) => {
          const active = item.key === page;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => { go(item.key); close?.(); }}
              className={cn(
                "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer",
                active
                  ? "border border-sky-400/40 bg-sky-500/10 text-sky-950 font-bold shadow-2xs"
                  : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-950"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors shadow-2xs",
                  active ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700"
                )}>
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <p className={cn("text-[13px] leading-tight truncate", active ? "text-sky-950 font-bold" : "text-slate-700 font-semibold group-hover:text-slate-900")}>{item.label}</p>
                  <p className={cn("text-[10px] truncate", active ? "text-sky-700 font-medium" : "text-slate-400 group-hover:text-slate-500")}>{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={14} className={cn("shrink-0 transition-transform", active ? "text-sky-600 translate-x-0.5" : "text-slate-400 group-hover:text-slate-600")} />
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="border-t border-slate-200/80 p-4">
        <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700">Intelligence Sources</span>
            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Live ocean feeds &amp; port infrastructure datasets</p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ page, go, children, onGoHome }: {
  page: PageKey; go: (p: PageKey) => void; children: React.ReactNode; onGoHome?: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const meta = PAGE_TITLES[page];
  const fx = useLiveFx();

  return (
    <div className="cmd-surface min-h-screen text-slate-900">
      {/* Operational Feed & FX Status Strip */}
      <div className="relative z-40 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white/95 px-3 py-1.5 text-[11px] text-slate-700">
        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 font-sans">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-bold text-slate-900">Live Feeds:</span>
            <span className="text-slate-600">Open-Meteo Weather &amp; Marine</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-slate-700">
            <span className="font-bold text-slate-900">USD/INR:</span>
            <span>{fx.status === "ok" ? `₹${fx.data.INR.toFixed(2)}` : "Unavailable"}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-sans">
            <span>·</span>
            <span>Vessel Tracking: Unavailable for Indian Waters</span>
          </div>
        </div>

        <div className="hidden lg:block font-mono text-[10px] text-slate-500">
          RFR-IQ Decision Intelligence · East Coast India
        </div>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="no-print sticky top-0 hidden h-screen w-[274px] shrink-0 border-r border-slate-200/80 bg-white/70 backdrop-blur-md lg:block shadow-[2px_0_12px_rgba(15,36,64,0.03)]">
          <SidebarContent page={page} go={go} onGoHome={onGoHome} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-[284px] border-r border-slate-200 bg-white shadow-2xl">
              <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">
                <X size={18} />
              </button>
              <SidebarContent page={page} go={go} close={() => setMobileOpen(false)} onGoHome={onGoHome} />
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <button onClick={() => setMobileOpen(true)} className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 lg:hidden">
                <Menu size={18} />
              </button>
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-slate-900/10 lg:hidden">
                <img src="/logo.jpg" alt="Logo" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-serif text-[15px] font-extrabold tracking-tight text-slate-900 sm:text-[17px]">{meta.title}</h2>
                </div>
                <p className="hidden truncate text-[12px] text-slate-500 sm:block">{meta.sub}</p>
              </div>

              {/* Currency Toggle Button (USD <-> Indian Currency) */}
              <div className="shrink-0">
                <CurrencyToggle showRateBadge size="sm" />
              </div>

              <div className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-[300px] sm:w-[340px] rounded-2xl border border-slate-200 bg-white shadow-xl backdrop-blur-xl p-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Bell size={14} className="text-slate-700" />
                          <p className="text-[13px] font-bold text-slate-900">System Notifications</p>
                        </div>
                      </div>
                      <div className="py-4 text-center">
                        <p className="text-[12px] text-slate-500">No active system alerts.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Avatar + Profile Popover */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white p-0.5 ring-2 ring-sky-500/30 hover:ring-sky-500 transition-all cursor-pointer overflow-hidden shadow-sm"
                  aria-label="User profile"
                >
                  <img src="/logo.jpg" alt="Profile" className="h-full w-full object-contain" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-[260px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1 ring-1 ring-slate-900/10 shadow-sm">
                          <img src="/logo.jpg" alt="RFR-IQ" className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <p className="font-serif text-[13px] font-extrabold text-slate-900">RFR-IQ Workspace</p>
                          <p className="text-[11px] text-slate-500">Cargo &amp; charter planning</p>
                        </div>
                      </div>
                      <div className="mt-3 border-t border-slate-100 pt-3 space-y-1.5 text-[11px]">
                        <p className="text-slate-600 flex justify-between"><span className="text-slate-500">Region:</span> <span className="font-semibold text-slate-900">East Coast India</span></p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Real-time Maritime Operational Chronometer & Dispatch Ticker */}
          <MaritimeTicker />

          <main className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-6">
            {children}
            <footer className="cmd-panel mt-8 rounded-xl px-5 py-4 text-center">
              <p className="text-[11px] leading-relaxed text-slate-600">
                <span className="font-bold text-slate-900">RFR-IQ</span> — Decision support for bulk cargo procurement to East Coast India. Weather &amp; marine data from Open-Meteo. Unavailable data is explicitly labelled.
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-wider text-slate-400">RFR-IQ · EAST COAST INDIA BULK DECISION SUPPORT</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
