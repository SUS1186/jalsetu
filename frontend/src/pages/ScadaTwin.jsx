import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { PotabilityBadge } from "../components/Gauges";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell, ReferenceLine,
} from "recharts";

/* ── Dynamic SVG Circular Gauge ── */
function DynamicGauge({ value, max, label, unit, warningThreshold, size = 130 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;
  const isWarn = warningThreshold !== undefined && value < warningThreshold;
  const color = isWarn ? "#EF4444" : value / max > 0.7 ? "#10B981" : "#0B5CAB";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8EEFA" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.6s ease-out, stroke 0.3s" }} />
        <text x={size / 2} y={size / 2 - 6} textAnchor="middle" style={{
          fontSize: "20px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: "#0e1d2a",
        }}>{typeof value === "number" ? value.toFixed(2) : value}</text>
        <text x={size / 2} y={size / 2 + 14} textAnchor="middle" style={{
          fontSize: "10px", fontFamily: "'Public Sans', sans-serif", fill: "#44474e",
        }}>{unit}</text>
      </svg>
      {label && <span className="text-[10px] font-semibold text-[#44474e] uppercase tracking-wide text-center">{label}</span>}
    </div>
  );
}

/* ── Dynamic Water Tank ── */
function DynamicTank({ level, isFlooded, label }) {
  const pct = Math.min(level / 100, 1);
  const waterColor = isFlooded ? "#8B5A2B" : "#3B82F6";
  const h = 100, w = 50;
  const waterH = h * pct;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={w + 8} height={h + 20} viewBox={`0 0 ${w + 8} ${h + 20}`}>
        <rect x="4" y="10" width={w} height={h} rx="4" fill="none" stroke="#74777f" strokeWidth="2" />
        <rect x="6" y={10 + h - waterH + 2} width={w - 4} height={Math.max(waterH - 4, 0)} rx="2" fill={waterColor} opacity="0.7">
          <animate attributeName="opacity" values="0.6;0.85;0.6" dur="2s" repeatCount="indefinite" />
        </rect>
        <text x={(w + 8) / 2} y={h / 2 + 14} textAnchor="middle" style={{
          fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: pct > 0.3 ? "#fff" : "#0e1d2a",
        }}>{Math.round(pct * 100)}%</text>
      </svg>
      {label && <span className="text-[10px] font-semibold text-[#44474e] uppercase tracking-wide">{label}</span>}
    </div>
  );
}

/* ── Fallback data generator when backend offline ── */
function generateFallback(isBurst, isFlood, existingHistory) {
  if (existingHistory.length > 0) return existingHistory;
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    tick: i + 1,
    time: new Date(now - (19 - i) * 2000).toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    pressure: isBurst ? 0.48 + Math.random() * 0.1 : 2.0 + Math.random() * 0.4,
    flow: isBurst ? 3.2 + Math.random() * 0.5 : 8.0 + Math.random() * 1.0,
    nrw: isBurst ? 35 + Math.random() * 5 : 11 + Math.random() * 3,
    chlorine: 0.3 + Math.random() * 0.15,
    turbidity: isFlood ? 48 + Math.random() * 12 : 0.6 + Math.random() * 0.5,
  }));
}

