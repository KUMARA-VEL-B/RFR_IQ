import { useState, useEffect } from "react";
import {
  LineChart, Ship, Clock, Shield, Play, ArrowRight, Anchor,
  Compass, Globe2, AlertTriangle, CheckCircle,
  Layers, MapPin,
} from "lucide-react";
import { HeroShipCanvas } from "../components/home/HeroShipCanvas";
import { HeroShipVisual } from "../components/home/HeroShipVisual";
import { IndiaHudMap } from "../components/home/IndiaHudMap";
import { WorkflowModal } from "../components/home/WorkflowModal";
import { CurrencyToggle } from "../components/CurrencyToggle";

interface HomeProps {
  onEnterPrototype: () => void;
}

export default function Home({ onEnterPrototype }: HomeProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    // Ensure Light Liquid Glass mode
    document.documentElement.classList.remove("dark");
  }, []);

  const handleLaunch = () => {
    setTransitioning(true);
    setTimeout(() => {
      onEnterPrototype();
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#f4f8fc] text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* ── CINEMATIC TRANSITION OVERLAY ── */}
      {transitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4f8fc] transition-opacity duration-500">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-900/10">
              <img src="/logo.jpg" alt="RFR-IQ Logo" className="h-full w-full object-contain animate-pulse" />
            </div>
            <div>
              <p className="font-mono text-[12px] font-extrabold uppercase tracking-widest text-sky-700">
                Initializing RFR-IQ Command Center
              </p>
              <p className="text-[14px] text-slate-600">Loading East Coast Maritime Intelligence...</p>
            </div>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200/90 bg-white/95 py-3.5 backdrop-blur-md shadow-xs transition-all duration-300"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-900/10">
              <img src="/logo.jpg" alt="RFR-IQ Logo" className="h-full w-full object-contain" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[21px] font-black tracking-tight text-slate-950">RFR-IQ</span>
                <span className="hidden rounded-md bg-sky-100 px-2 py-0.5 font-mono text-[9px] font-black tracking-wider text-sky-900 border border-sky-200/80 sm:inline-block">
                  v2.6 MARITIME
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-700">
                Maritime Intelligence for a Stronger India
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#hero" className="rounded-lg bg-sky-50 px-3 py-1.5 text-[13px] font-black text-sky-950 border border-sky-200/80 transition-colors">
              Home
            </a>
            <button
              onClick={handleLaunch}
              className="text-[13px] font-extrabold text-slate-800 transition-colors hover:text-sky-700 cursor-pointer"
            >
              Platform
            </button>
            <a href="#problem" className="text-[13px] font-extrabold text-slate-800 transition-colors hover:text-sky-700">
              The Challenge
            </a>
            <a href="#intelligence" className="text-[13px] font-extrabold text-slate-800 transition-colors hover:text-sky-700">
              Intelligence
            </a>
            <a href="#decision" className="text-[13px] font-extrabold text-slate-800 transition-colors hover:text-sky-700">
              Decision
            </a>
          </div>

          {/* Right Badges & CTA */}
          <div className="flex items-center gap-3">
            {/* Currency Switcher Button (USD <-> Indian Currency) */}
            <CurrencyToggle showRateBadge size="sm" />

            {/* Built for Bharat Badge */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1 text-[11px] font-bold text-slate-900 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#f97316]" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span className="ml-1 text-[11px] font-black text-slate-950">Built for Bharat</span>
            </div>

            <button
              onClick={handleLaunch}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 px-4 py-2 text-[12px] font-black text-white shadow-sm transition-all hover:scale-105 hover:shadow-md cursor-pointer"
            >
              <span>Open Platform</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── PART 1: FULL-SCREEN HERO SECTION (~100vh) ── */}
      <section
        id="hero"
        className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden pt-24 pb-10"
      >
        {/* Cinematic Ocean Canvas Background */}
        <HeroShipCanvas />

        {/* Hero Content Container */}
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-20 flex-1 flex flex-col justify-center">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Dominant Text Column */}
            <div className="lg:col-span-7 pt-4">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-3.5 py-1.5 mb-5 shadow-xs">
                <Compass size={14} className="text-sky-800 animate-spin" style={{ animationDuration: "14s" }} />
                <span className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-sky-950">
                  INTELLIGENCE ACROSS OCEANS
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[44px] font-black leading-[1.08] tracking-tight text-slate-950 sm:text-[62px] xl:text-[72px]">
                Smarter Freight. <br />
                <span className="text-sky-800">
                  Stronger India.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 max-w-2xl text-[17px] sm:text-[19px] leading-relaxed text-slate-800 font-semibold">
                Freight Forecasting &amp; Vessel Optimization for Bulk Cargo Procurement to India's East Coast
              </p>

              {/* 4 Feature Indicators */}
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl">
                {[
                  { label: "Freight Forecasting", icon: LineChart, color: "text-sky-800", bg: "bg-sky-50", border: "border-sky-200" },
                  { label: "Vessel Optimization", icon: Ship, color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200" },
                  { label: "Idle Time Reduction", icon: Clock, color: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
                  { label: "Risk Mitigation", icon: Shield, color: "text-rose-800", bg: "bg-rose-50", border: "border-rose-200" },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.label}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-300 bg-white p-3 shadow-xs transition-all hover:border-sky-400 hover:shadow-md"
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${f.bg} ${f.border} ${f.color} border`}>
                        <Icon size={16} strokeWidth={2.4} />
                      </span>
                      <span className="text-[12px] font-extrabold leading-tight text-slate-950">{f.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleLaunch}
                  className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 px-7 py-4 text-[15px] font-black text-white shadow-md transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  <span className="relative z-10">Open Platform</span>
                  <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  className="group flex items-center gap-2.5 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-[15px] font-extrabold text-slate-900 shadow-2xs transition-all hover:border-sky-400 hover:bg-sky-50 cursor-pointer"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-800 group-hover:scale-110 transition-transform">
                    <Play size={13} className="fill-sky-800" />
                  </span>
                  <span>Watch Overview</span>
                </button>
              </div>
            </div>

            {/* Right Column: India HUD Radar Map & Intelligence Summary */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
              <IndiaHudMap onSelectPort={() => setModalOpen(true)} />

              {/* Right-Side Intelligence Panel (Connecting Global Resources) */}
              <div className="mt-4 w-full max-w-[540px] rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <p className="font-mono text-[11px] font-black uppercase tracking-widest text-sky-800">
                  Strategic Maritime Corridor
                </p>
                <h2 className="text-[16px] font-black text-slate-950 mt-1">
                  Connecting Global Resources to a Stronger India
                </h2>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-200 pt-3 text-center">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                    <p className="text-[28px] font-black leading-none text-sky-800">6</p>
                    <p className="mt-1 text-[12px] font-black text-slate-950">East Coast Ports</p>
                    <p className="font-mono text-[10px] font-semibold text-slate-600">Vizag to Haldia</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                    <p className="text-[28px] font-black leading-none text-amber-800">3</p>
                    <p className="mt-1 text-[12px] font-black text-slate-950">Global Regions</p>
                    <p className="font-mono text-[10px] font-semibold text-slate-600">Aus · Brazil · SA</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                    <p className="text-[28px] font-black leading-none text-emerald-800">1</p>
                    <p className="mt-1 text-[12px] font-black text-slate-950">Decision Platform</p>
                    <p className="font-mono text-[10px] font-semibold text-slate-600">Freight · Vessel · Port · Risk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Centerpiece Dominant Commercial Bulk Carrier */}
          <div className="mt-10 sm:mt-12">
            <HeroShipVisual />
          </div>
        </div>

        {/* Scroll down prompt */}
        <div className="relative z-20 mx-auto mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          <span>Scroll to explore intelligence</span>
          <span className="animate-bounce text-cyan-400">↓</span>
        </div>
      </section>

      {/* ── SECTION 2 — GLOBAL TO INDIA (Corridor Architecture) ── */}
      <section id="global" className="relative border-t border-slate-200 bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-3.5 py-1 mb-3">
              <Globe2 size={14} className="text-sky-800" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-sky-950">
                Supply Chain Convergence
              </span>
            </div>
            <h2 className="text-[32px] font-black text-slate-950 sm:text-[44px]">
              From Global Oceans to India's East Coast
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-slate-700 font-medium">
              India's steel, energy, and infrastructure sectors consume hundreds of millions of dry-bulk tons annually. RFR-IQ connects global export terminals directly into optimal discharge operations.
            </p>
          </div>

          {/* Sourcing Corridor Cards */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                origin: "Australia",
                distance: "7,800 km (reference)",
                transit: "Reference: ~18 days transit",
                cargo: "Iron Ore & Coking Coal",
                ports: "Port Hedland / Hay Point → Vizag / Dhamra",
                tag: "High Volume",
                tagColor: "bg-sky-100 text-sky-900 border-sky-200",
                desc: "Primary source of high-grade metallurgical coal and lump iron ore powering eastern blast furnaces.",
              },
              {
                origin: "Brazil",
                distance: "12,400 km (reference)",
                transit: "Reference: ~28 days transit",
                cargo: "High-Fe Pellets & Carajas Ore",
                ports: "Ponta da Madeira → Paradip / Vizag",
                tag: "Long Haul",
                tagColor: "bg-amber-100 text-amber-900 border-amber-200",
                desc: "Long-voyage Cape-size stems where freight timing matters.",
              },
              {
                origin: "South Africa",
                distance: "6,200 km (reference)",
                transit: "Reference: ~16 days transit",
                cargo: "Thermal Coal & Manganese",
                ports: "Richards Bay → Haldia / Gangavaram",
                tag: "Short Haul",
                tagColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
                desc: "Fast-transit mineral stems sensitive to Cape Agulhas weather conditions.",
              },
            ].map((c) => (
              <div
                key={c.origin}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition-all hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-black uppercase tracking-widest text-slate-600">
                    Sourcing Region
                  </span>
                  <span className={`rounded-full border ${c.tagColor} px-2.5 py-0.5 font-mono text-[10px] font-black shadow-2xs`}>
                    {c.tag}
                  </span>
                </div>
                <h3 className="text-[26px] font-black text-slate-950">{c.origin}</h3>
                <div className="mt-2 flex items-center gap-2 font-mono text-[13px] font-extrabold text-sky-900">
                  <span>{c.distance}</span>
                  <span>·</span>
                  <span>{c.transit}</span>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-slate-700 font-medium">{c.desc}</p>
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">Key Commodities</p>
                  <p className="font-mono text-[13px] font-black text-slate-950">{c.cargo}</p>
                  <p className="mt-1 text-[11px] font-mono font-semibold text-slate-600">{c.ports}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — THE PROBLEM (Reactive vs Intelligent) ── */}
      <section id="problem" className="relative border-t border-slate-200 bg-[#f4f8fc] py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1 mb-3">
              <AlertTriangle size={14} className="text-rose-800" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-rose-950">
                The Procurement Dilemma
              </span>
            </div>
            <h2 className="text-[34px] font-black text-slate-950 sm:text-[46px] tracking-tight">
              Freight Markets Move Fast. <br />
              <span className="text-rose-700">Decisions Can't Wait.</span>
            </h2>
            <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-slate-800 font-semibold max-w-2xl mx-auto">
              Uncalibrated bulk shipping exposure leads to demurrage risks and sub-optimal vessel choices when procurement teams are forced to rely on fragmented spot quotes.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {/* The Traditional Bottleneck (Current Industry Pain) */}
            <div className="rounded-3xl border border-rose-200/90 bg-white/95 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                <p className="font-mono text-[13px] font-black uppercase tracking-widest text-rose-950">
                  Current Industry Pain
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  { step: "01", title: "Reactive Spot Chartering", desc: "Charters booked late under spot pressure, paying peak premiums." },
                  { step: "02", title: "Market Volatility Blindspots", desc: "Freight market movements can change between planning and charter commitment." },
                  { step: "03", title: "Higher Procurement Exposure", desc: "Excess freight paid without multi-voyage planning." },
                  { step: "04", title: "Excessive Anchorage Idle Time", desc: "Uncoordinated arrivals increase waiting time and demurrage exposure." },
                  { step: "05", title: "Compounding Operational Risk", desc: "Monsoon squalls, draft restrictions, and cost shocks disrupt supply." },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all">
                    <span className="font-mono text-[12px] font-black text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <p className="text-[15px] font-black text-slate-950">{item.title}</p>
                      <p className="text-[13px] font-medium text-slate-700 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The RFR-IQ Intelligent Advantage */}
            <div className="rounded-3xl border border-emerald-200/90 bg-white/95 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                <p className="font-mono text-[13px] font-black uppercase tracking-widest text-emerald-950">
                  RFR-IQ Intelligence
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  { title: "Forecast", desc: "Review 2012–2019 freight index history as market context.", icon: LineChart },
                  { title: "Optimize", desc: "Compare candidate vessel classes across deadweight, speed, draft, and charter economics.", icon: Ship },
                  { title: "Simulate", desc: "Explore planning scenarios for market, delivery pressure and weather assumptions.", icon: Layers },
                  { title: "Manage Risk", desc: "Quantify probability × impact matrix to hedge contract terms before fixing.", icon: Shield },
                  { title: "Decide", desc: "Generate an explainable charter decision from the available shipment, market, port and risk information.", icon: CheckCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-[15px] font-black text-slate-950">{item.title}</p>
                        <p className="text-[13px] font-medium text-slate-700 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — THE 4-PILLAR INTELLIGENCE ENGINE ── */}
      <section id="intelligence" className="relative border-t border-slate-200 bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 mb-3">
              <Anchor size={14} className="text-amber-800" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-950">
                Core Framework
              </span>
            </div>
            <h2 className="text-[32px] font-black text-slate-950 sm:text-[44px]">
              Four Modules. One Unified Command.
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-slate-700 font-medium">
              Purpose-built for bulk cargo procurement to India's East Coast, with transparent data provenance.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                name: "FREIGHT FORECASTING",
                desc: "Historical freight index context (Historical Freight Market, 2012–2019).",
                stat: "Data unavailable",
                icon: LineChart,
                color: "text-sky-800",
                iconBg: "bg-sky-50 border-sky-200",
              },
              {
                num: "02",
                name: "VESSEL OPTIMIZATION",
                desc: "Evaluate vessel classes across port constraints and load feasibility.",
                stat: "Rule-based recommendation",
                icon: Ship,
                color: "text-amber-800",
                iconBg: "bg-amber-50 border-amber-200",
              },
              {
                num: "03",
                name: "PORT INTELLIGENCE",
                desc: "Draft depth, tide data and berth infrastructure across East Coast ports.",
                stat: "Draft & berth feasibility",
                icon: MapPin,
                color: "text-emerald-800",
                iconBg: "bg-emerald-50 border-emerald-200",
              },
              {
                num: "04",
                name: "RISK MITIGATION",
                desc: "Detect demurrage hazards and weather delays before fixing.",
                stat: "No validated estimate available",
                icon: Shield,
                color: "text-rose-800",
                iconBg: "bg-rose-50 border-rose-200",
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.num}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition-all hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[14px] font-black text-slate-600">{p.num}</span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${p.iconBg} ${p.color} border`}>
                        <Icon size={18} strokeWidth={2.2} />
                      </div>
                    </div>
                    <h3 className="text-[17px] font-black text-slate-950 tracking-tight">{p.name}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-700 font-medium">{p.desc}</p>
                  </div>
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <span className="font-mono text-[11px] font-black text-sky-950 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200/80 inline-block">{p.stat}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — DECISION VISUAL WORKFLOW ── */}
      <section id="decision" className="relative border-t border-slate-200 bg-[#f4f8fc] py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 mb-3">
              <CheckCircle size={14} className="text-emerald-800" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-950">
                Sample Workflow
              </span>
            </div>
            <h2 className="text-[32px] font-black text-slate-950 sm:text-[44px]">
              Data In. Explainable Decision Out.
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-slate-700 font-medium">
              Here is how RFR-IQ synthesizes complex voyage parameters into a single decisive procurement action.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="mt-14 rounded-3xl border border-slate-300 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <span className="font-mono text-[11px] font-black uppercase tracking-widest text-slate-600">
                  Stem Requirement
                </span>
                <p className="text-[20px] font-black text-slate-950">
                  Operational Spec Mode
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-black text-emerald-950 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">Rule-based recommendation</span>
              </div>
            </div>

            {/* Step-by-Step Chain */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <span className="font-mono text-[10px] font-bold text-slate-600 uppercase">01 Forecast</span>
                <p className="text-[22px] font-black text-slate-900 mt-1">—</p>
                <p className="text-[11px] font-semibold text-slate-600">Historical trend</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <span className="font-mono text-[10px] font-bold text-slate-600 uppercase">02 Vessel</span>
                <p className="text-[20px] font-black text-slate-900 mt-1">—</p>
                <p className="text-[11px] font-semibold text-slate-600">Class compatibility</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <span className="font-mono text-[10px] font-bold text-slate-600 uppercase">03 Port</span>
                <p className="text-[18px] font-black text-slate-900 mt-1">—</p>
                <p className="text-[11px] font-semibold text-slate-600">Draft &amp; berth check</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <span className="font-mono text-[10px] font-bold text-slate-600 uppercase">04 Risk</span>
                <p className="text-[20px] font-black text-slate-900 mt-1">—</p>
                <p className="text-[11px] font-semibold text-slate-600">Weather &amp; demurrage</p>
              </div>
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center shadow-xs">
                <span className="font-mono text-[10px] font-bold text-amber-800 uppercase">05 Guidance</span>
                <p className="text-[22px] font-black text-amber-950 mt-1">ENTER / WATCH</p>
                <p className="text-[11px] font-bold text-amber-900">Rule-based output</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                  <Anchor size={20} />
                </div>
                <div>
                  <p className="text-[14px] font-black text-slate-950">Recommended Contract Strategy</p>
                  <p className="text-[12px] font-medium text-slate-700">Short-Term Multiple Voyage or Spot Laycan Fixing</p>
                </div>
              </div>

              <button
                onClick={handleLaunch}
                className="flex items-center gap-2 rounded-xl bg-sky-700 hover:bg-sky-600 px-5 py-2.5 text-[13px] font-black text-white transition-colors shadow-sm cursor-pointer"
              >
                <span>Inspect in Decision Center</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — FINAL CINEMATIC CTA ── */}
      <section className="relative border-t border-slate-200 bg-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 mb-6">
            <Anchor size={14} className="text-amber-800" />
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-amber-950">
              Freight intelligence for chartering and cargo planning
            </span>
          </div>

          <h2 className="text-[38px] font-black leading-tight text-slate-950 sm:text-[56px]">
            Make the Next Voyage <br />
            <span className="text-amber-700">
              a Smarter Decision.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] sm:text-[19px] leading-relaxed text-slate-800 font-semibold">
            Turn freight uncertainty into actionable intelligence. Explore the full platform.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleLaunch}
              className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 px-8 py-5 text-[16px] font-black text-white shadow-md transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <span>Enter RFR-IQ</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-5 text-[15px] font-extrabold text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Play size={15} className="fill-current" />
              <span>Watch Framework</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── MARITIME FOOTER ── */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 ring-1 ring-slate-900/10 shadow-sm">
              <img src="/logo.jpg" alt="RFR-IQ Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-serif text-[17px] font-black text-slate-950">RFR-IQ</p>
              <p className="text-[11px] font-bold text-slate-700 font-mono">
                Freight intelligence for chartering and cargo planning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-[12px] text-slate-700 font-semibold">
            <span>East Coast India</span>
            <span>·</span>
            <span>Bulk Procurement</span>
            <span>·</span>
            <span className="text-amber-900 font-black">Built for Bharat 🇮🇳</span>
          </div>
        </div>
      </footer>

      {/* ── WORKFLOW MODAL ── */}
      <WorkflowModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onEnterPrototype={handleLaunch}
      />
    </div>
  );
}
