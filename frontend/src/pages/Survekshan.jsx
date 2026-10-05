import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";

const TIER_DIST = [
  { tier: "Front Runners", count: 82, pct: 10.9, bgColor: "bg-green-50", stars: 5, desc: "100% Saturation + Certified" },
  { tier: "High Achievers", count: 248, pct: 32.9, bgColor: "bg-blue-50", stars: 4, desc: "75-100% FHTC + Active" },
  { tier: "Achievers", count: 215, pct: 28.5, bgColor: "bg-yellow-50", stars: 3, desc: "50-75% + VAP" },
  { tier: "Performers", count: 142, pct: 18.8, bgColor: "bg-orange-50", stars: 2, desc: "25-50% Coverage" },
  { tier: "Aspirants", count: 67, pct: 8.9, bgColor: "bg-red-50", stars: 1, desc: "Below 25%" },
];

const TIER_BADGE = {
  "Front Runner": "bg-green-100 text-green-800",
  "High Achiever": "bg-blue-100 text-blue-800",
  "Achiever": "bg-yellow-100 text-yellow-800",
  "Performer": "bg-orange-100 text-orange-800",
  "Aspirant": "bg-red-100 text-red-800",
};

const TIER_BAR_COLOR = {
  "Front Runner": "#10B981",
  "High Achiever": "#3B82F6",
  "Achiever": "#F59E0B",
  "Performer": "#F97316",
  "Aspirant": "#EF4444",
};

// Monthly data — districts with scores for each month
const MONTHLY_SCORES = {
  "Mar 2024": [
    { district: "Porbandar [GJ]", score: 98.49, tier: "Front Runner" },
    { district: "Vadodara [GJ]", score: 97.99, tier: "Front Runner" },
    { district: "Ambala [HR]", score: 96.89, tier: "Front Runner" },
    { district: "The Nilgiris [TN]", score: 94.29, tier: "High Achiever" },
    { district: "Jalgaon [MH]", score: 92.89, tier: "High Achiever" },
    { district: "Hathras [UP]", score: 74.38, tier: "Achiever" },
    { district: "Udalguri [AS]", score: 71.60, tier: "Achiever" },
    { district: "Dharmapuri [TN]", score: 56.89, tier: "Performer" },
  ],
  "Feb 2024": [
    { district: "Porbandar [GJ]", score: 96.09, tier: "Front Runner" },
    { district: "Ambala [HR]", score: 93.79, tier: "Front Runner" },
    { district: "Vadodara [GJ]", score: 96.19, tier: "Front Runner" },
    { district: "The Nilgiris [TN]", score: 88.09, tier: "High Achiever" },
    { district: "Jalgaon [MH]", score: 88.39, tier: "High Achiever" },
    { district: "Hathras [UP]", score: 70.58, tier: "Achiever" },
    { district: "Udalguri [AS]", score: 65.80, tier: "Achiever" },
    { district: "Dharmapuri [TN]", score: 54.89, tier: "Performer" },
  ],
  "Jan 2024": [
    { district: "Vadodara [GJ]", score: 94.50, tier: "Front Runner" },
    { district: "Porbandar [GJ]", score: 93.80, tier: "Front Runner" },
    { district: "Ambala [HR]", score: 91.20, tier: "Front Runner" },
    { district: "Jalgaon [MH]", score: 86.40, tier: "High Achiever" },
    { district: "The Nilgiris [TN]", score: 85.10, tier: "High Achiever" },
    { district: "Hathras [UP]", score: 68.30, tier: "Achiever" },
    { district: "Udalguri [AS]", score: 62.10, tier: "Achiever" },
    { district: "Dharmapuri [TN]", score: 52.40, tier: "Performer" },
  ],
};

const MONTHS = Object.keys(MONTHLY_SCORES);

export default function Survekshan() {
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  // Dynamic: sort by score descending, recalculate on month change
  const barData = [...MONTHLY_SCORES[selectedMonth]].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#002147] tracking-tight">Jal Jeevan Survekshan Assessment</h1>
        <p className="text-[13px] text-[#44474e] mt-1">Performance Evaluation across 754 Districts</p>
      </div>

      {/* ── Tier Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {TIER_DIST.map((tier) => (
          <div key={tier.tier} className={`${tier.bgColor} rounded-lg border border-[#DCE3EC] p-4`}>
            <div className="flex items-center gap-0.5 mb-1">
              {Array.from({ length: tier.stars }).map((_, i) => (
                <span key={i} className="text-[#B3802A] text-[12px]">{"\u2605"}</span>
              ))}
            </div>
            <div className="font-mono text-[26px] font-bold text-[#0e1d2a]">{tier.count}</div>
            <div className="text-[11px] font-bold text-[#0e1d2a]">Districts</div>
            <div className="text-[10px] text-[#44474e]">{tier.pct}% of Nation</div>
            <div className="text-[9px] text-[#74777f] mt-1">{tier.desc}</div>
          </div>
        ))}
      </div>

      {/* ════ DYNAMIC HORIZONTAL BAR CHART ════ */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#002147] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#B3802A]">emoji_events</span>
            District Leaderboard — Top 8
          </h2>
          <div className="flex bg-[#E8EEFA] rounded-lg overflow-hidden">
            {MONTHS.map((m) => (
              <button key={m} onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  selectedMonth === m ? "bg-[#0B5CAB] text-white" : "text-[#44474e] hover:bg-[#D6E3FF]"
                }`}>{m}</button>
            ))}
          </div>
        </div>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer className="notranslate" translate="no">
            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EEFA" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#44474e" }}
                label={{ value: "Composite Score", position: "insideBottom", offset: -2, style: { fontSize: 10, fill: "#44474e" } }} />
              <YAxis type="category" dataKey="district" tick={{ fontSize: 11, fill: "#0e1d2a" }} width={120} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #DCE3EC", fontSize: 11 }}
                formatter={(v) => [`${v.toFixed(2)}`, "Score"]} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={22}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={TIER_BAR_COLOR[entry.tier] || "#0B5CAB"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Scoring Methodology ── */}
      <div className="bg-white rounded-lg border border-[#DCE3EC] p-5">
        <h2 className="text-[14px] font-bold text-[#002147] mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#0B5CAB]">school</span>
          JJS 2024 Scoring Weightage
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "FHTC Saturation", weight: "40%", icon: "water_drop" },
            { label: "Water Quality", weight: "25%", icon: "science" },
            { label: "Service Delivery", weight: "20%", icon: "local_shipping" },
            { label: "VWSC Certification", weight: "15%", icon: "verified" },
          ].map((m) => (
            <div key={m.label} className="text-center p-3 bg-[#F7F9FF] rounded-lg border border-[#DCE3EC]">
              <span className="material-symbols-outlined text-[28px] text-[#0B5CAB] mb-1">{m.icon}</span>
              <div className="font-mono text-[20px] font-bold text-[#002147]">{m.weight}</div>
              <div className="text-[10px] text-[#44474e] font-semibold mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