export default function ScadaTwin({ telemetry, isBurstActive, isFloodActive, telemetryHistory = [] }) {
  const { t } = useLanguage();

  const history = telemetryHistory.length > 0 ? telemetryHistory : generateFallback(isBurstActive, isFloodActive, telemetryHistory);

  // Live values from latest tick or telemetry
  const latest = history[history.length - 1] || {};
  const pressure = isBurstActive ? 0.48 : (latest.pressure ?? 2.14);
  const flow = latest.flow ?? 8.42;
  const nrw = isBurstActive ? 38.2 : (latest.nrw ?? 12.26);
  const chlorine = latest.chlorine ?? 0.38;
  const ph = telemetry?.nodes?.[1]?.ph_spectrometry ?? 7.32;
  const lpcd = telemetry?.network_kpis?.per_capita_lpcd ?? 84.0;
  const tankPct = telemetry?.nodes?.[2]?.tank_level_pct ?? 81;
  const nodesActive = telemetry?.network_kpis?.nodes_active ?? 4;
  const nodesTotal = telemetry?.network_kpis?.nodes_total ?? 4;
  const turbidity = isFloodActive ? 54.2 : (latest.turbidity ?? 0.82);
  const isSafe = chlorine >= 0.2 && ph >= 6.5 && ph <= 8.5 && !isFloodActive;

  // Node bar chart data — fully reactive
  const nodeBarData = [
    { id: "LEAK_NODE", pressure: pressure, flow: flow, status: "NOMINAL" },
    { id: "JUNC_01", pressure: 1.95 + (isBurstActive ? -0.3 : 0), flow: 4.10, status: "ACTIVE" },
    { id: "JUNC_02", pressure: isBurstActive ? 0.48 : 1.88, flow: 3.25, status: isBurstActive ? "FAULT" : "ACTIVE" },
    { id: "JUNC_03", pressure: isBurstActive ? 0.48 : 1.62, flow: 2.65, status: isBurstActive ? "FAULT" : "ACTIVE" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Title + Status ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-[#002147] tracking-tight">{t("scada.title")}</h1>
          <p className="text-[12px] text-[#44474e] mt-0.5">EPANET 2.2 &bull; Polling: 2000ms &bull; {history.length}/20 ticks buffered</p>
        </div>
        <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
          isBurstActive ? "bg-red-100 text-red-800 animate-pulse" : isFloodActive ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-green-100 text-green-800"
        }`}>
          SCADA: {isBurstActive ? "PIPE BURST FAULT" : isFloodActive ? "FLOOD INTAKE TRIPPED" : "NOMINAL"}
        </span>
      </div>

      {/* ── 4 Dynamic Gauges ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("scada.residual_chlorine")}</div>
          <DynamicGauge value={chlorine} max={1.0} unit="mg/L" warningThreshold={0.2} />
          <span className={`mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${chlorine >= 0.2 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {chlorine >= 0.2 ? "SAFE" : "LOW"}
          </span>
        </div>
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("scada.ph")}</div>
          <DynamicGauge value={ph} max={14} unit="pH" warningThreshold={6.5} />
          <span className="mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-100 text-blue-800">POTABLE</span>
        </div>
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("scada.nrw")}</div>
          <DynamicGauge value={nrw} max={50} unit="% loss" warningThreshold={15} />
          <span className={`mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${nrw > 25 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
            {nrw > 25 ? "HIGH LOSS" : "LOW LOSS"}
          </span>
        </div>
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("scada.lpcd")}</div>
          <DynamicGauge value={lpcd} max={120} unit="LPCD" />
          <span className="mt-2 text-[10px] text-[#74777f]">{t("common.target")}: 55 LPCD</span>
        </div>
      </div>

      {/* ════ LIVE ROLLING LINE CHART ════ */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[14px] font-bold text-[#002147] mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#0B5CAB]">monitoring</span>
          Live Hydraulic Telemetry Stream (last {history.length} ticks)
        </h2>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EEFA" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#74777f" }} interval="preserveStartEnd" />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#44474e" }} domain={[0, 5]}
                label={{ value: "bar", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#44474e" } }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#44474e" }} domain={[0, 15]}
                label={{ value: "L/s", angle: 90, position: "insideRight", style: { fontSize: 10, fill: "#44474e" } }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #DCE3EC", fontSize: 11 }}
                formatter={(v, name) => [typeof v === "number" ? v.toFixed(2) : v, name]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine yAxisId="left" y={0.7} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Min Pressure", position: "insideTopRight", fill: "#EF4444", fontSize: 9 }} />
              <Line yAxisId="left" type="monotone" dataKey="pressure" stroke="#0B5CAB" strokeWidth={2}
                dot={false} name={t("scada.pressure")} isAnimationActive={false} />
              <Line yAxisId="right" type="monotone" dataKey="flow" stroke="#10B981" strokeWidth={2}
                dot={false} name={t("scada.flow")} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Tank + Potability + Node Bar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tank + Potability */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("scada.tank_level")}</div>
            <DynamicTank level={tankPct} isFlooded={isFloodActive} label="ESR 150 KL" />
          </div>
          <PotabilityBadge isSafe={isSafe} label={isSafe ? t("scada.safe_to_drink") : t("scada.do_not_drink")} />
        </div>

        {/* Node Pressure Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#DCE3EC] p-5">
          <h2 className="text-[14px] font-bold text-[#002147] mb-3">Node Pressure Comparison</h2>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={nodeBarData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEFA" />
                <XAxis dataKey="id" tick={{ fontSize: 10, fill: "#44474e" }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 10, fill: "#44474e" }}
                  label={{ value: "bar", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#44474e" } }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #DCE3EC", fontSize: 11 }}
                  formatter={(v) => [v.toFixed(2) + " bar"]} />
                <ReferenceLine y={0.7} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Min Safe", position: "insideTopRight", fill: "#EF4444", fontSize: 9 }} />
                <Bar dataKey="pressure" radius={[4, 4, 0, 0]}>
                  {nodeBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.pressure < 0.7 ? "#EF4444" : entry.pressure < 1.5 ? "#F59E0B" : "#0B5CAB"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Turbidity Time-Series (for flood) ── */}
      {isFloodActive && (
        <div className="bg-white rounded-lg border-2 border-amber-300 p-5">
          <h2 className="text-[14px] font-bold text-amber-800 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">flood</span>
            Turbidity Surge Monitor (NTU)
          </h2>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <LineChart data={history.map((h) => ({ ...h, turbidity: isFloodActive ? 48 + Math.random() * 12 : h.turbidity }))}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#92400E" }} interval="preserveStartEnd" />
                <YAxis domain={[0, 70]} tick={{ fontSize: 10, fill: "#92400E" }} />
                <ReferenceLine y={5} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Permissible: 5 NTU", position: "insideTopRight", fill: "#EF4444", fontSize: 9 }} />
                <Line type="monotone" dataKey="turbidity" stroke="#92400E" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
