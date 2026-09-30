import React, { useState } from "react";

// Official 6-tier saturation color palette
const TIER_COLORS = {
    tier1: "#F7D9CE", // 0% - 10%
    tier2: "#F3B39E", // 11% - 25%
    tier3: "#BCD9EA", // 26% - 50%
    tier4: "#6BAED6", // 51% - 75%
    tier5: "#2171B5", // 76% - <100%
    tier6: "#08306B", // 100% Saturation
};

// State-level saturation data & map vectors
const STATE_DATA = [
    { id: "JK", name: "Jammu & Kashmir", saturation: 79.4, hhs: "18.6 L", conn: "14.8 L", tier: TIER_COLORS.tier5, star: null, d: "M 220 50 L 260 55 L 290 85 L 285 130 L 235 140 L 210 110 Z" },
    { id: "HP", name: "Himachal Pradesh", saturation: 100.0, hhs: "17.1 L", conn: "17.1 L", tier: TIER_COLORS.tier6, star: "white", starPos: [260, 160], d: "M 240 140 L 275 145 L 285 175 L 255 185 L 235 160 Z" },
    { id: "PB", name: "Punjab", saturation: 100.0, hhs: "34.2 L", conn: "34.2 L", tier: TIER_COLORS.tier6, star: "gold", starPos: [230, 195], d: "M 215 165 L 245 165 L 245 205 L 215 200 Z" },
    { id: "UT", name: "Uttarakhand", saturation: 92.6, hhs: "15.0 L", conn: "13.9 L", tier: TIER_COLORS.tier5, star: null, d: "M 280 165 L 320 185 L 310 220 L 275 195 Z" },
    { id: "HR", name: "Haryana", saturation: 100.0, hhs: "30.4 L", conn: "30.4 L", tier: TIER_COLORS.tier6, star: "gold", starPos: [248, 225], d: "M 235 205 L 265 205 L 260 245 L 230 235 Z" },
    { id: "RJ", name: "Rajasthan", saturation: 54.3, hhs: "107.3 L", conn: "58.3 L", tier: TIER_COLORS.tier4, star: null, d: "M 155 210 L 230 220 L 245 295 L 180 340 L 140 270 Z" },
    { id: "UP", name: "Uttar Pradesh", saturation: 84.7, hhs: "266.2 L", conn: "225.5 L", tier: TIER_COLORS.tier5, star: null, d: "M 265 215 L 360 230 L 400 300 L 320 340 L 265 290 Z" },
    { id: "BR", name: "Bihar", saturation: 96.4, hhs: "166.3 L", conn: "160.3 L", tier: TIER_COLORS.tier5, star: null, d: "M 405 285 L 475 290 L 465 345 L 395 340 Z" },
    { id: "GJ", name: "Gujarat", saturation: 100.0, hhs: "91.2 L", conn: "91.2 L", tier: TIER_COLORS.tier6, star: "white", starPos: [175, 385], d: "M 130 330 L 195 345 L 210 425 L 155 435 L 120 375 Z" },
    { id: "MP", name: "Madhya Pradesh", saturation: 68.2, hhs: "112.5 L", conn: "76.7 L", tier: TIER_COLORS.tier4, star: null, d: "M 215 340 L 335 340 L 350 420 L 240 435 L 205 385 Z" },
    { id: "JH", name: "Jharkhand", saturation: 52.8, hhs: "61.4 L", conn: "32.4 L", tier: TIER_COLORS.tier4, star: null, d: "M 395 345 L 455 350 L 440 415 L 385 400 Z" },
    { id: "WB", name: "West Bengal", saturation: 48.9, hhs: "173.2 L", conn: "84.7 L", tier: TIER_COLORS.tier3, star: null, d: "M 455 330 L 480 325 L 470 435 L 440 425 Z" },
    { id: "CH", name: "Chhattisgarh", saturation: 62.1, hhs: "50.2 L", conn: "31.2 L", tier: TIER_COLORS.tier4, star: null, d: "M 335 375 L 385 385 L 360 480 L 325 465 Z" },
    { id: "OD", name: "Odisha", saturation: 71.5, hhs: "88.6 L", conn: "63.3 L", tier: TIER_COLORS.tier4, star: null, d: "M 375 410 L 445 425 L 420 500 L 365 475 Z" },
    { id: "MH", name: "Maharashtra (Gharat Hub)", saturation: 86.8, hhs: "146.5 L", conn: "127.2 L", tier: TIER_COLORS.tier5, star: "gold", starPos: [210, 480], d: "M 185 435 L 285 435 L 315 520 L 225 565 L 180 485 Z" },
    { id: "TG", name: "Telangana", saturation: 100.0, hhs: "54.1 L", conn: "54.1 L", tier: TIER_COLORS.tier6, star: "white", starPos: [280, 525], d: "M 270 495 L 330 495 L 325 565 L 265 550 Z" },
    { id: "AP", name: "Andhra Pradesh", saturation: 74.2, hhs: "95.4 L", conn: "70.8 L", tier: TIER_COLORS.tier4, star: null, d: "M 315 540 L 360 520 L 330 650 L 280 610 Z" },
    { id: "KA", name: "Karnataka", saturation: 79.1, hhs: "101.2 L", conn: "80.0 L", tier: TIER_COLORS.tier5, star: null, d: "M 220 560 L 275 565 L 270 680 L 210 635 Z" },
    { id: "GA", name: "Goa", saturation: 100.0, hhs: "2.3 L", conn: "2.3 L", tier: TIER_COLORS.tier6, star: "gold", starPos: [205, 595], d: "M 205 585 L 220 588 L 215 605 L 202 600 Z" },
    { id: "KL", name: "Kerala", saturation: 56.4, hhs: "70.8 L", conn: "39.9 L", tier: TIER_COLORS.tier4, star: null, d: "M 225 675 L 250 670 L 255 765 L 235 770 Z" },
    { id: "TN", name: "Tamil Nadu", saturation: 82.3, hhs: "125.6 L", conn: "103.4 L", tier: TIER_COLORS.tier5, star: "gold", starPos: [285, 715], d: "M 255 660 L 305 655 L 295 760 L 245 770 Z" },
    { id: "NE", name: "North-Eastern States", saturation: 88.5, hhs: "58.4 L", conn: "51.7 L", tier: TIER_COLORS.tier5, star: "gold", starPos: [520, 275], d: "M 485 240 L 575 250 L 585 340 L 505 350 L 485 290 Z" },
    { id: "AN", name: "A & N Islands", saturation: 100.0, hhs: "0.62 L", conn: "0.62 L", tier: TIER_COLORS.tier6, star: "gold", starPos: [490, 680], d: "M 488 660 L 496 660 L 494 740 L 486 740 Z" }
];

