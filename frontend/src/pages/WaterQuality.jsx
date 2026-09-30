import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { StatCard, IndianNumber } from "../components/Gauges";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from "recharts";

const STATE_DATA = [
  { rank: "01", state: "Gujarat", labs: "192 (78 NABL)", tested: 234190, contaminated: 1420, remedial: 99.2, ftk_women: 134200, status: "VERIFIED" },
  { rank: "02", state: "Maharashtra", labs: "170 (70 NABL)", tested: 318109, contaminated: 8918, remedial: 91.5, ftk_women: 219100, status: "ACTIVE" },
  { rank: "03", state: "Tamil Nadu", labs: "94 (62 NABL)", tested: 168408, contaminated: 2140, remedial: 91.8, ftk_women: 145200, status: "VERIFIED" },
  { rank: "04", state: "Uttar Pradesh", labs: "212 (88 NABL)", tested: 412050, contaminated: 36200, remedial: 79.4, ftk_women: 381100, status: "SANCTIONED" },
  { rank: "05", state: "Rajasthan", labs: "132 (56 NABL)", tested: 198408, contaminated: 9848, remedial: 81.3, ftk_women: 140100, status: "ACTIVE" },
];

const BIS_PARAMS = [
  { name: "E. coli / Fecal Coliform", standard: "0 CFU/100 mL", flagged: 38412, status: "NATIONAL ALERT" },
  { name: "Fluoride (F)", standard: "1.5 mg/L", flagged: 12304, status: "ENDEMIC" },
  { name: "Iron (Fe)", standard: "1.0 mg/L", flagged: 18858, status: "ENDEMIC" },
  { name: "Arsenic (As)", standard: "0.01 mg/L", flagged: 4238, status: "NATIONAL ALERT" },
  { name: "Nitrate (NO\u2083)", standard: "45 mg/L", flagged: 1182, status: "MODERATE" },
];

const PIE_COLORS = ["#10B981", "#EF4444", "#3B82F6"];

export default function WaterQuality({ isFloodActive }) {
  const { t } = useLanguage();

  // Dynamic donut data — reactive to flood
  const cleanSamples = isFloodActive ? 3200000 : 3320000;
  const contaminatedSamples = isFloodActive ? 189071 + 184 : 69593;
  const ftkTests = 6132409;

  const donutData = [
    { name: t("wq.safe"), value: cleanSamples },
    { name: t("wq.contaminated"), value: contaminatedSamples },
    { name: "FTK Field Tests", value: ftkTests },
  ];
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#002147] tracking-tight">{t("wq.title")}</h1>
        <p className="text-[13px] text-[#44474e] mt-1">जल गुणवत्ता प्रबंधन सूचना प्रणाली</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon="science" value="2,850" label={t("wq.labs")} sublabel="Institutional + FTK" iconColor="#0B5CAB" />
        <StatCard icon="biotech" value="33,89,336" label={t("wq.samples_tested")} sublabel="FY 2026-27" iconColor="#1A7F48" />
        <StatCard icon="fact_check" value="3,89,071" label="Village Coverage" sublabel="49.5% Penetration" iconColor="#0B5CAB" />
        <StatCard icon="groups" value="24,80,533" label={t("wq.women_trained")} sublabel="5-Women FTK Groups" iconColor="#B3802A" />
        <StatCard icon="explore" value="5,07,642" label="Active Village Reach" sublabel="64.6% Coverage" iconColor="#0B5CAB" />
        <StatCard icon="lab_research" value="61,32,409" label={t("wq.ftk_tests")} sublabel="+10,893 today" iconColor="#1A7F48"
          trend={isFloodActive ? "+184 flagged" : "+42"} />
      </div>

      {/* ════ DYNAMIC DONUT CHART ════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
          <h2 className="text-[14px] font-bold text-[#002147] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#0B5CAB]">donut_large</span>
            Sample Distribution (Lab + FTK)
          </h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  labelLine={{ stroke: "#74777f", strokeWidth: 1 }}>
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #DCE3EC", fontSize: 11 }}
                  formatter={(v) => [v.toLocaleString("en-IN"), "Samples"]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BIS Compliance */}
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
          <h2 className="text-[14px] font-bold text-[#002147] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-red-600">warning</span>
            BIS:10500 Compliance Matrix
          </h2>
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="bg-[#002147] text-white text-[10px] uppercase tracking-wider">
                <th className="px-3 py-2 rounded-tl-lg">Parameter</th>
                <th className="px-3 py-2">Limit</th>
                <th className="px-3 py-2">Flagged</th>
                <th className="px-3 py-2 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {BIS_PARAMS.map((r, i) => (
                <tr key={i} className="border-b border-[#DCE3EC] hover:bg-[#F7F9FF]">
                  <td className="px-3 py-2 font-semibold">{r.name}</td>
                  <td className="px-3 py-2 font-mono text-[11px]">{r.standard}</td>
                  <td className="px-3 py-2 font-mono font-bold text-red-700">{r.flagged.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      r.status === "NATIONAL ALERT" ? "bg-red-100 text-red-800" :
                      r.status === "ENDEMIC" ? "bg-amber-100 text-amber-800" : "bg-yellow-100 text-yellow-800"
                    }`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Flood Alert ── */}
      {isFloodActive && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3 animate-pulse">
          <span className="material-symbols-outlined text-[28px] text-red-600">dangerous</span>
          <div>
            <div className="text-[13px] font-bold text-red-800">{t("wq.contaminated")} — Flood Surge</div>
            <div className="text-[11px] text-red-700 mt-0.5">Turbidity: 54.2 NTU. +184 contaminated samples today.</div>
          </div>
        </div>
      )}

      {/* ── State Lab Table ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[16px] font-bold text-[#002147] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">table_chart</span>
          State/UT Lab &amp; FTK Surveillance League
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#002147] text-white text-[10px] uppercase tracking-wider">
                <th className="px-3 py-2 rounded-tl-lg">S.No</th>
                <th className="px-3 py-2">State</th>
                <th className="px-3 py-2">Labs</th>
                <th className="px-3 py-2">Tested</th>
                <th className="px-3 py-2">{t("wq.contaminated")}</th>
                <th className="px-3 py-2">Remedial %</th>
                <th className="px-3 py-2 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {STATE_DATA.map((r, i) => (
                <tr key={r.rank} className={`border-b border-[#DCE3EC] text-[12px] ${i % 2 ? "bg-[#F7F9FF]" : "bg-white"} hover:bg-[#EBF3FC]`}>
                  <td className="px-3 py-2 font-bold text-[#0B5CAB]">{r.rank}</td>
                  <td className="px-3 py-2 font-semibold">{r.state}</td>
                  <td className="px-3 py-2 font-mono text-[11px]">{r.labs}</td>
                  <td className="px-3 py-2 font-mono text-[11px]">{r.tested.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-red-700">{r.contaminated.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 h-1.5 bg-[#E8EEFA] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#1A7F48]" style={{ width: `${r.remedial}%` }} />
                      </div>
                      <span className="text-[10px] font-mono">{r.remedial}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      r.status === "VERIFIED" ? "bg-green-100 text-green-800" :
                      r.status === "ACTIVE" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                    }`}>{r.status}</span>
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
