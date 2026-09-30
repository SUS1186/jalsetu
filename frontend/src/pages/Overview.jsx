import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { StatCard, IndianNumber } from "../components/Gauges";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000";

const RAW_DATA = [
  { year: "Aug 2019", fhtc: 32362838 },
  { year: "Mar 2020", fhtc: 38060925 },
  { year: "Mar 2021", fhtc: 57273498 },
  { year: "Mar 2022", fhtc: 90983473 },
  { year: "Mar 2023", fhtc: 118805889 },
  { year: "Mar 2024", fhtc: 146282756 },
  { year: "Sep 2026", fhtc: 159546438 },
];

function computeIncrements(data) {
  return data.map((d, i) => ({
    year: d.year,
    increment: i === 0 ? d.fhtc : d.fhtc - data[i - 1].fhtc,
  }));
}

const HGJ_STATES = [
  "Goa", "A&N Islands", "Puducherry", "D&NH and D&D",
  "Arunachal Pradesh", "Haryana", "Punjab", "Gujarat", "Telangana",
  "Himachal Pradesh", "Sikkim",
];

const TIER_COLORS = {
  "Front Runner": "bg-green-100 text-green-800",
  "High Achiever": "bg-blue-100 text-blue-800",
  "Achiever": "bg-yellow-100 text-yellow-800",
  "Performer": "bg-orange-100 text-orange-800",
  "Aspirant": "bg-red-100 text-red-800",
};

/* ── JJM Gap Item ── */
function GapItem({ icon, iconColor, legacy, jalsetu, index }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: iconColor + "18" }}>
        <span className="material-symbols-outlined text-[18px]" style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Legacy Gap #{index}</span>
        </div>
        <p className="text-[11px] text-[#74777f] line-through mb-0.5">{legacy}</p>
        <p className="text-[11px] text-[#0e1d2a] font-semibold">{jalsetu}</p>
      </div>
    </div>
  );
}

/* ── Saturation Color Tier ── */
function getSaturationColor(pct) {
  if (pct >= 100) return "#08306B";
  if (pct >= 76) return "#2171B5";
  if (pct >= 51) return "#6BAED6";
  if (pct >= 26) return "#BCD9EA";
  if (pct >= 11) return "#F3B39E";
  return "#F7D9CE";
}

function getSaturationTier(pct) {
  if (pct >= 100) return "100% Saturated";
  if (pct >= 76) return "76% - 99%";
  if (pct >= 51) return "51% - 75%";
  if (pct >= 26) return "26% - 50%";
  if (pct >= 11) return "11% - 25%";
  return "0% - 10%";
}

