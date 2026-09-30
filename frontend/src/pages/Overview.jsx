import React, { useState } from "react";
import { NATIONAL_KPI, STATE_KPIS } from "../data/kpiData";
import IndiaMapCard from "../components/IndiaMapCard";

export default function Overview() {
  const [selectedStateName, setSelectedStateName] = useState(null);

  // Active KPI data (State-specific or National Baseline)
  const currentKPI = selectedStateName && STATE_KPIS[selectedStateName]
    ? STATE_KPIS[selectedStateName]
    : {
        ...NATIONAL_KPI,
        name: selectedStateName || NATIONAL_KPI.name,
        totalHH: selectedStateName ? `${selectedStateName} Telemetry Syncing...` : NATIONAL_KPI.totalHH
      };

  return (
    <div className="space-y-4 p-4 max-w-[1600px] mx-auto">
      {/* ================= PAGE TITLE & STATE FILTER BADGE ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <h1 className="text-[22px] font-black text-[#002147] tracking-tight">
            {selectedStateName ? `${selectedStateName} Household Tap Water Status` : "National Household Tap Water Status"}
          </h1>
          <p className="text-[12px] text-slate-500 font-medium">
            AI-Powered Predictive Infrastructure Failure Prevention & Flood Resilience
          </p>
        </div>

        {selectedStateName && (
          <button
            onClick={() => setSelectedStateName(null)}
            className="flex items-center gap-1.5 bg-[#EBF3FC] text-[#0B5CAB] hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <span>Active Filter: <b>{selectedStateName}</b></span>
            <span className="text-[14px]">✕</span>
            <span className="text-[10px] text-slate-500 font-normal ml-1">(Reset to National)</span>
          </button>
        )}
      </div>

      {/* ================= ROW 1: 3 BIG KPI CARDS (DYNAMICALLY CONNECTED) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: TOTAL RURAL HOUSEHOLDS */}
        <div className="bg-[#E2E8F0] rounded-xl border border-[#CBD5E1] p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            TOTAL RURAL HOUSEHOLDS
          </span>
          <div className="text-[28px] font-black text-[#002147] mt-1.5 tracking-tight font-mono">
            {currentKPI.totalHH}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {selectedStateName
              ? `JJM Verified Rural Baseline in ${selectedStateName}`
              : "Census 2011 normalized baseline across 28 States & 8 UTs"}
          </p>
        </div>

        {/* Card 2: FHTC AS ON 15 AUG 2019 */}
        <div className="bg-[#E2E8F0] rounded-xl border border-[#CBD5E1] p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            FHTC AS ON 15 AUG 2019
          </span>
          <div className="text-[28px] font-black text-[#002147] mt-1.5 tracking-tight font-mono">
            {currentKPI.baseline2019 || "3,23,62,838"}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {currentKPI.baselinePct || "16.72%"} — Pre-Mission August 2019 coverage
          </p>
        </div>

        {/* Card 3: CURRENT SATURATION (FHTC) */}
        <div className="bg-[#E2E8F0] rounded-xl border border-[#CBD5E1] p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            CURRENT SATURATION (FHTC)
          </span>
          <div className="text-[28px] font-black text-[#0B5CAB] mt-1.5 tracking-tight font-mono">
            {currentKPI.currentFHTC}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[12px] font-extrabold text-[#0B5CAB]">
              ({currentKPI.saturationPct || "82.43"}%)
            </span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              {currentKPI.todayAdded || "+10,331 Today"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= ROW 2: 4 SECONDARY METRIC CARDS (DYNAMICALLY CONNECTED) ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Districts Saturated */}
        <div className="bg-[#E2E8F0] rounded-xl border border-[#CBD5E1] p-3 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white text-[#0B5CAB] shadow-xs border border-slate-200 flex items-center justify-center text-xl shrink-0">
            🏢
          </div>
          <div>
            <div className="text-[18px] font-black text-[#002147] font-mono leading-tight">
              {currentKPI.districts?.saturated ?? 196}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold">Districts Saturated</div>
            <div className="text-[10px] text-slate-400">
              / {currentKPI.districts?.total ?? 754} — Certified: {currentKPI.districts?.certified ?? 122}
            </div>
          </div>
        </div>

        {/* 2. Blocks Saturated */}
        <div className="bg-[#E2E8F0] rounded-xl border border-[#CBD5E1] p-3 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white text-rose-600 shadow-xs border border-slate-200 flex items-center justify-center text-xl shrink-0">
            ▦
          </div>
          <div>
            <div className="text-[18px] font-black text-[#002147] font-mono leading-tight">
              {currentKPI.blocks?.saturated ?? "1,965"}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold">Blocks Saturated</div>
            <div className="text-[10px] text-slate-400">
              / {currentKPI.blocks?.total ?? "7,180"} — Certified: {currentKPI.blocks?.certified ?? "1,123"}
            </div>
          </div>
        </div>

        {/* 3. Gram Panchayats */}
        <div className="bg-[#E2E8F0] rounded-xl border border-[#CBD5E1] p-3 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white text-[#0B5CAB] shadow-xs border border-slate-200 flex items-center justify-center text-xl shrink-0">
            🏛
          </div>
          <div>
            <div className="text-[18px] font-black text-[#002147] font-mono leading-tight">
              {currentKPI.gps?.saturated ?? "1,34,928"}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold">Gram Panchayats</div>
            <div className="text-[10px] text-slate-400">
              Certified: {currentKPI.gps?.certified ?? "1,21,428"}
            </div>
          </div>
        </div>

        {/* 4. Villages Saturated */}
        <div className="bg-[#E2E8F0] rounded-xl border border-[#CBD5E1] p-3 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-white text-emerald-700 shadow-xs border border-slate-200 flex items-center justify-center text-xl shrink-0">
            🌲
          </div>
          <div>
            <div className="text-[18px] font-black text-[#002147] font-mono leading-tight">
              {currentKPI.villages?.saturated ?? "2,93,855"}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold">Villages Saturated</div>
            <div className="text-[10px] text-slate-400">
              / {currentKPI.villages?.total ?? "5,23,800"} Saturated
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATE VECTOR GRID + DISTRICT CARDS ================= */}
      <div className="mt-4">
        <IndiaMapCard onSelectState={(st) => setSelectedStateName(st?.name || st)} />
      </div>
    </div>
  );
}
