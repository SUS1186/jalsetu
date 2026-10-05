import { useLanguage } from '../context/LanguageContext';
import React, { useState, useEffect } from "react";

const INIT_STEPS = [
  "Connecting to National Water Informatics Center (NWIC) Gateway...",
  "Syncing EPANET Hydraulic Sensors (Gharat Village)...",
  "Fetching CWC River Level & IMD Precipitation Feeds...",
  "Calibrating A* / Dijkstra Emergency Route Topologies...",
  "Initializing Multilingual Bhashini AI Engine...",
];

/* ── Ashoka Lion Capital Emblem ── */
function AshokaEmblem() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="#B3802A" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="32" r="24" stroke="#B3802A" strokeWidth="1.2" fill="none" />
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 32 + 18 * Math.cos(angle);
        const y1 = 32 + 18 * Math.sin(angle);
        const x2 = 32 + 24 * Math.cos(angle);
        const y2 = 32 + 24 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#B3802A"
            strokeWidth="1"
          />
        );
      })}
      <circle cx="32" cy="32" r="6" fill="#B3802A" />
      <circle cx="32" cy="32" r="3" fill="#002147" />
    </svg>
  );
}

/* ── Har Ghar Jal Water Droplet Emblem ── */
function HarGharJalEmblem() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="#0080FF" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="32" r="28" fill="#0B5CAB" fillOpacity="0.15" />
      <path
        d="M32 14 C32 14, 20 28, 20 37 C20 43.6 25.4 49 32 49 C38.6 49 44 43.6 44 37 C44 28, 32 14, 32 14 Z"
        fill="url(#dropletGrad)"
      />
      <path
        d="M26 36 C26 32, 30 26, 31 24 C30 27, 28 32, 28 36 C28 38, 27 39, 26 39 C26 39, 26 37, 26 36 Z"
        fill="#FFFFFF"
        fillOpacity="0.6"
      />
      <path
        d="M27 40 C27 42.5 29.2 44.5 32 44.5 C34.8 44.5 37 42.5 37 40"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id="dropletGrad" x1="32" y1="14" x2="32" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0080FF" />
          <stop offset="100%" stopColor="#0B5CAB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function LoadingScreen({ onComplete }) {
  // Auto-dismiss safety timer (1.8s)
  React.useEffect(() => {
    const autoTimer = setTimeout(() => {
      if (typeof onComplete === "function") onComplete();
    }, 1800);
    return () => clearTimeout(autoTimer);
  }, [onComplete]);

  React.useEffect(() => { const autoDismissTimer = setTimeout(() => { if (typeof onComplete === "function") onComplete(); }, 2000); return () => clearTimeout(autoDismissTimer); }, [onComplete]);
  // Auto-dismiss loading screen when 100% / Step 5 is reached
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onComplete === 'function') onComplete();
      else if (typeof onClose === 'function') onClose();
      else if (typeof onFinish === 'function') onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const totalDuration = 2200; // 2.2 seconds total animation
    const stepInterval = totalDuration / INIT_STEPS.length;
    const progressInterval = 30;
    const progressIncrement = 100 / (totalDuration / progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < INIT_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, stepInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(100, prev + progressIncrement);
      });
    }, progressInterval);

    const completeTimer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, totalDuration + 200);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#002147] transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ fontFamily: "'Public Sans', sans-serif" }}
    >
      {/* Background Decorative Grid */}
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
      <div className="text-center relative z-10 mb-8 px-4">
        <h1 className="text-white text-[24px] font-bold tracking-tight mb-1">
          {"जलसेतु (JalSetu)"}
        </h1>
        <p className="text-[#B3802A] text-[14px] font-semibold italic mb-2">
          {"\"Satat Jal, Surakshit Kal\" — सतत जल, सुरक्षित कल"}
        </p>
        <p className="text-[#94a3b8] text-[12px] max-w-[480px] mx-auto leading-relaxed">
          Autonomous Rural Water Infrastructure &amp; Flood Decision Support System
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
          <p className="text-[#cbd5e1] text-[11px] font-mono tracking-wide truncate">
            {INIT_STEPS[currentStep]}
          </p>
        </div>

        {/* Percentage Counter */}
        <div className="flex justify-between items-center text-[10px] text-[#64748b] font-mono">
          <span>{`Step ${currentStep + 1} of ${INIT_STEPS.length}`}</span>
          <span>{`${Math.round(progress)}%`}</span>
        </div>
      </div>

      {/* Fallback dismiss button */}
      <button
        onClick={() => {
          setIsFading(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
        }}
        className="mt-8 text-[11px] text-[#64748b] hover:text-[#94a3b8] transition-colors underline cursor-pointer relative z-10"
      >
        Skip Loading &rarr;
      </button>

      {/* Pulse Animation Style */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
