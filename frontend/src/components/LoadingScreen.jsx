import React, { useState, useEffect } from "react";

const INIT_STEPS = [
  "Connecting to National Water Informatics Center (NWIC) Gateway...",
  "Syncing EPANET Hydraulic Sensors (Gharat Village)...",
  "Fetching CWC River Level & IMD Precipitation Feeds...",
  "Calibrating A* / Dijkstra Emergency Route Topologies...",
  "Initializing Multilingual Bhashini AI Engine...",
];

/* ── Ashoka Lion Capital SVG ── */
function AshokaEmblem() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="#B3802A" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="32" r="24" stroke="#B3802A" strokeWidth="1.2" fill="none" />
      {/* Stylized wheel spokes */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 32 + 18 * Math.cos(angle);
        const y1 = 32 + 18 * Math.sin(angle);
        const x2 = 32 + 24 * Math.cos(angle);
        const y2 = 32 + 24 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B3802A" strokeWidth="1" />;
      })}
      <circle cx="32" cy="32" r="5" fill="#B3802A" />
      {/* Pillar base */}
      <rect x="24" y="48" width="16" height="3" rx="1" fill="#B3802A" />
      <rect x="20" y="52" width="24" height="2" rx="1" fill="#B3802A" />
      {/* Lion head (simplified) */}
      <ellipse cx="32" cy="16" rx="8" ry="6" fill="#B3802A" opacity="0.9" />
      <ellipse cx="32" cy="14" rx="5" ry="4" fill="#B3802A" />
      <rect x="29" y="20" width="6" height="8" rx="2" fill="#B3802A" opacity="0.85" />
    </svg>
  );
}

/* ── Har Ghar Jal Water Droplet Emblem ── */
function HarGharJalEmblem() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dropGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B5CAB" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>
      </defs>
      <path d="M24 4 C24 4 8 22 8 30 C8 38.837 15.163 44 24 44 C32.837 44 40 38.837 40 30 C40 22 24 4 24 4Z" fill="url(#dropGrad)" />
      <ellipse cx="24" cy="30" rx="8" ry="6" fill="white" opacity="0.2" />
      <circle cx="20" cy="26" r="2.5" fill="white" opacity="0.4" />
      <circle cx="17" cy="30" r="1.5" fill="white" opacity="0.3" />
    </svg>
  );
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const stepDuration = 240; // ms per step (total ~1.2s for 5 steps)
    const tickInterval = 30;
    const totalTicks = (INIT_STEPS.length * stepDuration) / tickInterval;
    let tick = 0;

    const timer = setInterval(() => {
      tick += 1;
      const pct = Math.min((tick / totalTicks) * 100, 100);
      setProgress(pct);
      setCurrentStep(Math.min(Math.floor((tick / totalTicks) * INIT_STEPS.length), INIT_STEPS.length - 1));

      if (tick >= totalTicks) {
        clearInterval(timer);
        setFading(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 600);
      }
    }, tickInterval);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#002147] transition-opacity duration-600 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transition: "opacity 0.6s ease-out" }}
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Emblems Row */}
      <div className="flex items-center gap-6 mb-6 relative z-10">
        <AshokaEmblem />
        <HarGharJalEmblem />
      </div>

      {/* Title Block */}
      <div className="text-center relative z-10 mb-8">
        <h1 className="text-white text-[22px] font-bold tracking-tight mb-1">
          {"जल जीवन मिशन — जलसेतु 2.0 (JalSetu)"}
        </h1>
        <p className="text-[#B3802A] text-[14px] font-semibold italic mb-2">
          {"\"Satat Jal, Surakshit Kal\" — सतत जल, सुरक्षित कल"}
        </p>
        <p className="text-[#94a3b8] text-[11px] max-w-[420px] mx-auto leading-relaxed">
          Department of Drinking Water &amp; Sanitation, Ministry of Jal Shakti
          <br />
          Government of India
        </p>
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-[460px] px-6 relative z-10">
        {/* Progress Bar */}
        <div className="w-full h-[6px] bg-[#0a1a2e] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #0B5CAB, #0080FF, #B3802A)",
              transition: "width 0.2s ease-out",
            }}
          />
        </div>

        {/* Step Text */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-block w-2 h-2 rounded-full bg-[#0080FF]"
            style={{
              animation: "pulse 1.2s infinite",
            }}
          />
          <span className="text-[#94a3b8] text-[11px] font-mono truncate">
            {INIT_STEPS[currentStep]}
          </span>
        </div>

        {/* Progress Percentage */}
        <div className="text-right">
          <span className="text-[#0080FF] text-[11px] font-mono font-bold">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Step Checklist */}
        <div className="mt-4 space-y-1.5">
          {INIT_STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={`text-[12px] ${
                    done
                      ? "text-green-400"
                      : active
                      ? "text-[#0080FF]"
                      : "text-[#334155]"
                  }`}
                >
                  {done ? "\u2713" : active ? "\u25CB" : "\u25CB"}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    done
                      ? "text-[#64748b] line-through"
                      : active
                      ? "text-[#94a3b8]"
                      : "text-[#334155]"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="mt-8 px-4 py-1.5 rounded border border-[#334155] text-[#64748b] text-[10px] font-bold uppercase tracking-wider hover:border-[#94a3b8] hover:text-[#94a3b8] transition-colors relative z-10"
      >
        Skip {">"} Local Backend Offline
      </button>

      {/* Pulse animation via inline style tag */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
