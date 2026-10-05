import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { ProgressBar } from "../components/Gauges";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine, Legend,
} from "recharts";

/* ── Dynamic SVG Radial Trust Score ── */
function TrustScoreGauge({ score }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score > 80 ? "#10B981" : score > 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={radius} fill="none" stroke="#E8EEFA" strokeWidth="12" />
        <circle cx="75" cy="75" r={radius} fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 75 75)"
          style={{ transition: "stroke-dashoffset 0.8s ease-out, stroke 0.4s" }} />
        <text x="75" y="70" textAnchor="middle" style={{
          fontSize: "28px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: color,
        }}>{score.toFixed(1)}</text>
        <text x="75" y="90" textAnchor="middle" style={{
          fontSize: "10px", fontFamily: "'Public Sans', sans-serif", fill: "#44474e",
        }}>/ 100</text>
      </svg>
    </div>
  );
}

export default function CagAudit({ telemetry, isBurstActive }) {
  const { t } = useLanguage();

  // All values compute reactively from isBurstActive
  const trustScore = isBurstActive ? 58.2 : 86.7;
  const govtSaturation = 100.0;
  const groundReality = isBurstActive ? 77.4 : 97.8;
  const missingHomes = isBurstActive ? 70 : 8;
  const lpcdActual = isBurstActive ? 41.2 : (telemetry?.network_kpis?.per_capita_lpcd ?? 84.0);
  const lpcdMandate = 55.0;
  const lpcdGoal = 120;

  // Dynamic bar chart data — recomputes on every state change
  const lpcdBarData = [
    { name: "Govt Mandate", value: lpcdMandate, fill: "#0B5CAB" },
    { name: "Actual Delivered", value: lpcdActual, fill: lpcdActual >= lpcdMandate ? "#10B981" : "#EF4444" },
    { name: "JJM Goal (120)", value: lpcdGoal, fill: "#E8EEFA" },
  ];

  // Discrepancy table — reactive
  const discrepancies = [
    { src: "Census vs GIS Drone", priority: isBurstActive ? "CRITICAL" : "HIGH", cls: "Statutory Discrepancy", hh: `${missingHomes} homes omitted` },
    { src: "IMIS vs SCADA Telemetry", priority: isBurstActive ? "HIGH" : "LOW", cls: isBurstActive ? "Hydraulic Fault Mismatch" : "Nominal", hh: isBurstActive ? `NRW spiked to 38.2%` : "Aligned" },
    { src: "Drone Demography Variance", priority: "MEDIUM", cls: "Geo-Spatial Gap", hh: `264 surveyed / ${264 - missingHomes} confirmed` },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Title ── */}
      <div>
        <h1 className="text-[22px] font-bold text-[#002147] tracking-tight">CAG Ground-Truth & Financial Compliance Audit</h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="bg-[#E8EEFA] text-[#0B5CAB] px-2 py-0.5 rounded text-[10px] font-bold">REF: CAG/PA/DW&amp;S-09/2024</span>
          {isBurstActive && (
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">DISCREPANCY DETECTED</span>
          )}
        </div>
      </div>

      {/* ── Trust Score + 3 Pictorial Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-5 flex flex-col items-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("cag.trust_score")}</div>
          <TrustScoreGauge score={trustScore} />
          <span className={`mt-2 px-3 py-1 rounded text-[11px] font-bold uppercase ${
            trustScore > 75 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>{trustScore > 75 ? "VERIFIED" : "MISMATCH"}</span>
        </div>

        <div className="bg-white rounded-lg border border-[#DCE3EC] p-5 flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-green-600">task_alt</span>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e]">{t("cag.govt_record")}</div>
          <div className="font-mono text-[28px] font-bold text-green-700">{govtSaturation}%</div>
          <span className="text-[11px] text-green-800 font-semibold">{t("cag.saturation")}</span>
        </div>

        <div className={`bg-white rounded-lg border p-5 flex flex-col items-center gap-3 ${isBurstActive ? "border-amber-300 bg-amber-50" : "border-[#DCE3EC]"}`}>
          <span className="material-symbols-outlined text-[36px] text-amber-600">satellite_alt</span>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e]">{t("cag.ground_reality")}</div>
          <div className="font-mono text-[28px] font-bold text-amber-700">{groundReality}%</div>
          <span className="text-[11px] text-amber-800 font-semibold">GIS Drone Survey</span>
        </div>

        <div className={`bg-white rounded-lg border p-5 flex flex-col items-center gap-3 ${missingHomes > 20 ? "border-red-300 bg-red-50" : "border-[#DCE3EC]"}`}>
          <span className="material-symbols-outlined text-[36px] text-red-600">person_off</span>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e]">{t("cag.gap")}</div>
          <div className="font-mono text-[28px] font-bold text-red-700">{missingHomes}</div>
          <span className="text-[11px] text-red-800 font-semibold">Unmapped Fringe Homes</span>
        </div>
      </div>

      {/* ════ DYNAMIC LPCD BAR CHART ════ */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[16px] font-bold text-[#002147] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">water_drop</span>
          LPCD Delivery: {t("common.actual")} vs Mandate (Dynamic)
        </h2>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer className="notranslate" translate="no">
            <BarChart data={lpcdBarData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EEFA" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#44474e" }} />
              <YAxis domain={[0, 130]} tick={{ fontSize: 10, fill: "#44474e" }}
                label={{ value: "LPCD", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#44474e" } }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #DCE3EC", fontSize: 11 }}
                formatter={(v) => [`${v.toFixed(1)} LPCD`]} />
              <ReferenceLine y={55} stroke="#EF4444" strokeDasharray="4 4"
                label={{ value: "Mandate: 55 LPCD", position: "insideTopRight", fill: "#EF4444", fontSize: 9 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {lpcdBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-[11px]">
          {lpcdActual >= lpcdMandate ? (
            <span className="text-green-700 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Exceeds mandate by +{(lpcdActual - lpcdMandate).toFixed(1)} LPCD
            </span>
          ) : (
            <span className="text-red-700 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              Below mandate by {(lpcdMandate - lpcdActual).toFixed(1)} LPCD — {((lpcdMandate - lpcdActual) / lpcdMandate * 100).toFixed(0)}% deficit
            </span>
          )}
        </div>
      </div>

      {/* ── Discrepancy Table ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[14px] font-bold text-[#002147] mb-3">Discrepancy Source Analysis</h2>
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="bg-[#002147] text-white text-[10px] uppercase tracking-wider">
              <th className="px-3 py-2 rounded-tl-lg">Source</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Classification</th>
              <th className="px-3 py-2 rounded-tr-lg">Finding</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.map((r, i) => (
              <tr key={i} className="border-b border-[#DCE3EC] hover:bg-[#F7F9FF]">
                <td className="px-3 py-2 font-semibold">{r.src}</td>
                <td className="px-3 py-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    r.priority === "CRITICAL" ? "bg-red-100 text-red-800" :
                    r.priority === "HIGH" ? "bg-amber-100 text-amber-800" :
                    r.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>{r.priority}</span>
                </td>
                <td className="px-3 py-2">{r.cls}</td>
                <td className="px-3 py-2 font-mono text-[11px]">{r.hh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
