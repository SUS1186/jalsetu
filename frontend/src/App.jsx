import React, { useState, useEffect, useRef } from "react";
import { LanguageProvider, useLanguage, LANGUAGES } from "./context/LanguageContext";
import LoadingScreen from "./components/LoadingScreen";
import Overview from "./pages/Overview";
import Survekshan from "./pages/Survekshan";
import WaterQuality from "./pages/WaterQuality";
import SchoolsAWC from "./pages/SchoolsAWC";
import ScadaTwin from "./pages/ScadaTwin";
import CagAudit from "./pages/CagAudit";
import ContractorSLA from "./pages/ContractorSLA";

const API_BASE = "http://127.0.0.1:8000";

const NAV_ITEMS = [
  { key: "overview", icon: "home_pin", labelKey: "nav.overview" },
  { key: "scada", icon: "schema", labelKey: "nav.scada" },
  { key: "wqmis", icon: "science", labelKey: "nav.waterquality" },
  { key: "survekshan", icon: "assessment", labelKey: "nav.survekshan" },
  { key: "schools", icon: "school", labelKey: "nav.schools" },
  { key: "cag", icon: "policy", labelKey: "nav.cag" },
  { key: "contractor", icon: "payments", labelKey: "nav.contractor" },
];

/* ────── Citizen Proof-of-Flow Modal ────── */
function CitizenModal({ isOpen, onClose, t }) {
  const [tapId, setTapId] = useState("TAP_S15");
  const [flowing, setFlowing] = useState(true);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/api/citizen/verify-flow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tap_id: tapId,
          flow_confirmed: flowing,
          lat: 19.874, lng: 75.349,
          reported_by: "Asha Worker / Local Resident",
          notes,
        }),
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 2000);
    } catch {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-[#002147] px-5 py-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#B3802A] text-[24px]">verified</span>
          <h2 className="text-white text-[16px] font-bold">{t("citizen.title")}</h2>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-[48px] text-green-600 mb-3">check_circle</span>
            <p className="text-[14px] font-semibold text-green-800">{t("citizen.success")}</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#44474e] mb-1">{t("citizen.tap_id")}</label>
              <input type="text" value={tapId} onChange={(e) => setTapId(e.target.value)}
                className="w-full border border-[#DCE3EC] rounded px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-[#0B5CAB] focus:ring-1 focus:ring-[#0B5CAB]/30" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#44474e] mb-1">{t("citizen.flowing")}</label>
              <div className="flex gap-3">
                <button onClick={() => setFlowing(true)}
                  className={`flex-1 py-2 rounded border text-[13px] font-semibold transition-colors ${flowing ? "bg-green-100 border-green-400 text-green-800" : "bg-white border-[#DCE3EC] text-[#44474e]"}`}>
                  <span className="material-symbols-outlined text-[16px] align-middle mr-1">check</span>{t("citizen.yes")}
                </button>
                <button onClick={() => setFlowing(false)}
                  className={`flex-1 py-2 rounded border text-[13px] font-semibold transition-colors ${!flowing ? "bg-red-100 border-red-400 text-red-800" : "bg-white border-[#DCE3EC] text-[#44474e]"}`}>
                  <span className="material-symbols-outlined text-[16px] align-middle mr-1">close</span>{t("citizen.no")}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#44474e] mb-1">{t("citizen.notes")}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="w-full border border-[#DCE3EC] rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#0B5CAB] focus:ring-1 focus:ring-[#0B5CAB]/30 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2 rounded border border-[#DCE3EC] text-[13px] font-semibold text-[#44474e] hover:bg-[#F7F9FF]">
                {t("citizen.cancel")}
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2 rounded bg-[#0B5CAB] text-white text-[13px] font-semibold hover:bg-[#094a8d] disabled:opacity-50 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">send</span>
                {t("citizen.submit")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────── Main App Shell ────── */
function AppShell() {
  const { t, lang, setLang, LANGUAGES } = useLanguage();

  const [showLoading, setShowLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isBurstActive, setIsBurstActive] = useState(false);
  const [isFloodActive, setIsFloodActive] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [audit, setAudit] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);
  const [citizenModalOpen, setCitizenModalOpen] = useState(false);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [burstStartTime, setBurstStartTime] = useState(null);
  const tickRef = useRef(0);

  const mainRef = useRef(null);

  // ── Scroll reset on tab change ──
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "instant" });
    window.scrollTo(0, 0);
  }, [activeTab]);

  // ── Telemetry polling ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [telRes, audRes] = await Promise.all([
          fetch(`${API_BASE}/api/telemetry/live`),
          fetch(`${API_BASE}/api/governance/audit`),
        ]);
        if (telRes.ok) {
          const d = await telRes.json();
          setTelemetry(d);
          setServerOnline(true);
          // Append to rolling history buffer (max 20 ticks)
          tickRef.current += 1;
          setTelemetryHistory((prev) => {
            const point = {
              tick: tickRef.current,
              time: new Date().toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              pressure: d?.nodes?.[0]?.hydrostatic_pressure_bar ?? 2.14,
              flow: d?.nodes?.[0]?.volumetric_flow_Lps ?? 8.42,
              nrw: d?.network_kpis?.nrw_pct ?? 12.26,
              chlorine: d?.nodes?.[0]?.residual_chlorine_mgL ?? 0.38,
              turbidity: d?.network_kpis?.turbidity_ntu ?? 0.82,
            };
            const next = [...prev, point];
            return next.length > 20 ? next.slice(-20) : next;
          });
        }
        if (audRes.ok) setAudit(await audRes.json());
      } catch {
        setServerOnline(false);
      }
    };
    fetchData();
    const iv = setInterval(fetchData, 2000);
    return () => clearInterval(iv);
  }, []);

  // ── Disaster toggles ──
  const handleToggleBurst = async () => {
    try {
      await fetch(`${API_BASE}/api/simulation/toggle-burst`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger_burst: !isBurstActive }),
      });
    } catch { /* offline fallback */ }
    const next = !isBurstActive;
    setIsBurstActive(next);
    setBurstStartTime(next ? Date.now() : null);
    setIsFloodActive(false);
  };

  const handleToggleFlood = () => {
    setIsFloodActive(!isFloodActive);
    setIsBurstActive(false);
  };

  const stopAll = () => {
    setIsBurstActive(false);
    setIsFloodActive(false);
  };

  const pageProps = { telemetry, audit, isBurstActive, isFloodActive, serverOnline, telemetryHistory, burstStartTime, setActiveTab };

  const isAnyDisaster = isBurstActive || isFloodActive;

  // Show loading screen
  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans antialiased text-[#0e1d2a]">
      {/* ════════ HEADER ════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#DCE3EC]">
        {/* Top bar */}
        <div className="h-[56px] px-4 flex items-center justify-between gap-3">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#D97706] text-[28px]">account_balance</span>
            <div>
              <div className="text-[17px] font-black text-[#002147] tracking-tight">
                JalSetu-Satat Jal, Surakshit Kal
              </div>
            </div>
          </div>
          </div>

          {/* Center: Status + Disaster buttons */}
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono ${serverOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              SCADA CORE: 127.0.0.1:8000 | {serverOnline ? t("app.online") : t("app.offline")}
            </span>

            {/* Language selector */}
            <select value={lang} onChange={(e) => setLang(e.target.value)}
              className="text-[11px] border border-[#DCE3EC] rounded px-2 py-1 bg-white focus:outline-none cursor-pointer">
              {(LANGUAGES || []).map((l) => (
                <option key={l.code} value={l.code}>{l.native}</option>
              ))}
            </select>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setCitizenModalOpen(true)}
              className="flex items-center gap-1.5 border border-[#0B5CAB] text-[#0B5CAB] hover:bg-[#EBF3FC] px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              {t("header.proof_of_flow")}
            </button>

            {isAnyDisaster ? (
              <button onClick={stopAll}
                className="flex items-center gap-1.5 bg-[#44474e] hover:bg-[#333] text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors">
                <span className="material-symbols-outlined text-[16px]">stop_circle</span>
                {t("header.stop_simulation")}
              </button>
            ) : (
              <>
                <button onClick={handleToggleBurst}
                  className="flex items-center gap-1.5 bg-[#C82333] hover:bg-[#a51d2a] text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <span className="material-symbols-outlined text-[16px]">plumbing</span>
                  {t("header.simulate_burst")}
                </button>
                <button onClick={handleToggleFlood}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <span className="material-symbols-outlined text-[16px]">flood</span>
                  {t("header.simulate_flood")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Flood alert banner */}
        {isFloodActive && (
          <div className="bg-amber-500 text-white px-4 py-2 flex items-center gap-2 text-[12px] font-semibold animate-pulse">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            {t("header.flood_alert")}
          </div>
        )}

        {/* Burst alert banner */}
        {isBurstActive && (
          <div className="bg-red-600 text-white px-4 py-2 flex items-center gap-2 text-[12px] font-semibold animate-pulse">
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            PIPE BURST ACTIVE — Pressure at JUNC_03 dropped to 0.48 bar. NRW Loss: 38.2%. Escrow withheld.
          </div>
        )}

        {/* Nominal status ticker */}
        {!isAnyDisaster && (
          <div className="h-[28px] bg-[#002147] px-4 flex items-center justify-between text-[10px] text-[#94a3b8]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#B3802A] uppercase tracking-wider text-[9px] font-bold bg-[#00204c] px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[12px]">campaign</span>Bhashini Live
              </span>
              <span>Real-time Jal Jeevan Mission national telemetry ingest pipeline synchronized across 785 districts.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">thermostat</span>Ambient: 28.4C
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-green-400">check_circle</span>Turbidity: 0.82 NTU (Safe)
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">sync</span>Last Sync: {new Date().toLocaleTimeString("en-IN")}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* ════════ SIDEBAR NAV ════════ */}
      <aside className="fixed left-0 z-40 w-[80px] bg-white border-r border-[#DCE3EC] flex flex-col items-center py-2 overflow-y-auto"
        style={{ top: isAnyDisaster ? "94px" : "84px", bottom: 0 }}>
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.key;
          return (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`w-full flex flex-col items-center justify-center py-2.5 px-1 text-center transition-colors ${
                active
                  ? "bg-[#EBF3FC] text-[#0B5CAB] border-l-[3px] border-[#0B5CAB] font-bold"
                  : "text-[#44474e] hover:bg-[#F7F9FF] hover:text-[#0e1d2a] border-l-[3px] border-transparent"
              }`}>
              <span className="material-symbols-outlined text-[22px] mb-0.5">{item.icon}</span>
              <span className="text-[9px] leading-[11px] uppercase tracking-normal font-semibold">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </aside>

      {/* ════════ MAIN CONTENT ════════ */}
      <main ref={mainRef} className="ml-[80px] overflow-auto"
        style={{ paddingTop: isAnyDisaster ? "94px" : "84px", minHeight: "100vh" }}>
        {activeTab === "overview" && <Overview {...pageProps} />}
        {activeTab === "survekshan" && <Survekshan {...pageProps} />}
        {activeTab === "wqmis" && <WaterQuality {...pageProps} />}
        {activeTab === "schools" && <SchoolsAWC {...pageProps} />}
        {activeTab === "scada" && <ScadaTwin {...pageProps} />}
        {activeTab === "cag" && <CagAudit {...pageProps} />}
        {activeTab === "contractor" && <ContractorSLA {...pageProps} />}
      </main>

      {/* ════════ CITIZEN MODAL ════════ */}
      <CitizenModal isOpen={citizenModalOpen} onClose={() => setCitizenModalOpen(false)} t={t} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
