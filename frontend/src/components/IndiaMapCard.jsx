import React, { useState, useMemo } from "react";
import {
  SATURATION_TIERS,
  STATES_MASTER,
  DISTRICTS_BY_STATE,
  getTierColor
} from "../data/indiaFullDistrictData";

export default function IndiaMapCard({ onSelectState }) {
  const [selectedState, setSelectedState] = useState(
    STATES_MASTER.find((s) => s.name === "Maharashtra") || STATES_MASTER[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [viewStyle, setViewStyle] = useState("cards"); // "cards" or "tiles"

  const districts = useMemo(() => {
    let list = DISTRICTS_BY_STATE[selectedState.name] || [];
    if (list.length === 0) {
      list = [
        { name: `${selectedState.name} Central Hub`, totalHH: selectedState.totalHH, conn: selectedState.conn, pct: selectedState.pct, trust: `${selectedState.trust}/100`, status: selectedState.status },
        { name: `${selectedState.name} North Zone`, totalHH: "1,15,000", conn: "98,000", pct: selectedState.pct, trust: `${selectedState.trust}/100`, status: "Operational" },
        { name: `${selectedState.name} South Zone`, totalHH: "1,40,000", conn: "1,18,000", pct: selectedState.pct, trust: `${selectedState.trust}/100`, status: "Operational" },
        { name: `${selectedState.name} East Sector`, totalHH: "95,000", conn: "76,000", pct: selectedState.pct, trust: `${selectedState.trust}/100`, status: "In Progress" }
      ];
    }

    if (tierFilter === "100") list = list.filter((d) => d.pct >= 100);
    else if (tierFilter === "76-99") list = list.filter((d) => d.pct >= 76 && d.pct < 100);
    else if (tierFilter === "51-75") list = list.filter((d) => d.pct >= 51 && d.pct <= 75);
    else if (tierFilter === "<50") list = list.filter((d) => d.pct < 50);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    return list;
  }, [selectedState, tierFilter, searchQuery]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-stretch">
      {/* ================= LEFT MAIN FRAME: 33 States Vector Grid ================= */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[13px] font-bold text-[#002147]">
              Interactive State Choropleth Vector Grid
            </span>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="text-[#0B5CAB]">★ Har Ghar Jal Certified (11)</span>
              <span className="text-amber-500">⭐ Reported (1)</span>
            </div>
          </div>

          {/* 33-State Interactive Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 my-3">
            {STATES_MASTER.map((st) => {
              const isSelected = selectedState.name === st.name;
              const color = getTierColor(st.pct);
              const isDark = st.pct >= 76;

              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedState(st); if (typeof onSelectState === "function") onSelectState(st);
                    setSearchQuery("");
                  }}
                  className={`p-2 rounded-lg text-left transition-all cursor-pointer flex flex-col justify-between min-h-[58px] ${
                    isSelected
                      ? "ring-3 ring-amber-500 border-2 border-amber-500 scale-[1.04] shadow-md z-10"
                      : "hover:opacity-90 border border-black/10"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  <div className={`flex items-center justify-between text-[11px] font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                    <span className="truncate pr-1">{st.name}</span>
                    {st.star && (
                      <span className="text-[12px]">{st.star === "white" ? "★" : "⭐"}</span>
                    )}
                  </div>
                  <div className={`text-right text-[12px] font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {Math.round(st.pct)}%
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2">
            <span className="text-[#0B5CAB] font-bold text-sm">ℹ</span>
            <span>Click any state button above to load its live district telemetry cards.</span>
          </div>
        </div>

        {/* Bottom Saturation Legend */}
        <div className="pt-3 border-t border-slate-100 mt-3">
          <div className="flex w-full rounded-md overflow-hidden h-3 shadow-inner border border-slate-200">
            {SATURATION_TIERS.map((tier, idx) => (
              <div key={idx} style={{ backgroundColor: tier.color }} className="flex-1" title={tier.label} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-600 mt-1">
            {SATURATION_TIERS.map((tier, idx) => (
              <span key={idx} className="text-center flex-1">{tier.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT FRAME: HIGH-VISIBILITY DISTRICT CARDS ================= */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
        <div>
          {/* Active State Header Banner */}
          <div className="bg-gradient-to-r from-slate-50 to-[#F0F7FF] border border-slate-200 rounded-xl p-3.5 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Active Selected State
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-[20px] font-black text-[#002147]">{selectedState.name}</h3>
                  {selectedState.star && (
                    <span className="text-amber-500 font-bold text-xs">
                      {selectedState.star === "white" ? "★ 100% Certified" : "⭐ Reported 100%"}
                    </span>
                  )}
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#EBF3FC] text-[#0B5CAB] border border-blue-200">
                    {selectedState.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[26px] font-black text-[#0B5CAB] leading-none">{selectedState.pct}%</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">Trust Score: {selectedState.trust}/100</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-200">
              <span>Rural Households: <b className="text-slate-900">{selectedState.totalHH}</b></span>
              <span>Tap Connections (FHTC): <b className="text-slate-900">{selectedState.conn}</b></span>
              {selectedState.name === "Maharashtra" && (
                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                  Gharat SCADA Twin Linked
                </span>
              )}
            </div>
          </div>

          {/* Search, Filter Pills & View Mode */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex-1 min-w-[160px]">
              <input
                type="text"
                placeholder={`Search district in ${selectedState.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0B5CAB] bg-white shadow-inner"
              />
            </div>

            <div className="flex items-center gap-1">
              {["ALL", "100", "76-99", "51-75", "<50"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    tierFilter === tier
                      ? "bg-[#002147] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {tier === "ALL" ? "All" : tier === "100" ? "100%" : `${tier}%`}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-[10px] font-bold">
              <button
                onClick={() => setViewStyle("cards")}
                className={`px-2 py-1 rounded cursor-pointer ${viewStyle === "cards" ? "bg-white text-[#0B5CAB] shadow-xs" : "text-slate-500"}`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewStyle("tiles")}
                className={`px-2 py-1 rounded cursor-pointer ${viewStyle === "tiles" ? "bg-white text-[#0B5CAB] shadow-xs" : "text-slate-500"}`}
              >
                Tiles
              </button>
            </div>
          </div>

          {/* ================= VISIBLE DISTRICT CARDS CONTAINER ================= */}
          {viewStyle === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto p-1">
              {districts.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-400 text-xs">
                  No districts match the filter criteria.
                </div>
              ) : (
                districts.map((dist, idx) => {
                  const tierColor = getTierColor(dist.pct);
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border-2 border-slate-200 hover:border-[#0B5CAB] p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
                    >
                      {/* Top Saturation Accent Strip */}
                      <div
                        className="h-1.5 w-full absolute top-0 left-0"
                        style={{ backgroundColor: tierColor }}
                      />

                      <div>
                        {/* District Title & Saturation Badge */}
                        <div className="flex items-start justify-between gap-2 mt-1">
                          <div>
                            <h4 className="font-extrabold text-[13px] text-[#002147] tracking-tight group-hover:text-[#0B5CAB] transition-colors">
                              {dist.name}
                            </h4>
                            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {dist.status || "Operational"}
                            </span>
                          </div>

                          <div
                            className="px-2.5 py-1 rounded-md text-[13px] font-black font-mono text-white shadow-xs shrink-0"
                            style={{ backgroundColor: tierColor }}
                          >
                            {dist.pct}%
                          </div>
                        </div>

                        {/* Telemetry Metrics Chips */}
                        <div className="grid grid-cols-2 gap-2 my-2.5">
                          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2">
                            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Rural HHs</span>
                            <span className="text-[12px] font-bold text-slate-900 font-mono">{dist.totalHH}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2">
                            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Connections</span>
                            <span className="text-[12px] font-bold text-slate-900 font-mono">{dist.conn}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer & Progress Meter */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-500 font-medium">JalSetu Trust Score:</span>
                          <span className="font-bold text-emerald-700 font-mono">{dist.trust}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${dist.pct}%`, backgroundColor: tierColor }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Matrix Tile View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[460px] overflow-y-auto p-1">
              {districts.map((dist, idx) => {
                const tierColor = getTierColor(dist.pct);
                const isDark = dist.pct >= 76;
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-black/10 flex flex-col justify-between min-h-[64px] shadow-xs cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: tierColor }}
                  >
                    <span className={`text-[11px] font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                      {dist.name}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] ${isDark ? "text-white/80" : "text-slate-700"}`}>{dist.trust}</span>
                      <span className={`text-[12px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                        {dist.pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-2 text-right border-t border-slate-100 mt-2">
          <span className="text-[11px] text-slate-500 font-medium">
            Displaying <b>{districts.length}</b> verified district cards in {selectedState.name}
          </span>
        </div>
      </div>
    </div>
  );
}
