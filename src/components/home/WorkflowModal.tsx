import { useState } from "react";
import { X, LineChart, Ship, FlaskConical, ShieldAlert, Gavel, ArrowRight } from "lucide-react";

interface WorkflowModalProps {
  open: boolean;
  onClose: () => void;
  onEnterPrototype: () => void;
}

const WORKFLOW_STEPS = [
  {
    step: "01",
    id: "forecast",
    name: "Forecast",
    title: "Freight Market Forecasting",
    icon: LineChart,
    color: "from-sky-500 to-blue-600",
    border: "border-sky-500/40",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.25)]",
    badge: "30D–90D Horizon",
    desc: "Lane rate projections for dry-bulk routes from historical freight market data.",
    metric: "Data unavailable",
  },
  {
    step: "02",
    id: "optimize",
    name: "Optimize",
    title: "Vessel Charter Optimization",
    icon: Ship,
    color: "from-amber-400 to-orange-600",
    border: "border-amber-400/40",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.25)]",
    badge: "Cargo Matching",
    desc: "Multi-parameter scoring of candidate vessel classes evaluating stem volume, deadweight utilization, and voyage charter rates.",
    metric: "Rule-based recommendation",
  },
  {
    step: "03",
    id: "simulate",
    name: "Simulate",
    title: "What-If Scenario Simulation",
    icon: FlaskConical,
    color: "from-purple-500 to-indigo-600",
    border: "border-purple-500/40",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    badge: "Planning Scenarios",
    desc: "Explore planning assumptions for market direction, delivery pressure and weather conditions.",
    metric: "No validated estimate available",
  },
  {
    step: "04",
    id: "risk",
    name: "Manage Risk",
    title: "Maritime Risk Intelligence",
    icon: ShieldAlert,
    color: "from-rose-500 to-red-600",
    border: "border-rose-500/40",
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.25)]",
    badge: "Matrix & Hedging",
    desc: "Probability × impact risk mapping across demurrage exposure, seasonal monsoons, counterparty default, and draft constraints at Indian discharge berths.",
    metric: "Data unavailable",
  },
  {
    step: "05",
    id: "decide",
    name: "Decide",
    title: "Executive Charter Decision",
    icon: Gavel,
    color: "from-emerald-400 to-teal-600",
    border: "border-emerald-400/40",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
    badge: "Explainable Output",
    desc: "One rule-based recommendation per lane.",
    metric: "Rule-based recommendation",
  },
];

export function WorkflowModal({ open, onClose, onEnterPrototype }: WorkflowModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (!open) return null;

  const current = WORKFLOW_STEPS[activeStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs anim-fade-up" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl anim-fade-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                RFR-IQ Decision Framework
              </p>
            </div>
            <h2 className="text-[18px] font-extrabold text-slate-950">How Maritime Intelligence Works</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Navigation Flow */}
        <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
          {WORKFLOW_STEPS.map((s, idx) => {
            const isSelected = activeStep === idx;
            const StepIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`flex flex-col items-center py-3.5 px-2 text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-slate-950 border-b-2 border-sky-600 font-bold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-1.5 ${
                  isSelected ? "bg-sky-600 text-white font-bold" : "bg-slate-200/70 text-slate-600"
                }`}>
                  <StepIcon size={16} />
                </div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">{s.step}</span>
                <span className="truncate text-[11px] font-bold w-full">{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Step Content */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${current.color} text-slate-950 shadow-sm`}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  Step {current.step} · {current.name}
                </span>
                <h3 className="text-[20px] font-extrabold text-slate-950">{current.title}</h3>
              </div>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 font-mono text-[11px] font-bold text-emerald-800">
              {current.badge}
            </div>
          </div>

          <p className="text-[14px] leading-relaxed text-slate-700 mb-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
            {current.desc}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Benchmark Output</span>
              <span className="font-mono text-[14px] font-extrabold text-amber-900">{current.metric}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : WORKFLOW_STEPS.length - 1))}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (activeStep < WORKFLOW_STEPS.length - 1) {
                    setActiveStep(activeStep + 1);
                  } else {
                    onEnterPrototype();
                  }
                }}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-1.5 text-[12px] font-extrabold text-white transition-colors cursor-pointer shadow-xs"
              >
                {activeStep === WORKFLOW_STEPS.length - 1 ? "Open Platform →" : "Next Step →"}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="font-mono text-[11px] text-slate-500">
            Freight intelligence for chartering and cargo planning
          </p>
          <button
            onClick={onEnterPrototype}
            className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2 text-[12px] font-extrabold text-white shadow-sm transition-all cursor-pointer"
          >
            <span>Open Platform</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
