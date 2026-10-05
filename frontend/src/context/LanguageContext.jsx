import React, { createContext, useContext, useState, useEffect } from "react";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "bn", label: "Bengali" },
  { code: "gu", label: "Gujarati" },
  { code: "kn", label: "Kannada" },
  { code: "pa", label: "Punjabi" },
  { code: "ml", label: "Malayalam" },
  { code: "or", label: "Odia" }
];

const ENGLISH_FALLBACKS = {
  "scada_title": "SCADA Cyber-Physical Hydraulic Digital Twin",
  "scada.title": "SCADA Cyber-Physical Hydraulic Digital Twin",
  "NAV.OVERVIEW": "OVERVIEW",
  "NAV.SCADA": "SCADA TWIN",
  "NAV.WATERQUALITY": "WATER QUALITY",
  "NAV.SURVEKSHAN": "SURVEKSHAN",
  "NAV.SCHOOLS": "SCHOOLS & AWCS",
  "NAV.CAG": "CAG AUDIT",
  "NAV.CONTRACTOR": "CONTRACTOR SLA",

  "waterquality.title": "Water Quality & Potability Telemetry (WQMIS)",
  "waterquality_title": "Water Quality & Potability Telemetry (WQMIS)",
  "survekshan.title": "Jal Jeevan Survekshan Assessment",
  "survekshan_title": "Jal Jeevan Survekshan Assessment",
  "schools.title": "School & Anganwadi Tap Water Security",
  "schools_title": "School & Anganwadi Tap Water Security",
  "cag.title": "CAG Ground-Truth & Financial Compliance Audit",
  "cag_title": "CAG Ground-Truth & Financial Compliance Audit",
  "contractor.title": "Contractor SLA & 5-Year O&M Performance Tracker",
  "contractor_title": "Contractor SLA & 5-Year O&M Performance Tracker",
  "SCADA Cyber-Physical Hydraulic Digital Twin": "SCADA Cyber-Physical Hydraulic Digital Twin",
  "SCADA Cyber-Physical Hydraulic Digital Twin": "SCADA Cyber-Physical Hydraulic Digital Twin",
  "title": "JalSetu Civic Intelligence Platform",

  "SCADA Cyber-Physical Hydraulic Digital Twin": "SCADA Cyber-Physical Hydraulic Digital Twin",
  "SCADA Cyber-Physical Hydraulic Digital Twin": "SCADA Cyber-Physical Hydraulic Digital Twin",
  "Pressure Delivery": "Pressure Delivery",
  "Water Flow Discharge": "Water Flow Discharge",
  "OHSR Reservoir Level": "OHSR Reservoir Level",
  "PROOF-OF-FLOW": "PROOF-OF-FLOW",
  "SIMULATE PIPE BURST": "SIMULATE PIPE BURST",
  "SIMULATE RIVER FLOOD": "SIMULATE RIVER FLOOD",
  "OVERVIEW": "OVERVIEW",
  "SCADA TWIN": "SCADA TWIN",
  "WATER QUALITY": "WATER QUALITY",
  "WATER QUALITY": "WATER QUALITY",
  "WATER QUALITY": "WATER QUALITY",
  "SURVEKSHAN": "SURVEKSHAN",
  "SCHOOLS & AWCS": "SCHOOLS & AWCS",
  "CAG AUDIT": "CAG AUDIT",
  "CONTRACTOR SLA": "CONTRACTOR SLA"
};

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (k) => k
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const m = document.cookie.match(/googtrans=\/en\/([a-z]{2})/i);
      return m ? m[1].toLowerCase() : (localStorage.getItem("jalsetu_lang") || "en");
    } catch (e) {
      return "en";
    }
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    try {
      localStorage.setItem("jalsetu_lang", langCode);
    } catch(e) {}

    if (langCode === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=/en/en; path=/;";
    } else {
      document.cookie = "googtrans=/en/" + langCode + "; path=/;";
    }
    window.location.reload();
  };

  // Re-trigger translation when switching tabs without full page reload
  useEffect(() => {
    if (!language || language === "en") return;

    const triggerTranslate = () => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = language;
        combo.dispatchEvent(new Event("change"));
      }
    };

    const handleClick = (e) => {
      const target = e.target.closest("button, nav, a, [role='button']");
      if (target) {
        setTimeout(triggerTranslate, 150);
        setTimeout(triggerTranslate, 450);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [language]);

  const t = (key) => {
    if (!key) return "";
    if (ENGLISH_FALLBACKS[key]) return ENGLISH_FALLBACKS[key];
    return key.replace(/^[A-Za-z0-9_]+\./, "").replace(/_/g, " ");
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