export default function IndiaMapCard() {
    const [viewMode, setViewMode] = useState("state"); // "state" or "district"
    const [hoveredState, setHoveredState] = useState(null);

    return (
        <div className="bg-white rounded-lg border border-[#DCE3EC] shadow-sm p-4 w-full">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#F1F5F9] gap-3">
                <div>
                    <h2 className="text-[17px] font-bold tracking-tight">
                        <span className="text-[#D97706]">Tap water supply in households (HHs)</span>{" "}
                        <span className="text-[#002147]">| India</span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Date Pill */}
                    <div className="flex items-center gap-2 bg-[#2072AF] text-white px-3.5 py-1.5 rounded-full shadow-sm">
                        <span className="text-[12px] font-semibold">As on 30 Sep 2026</span>
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <span className="text-[#2072AF] text-[10px] font-bold">✓</span>
                        </div>
                    </div>

                    {/* State / District View Toggle */}
                    <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded text-[11px] font-medium border border-[#CBD5E1]">
                        <button
                            onClick={() => setViewMode("state")}
                            className={`px-2.5 py-1 rounded transition-colors ${viewMode === "state"
                                    ? "bg-white text-[#0B5CAB] font-bold shadow-xs"
                                    : "text-[#64748B] hover:text-[#0F172A]"
                                }`}
                        >
                            State view
                        </button>
                        <span className="text-[#CBD5E1] px-1">|</span>
                        <button
                            onClick={() => setViewMode("district")}
                            className={`px-2.5 py-1 rounded transition-colors ${viewMode === "district"
                                    ? "bg-white text-[#0B5CAB] font-bold shadow-xs"
                                    : "text-[#64748B] hover:text-[#0F172A]"
                                }`}
                        >
                            District view
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Interactive Map Viewport */}
            <div className="relative flex justify-center items-center py-2 min-h-[460px]">
                {/* Hover Tooltip Popover */}
                {hoveredState && (
                    <div
                        className="absolute z-20 pointer-events-none bg-[#002147] text-white text-[11px] px-3 py-2 rounded shadow-lg border border-[#0B5CAB]"
                        style={{ top: "16px", left: "20px" }}
                    >
                        <p className="font-bold text-amber-300 text-[12px]">{hoveredState.name}</p>
                        <p className="text-slate-200">Total Rural HHs: <span className="font-semibold">{hoveredState.hhs}</span></p>
                        <p className="text-slate-200">Tap Connections: <span className="font-semibold">{hoveredState.conn}</span></p>
                        <p className="font-bold text-white mt-0.5">
                            Saturation: <span className="text-emerald-300">{hoveredState.saturation}%</span>
                        </p>
                        {hoveredState.star && (
                            <p className="text-[10px] text-amber-400 mt-0.5">
                                {hoveredState.star === "white" ? "★ 100% Certified Har Ghar Jal" : "⭐ 100% Reported Har Ghar Jal"}
                            </p>
                        )}
                    </div>
                )}

                {/* India Vector SVG */}
                <svg
                    viewBox="100 20 520 780"
                    className="w-full max-w-[540px] h-auto drop-shadow-sm select-none"
                >
                    {/* Map Polygons */}
                    {STATE_DATA.map((state) => {
                        const isHovered = hoveredState?.id === state.id;
                        return (
                            <path
                                key={state.id}
                                d={state.d}
                                fill={state.tier}
                                stroke="#FFFFFF"
                                strokeWidth={viewMode === "district" ? "0.6" : "1.2"}
                                strokeDasharray={viewMode === "district" ? "1,1" : "none"}
                                className="transition-colors duration-150 cursor-pointer hover:opacity-90"
                                style={{
                                    filter: isHovered ? "brightness(1.15) drop-shadow(0 0 4px rgba(0,0,0,0.3))" : "none"
                                }}
                                onMouseEnter={() => setHoveredState(state)}
                                onMouseLeave={() => setHoveredState(null)}
                            />
                        );
                    })}

                    {/* Star Badges for Certified & Reported States */}
                    {STATE_DATA.filter((s) => s.star && s.starPos).map((s) => (
                        <text
                            key={`star-${s.id}`}
                            x={s.starPos[0]}
                            y={s.starPos[1]}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={s.star === "white" ? "15" : "14"}
                            fill={s.star === "white" ? "#FFFFFF" : "#F59E0B"}
                            stroke="#0F172A"
                            strokeWidth="0.5"
                            className="pointer-events-none select-none font-bold"
                        >
                            {s.star === "white" ? "★" : "⭐"}
                        </text>
                    ))}
                </svg>
            </div>

            {/* 6-Tier Saturation Legend Bar */}
            <div className="pt-2 border-t border-[#F1F5F9]">
                <div className="flex items-center w-full h-3 rounded overflow-hidden shadow-inner">
                    <div className="h-full flex-1" style={{ backgroundColor: TIER_COLORS.tier1 }} title="0%-10%" />
                    <div className="h-full flex-1" style={{ backgroundColor: TIER_COLORS.tier2 }} title="11%-25%" />
                    <div className="h-full flex-1" style={{ backgroundColor: TIER_COLORS.tier3 }} title="26%-50%" />
                    <div className="h-full flex-1" style={{ backgroundColor: TIER_COLORS.tier4 }} title="51%-75%" />
                    <div className="h-full flex-1" style={{ backgroundColor: TIER_COLORS.tier5 }} title="76%-<100%" />
                    <div className="h-full flex-1" style={{ backgroundColor: TIER_COLORS.tier6 }} title="100%" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#475569] font-medium pt-1 px-1">
                    <span>0%-10%</span>
                    <span>11%-25%</span>
                    <span>26%-50%</span>
                    <span>51%-75%</span>
                    <span>{"76%-<100%"}</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
}