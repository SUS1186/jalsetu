import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine,
} from "recharts";

/* ── Circular SVG Gauge ── */
function GaugeRing({ value, max, label, unit, warningLow, warningHigh, size = 120 }) {
  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(value / max, 1));
  const offset = circumference * (1 - pct);
  
  const isWarn = (warningLow !== undefined && value < warningLow) || (warningHigh !== undefined && value > warningHigh);
  const color = isWarn ? "#DC2626" : (pct > 0.7 ? "#059669" : "#0B5CAB");

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8EEFA" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s ease-out, stroke 0.3s" }}
        />
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          style={{ fontSize: "18px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: "#002147" }}
        >
          {typeof value === "number" ? value.toFixed(2) : value}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          style={{ fontSize: "10px", fontFamily: "'Public Sans', sans-serif", fill: "#74777f" }}
        >
          {unit}
        </text>
      </svg>
      {label && <span className="text-[10px] font-bold text-[#44474e] uppercase tracking-wider mt-1 text-center">{label}</span>}
    </div>
  );
}

/* ── Interactive SVG Hydraulic Pipeline Schematic ── */
function HydraulicSchematic({ isBurst, isFlood, selectedNode, onSelectNode, pressure, flow, vibration }) {
  const strokeColor = isBurst ? "#DC2626" : "#0284C7";
  const pipeSpeed = isBurst ? "0.8s" : "2s";

  return (
    <div className="bg-[#002147] rounded-xl p-5 border border-[#0B5CAB]/30 shadow-lg text-white relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 border-b border-[#0B5CAB]/40 pb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#0080FF]">schema</span>
          <span className="text-[13px] font-bold tracking-tight">
            Gharat Habitation Cyber-Physical Hydraulic Network Schematic
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#cbd5e1] bg-[#001733] px-2 py-0.5 rounded border border-[#0B5CAB]/30">
          EPANET 2.2 Digital Twin &bull; 4 Nodes Active
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 920 230" className="w-full min-w-[760px] h-[210px]">
          <defs>
            <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Pipelines */}
          {/* Intake to WTP */}
          <line x1="80" y1="120" x2="220" y2="120" stroke="#003875" strokeWidth="8" strokeLinecap="round" />
          <line x1="80" y1="120" x2="220" y2="120" stroke={strokeColor} strokeWidth="4" strokeDasharray="8,6" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-28" dur={pipeSpeed} repeatCount="indefinite" />
          </line>

          {/* WTP to OHSR */}
          <line x1="280" y1="120" x2="430" y2="120" stroke="#003875" strokeWidth="8" strokeLinecap="round" />
          <line x1="280" y1="120" x2="430" y2="120" stroke={strokeColor} strokeWidth="4" strokeDasharray="8,6" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-28" dur={pipeSpeed} repeatCount="indefinite" />
          </line>

          {/* OHSR to Leak Node / Feeder */}
          <line x1="490" y1="120" x2="620" y2="120" stroke="#003875" strokeWidth="8" strokeLinecap="round" />
          <line x1="490" y1="120" x2="620" y2="120" stroke={strokeColor} strokeWidth="4" strokeDasharray="8,6" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-28" dur={pipeSpeed} repeatCount="indefinite" />
          </line>

          {/* Feeder to Standposts */}
          <line x1="680" y1="120" x2="820" y2="70" stroke="#003875" strokeWidth="6" strokeLinecap="round" />
          <line x1="680" y1="120" x2="820" y2="70" stroke={isBurst ? "#7f1d1d" : "#0284C7"} strokeWidth="3" strokeDasharray="6,4" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="2.5s" repeatCount="indefinite" />
          </line>

          <line x1="680" y1="120" x2="820" y2="170" stroke="#003875" strokeWidth="6" strokeLinecap="round" />
          <line x1="680" y1="120" x2="820" y2="170" stroke={isBurst ? "#7f1d1d" : "#0284C7"} strokeWidth="3" strokeDasharray="6,4" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="2.5s" repeatCount="indefinite" />
          </line>

          {/* Node 1: Intake Pump */}
          <g transform="translate(45, 85)" className="cursor-pointer" onClick={() => onSelectNode("INTAKE_PUMP_01")}>
            <circle cx="35" cy="35" r="32" fill="#002147" stroke={isFlood ? "#DC2626" : "#0080FF"} strokeWidth="2.5" />
            <text x="35" y="30" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">INTAKE</text>
            <text x="35" y="44" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="monospace">PUMP-01</text>
            <text x="35" y="80" textAnchor="middle" fill="#cbd5e1" fontSize="9">Vib: {vibration.toFixed(2)} mm/s</text>
          </g>

          {/* Node 2: Water Treatment Plant */}
          <g transform="translate(210, 80)" className="cursor-pointer" onClick={() => onSelectNode("WTP_50KLD")}>
            <rect x="10" y="10" width="60" height="60" rx="8" fill="#002147" stroke="#10B981" strokeWidth="2.5" />
            <text x="40" y="36" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">WTP</text>
            <text x="40" y="50" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace">50 KLD</text>
            <text x="40" y="85" textAnchor="middle" fill="#cbd5e1" fontSize="9">Cl: 0.35 mg/L</text>
          </g>

          {/* Node 3: OHSR Tank */}
          <g transform="translate(420, 75)" className="cursor-pointer" onClick={() => onSelectNode("OHSR_150KL")}>
            <rect x="10" y="10" width="60" height="70" rx="6" fill="#002147" stroke="#B3802A" strokeWidth="2.5" />
            <rect x="12" y="32" width="56" height="46" rx="4" fill="#0284C7" opacity="0.4" />
            <text x="40" y="34" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">OHSR</text>
            <text x="40" y="48" textAnchor="middle" fill="#B3802A" fontSize="9" fontFamily="monospace">150 KL</text>
            <text x="40" y="94" textAnchor="middle" fill="#cbd5e1" fontSize="9">Level: 81%</text>
          </g>

          {/* Node 4: LEAK_NODE / Rising Main Junction */}
          <g transform="translate(610, 85)" className="cursor-pointer" onClick={() => onSelectNode("LEAK_NODE")}>
            <circle cx="35" cy="35" r="32" fill="#002147" stroke={isBurst ? "#DC2626" : "#0080FF"} strokeWidth={isBurst ? "4" : "2.5"} />
            {isBurst && (
              <>
                <circle cx="35" cy="35" r="38" fill="none" stroke="#DC2626" strokeWidth="2" opacity="0.8">
                  <animate attributeName="r" values="32;46;32" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x="35" y="18" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">RUPTURE!</text>
              </>
            )}
            <text x="35" y="34" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">LEAK_NODE</text>
            <text x="35" y="48" textAnchor="middle" fill={isBurst ? "#EF4444" : "#38BDF8"} fontSize="9" fontFamily="monospace">
              {pressure.toFixed(2)} bar
            </text>
          </g>

          {/* Node 5: Standposts (East Ward & South Tail-End) */}
          <g transform="translate(810, 45)" className="cursor-pointer" onClick={() => onSelectNode("JUNC_01")}>
            <circle cx="25" cy="25" r="22" fill="#002147" stroke="#10B981" strokeWidth="2" />
            <text x="25" y="24" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">JUNC_01</text>
            <text x="25" y="36" textAnchor="middle" fill="#10B981" fontSize="8">East (95 HH)</text>
          </g>

          <g transform="translate(810, 145)" className="cursor-pointer" onClick={() => onSelectNode("JUNC_03")}>
            <circle cx="25" cy="25" r="22" fill="#002147" stroke={isBurst ? "#DC2626" : "#10B981"} strokeWidth="2" />
            <text x="25" y="24" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">JUNC_03</text>
            <text x="25" y="36" textAnchor="middle" fill={isBurst ? "#EF4444" : "#10B981"} fontSize="8">South (105 HH)</text>
          </g>
        </svg>
      </div>

      <div className="mt-2 text-[10px] text-[#94a3b8] flex flex-wrap items-center justify-between">
        <span>Click any node in the schematic to inspect localized telemetry and transducer health.</span>
        <span className="font-mono text-[#38BDF8]">Pumping Status: {isFlood ? "TRIPPED (HIGH TURBIDITY)" : "ACTIVE DUTY"}</span>
      </div>
    </div>
  );
}

