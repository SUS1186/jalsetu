import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const SLA_ROWS = [
  { id: "01", param: "Continuity of Supply", requirement: "Min 4-8 hours continuous", actual: "4.8 hours continuous", penalty: "₹1,000 / day / village", status: "compliant" },
  { id: "02", param: "Terminal Pressure at FHTC", requirement: "7m head (0.70 bar)", actual: "0.82 bar dynamic delivery", penalty: "₹1,500 / day / node", status: "compliant" },
  { id: "03", param: "Potable Water Quantity", requirement: "55.0 LPCD (litres per capita)", actual: "58.4 LPCD observed mean", penalty: "15% invoice retention", status: "compliant" },
  { id: "04", param: "Potability Standards (BIS:10500)", requirement: "Residual Cl: 0.2-0.5 mg/L", actual: "Cl: 0.38, Coliform: 0 CFU", penalty: "₹10,000 / failed sample", status: "compliant" },
  { id: "05", param: "Preventive Maintenance", requirement: "Monthly physical overhaul", actual: "100% completed & synced", penalty: "Nil (Penalty waived)", status: "compliant" },
  { id: "06", param: "SCADA Telemetry Uptime", requirement: "99.0% continuous uplink", actual: "99.84% uptime (Exceeds)", penalty: "Nil (Exemplary)", status: "compliant" },
];

const MONTHLY_WITHHOLDINGS = [
  { month: "Oct 2023", penalty: 12.5, released: 145.0 },
  { month: "Nov 2023", penalty: 8.2, released: 148.5 },
  { month: "Dec 2023", penalty: 15.0, released: 142.0 },
  { month: "Jan 2024", penalty: 4.5, released: 155.0 },
  { month: "Feb 2024", penalty: 6.8, released: 151.2 },
  { month: "Mar 2024", penalty: 25.0, released: 138.0 },
];

