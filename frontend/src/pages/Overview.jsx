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
            Geospatial Catchment Analytics (NDVI/NDWI) & Geo-Coded Image Verification for Watershed Development
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


      {/* GEOSPATIAL WATERSHED & GEO-CODED IMAGE INTELLIGENCE PANEL */}
      <div className="w-full bg-white border border-[#DCE3EC] rounded-xl p-6 my-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-5 border-b border-gray-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#002147] text-2xl">satellite_alt</span>
              <h3 className="text-base font-bold text-[#002147]">Catchment Hydrological Health & Geo-Coded Field Image Audit</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                SENTINEL-2 / DEM LINKED
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Multi-spectral raster analysis correlated with ground-truth geotagged mobile surveys for PMKSY-WDC interventions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Micro-Watershed Basin: <span className="text-[#002147] font-bold ml-1">MW-MH-43B</span>
          </div>
        </div>

        {/* 3 Remote Sensing KPI Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
            <div className="text-[11px] font-bold text-emerald-800 tracking-wider">NDVI VEGETATION GAIN (BIOMASS)</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">+0.28 ΔNDVI</div>
            <div className="text-xs text-gray-500 mt-1">Post-monsoon canopy recovery around treated contour bunds</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200 shadow-2xs">
            <div className="text-[11px] font-bold text-blue-800 tracking-wider">NDWI SURFACE WATER RETENTION</div>
            <div className="text-2xl font-black text-blue-700 mt-1">+41.2% SPREAD</div>
            <div className="text-xs text-gray-500 mt-1">Storage increase behind newly excavated percolation tanks</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-200 shadow-2xs">
            <div className="text-[11px] font-bold text-indigo-800 tracking-wider">RUNOFF REDUCTION VELOCITY</div>
            <div className="text-2xl font-black text-indigo-700 mt-1">-34.6% PEAK</div>
            <div className="text-xs text-gray-500 mt-1">Soil erosion mitigation calculated via SRTM DEM drainage model</div>
          </div>
        </div>

        {/* Geo-Coded Field Image Audit Feed */}
        <div>
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Recent Geo-Coded Ground Image Verifications (Bhuvan/Field Mobile Uploads)</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified</span> 100% EXIF Boundaries Verified
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1 */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-all shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#002147]">Masonry Check Dam #14</span>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">AUTHENTIC</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">GPS: 19.8762° N, 75.3421° E</div>
              <div className="text-xs text-gray-500 mt-0.5">Azimuth: 142° SE • Elev: 542m</div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs">
                <span className="text-gray-600">CV Storage Status:</span>
                <span className="font-bold text-blue-600">88% Water Stored</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-600">Siltation Risk:</span>
                <span className="font-bold text-emerald-600">Low (8% Silt)</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-all shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#002147]">Percolation Tank #03</span>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">AUTHENTIC</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">GPS: 19.8640° N, 75.3312° E</div>
              <div className="text-xs text-gray-500 mt-0.5">Azimuth: 88° E • Elev: 538m</div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs">
                <span className="text-gray-600">CV Storage Status:</span>
                <span className="font-bold text-blue-600">Active Infiltration</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-600">Embankment Health:</span>
                <span className="font-bold text-emerald-600">Intact (No Breaches)</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40 hover:bg-white transition-all shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#002147]">Contour Bund Section B</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">AUDIT ALERT</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">GPS: 19.8519° N, 75.3508° E</div>
              <div className="text-xs text-gray-500 mt-0.5">Azimuth: 210° SW • Elev: 555m</div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs">
                <span className="text-gray-600">CV Storage Status:</span>
                <span className="font-bold text-amber-600">Desilting Needed</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-600">Contractor Milestone:</span>
                <span className="font-bold text-red-600">Payment On Hold</span>
              </div>
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