export default function ScadaTwin({ telemetry, isBurstActive, isFloodActive, telemetryHistory = [] }) {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState("LEAK_NODE");

  // Fallback history if offline
  const history = telemetryHistory.length > 0 ? telemetryHistory : Array.from({ length: 20 }, (_, i) => ({
    tick: i + 1,
    time: new Date(Date.now() - (19 - i) * 2000).toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    pressure: isBurstActive ? 0.48 + Math.random() * 0.05 : 3.82 + Math.random() * 0.15,
    flow: isBurstActive ? 14.8 + Math.random() * 0.3 : 3.64 + Math.random() * 0.12,
    chlorine: isBurstActive ? 0.05 : 0.35,
    turbidity: isFloodActive ? 54.2 : 1.4,
  }));

  const latest = history[history.length - 1] || {};
  const pressure = isBurstActive ? 0.48 : (latest.pressure ?? 3.82);
  const flow = isBurstActive ? 14.80 : (latest.flow ?? 3.64);
  const vibration = isBurstActive ? 0.88 : 0.15;
  const chlorine = isBurstActive ? 0.05 : 0.35;
  const ph = isBurstActive ? 6.4 : 7.2;
  const tankPct = isFloodActive ? 42 : 81;
  const isPotable = !isBurstActive && !isFloodActive && chlorine >= 0.2 && ph >= 6.5;

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-[#002147] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[26px] text-[#0B5CAB]">precision_manufacturing</span>
            {t("scada.title")}
          </h1>
          <p className="text-[12px] text-[#44474e] mt-0.5">
            Real-Time Cyber-Physical Hydraulic Telemetry, EPANET 2.2 Twin &amp; Anomaly Detection
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${
            isBurstActive
              ? "bg-red-100 text-red-800 border border-red-300 animate-pulse"
              : isFloodActive
              ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
              : "bg-green-100 text-green-800 border border-green-300"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {isBurstActive ? "emergency" : isFloodActive ? "warning" : "check_circle"}
          </span>
          STATUS: {isBurstActive ? "PIPE BURST CRITICAL" : isFloodActive ? "FLOOD INTAKE TRIPPED" : "NOMINAL"}
        </span>
      </div>

      {/* ── Large Potability Grade Indicator ── */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 shadow-sm transition-all ${
          isPotable
            ? "bg-[#E8F8F0] border-green-300 text-green-900"
            : "bg-[#FDEAEB] border-red-300 text-red-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isPotable ? "bg-green-600 text-white" : "bg-red-600 text-white animate-pulse"
            }`}
          >
            <span className="material-symbols-outlined text-[28px]">
              {isPotable ? "verified" : "dangerous"}
            </span>
          </div>
          <div>
            <div className="text-[16px] font-extrabold tracking-tight">
              {isPotable
                ? "GRADE A &mdash; POTABLE (BIS:10500 Compliant)"
                : "GRADE D &mdash; CONTAMINATED (Bacterial Contamination Risk)"}
            </div>
            <div className="text-[11px] mt-0.5 font-medium opacity-90">
              {isPotable
                ? "Disinfection residual maintained. pH: 7.2 | Turbidity: 1.4 NTU | Free Chlorine: 0.35 mg/L &bull; Safe for direct household consumption."
                : "Residual chlorine depleted (< 0.1 mg/L) or turbidity breached safety threshold (> 5 NTU). Do NOT consume without boiling."}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] font-bold">
          <span className="bg-white/80 px-2.5 py-1 rounded border border-current">
            pH: {ph.toFixed(1)}
          </span>
          <span className="bg-white/80 px-2.5 py-1 rounded border border-current">
            Residual Cl: {chlorine.toFixed(2)} mg/L
          </span>
          <span className="bg-white/80 px-2.5 py-1 rounded border border-current">
            Turbidity: {isFloodActive ? "54.2" : "1.4"} NTU
          </span>
        </div>
      </div>

      {/* ── Interactive SVG Hydraulic Pipeline Schematic ── */}
      <HydraulicSchematic
        isBurst={isBurstActive}
        isFlood={isFloodActive}
        selectedNode={selectedNode}
        onSelectNode={setSelectedNode}
        pressure={pressure}
        flow={flow}
        vibration={vibration}
      />

      {/* ── Reactive SCADA Gauges Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Pressure Gauge */}
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center shadow-sm">
          <GaugeRing
            value={pressure}
            max={5.0}
            label={t("scada.pressure")}
            unit="bar"
            warningLow={0.7}
          />
          <div className="mt-2 text-[10px] text-[#74777f] font-mono">
            Baseline: 3.80 bar &bull; Min: 0.70 bar
          </div>
        </div>

        {/* Flow Rate Gauge */}
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center shadow-sm">
          <GaugeRing
            value={flow}
            max={20.0}
            label={t("scada.flow")}
            unit="L/s"
            warningHigh={12.0}
          />
          <div className="mt-2 text-[10px] text-[#74777f] font-mono">
            Consumer Delivered: {flow.toFixed(2)} L/s
          </div>
        </div>

        {/* Motor Vibration RMS Gauge */}
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center shadow-sm">
          <GaugeRing
            value={vibration}
            max={1.5}
            label="Motor Vibration"
            unit="RMS mm/s"
            warningHigh={0.45}
          />
          <div className="mt-2 text-[10px] text-[#74777f] font-mono">
            {vibration > 0.45 ? "Cavitation Warning" : "Vibration Nominal"}
          </div>
        </div>

        {/* Tank Level Gauge */}
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center shadow-sm">
          <GaugeRing
            value={tankPct}
            max={100}
            label={t("scada.tank_level")}
            unit="%"
            warningLow={25}
          />
          <div className="mt-2 text-[10px] text-[#74777f] font-mono">
            OHSR Reservoir (150 KL)
          </div>
        </div>
      </div>

      {/* ── Dynamic Recharts Line Graph: Rolling 20-Tick Telemetry ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">query_stats</span>
            <h2 className="text-[15px] font-bold text-[#002147]">
              Rolling 20-Tick Hydraulic Telemetry Stream (Pressure vs. Flow Rate)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#0B5CAB] bg-[#E8EEFA] px-2 py-0.5 rounded font-bold">
            2-Second SCADA Poll Interval
          </span>
        </div>

        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={history} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EEFA" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#74777f" }} interval="preserveStartEnd" />
              <YAxis
                yAxisId="left"
                domain={[0, 5]}
                tick={{ fontSize: 10, fill: "#0B5CAB" }}
                label={{ value: "Pressure (bar)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#0B5CAB" } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 20]}
                tick={{ fontSize: 10, fill: "#059669" }}
                label={{ value: "Flow (L/s)", angle: 90, position: "insideRight", style: { fontSize: 10, fill: "#059669" } }}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #DCE3EC", fontSize: 11 }}
                formatter={(v, name) => [typeof v === "number" ? v.toFixed(2) : v, name]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine
                yAxisId="left"
                y={0.7}
                stroke="#DC2626"
                strokeDasharray="4 4"
                label={{ value: "Critical Burst Floor (0.7 bar)", position: "insideTopRight", fill: "#DC2626", fontSize: 9 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pressure"
                stroke="#0B5CAB"
                strokeWidth={2.5}
                dot={false}
                name="Hydrostatic Pressure (bar)"
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="flow"
                stroke="#059669"
                strokeWidth={2.5}
                dot={false}
                name="Volumetric Flow (L/s)"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
