import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { IndianNumber, ProgressBar } from "../components/Gauges";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const STATE_DATA = [
  { rank: "01", state: "Gujarat", schools: 43120, awc: 55925, total: "1,07,617", hh_gp: 43858, satPct: 100, status: "HAR GHAR JAL" },
  { rank: "02", state: "Himachal Pradesh", schools: 39124, awc: 53925, total: "1,07,617", hh_gp: 22330, satPct: 100, status: "HAR GHAR JAL" },
  { rank: "03", state: "Haryana", schools: 22448, awc: 25962, total: "22,330", hh_gp: 22330, satPct: 100, status: "CERTIFIED" },
  { rank: "04", state: "Tamil Nadu", schools: 45200, awc: 84637, total: "1,04,637", hh_gp: 67800, satPct: 95, status: "ACTIVE" },
  { rank: "05", state: "Maharashtra", schools: 35400, awc: 79230, total: "1,05,630", hh_gp: 81400, satPct: 93, status: "ACTIVE" },
  { rank: "06", state: "Uttar Pradesh", schools: 147400, awc: 187300, total: "3,34,700", hh_gp: 176800, satPct: 85, status: "MONITORED" },
  { rank: "07", state: "Rajasthan", schools: 96100, awc: 62135, total: "1,58,235", hh_gp: 64100, satPct: 79, status: "ACTIVE" },
];

const CHART_DATA = STATE_DATA.map((d) => ({
  state: d.state,
  Schools: d.schools,
  Anganwadis: d.awc,
  Saturation: d.satPct,
}));