/* ── India Choropleth Mini Map (SVG-based state boxes) ── */
function IndiaStateGrid({ states, filter, onStateClick }) {
  const filtered = filter === "all" ? states
    : filter === "100" ? states.filter(s => s.saturation_pct >= 100)
    : filter === "aspirational" ? states.filter(s => s.saturation_pct < 50)
    : states.filter(s => s.saturation_pct < 75);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
      {filtered.map((s) => (
        <button
          key={s.state_name}
          onClick={() => onStateClick(s)}
          className="relative group rounded p-1.5 border border-transparent hover:border-[#0B5CAB] transition-all cursor-pointer text-center"
          style={{ backgroundColor: getSaturationColor(s.saturation_pct) }}
        >
          <div className="text-[8px] font-bold text-white truncate leading-tight" style={{
            textShadow: s.saturation_pct >= 50 ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
            color: s.saturation_pct < 26 ? "#0e1d2a" : "#fff"
          }}>
            {s.state_name.length > 12 ? s.state_name.substring(0, 10) + ".." : s.state_name}
          </div>
          <div className="text-[10px] font-mono font-bold" style={{
            color: s.saturation_pct < 26 ? "#0B5CAB" : "#fff",
          }}>
            {s.saturation_pct.toFixed(0)}%
          </div>
          {/* Tooltip on hover */}
          <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#002147] text-white px-2 py-1.5 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            <div className="font-bold">{s.state_name}</div>
            <div className="font-mono text-[9px] mt-0.5">
              HH: {s.total_households.toLocaleString("en-IN")} | Conn: {s.connections_provided.toLocaleString("en-IN")}
            </div>
            <div className="font-mono text-[9px]">
              {s.saturation_pct.toFixed(1)}% | {s.status}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}


export default function Overview({ setActiveTab }) {
  const { t } = useLanguage();
  const [chartMode, setChartMode] = useState("cumulative");
  const [stateFilter, setStateFilter] = useState("all");
  const [saturationStates, setSaturationStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  // Fetch state saturation data from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/governance/saturation-states`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d && d.states) setSaturationStates(d.states);
      })
      .catch(() => {
        // Fallback static data
        setSaturationStates([
          { state_name: "Gujarat", total_households: 10841806, connections_provided: 10841806, saturation_pct: 100.0, status: "CERTIFIED" },
          { state_name: "Haryana", total_households: 4282800, connections_provided: 4282800, saturation_pct: 100.0, status: "CERTIFIED" },
          { state_name: "Punjab", total_households: 3625642, connections_provided: 3625642, saturation_pct: 100.0, status: "CERTIFIED" },
          { state_name: "Telangana", total_households: 5568920, connections_provided: 5568920, saturation_pct: 100.0, status: "CERTIFIED" },
          { state_name: "Goa", total_households: 278550, connections_provided: 278550, saturation_pct: 100.0, status: "CERTIFIED" },
          { state_name: "Tamil Nadu", total_households: 7553712, connections_provided: 7117108, saturation_pct: 94.22, status: "REPORTED" },
          { state_name: "Maharashtra", total_households: 12228980, connections_provided: 11082510, saturation_pct: 90.62, status: "REPORTED" },
          { state_name: "Rajasthan", total_households: 12290000, connections_provided: 10876650, saturation_pct: 88.5, status: "REPORTED" },
          { state_name: "Uttar Pradesh", total_households: 26372760, connections_provided: 16927271, saturation_pct: 64.17, status: "REPORTED" },
          { state_name: "Bihar", total_households: 18097895, connections_provided: 11597432, saturation_pct: 64.08, status: "REPORTED" },
        ]);
      });
  }, []);

  const chartData = chartMode === "cumulative" ? RAW_DATA : computeIncrements(RAW_DATA);
  const dataKey = chartMode === "cumulative" ? "fhtc" : "increment";

  const leagueTable = saturationStates.slice(0, 10).map((s, i) => ({
    rank: i + 1,
    name: s.state_name,
    fhtc: s.connections_provided,
    coverage: s.saturation_pct,
    status: s.status,
    tier: s.saturation_pct >= 100 ? "Front Runner" : s.saturation_pct >= 90 ? "High Achiever" : s.saturation_pct >= 75 ? "Achiever" : s.saturation_pct >= 50 ? "Performer" : "Aspirant",
  }));

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#002147] tracking-tight">{t("overview.title")}</h1>
        <p className="text-[13px] text-[#44474e] mt-1">{t("app.subtitle")}</p>
      </div>

      {/* ── Top 3 KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("overview.total_rural_hh")}</div>
          <IndianNumber value={193545173} className="text-[32px] text-[#002147]" />
          <div className="text-[10px] text-[#74777f] mt-1">Census 2011 normalized baseline</div>
        </div>
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("overview.fhtc_baseline")}</div>
          <IndianNumber value={32362838} className="text-[32px] text-[#002147]" />
          <div className="text-[10px] text-[#74777f] mt-1">16.72% — Pre-Mission coverage</div>
        </div>
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#44474e] mb-2">{t("overview.current_saturation")}</div>
          <IndianNumber value={159546438} className="text-[32px] text-[#0B5CAB]" />
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] font-bold text-[#0B5CAB]">(82.43%)</span>
            <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-mono font-bold">+10,331 {t("common.today")}</span>
          </div>
        </div>
      </div>

      {/* ── Status Cards + HGJ ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#E8F8F0] rounded-lg border border-green-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[20px] text-green-700">verified</span>
            <span className="text-[12px] font-bold text-green-800 uppercase tracking-wide">{t("overview.har_ghar_jal_states")}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {HGJ_STATES.map((s) => (
              <span key={s} className="bg-white text-green-800 text-[10px] font-semibold px-2 py-1 rounded border border-green-200">{s}</span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon="location_city" value="196" label={t("overview.districts")} sublabel="/ 785 — Certified: 122" iconColor="#0B5CAB" />
          <StatCard icon="grid_view" value="1,965" label={t("overview.blocks")} sublabel="/ 7,180 — Certified: 1,123" iconColor="#C82333" />
          <StatCard icon="holiday_village" value="1,34,928" label={t("overview.panchayats")} sublabel="Certified: 1,21,428" iconColor="#0B5CAB" />
          <StatCard icon="forest" value="2,93,855" label={t("overview.villages")} sublabel="/ 5,23,800" iconColor="#1A7F48" />
        </div>
      </div>

      {/* ════ INTERACTIVE INDIA CHOROPLETH MAP ════ */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-[16px] font-bold text-[#002147] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">map</span>
            JJM India Saturation Choropleth
          </h2>
          <div className="flex bg-[#E8EEFA] rounded-lg overflow-hidden">
            {[
              { key: "all", label: "All States" },
              { key: "100", label: "100% Saturated" },
              { key: "aspirational", label: "Aspirational" },
              { key: "focus", label: "Focus" },
            ].map((f) => (
              <button key={f.key} onClick={() => setStateFilter(f.key)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  stateFilter === f.key ? "bg-[#0B5CAB] text-white" : "text-[#44474e] hover:bg-[#D6E3FF]"
                }`}>{f.label}</button>
            ))}
          </div>
        </div>

        <IndiaStateGrid
          states={saturationStates}
          filter={stateFilter}
          onStateClick={setSelectedState}
        />

        {/* Color Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-[#DCE3EC]">
          <span className="text-[10px] font-bold text-[#44474e] uppercase tracking-wider">Legend:</span>
          {[
            { label: "0-10%", color: "#F7D9CE" },
            { label: "11-25%", color: "#F3B39E" },
            { label: "26-50%", color: "#BCD9EA" },
            { label: "51-75%", color: "#6BAED6" },
            { label: "76-99%", color: "#2171B5" },
            { label: "100%", color: "#08306B" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: l.color }} />
              <span className="text-[9px] font-mono text-[#44474e]">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Gharat Pin */}
        <div className="mt-3 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <button
            onClick={() => { if (setActiveTab) setActiveTab("scada"); }}
            className="text-[11px] font-semibold text-[#C82333] hover:underline cursor-pointer"
          >
            Gharat Habitation (SCADA Live Node) — Maharashtra
            <span className="text-[9px] text-[#74777f] ml-1">{t("overview.view_scada")} {"\u2192"}</span>
          </button>
        </div>

        {/* Selected State Detail */}
        {selectedState && (
          <div className="mt-3 bg-[#F7F9FF] rounded-lg border border-[#DCE3EC] p-3 flex items-center justify-between">
            <div>
              <div className="text-[14px] font-bold text-[#002147]">{selectedState.state_name}</div>
              <div className="text-[11px] text-[#44474e] mt-0.5">
                Rural HH: <span className="font-mono font-bold">{selectedState.total_households.toLocaleString("en-IN")}</span>
                {" | "}Connections: <span className="font-mono font-bold">{selectedState.connections_provided.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[22px] font-bold text-[#0B5CAB]">{selectedState.saturation_pct.toFixed(1)}%</div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                selectedState.status === "CERTIFIED" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}>{selectedState.status}</span>
            </div>
          </div>
        )}
      </div>

      {/* ════ JJM GAPS AUDIT CARD ════ */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[20px] text-[#B3802A]">compare_arrows</span>
          <h2 className="text-[16px] font-bold text-[#002147]">{t("overview.jjm_gaps_title")}</h2>
          <span className="bg-[#FDEAEB] text-[#C82333] px-2 py-0.5 rounded text-[9px] font-bold uppercase">Operational Audit</span>
        </div>
        <div className="space-y-4">
          <GapItem index={1} icon="satellite_alt" iconColor="#C82333"
            legacy="Outdated Census 2011 denominators claim 100% saturation"
            jalsetu="JalSetu uses GIS drone mapping + citizen crowdsourcing, exposing 70 unmapped fringe households and dry ghost taps"
          />
          <GapItem index={2} icon="auto_fix_high" iconColor="#0B5CAB"
            legacy="Reactive: Wait for villagers to complain about breakdowns"
            jalsetu="Isolation Forest anomaly detection on pump vibration, current, and pressure detects cavitation and micro-leaks before line bursts"
          />
          <GapItem index={3} icon="flood" iconColor="#F59E0B"
            legacy="Climate and flood data siloed — river levels ignored"
            jalsetu="Real-time CWC river gauge + DEM elevation integration predicts inundation 48 hours early, auto-trips intake pumps at turbidity &gt;50 NTU"
          />
          <GapItem index={4} icon="route" iconColor="#1A7F48"
            legacy="Zero disaster logistics or emergency navigation"
            jalsetu="A* / Dijkstra algorithms on road elevation models plot flood-safe routes for relief tankers and maintenance crews"
          />
          <GapItem index={5} icon="lock" iconColor="#B3802A"
            legacy="Paper certifications — contractor disbursements on manual signatures"
            jalsetu="Smart escrow automatically freezes PFMS milestone funds when IoT telemetry confirms continuous pressure or quality breaches"
          />
        </div>
      </div>

      {/* ════ DYNAMIC AREA CHART WITH TOGGLE ════ */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#002147] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#0B5CAB]">show_chart</span>
            Cumulative FHTC Trajectory (2019–2026)
          </h2>
          <div className="flex bg-[#E8EEFA] rounded-lg overflow-hidden">
            <button onClick={() => setChartMode("cumulative")}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                chartMode === "cumulative" ? "bg-[#0B5CAB] text-white" : "text-[#44474e] hover:bg-[#D6E3FF]"
              }`}>Cumulative</button>
            <button onClick={() => setChartMode("increments")}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                chartMode === "increments" ? "bg-[#0B5CAB] text-white" : "text-[#44474e] hover:bg-[#D6E3FF]"
              }`}>Yearly Increments</button>
          </div>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="fhtcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B5CAB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EEFA" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#44474e" }} />
              <YAxis tick={{ fontSize: 10, fill: "#44474e" }}
                tickFormatter={(v) => `${(v / 10000000).toFixed(1)} Cr`} />
              <Tooltip
                formatter={(v) => [`${(v / 10000000).toFixed(2)} Cr (${v.toLocaleString("en-IN")})`, chartMode === "cumulative" ? "FHTC" : "Increment"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #DCE3EC", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey={dataKey} stroke="#0B5CAB" fill="url(#fhtcGrad)" strokeWidth={2.5}
                dot={{ r: 5, fill: "#0B5CAB", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7 }}
                name={chartMode === "cumulative" ? "Cumulative FHTC" : "Yearly Addition"} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── League Table ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[16px] font-bold text-[#002147] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#B3802A]">emoji_events</span>
          State Saturation League (DB-Backed)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#002147] text-white text-[11px] uppercase tracking-wider">
                <th className="px-3 py-2.5 rounded-tl-lg">Rank</th>
                <th className="px-3 py-2.5">State / UT</th>
                <th className="px-3 py-2.5">FHTC HHs</th>
                <th className="px-3 py-2.5">Tier</th>
                <th className="px-3 py-2.5 rounded-tr-lg">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {leagueTable.map((row, i) => (
                <tr key={row.rank} className={`border-b border-[#DCE3EC] text-[12px] ${i % 2 ? "bg-[#F7F9FF]" : "bg-white"} hover:bg-[#EBF3FC] transition-colors`}>
                  <td className="px-3 py-2.5 font-bold text-[#0B5CAB]">{row.rank}</td>
                  <td className="px-3 py-2.5 font-semibold">{row.name}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">{row.fhtc.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${TIER_COLORS[row.tier]}`}>{row.tier}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#E8EEFA] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#0B5CAB]" style={{ width: `${row.coverage}%`, transition: "width 0.5s" }} />
                      </div>
                      <span className="font-mono font-bold text-[11px]">{row.coverage}%</span>
                    </div>
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
