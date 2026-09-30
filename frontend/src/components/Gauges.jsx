import React from "react";

/* ── Circular Gauge (Pressure / Trust Score) ── */
export function CircularGauge({ value, max, label, unit, color = "#0B5CAB", warningThreshold, size = 140 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);
  const isWarning = warningThreshold !== undefined && value < warningThreshold;
  const gaugeColor = isWarning ? "#C82333" : color;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8EEFA" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={gaugeColor} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s" }}
        />
        <text x={size / 2} y={size / 2 - 8} textAnchor="middle" className="fill-[#0e1d2a]"
          style={{ fontSize: size > 120 ? "22px" : "18px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          {typeof value === "number" ? value.toFixed(value < 10 ? 2 : 1) : value}
        </text>
        <text x={size / 2} y={size / 2 + 14} textAnchor="middle" className="fill-[#44474e]"
          style={{ fontSize: "11px", fontFamily: "'Public Sans', sans-serif" }}>
          {unit}
        </text>
      </svg>
      {label && <span className="text-[11px] font-semibold text-[#44474e] uppercase tracking-wide text-center">{label}</span>}
    </div>
  );
}

/* ── Speedometer Gauge (Flow Rate) ── */
export function SpeedometerGauge({ value, max, label, unit, color = "#0B5CAB", size = 140 }) {
  const pct = Math.min(value / max, 1);
  const angle = -135 + pct * 270;
  const r = (size - 30) / 2;
  const cx = size / 2, cy = size / 2;

  // Needle endpoint
  const needleLen = r - 10;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + needleLen * Math.cos(rad);
  const ny = cy + needleLen * Math.sin(rad);

  // Arc background
  const arcR = r;
  const startAngle = -135, endAngle = 135;
  const toXY = (a) => ({
    x: cx + arcR * Math.cos((a * Math.PI) / 180),
    y: cy + arcR * Math.sin((a * Math.PI) / 180),
  });
  const s = toXY(startAngle), e = toXY(endAngle);
  const arcPath = `M ${s.x} ${s.y} A ${arcR} ${arcR} 0 1 1 ${e.x} ${e.y}`;
  const fillEnd = toXY(angle);
  const fillPath = `M ${s.x} ${s.y} A ${arcR} ${arcR} 0 ${angle - startAngle > 180 ? 1 : 0} 1 ${fillEnd.x} ${fillEnd.y}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.75}`}>
        <path d={arcPath} fill="none" stroke="#E8EEFA" strokeWidth="10" strokeLinecap="round" />
        <path d={fillPath} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          style={{ transition: "d 0.5s ease" }} />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#C82333" strokeWidth="3" strokeLinecap="round"
          style={{ transition: "all 0.5s ease" }} />
        <circle cx={cx} cy={cy} r="5" fill="#002147" />
        <text x={cx} y={cy + 24} textAnchor="middle"
          style={{ fontSize: "18px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: "#0e1d2a" }}>
          {typeof value === "number" ? value.toFixed(1) : value}
        </text>
        <text x={cx} y={cy + 38} textAnchor="middle"
          style={{ fontSize: "10px", fontFamily: "'Public Sans', sans-serif", fill: "#44474e" }}>
          {unit}
        </text>
      </svg>
      {label && <span className="text-[11px] font-semibold text-[#44474e] uppercase tracking-wide text-center">{label}</span>}
    </div>
  );
}

/* ── Water Tank Level ── */
export function WaterTank({ level, maxLevel = 100, label, isFlooded = false, size = 120 }) {
  const pct = Math.min(level / maxLevel, 1);
  const tankH = size * 0.8;
  const waterH = tankH * pct;
  const waterColor = isFlooded ? "#8B5A2B" : "#3B82F6";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size * 0.6} height={size} viewBox={`0 0 ${size * 0.6} ${size}`}>
        {/* Tank body */}
        <rect x="4" y={size * 0.1} width={size * 0.6 - 8} height={tankH}
          rx="4" fill="none" stroke="#74777f" strokeWidth="2" />
        {/* Water fill */}
        <rect x="6" y={size * 0.1 + tankH - waterH + 2} width={size * 0.6 - 12}
          height={waterH - 4} rx="2" fill={waterColor} opacity="0.7">
          <animate attributeName="opacity" values="0.6;0.85;0.6" dur="2s" repeatCount="indefinite" />
        </rect>
        {/* Percentage label */}
        <text x={size * 0.3} y={size * 0.55} textAnchor="middle"
          style={{ fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: "#fff" }}>
          {Math.round(pct * 100)}%
        </text>
      </svg>
      {label && <span className="text-[10px] font-semibold text-[#44474e] uppercase tracking-wide text-center">{label}</span>}
    </div>
  );
}