export default function ContractorSLA({ isBurstActive, isFloodActive, burstStartTime }) {
  const { t } = useLanguage();

  const [simulatedOutageHours, setSimulatedOutageHours] = useState(isBurstActive ? 22 : 0);
  const [repairMeters, setRepairMeters] = useState(isBurstActive ? 245 : 350);
  const [remediationDispatched, setRemediationDispatched] = useState(false);

  useEffect(() => {
    if (isBurstActive) {
      setSimulatedOutageHours(22);
      setRepairMeters(245);
      setRemediationDispatched(false);
    } else {
      setSimulatedOutageHours(0);
      setRepairMeters(350);
      setRemediationDispatched(false);
    }
  }, [isBurstActive]);

  const isLocked = (isBurstActive || isFloodActive) && !remediationDispatched;
  const isBreach = isBurstActive && !remediationDispatched;

  // Mathematical SLA Penalty Calculation
  const elapsedOutageHours = isBreach ? simulatedOutageHours : 0;
  const totalHours = 48;
  const remainingHours = Math.max(0, totalHours - elapsedOutageHours);
  const damages = isBreach ? Math.max(0, (elapsedOutageHours - 12) * 2500) : 0;

  // Dynamic SVG Circular Timer Math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, remainingHours / totalHours));
  const strokeDashoffset = circumference - progressRatio * circumference;

  const timerColor = isBreach
    ? "#EF4444"
    : remainingHours < 24
    ? "#F59E0B"
    : "#10B981";

  const pipelineTotal = 350;

  const handleAuthorizeRemediation = () => {
    setRemediationDispatched(true);
    setRepairMeters(350);
    setSimulatedOutageHours(10);
  };

  const slaData = SLA_ROWS.map((row) => {
    if (isBreach) {
      if (row.id === "02") {
        return {
          ...row,
          actual: "0.48 bar (Critical drop)",
          status: "breached",
          penalty: "₹1,500 / day / node",
        };
      }
      if (row.id === "03") {
        return {
          ...row,
          actual: "41.2 LPCD (Deficit < 55 LPCD)",
          status: "breached",
        };
      }
    }
    return row;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Title ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-[#002147] tracking-tight">{t("sla.title")}</h1>
          <p className="text-[13px] text-[#44474e] mt-1">
            L&amp;T Rural Water &amp; Infrastructure Division &bull; Contract: RWS/CSN/2024 &bull; 5-Year Comprehensive O&amp;M
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isBreach && !remediationDispatched && (
            <button
              onClick={handleAuthorizeRemediation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#C82333] hover:bg-[#a51d2a] text-white text-[12px] font-bold shadow transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">build</span>
              Authorize Remediation Escrow Drawdown
            </button>
          )}
          {remediationDispatched && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-green-100 text-green-800 text-[12px] font-bold border border-green-300">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Rapid Repair Unit Dispatched &bull; Escrow Drawdown Authorized
            </span>
          )}
        </div>
      </div>

      {/* ── Top Visual Row: Padlock + Dynamic SLA Timer Ring + Damages Metric + Pipe Progress ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. Giant Visual Escrow Padlock */}
        <div
          className={`flex flex-col items-center justify-center p-5 rounded-lg border-2 transition-all duration-500 ${
            isLocked
              ? "bg-red-50 border-red-400 animate-pulse shadow-md"
              : "bg-green-50 border-green-300"
          }`}
        >
          <svg width="68" height="68" viewBox="0 0 80 80">
            {isLocked ? (
              <>
                <rect x="15" y="38" width="50" height="35" rx="6" fill="#C82333" />
                <rect x="22" y="18" width="36" height="24" rx="12" fill="none" stroke="#C82333" strokeWidth="6" />
                <circle cx="40" cy="52" r="4" fill="#FFFFFF" />
                <rect x="38" y="52" width="4" height="10" fill="#FFFFFF" />
              </>
            ) : (
              <>
                <rect x="15" y="38" width="50" height="35" rx="6" fill="#1A7F48" />
                <path d="M 22 38 L 22 28 C 22 16 58 16 58 28" fill="none" stroke="#1A7F48" strokeWidth="6" strokeLinecap="round" />
                <circle cx="40" cy="52" r="4" fill="#FFFFFF" />
                <rect x="38" y="52" width="4" height="10" fill="#FFFFFF" />
              </>
            )}
          </svg>
          <div className="mt-2 text-center">
            <span className={`text-[12px] font-bold uppercase tracking-wider block ${isLocked ? "text-red-700" : "text-green-800"}`}>
              {isLocked ? t("sla.escrow_locked") : t("sla.funds_released")}
            </span>
            <span className="text-[10px] text-[#44474e]">
              {isLocked ? "Penalty Accumulating" : "State Water Treasury Verified"}
            </span>
          </div>
        </div>

        {/* 2. Mathematical Animated SLA Timer Ring */}
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col items-center justify-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e] mb-1">
            {t("sla.hours_remaining")}
          </div>
          <svg width="140" height="140" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#E8EEFA"
              strokeWidth="10"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={timerColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s" }}
            />
            <text
              x="80"
              y="74"
              textAnchor="middle"
              style={{ fontSize: "22px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: timerColor }}
            >
              {remainingHours.toFixed(1)}h
            </text>
            <text
              x="80"
              y="94"
              textAnchor="middle"
              style={{ fontSize: "10px", fontFamily: "'Public Sans', sans-serif", fill: "#44474e", fontWeight: 600 }}
            >
              / {totalHours}h MTTR
            </text>
          </svg>
          <div className="text-[10px] text-center text-[#74777f]">
            {isBreach ? (
              <span className="text-red-600 font-bold">12h Grace Period Elapsed</span>
            ) : (
              <span>Nominal MTTR Window Active</span>
            )}
          </div>
        </div>

        {/* 3. Liquidated Damages Applied Metric */}
        <div
          className={`rounded-lg border-2 p-5 flex flex-col items-center justify-center gap-1.5 transition-all ${
            damages > 0 ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"
          }`}
        >
          <span
            className="material-symbols-outlined text-[36px]"
            style={{ color: damages > 0 ? "#C82333" : "#1A7F48" }}
          >
            {damages > 0 ? "gavel" : "verified_user"}
          </span>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#44474e] text-center">
            {t("sla.penalty")}
          </div>
          <div
            className={`font-mono text-[24px] font-bold ${
              damages > 0 ? "text-red-700" : "text-green-700"
            }`}
          >
            ₹{damages.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-center text-[#74777f]">
            {damages > 0 ? (
              <span className="text-red-600 font-semibold">₹2,500/hr past 12h grace</span>
            ) : (
              <span className="text-green-700 font-semibold">Zero Penalties Accrued</span>
            )}
          </div>
        </div>

        {/* 4. Visual Pipeline Repair Progress */}
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#44474e]">
              {t("sla.pipeline_repair")}
            </span>
            <span className="text-[12px] font-mono font-bold text-[#0B5CAB]">
              {Math.round((repairMeters / pipelineTotal) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#E8EEFA] rounded-full h-4 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(repairMeters / pipelineTotal) * 100}%`,
                backgroundColor: repairMeters >= pipelineTotal ? "#10B981" : "#0B5CAB",
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#44474e]">
            <span>{repairMeters}m Replaced</span>
            <span>{pipelineTotal}m Total</span>
          </div>
          <div className="text-[10px] text-[#74777f] mt-2">
            {repairMeters >= pipelineTotal
              ? "All Pipe Replaced & Hydro-Tested"
              : `${pipelineTotal - repairMeters}m rupture zone under active weld`}
          </div>
        </div>
      </div>

      {/* ── Force Majeure Banner ── */}
      {isFloodActive && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[32px] text-amber-600">flood</span>
          <div>
            <div className="text-[14px] font-bold text-amber-800">{t("sla.force_majeure")}</div>
            <div className="text-[12px] text-amber-700 mt-0.5">
              Chemical dosage booster SLA activated. Escrow frozen under Force Majeure statutory clause until river intake turbidity normalizes below 5 NTU.
            </div>
          </div>
        </div>
      )}

      {/* ── Recharts Dynamic Penalty & Withholding Trend Chart ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-[16px] font-bold text-[#002147] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">analytics</span>
              SLA Liquidated Damages &amp; Escrow Retention History (₹ Lakhs)
            </h2>
            <p className="text-[11px] text-[#74777f] mt-0.5">
              Dynamic 6-month fiscal audit trail comparing contractor escrow releases against performance clawbacks
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#10B981] inline-block" />
              Escrow Cleared
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#EF4444] inline-block" />
              Liquidated Damages
            </span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_WITHHOLDINGS} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#44474e" }} />
              <YAxis tick={{ fontSize: 11, fill: "#44474e" }} unit=" L" />
              <Tooltip
                formatter={(val, name) => [
                  `₹${val} Lakhs`,
                  name === "released" ? "Escrow Cleared" : "Damages Withheld",
                ]}
                contentStyle={{
                  backgroundColor: "#002147",
                  border: "none",
                  borderRadius: "6px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="released" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="penalty" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── SLA Matrix Table ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[16px] font-bold text-[#002147] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">checklist</span>
          Contractor 5-Year O&amp;M Service Level Agreement (SLA) Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#002147] text-white text-[10px] uppercase tracking-wider">
                <th className="px-3 py-2.5 rounded-tl-lg">#</th>
                <th className="px-3 py-2.5">SLA Parameter</th>
                <th className="px-3 py-2.5">Statutory Requirement</th>
                <th className="px-3 py-2.5">Actual Observed</th>
                <th className="px-3 py-2.5">Contractual Penalty</th>
                <th className="px-3 py-2.5 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {slaData.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-[#DCE3EC] text-[12px] ${
                    row.status === "breached"
                      ? "bg-red-50 font-semibold"
                      : i % 2
                      ? "bg-[#F7F9FF]"
                      : "bg-white"
                  } hover:bg-[#EBF3FC] transition-colors`}
                >
                  <td className="px-3 py-2.5 font-bold text-[#0B5CAB]">{row.id}</td>
                  <td className="px-3 py-2.5 font-semibold text-[#0e1d2a]">{row.param}</td>
                  <td className="px-3 py-2.5 text-[11px] text-[#44474e]">{row.requirement}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">{row.actual}</td>
                  <td className="px-3 py-2.5 text-[11px]">{row.penalty}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        row.status === "breached"
                          ? "bg-red-200 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {row.status === "breached" ? "error" : "check_circle"}
                      </span>
                      {row.status === "breached" ? "BREACHED" : "COMPLIANT"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {damages > 0 && (
          <div className="mt-3 flex justify-end">
            <span className="font-mono text-[14px] font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded">
              TOTAL LIQUIDATED DAMAGES ACCRUED: ₹{damages.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* ── Escrow Summary ── */}
      <div className="bg-[#002147] rounded-lg p-5 text-white">
        <h2 className="text-[14px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#B3802A]">account_balance</span>
          National Cumulative Escrow Holdings
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-mono text-[22px] font-bold">709</div>
            <div className="text-[10px] text-[#94a3b8] uppercase">Concessionaires</div>
          </div>
          <div>
            <div className="font-mono text-[22px] font-bold text-[#B3802A]">₹826.20 Cr</div>
            <div className="text-[10px] text-[#94a3b8] uppercase">Total Escrowed</div>
          </div>
          <div>
            <div className="font-mono text-[22px] font-bold text-[#EF4444]">
              {isBreach ? "74" : "73"}
            </div>
            <div className="text-[10px] text-[#94a3b8] uppercase">Breached SLAs</div>
          </div>
          <div>
            <div className="font-mono text-[22px] font-bold text-green-400">
              {remediationDispatched ? "23" : "22"}
            </div>
            <div className="text-[10px] text-[#94a3b8] uppercase">Cure Notices Dispatched</div>
          </div>
        </div>
      </div>
    </div>
  );
}