export default function SchoolsAWC() {
  const { t } = useLanguage();
  const [metricView, setMetricView] = useState("counts"); // "counts" or "saturation"

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Title ── */}
      <div>
        <h1 className="text-[22px] font-bold text-[#002147] tracking-tight">{t("schools.title")}</h1>
        <p className="text-[13px] text-[#44474e] mt-1">
          हमारे बच्चों के लिए स्वच्छ पेयजल — 100% Institutional Tap Water Saturation
        </p>
      </div>

      {/* ── Top KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#EBF3FC] rounded-lg border border-[#BCD9EA] p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[24px] text-[#0B5CAB]">school</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">{t("schools.total_schools")}</span>
          </div>
          <IndianNumber value={935144} className="text-[32px] text-[#002147]" />
          <div className="text-[10px] text-[#74777f] mt-1">/ 11,20,581 Government &amp; Aided Schools (83.4%)</div>
          <div className="mt-2">
            <ProgressBar value={935144} max={1120581} color="#0B5CAB" height={8} showText={false} />
          </div>
        </div>

        <div className="bg-[#E8F8F0] rounded-lg border border-green-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[24px] text-green-700">child_care</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">{t("schools.awc_count")}</span>
          </div>
          <IndianNumber value={973598} className="text-[32px] text-[#002147]" />
          <div className="text-[10px] text-[#74777f] mt-1">/ 11,23,695 Anganwadi Centres (86.6%)</div>
          <div className="mt-2">
            <ProgressBar value={973598} max={1123695} color="#1A7F48" height={8} showText={false} />
          </div>
        </div>

        <div className="bg-[#FFF8E1] rounded-lg border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[24px] text-[#B3802A]">local_hospital</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">GP / Bhawans / PHCs</span>
          </div>
          <IndianNumber value={393696} className="text-[32px] text-[#002147]" />
          <div className="text-[10px] text-[#74777f] mt-1">Community buildings connected (77.0%)</div>
          <div className="mt-2">
            <ProgressBar value={77} max={100} color="#B3802A" height={8} showText={false} />
          </div>
        </div>
      </div>

      {/* ── Dynamic Recharts Chart ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-bold text-[#002147] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">bar_chart</span>
              Institutional Tap Water Coverage Comparison by State
            </h2>
            <p className="text-[11px] text-[#74777f] mt-0.5">
              Comparative metrics across elementary schools and child care centres (AWCs)
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#F4F6F9] p-1 rounded-md border border-[#DCE3EC]">
            <button
              onClick={() => setMetricView("counts")}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                metricView === "counts"
                  ? "bg-white text-[#0B5CAB] shadow-sm font-bold"
                  : "text-[#44474e] hover:text-[#002147]"
              }`}
            >
              Absolute Counts
            </button>
            <button
              onClick={() => setMetricView("saturation")}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                metricView === "saturation"
                  ? "bg-white text-[#0B5CAB] shadow-sm font-bold"
                  : "text-[#44474e] hover:text-[#002147]"
              }`}
            >
              Saturation %
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {metricView === "counts" ? (
              <BarChart data={CHART_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="state" tick={{ fontSize: 11, fill: "#44474e" }} />
                <YAxis tick={{ fontSize: 11, fill: "#44474e" }} />
                <Tooltip
                  formatter={(val, name) => [val.toLocaleString("en-IN") + " Connected", name]}
                  contentStyle={{
                    backgroundColor: "#002147",
                    border: "none",
                    borderRadius: "6px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                <Bar dataKey="Schools" fill="#0B5CAB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Anganwadis" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={CHART_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="state" tick={{ fontSize: 11, fill: "#44474e" }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: "#44474e" }} />
                <Tooltip
                  formatter={(val) => [`${val}% Saturated`, "Coverage"]}
                  contentStyle={{
                    backgroundColor: "#002147",
                    border: "none",
                    borderRadius: "6px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="Saturation" fill="#002147" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Specialized Infrastructure ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[16px] font-bold text-[#002147] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">eco</span>
          Specialized Child Hygiene &amp; Ecological Infrastructure (WinS)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "water_drop", label: "Toilets & Climate Proof Flow", value: "7,45,561", sub: "87.1% compliance" },
            { icon: "wash", label: "Handwashing Stations (WinS)", value: "8,69,934", sub: "Infraday sensors installed" },
            { icon: "opacity", label: "Rainwater Harvesting Systems", value: "1,01,126", sub: "Collecting roof-grade runoff" },
            { icon: "recycling", label: "Greywater & Poshan Vatika", value: "1,31,868", sub: "Reuse at all schools" },
          ].map((item) => (
            <div key={item.label} className="bg-[#F7F9FF] rounded-lg border border-[#DCE3EC] p-4 text-center">
              <span className="material-symbols-outlined text-[28px] text-[#0B5CAB] mb-2">{item.icon}</span>
              <div className="font-mono text-[18px] font-bold text-[#002147]">{item.value}</div>
              <div className="text-[10px] text-[#44474e] font-semibold mt-1">{item.label}</div>
              <div className="text-[9px] text-[#74777f] mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── State League Table ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[16px] font-bold text-[#002147] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#B3802A]">leaderboard</span>
          State / UT Institutional Infrastructure League Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#002147] text-white text-[10px] uppercase tracking-wider">
                <th className="px-3 py-2.5 rounded-tl-lg">S.No</th>
                <th className="px-3 py-2.5">State / UT</th>
                <th className="px-3 py-2.5">{t("schools.total_schools")}</th>
                <th className="px-3 py-2.5">{t("schools.awc_count")}</th>
                <th className="px-3 py-2.5">Saturation</th>
                <th className="px-3 py-2.5 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {STATE_DATA.map((row, i) => (
                <tr key={row.rank} className={`border-b border-[#DCE3EC] text-[12px] ${i % 2 ? "bg-[#F7F9FF]" : "bg-white"} hover:bg-[#EBF3FC]`}>
                  <td className="px-3 py-2.5 font-bold text-[#0B5CAB]">{row.rank}</td>
                  <td className="px-3 py-2.5 font-semibold">{row.state}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">{row.schools.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">{row.awc.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-2 bg-[#E8EEFA] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${row.satPct}%`,
                          backgroundColor: row.satPct === 100 ? "#1A7F48" : row.satPct >= 90 ? "#0B5CAB" : "#B3802A"
                        }} />
                      </div>
                      <span className="font-mono text-[10px] font-bold">{row.satPct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      row.status === "HAR GHAR JAL" ? "bg-green-100 text-green-800" :
                      row.status === "CERTIFIED" ? "bg-blue-100 text-blue-800" :
                      row.status === "ACTIVE" ? "bg-yellow-100 text-yellow-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