/* ── Linear Progress Bar ── */
export function ProgressBar({ value, max, label, color = "#0B5CAB", showText = true, height = 20 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      {label && <div className="flex justify-between items-center mb-1">
        <span className="text-[12px] font-semibold text-[#0e1d2a]">{label}</span>
        {showText && <span className="text-[12px] font-mono font-bold text-[#0e1d2a]">{Math.round(pct)}%</span>}
      </div>}
      <div className="w-full bg-[#E8EEFA] rounded-full overflow-hidden" style={{ height }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      {showText && <div className="flex justify-between mt-0.5">
        <span className="text-[10px] text-[#44474e] font-mono">{value}{typeof max === "number" ? ` / ${max}` : ""}</span>
      </div>}
    </div>
  );
}

/* ── Escrow Padlock ── */
export function EscrowPadlock({ isLocked, label }) {
  return (
    <div className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all duration-500 ${
      isLocked
        ? "bg-red-50 border-red-300 animate-pulse"
        : "bg-green-50 border-green-300"
    }`}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        {isLocked ? (
          <>
            <rect x="15" y="38" width="50" height="35" rx="6" fill="#C82333" />
            <rect x="22" y="18" width="36" height="24" rx="12" fill="none" stroke="#C82333" strokeWidth="5" />
            <rect x="35" y="48" width="10" height="14" rx="2" fill="#fff" />
          </>
        ) : (
          <>
            <rect x="15" y="38" width="50" height="35" rx="6" fill="#1A7F48" />
            <path d="M 22 38 L 22 30 C 22 18 58 18 58 30" fill="none" stroke="#1A7F48" strokeWidth="5" strokeLinecap="round" />
            <rect x="35" y="48" width="10" height="14" rx="2" fill="#fff" />
          </>
        )}
      </svg>
      <span className={`text-[13px] font-bold uppercase tracking-wider ${isLocked ? "text-red-700" : "text-green-700"}`}>
        {label}
      </span>
    </div>
  );
}

/* ── Countdown Timer ── */
export function CountdownTimer({ hours, label, color = "#0B5CAB" }) {
  const maxHours = 48;
  const pct = Math.min(hours / maxHours, 1);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const urgentColor = hours < 12 ? "#C82333" : color;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#E8EEFA" strokeWidth="8" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke={urgentColor} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 60 60)" style={{ transition: "all 0.6s" }} />
        <text x="60" y="55" textAnchor="middle"
          style={{ fontSize: "24px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: urgentColor }}>
          {hours}h
        </text>
        <text x="60" y="72" textAnchor="middle"
          style={{ fontSize: "9px", fontFamily: "'Public Sans', sans-serif", fill: "#44474e", fontWeight: 600 }}>
          REMAINING
        </text>
      </svg>
      {label && <span className="text-[10px] font-semibold text-[#44474e] uppercase tracking-wide text-center">{label}</span>}
    </div>
  );
}

/* ── Stat Card ── */
export function StatCard({ icon, value, label, sublabel, color = "#EBF3FC", iconColor = "#0B5CAB", trend }) {
  return (
    <div className="bg-white rounded-lg border border-[#DCE3EC] p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="material-symbols-outlined text-[28px]" style={{ color: iconColor }}>{icon}</span>
        {trend && (
          <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
            trend.startsWith("+") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>{trend}</span>
        )}
      </div>
      <div className="font-mono text-[24px] font-bold text-[#0e1d2a] leading-tight">{value}</div>
      <div className="text-[12px] font-semibold text-[#44474e]">{label}</div>
      {sublabel && <div className="text-[10px] text-[#74777f]">{sublabel}</div>}
    </div>
  );
}

/* ── Potability Badge ── */
export function PotabilityBadge({ isSafe, label }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-lg border-2 transition-all ${
      isSafe
        ? "bg-green-50 border-green-300 text-green-800"
        : "bg-red-50 border-red-300 text-red-800 animate-pulse"
    }`}>
      <span className="material-symbols-outlined text-[36px]">
        {isSafe ? "verified" : "dangerous"}
      </span>
      <span className="text-[14px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ── Indian Number Format ── */
export function IndianNumber({ value, className = "" }) {
  const formatted = typeof value === "number"
    ? value.toLocaleString("en-IN")
    : value;
  return <span className={`font-mono font-bold ${className}`}>{formatted}</span>;
}
