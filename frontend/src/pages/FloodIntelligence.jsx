import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = "http://127.0.0.1:8000";

// Gharat Village coordinates
const CENTER = [19.8762, 75.3433];

// Fallback inspection records
const DEFAULT_GEO_IMAGES = [
  {
    id: 1,
    watershed_id: "WS_MAHA_09_CD01",
    latitude: 19.8792,
    longitude: 75.3410,
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80",
    feature_type: "Check Dam",
    health_status: "Silted (65%)",
    ai_analysis_tag: "High Siltation Detected — Desiltation Required",
    timestamp: "2026-09-28T09:30:00Z",
  },
  {
    id: 2,
    watershed_id: "WS_MAHA_09_IW02",
    latitude: 19.8745,
    longitude: 75.3468,
    image_url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=400&q=80",
    feature_type: "Intake Well",
    health_status: "Operational",
    ai_analysis_tag: "Submersible Pump & Sump Nominal",
    timestamp: "2026-09-28T10:15:00Z",
  },
  {
    id: 3,
    watershed_id: "WS_MAHA_09_PT03",
    latitude: 19.8820,
    longitude: 75.3385,
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
    feature_type: "Percolation Tank",
    health_status: "Intact",
    ai_analysis_tag: "Aquifer Recharge Seepage Normal",
    timestamp: "2026-09-28T11:00:00Z",
  },
  {
    id: 4,
    watershed_id: "WS_MAHA_09_PS04",
    latitude: 19.8710,
    longitude: 75.3490,
    image_url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80",
    feature_type: "Pipeline Siltation",
    health_status: "Severe Erosion",
    ai_analysis_tag: "Embankment Scour Risk — Reinforce Riprap",
    timestamp: "2026-09-28T11:45:00Z",
  },
  {
    id: 5,
    watershed_id: "WS_MAHA_09_CD05",
    latitude: 19.8855,
    longitude: 75.3440,
    image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80",
    feature_type: "Check Dam",
    health_status: "Intact",
    ai_analysis_tag: "Spillway Free of Debris & Micro-Fissures",
    timestamp: "2026-09-28T12:30:00Z",
  },
  {
    id: 6,
    watershed_id: "WS_MAHA_09_PT06",
    latitude: 19.8680,
    longitude: 75.3415,
    image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80",
    feature_type: "Percolation Tank",
    health_status: "Operational",
    ai_analysis_tag: "Soil Moisture Index Optimal (NDVI 0.62)",
    timestamp: "2026-09-28T13:15:00Z",
  },
];

export default function FloodIntelligence({ isFloodActive, setActiveTab }) {
  const { t } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({
    satellite: null,
    drainage: null,
    ndvi: null,
    cameras: null,
    flood: null,
    route: null,
  });

  // Layer Visibility Toggles
  const [showSatellite, setShowSatellite] = useState(true);
  const [showDrainage, setShowDrainage] = useState(true);
  const [showNdvi, setShowNdvi] = useState(true);
  const [showCameras, setShowCameras] = useState(true);

  // Geo-Images & Inspection Modal
  const [geoImages, setGeoImages] = useState(DEFAULT_GEO_IMAGES);
  const [selectedImage, setSelectedImage] = useState(null);

  // Flood Assessment State
  const [floodData, setFloodData] = useState({
    river_status: isFloodActive ? "DANGER" : "NORMAL",
    current_level_meters: isFloodActive ? 12.4 : 7.8,
    danger_level_meters: 10.5,
    warning_level_meters: 9.2,
    flood_risk_probability: isFloodActive ? 0.885 : 0.08,
    upstream_rainfall_24h_mm: isFloodActive ? 184.0 : 14.2,
    submerged_road_segments: isFloodActive ? 4 : 0,
    intake_pump_command: isFloodActive ? "EMERGENCY_SHUTDOWN" : "OPERATIONAL",
    turbidity_estimate_ntu: isFloodActive ? 54.2 : 1.4,
  });

  // Fetch Geo Images from Backend
  useEffect(() => {
    fetch(`${API_BASE}/api/watershed/geo-images`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.images && d.images.length > 0) {
          setGeoImages(d.images);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Flood Risk Assessment
  useEffect(() => {
    fetch(`${API_BASE}/api/flood/risk-assessment`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setFloodData({
            river_status: d.river_status,
            current_level_meters: d.current_level_meters,
            danger_level_meters: d.danger_level_meters,
            warning_level_meters: d.warning_level_meters,
            flood_risk_probability: d.flood_risk_probability,
            upstream_rainfall_24h_mm: d.upstream_rainfall_24h_mm,
            submerged_road_segments: (d.submerged_road_segments || []).length,
            intake_pump_command: d.intake_pump_command,
            turbidity_estimate_ntu: d.turbidity_estimate_ntu,
          });
        }
      })
      .catch(() => {});
  }, [isFloodActive]);

  // ── Initialize Leaflet Map ──
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: CENTER,
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Base CartoDB Light Tile Layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        maxZoom: 19,
      }).addTo(map);

      // Initialize Layer Groups
      layerGroupsRef.current.satellite = L.layerGroup().addTo(map);
      layerGroupsRef.current.drainage = L.layerGroup().addTo(map);
      layerGroupsRef.current.ndvi = L.layerGroup().addTo(map);
      layerGroupsRef.current.cameras = L.layerGroup().addTo(map);
      layerGroupsRef.current.flood = L.layerGroup().addTo(map);
      layerGroupsRef.current.route = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ── Render / Update Satellite Layer ──
  useEffect(() => {
    const group = layerGroupsRef.current.satellite;
    if (!group) return;
    group.clearLayers();

    if (showSatellite) {
      // 30m SRISHTI-DRISHTI Composite Bounds
      const bounds = [
        [19.855, 75.320],
        [19.898, 75.368],
      ];
      const satOverlay = L.rectangle(bounds, {
        color: "#0B5CAB",
        weight: 1.5,
        dashArray: "4, 6",
        fillColor: "#0B5CAB",
        fillOpacity: 0.04,
      });
      satOverlay.bindTooltip("30m SRISHTI-DRISHTI Sensor Catchment Bounds (ISRO Resourcesat-2)", {
        sticky: true,
        className: "leaflet-tooltip-custom",
      });
      group.addLayer(satOverlay);
    }
  }, [showSatellite]);

  // ── Render / Update Drainage Network Layer ──
  useEffect(() => {
    const group = layerGroupsRef.current.drainage;
    if (!group) return;
    group.clearLayers();

    if (showDrainage) {
      const streams = [
        {
          name: "Gharat Main Stream (Order 3)",
          coords: [
            [19.890, 75.335],
            [19.882, 75.340],
            [19.8762, 75.3433],
            [19.868, 75.348],
          ],
          color: "#0284C7",
          weight: 4,
        },
        {
          name: "North Ridgeline Tributary (Order 2)",
          coords: [
            [19.885, 75.330],
            [19.880, 75.338],
            [19.8762, 75.3433],
          ],
          color: "#38BDF8",
          weight: 2.5,
        },
        {
          name: "East Terrace Drainage (Order 2)",
          coords: [
            [19.880, 75.355],
            [19.874, 75.348],
            [19.8762, 75.3433],
          ],
          color: "#38BDF8",
          weight: 2.5,
        },
      ];

      streams.forEach((st) => {
        const line = L.polyline(st.coords, {
          color: st.color,
          weight: st.weight,
          opacity: 0.85,
        });
        line.bindTooltip(st.name, { sticky: true });
        group.addLayer(line);
      });
    }
  }, [showDrainage]);

  // ── Render / Update NDVI Vegetation Matrix Layer ──
  useEffect(() => {
    const group = layerGroupsRef.current.ndvi;
    if (!group) return;
    group.clearLayers();

    if (showNdvi) {
      const zones = [
        {
          name: "Riparian High-Moisture Zone (NDVI: 0.68)",
          bounds: [[19.872, 75.338], [19.880, 75.348]],
          color: "#16A34A",
          opacity: 0.28,
        },
        {
          name: "Rainfed Cultivation Belt (NDVI: 0.42)",
          bounds: [[19.864, 75.328], [19.872, 75.338]],
          color: "#D97706",
          opacity: 0.25,
        },
        {
          name: "Erosion-Prone Upper Catchment (NDVI: 0.22)",
          bounds: [[19.862, 75.348], [19.870, 75.358]],
          color: "#DC2626",
          opacity: 0.22,
        },
      ];

      zones.forEach((z) => {
        const poly = L.rectangle(z.bounds, {
          color: z.color,
          weight: 1,
          fillColor: z.color,
          fillOpacity: z.opacity,
        });
        poly.bindTooltip(z.name, { sticky: true });
        group.addLayer(poly);
      });
    }
  }, [showNdvi]);

  // ── Render / Update Geo-Tagged Inspection Markers ──
  useEffect(() => {
    const group = layerGroupsRef.current.cameras;
    if (!group) return;
    group.clearLayers();

    if (showCameras) {
      geoImages.forEach((img) => {
        const isWarning = img.health_status.includes("Silted") || img.health_status.includes("Erosion");
        const iconHtml = `
          <div style="
            background: ${isWarning ? "#DC2626" : "#0B5CAB"};
            color: #ffffff;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid #ffffff;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <span class="material-symbols-outlined" style="font-size: 16px;">photo_camera</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-camera-icon",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([img.latitude, img.longitude], { icon: customIcon });
        marker.on("click", () => {
          setSelectedImage(img);
        });
        marker.bindTooltip(
          `<b>${img.feature_type}</b><br/><span style="font-size: 10px;">${img.watershed_id}</span>`,
          { direction: "top" }
        );
        group.addLayer(marker);
      });
    }
  }, [showCameras, geoImages]);

  // ── Render / Update Flood Simulation & A* Evacuation Route ──
  useEffect(() => {
    const floodGroup = layerGroupsRef.current.flood;
    const routeGroup = layerGroupsRef.current.route;
    if (!floodGroup || !routeGroup) return;

    floodGroup.clearLayers();
    routeGroup.clearLayers();

    if (isFloodActive) {
      // 1. Submerged River Zone & Road Segments
      const floodZone = [
        [19.868, 75.334],
        [19.873, 75.336],
        [19.880, 75.344],
        [19.886, 75.348],
        [19.884, 75.352],
        [19.875, 75.348],
        [19.866, 75.340],
      ];

      const floodPoly = L.polygon(floodZone, {
        color: "#DC2626",
        weight: 2,
        fillColor: "#DC2626",
        fillOpacity: 0.35,
      });
      floodPoly.bindTooltip("<b>ACTIVE MONSOON FLOOD ZONE</b><br/>Godavari River Level: 12.4m (Danger: 10.5m)", {
        sticky: true,
      });
      floodGroup.addLayer(floodPoly);

      // Blocked Submerged Road Segments
      const blockedRoads = [
        { name: "Old Bridge Causeway (El: 7.9m)", coords: [[19.881, 75.344], [19.885, 75.348]] },
        { name: "KM 3-5 Low Road (El: 8.4m)", coords: [[19.869, 75.336], [19.873, 75.340]] },
      ];

      blockedRoads.forEach((rd) => {
        const line = L.polyline(rd.coords, {
          color: "#991B1B",
          weight: 6,
          dashArray: "6, 6",
        });
        line.bindTooltip(`❌ SUBMERGED: ${rd.name}`, { sticky: true });
        floodGroup.addLayer(line);
      });

      // 2. Dynamic Emerald Green A* Flood-Safe Tanker Route
      const safeWaypoints = [
        [19.8762, 75.3433], // Village Standpost
        [19.8780, 75.3460], // Highland Link
        [19.8820, 75.3500], // Ridge Bypass
        [19.8860, 75.3550], // East High Plateau
        [19.8900, 75.3600], // Relief Distribution Hub
      ];

      const routeLine = L.polyline(safeWaypoints, {
        color: "#059669",
        weight: 5,
        opacity: 0.95,
      });
      routeLine.bindTooltip(
        "<b>A* / DIJKSTRA SAFE TANKER ROUTE</b><br/>Distance: 4.8 km &bull; 13.7 min &bull; Zero Inundation Risk",
        { sticky: true }
      );
      routeGroup.addLayer(routeLine);

      // Origin and Destination Markers
      const startIcon = L.divIcon({
        html: `<div style="background:#059669;color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;border:1px solid #fff;white-space:nowrap;">Origin: Gharat Standpost</div>`,
        iconAnchor: [0, 0],
      });
      const endIcon = L.divIcon({
        html: `<div style="background:#059669;color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;border:1px solid #fff;white-space:nowrap;">Dest: Relief Hub (Highland)</div>`,
        iconAnchor: [0, 0],
      });

      routeGroup.addLayer(L.marker([19.8762, 75.3433], { icon: startIcon }));
      routeGroup.addLayer(L.marker([19.8900, 75.3600], { icon: endIcon }));
    }
  }, [isFloodActive]);

  return (
    <div className="flex flex-col gap-4 p-6 relative">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-[#002147] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[26px] text-[#0B5CAB]">satellite_alt</span>
            Flood Resilience &amp; 30m SRISHTI-DRISHTI Geospatial Decision Support
          </h1>
          <p className="text-[12px] text-[#44474e] mt-0.5">
            Watershed Hydrology, Dynamic Inundation Modeling, and A* / Dijkstra Evacuation Logistics
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 ${
              isFloodActive
                ? "bg-red-100 text-red-800 border border-red-300 animate-pulse"
                : "bg-green-100 text-green-800 border border-green-300"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isFloodActive ? "warning" : "verified"}
            </span>
            {isFloodActive ? "RIVER FLOOD SURGE ACTIVE (BREACH)" : "WATERSHED HYDROLOGY NOMINAL"}
          </span>
        </div>
      </div>

      {/* ── Key Metrics Ribbon ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border border-[#DCE3EC] p-3 shadow-sm">
          <div className="text-[10px] font-bold text-[#44474e] uppercase">Godavari River Level</div>
          <div className="text-[18px] font-bold font-mono text-[#002147] mt-0.5">
            {floodData.current_level_meters} m
          </div>
          <div className="text-[9px] text-[#74777f]">Danger Mark: {floodData.danger_level_meters} m</div>
        </div>

        <div className="bg-white rounded-lg border border-[#DCE3EC] p-3 shadow-sm">
          <div className="text-[10px] font-bold text-[#44474e] uppercase">Inundation Risk</div>
          <div className={`text-[18px] font-bold font-mono mt-0.5 ${isFloodActive ? "text-red-600" : "text-green-700"}`}>
            {(floodData.flood_risk_probability * 100).toFixed(1)}%
          </div>
          <div className="text-[9px] text-[#74777f]">DEM Elevation Model</div>
        </div>

        <div className="bg-white rounded-lg border border-[#DCE3EC] p-3 shadow-sm">
          <div className="text-[10px] font-bold text-[#44474e] uppercase">24h Rainfall (IMD)</div>
          <div className="text-[18px] font-bold font-mono text-[#002147] mt-0.5">
            {floodData.upstream_rainfall_24h_mm} mm
          </div>
          <div className="text-[9px] text-[#74777f]">Catchment Gauge Feed</div>
        </div>

        <div className="bg-white rounded-lg border border-[#DCE3EC] p-3 shadow-sm">
          <div className="text-[10px] font-bold text-[#44474e] uppercase">Intake Raw Turbidity</div>
          <div className={`text-[18px] font-bold font-mono mt-0.5 ${isFloodActive ? "text-amber-600" : "text-[#0B5CAB]"}`}>
            {floodData.turbidity_estimate_ntu} NTU
          </div>
          <div className="text-[9px] font-bold" style={{ color: isFloodActive ? "#DC2626" : "#1A7F48" }}>
            Pump: {floodData.intake_pump_command}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#DCE3EC] p-3 shadow-sm">
          <div className="text-[10px] font-bold text-[#44474e] uppercase">Emergency Logistics</div>
          <div className="text-[18px] font-bold font-mono text-[#059669] mt-0.5">
            {isFloodActive ? "A* Active" : "Standby"}
          </div>
          <div className="text-[9px] text-[#74777f]">
            {isFloodActive ? "4 road segments avoided" : "Dry roads clear"}
          </div>
        </div>
      </div>

      {/* ── Main Map Canvas Container with Overlay Controls ── */}
      <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-[#DCE3EC] shadow-md">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* SRISHTI-DRISHTI 30m Layer Toggles (Top-Right Floating Panel) */}
        <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-[#DCE3EC] shadow-lg text-[11px] w-[270px]">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[#DCE3EC]">
            <span className="material-symbols-outlined text-[18px] text-[#0B5CAB]">layers</span>
            <span className="font-bold text-[#002147] tracking-tight uppercase text-[10px]">
              30m SRISHTI-DRISHTI GIS Layers
            </span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:text-[#0B5CAB]">
              <input
                type="checkbox"
                checked={showSatellite}
                onChange={(e) => setShowSatellite(e.target.checked)}
                className="rounded text-[#0B5CAB] focus:ring-0 cursor-pointer"
              />
              <span className="font-medium text-[#0e1d2a]">30m Satellite Composite</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-[#0B5CAB]">
              <input
                type="checkbox"
                checked={showDrainage}
                onChange={(e) => setShowDrainage(e.target.checked)}
                className="rounded text-[#0B5CAB] focus:ring-0 cursor-pointer"
              />
              <span className="font-medium text-[#0e1d2a]">Surface Drainage (Blue Vectors)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-[#0B5CAB]">
              <input
                type="checkbox"
                checked={showNdvi}
                onChange={(e) => setShowNdvi(e.target.checked)}
                className="rounded text-[#0B5CAB] focus:ring-0 cursor-pointer"
              />
              <span className="font-medium text-[#0e1d2a]">NDVI Vegetation Matrix</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-[#0B5CAB]">
              <input
                type="checkbox"
                checked={showCameras}
                onChange={(e) => setShowCameras(e.target.checked)}
                className="rounded text-[#0B5CAB] focus:ring-0 cursor-pointer"
              />
              <span className="font-medium text-[#0e1d2a]">Inspection Camera Pins ({geoImages.length})</span>
            </label>
          </div>

          {/* Quick Info Box */}
          <div className="mt-3 pt-2 border-t border-[#DCE3EC] text-[9px] text-[#74777f] font-mono">
            Provider: ISRO Resourcesat-2 / Sentinel-2 L2A &bull; 30m Grid
          </div>
        </div>

        {/* Bottom Left: Route Info Banner (visible during flood) */}
        {isFloodActive && (
          <div className="absolute bottom-4 left-4 z-20 bg-[#002147]/95 backdrop-blur-md text-white p-3.5 rounded-lg border border-[#059669] shadow-xl text-[11px] max-w-[380px]">
            <div className="flex items-center gap-2 text-[#10B981] font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">route</span>
              A* / Dijkstra Dynamic Heuristic Safe Route Active
            </div>
            <p className="text-[10px] text-[#cbd5e1] leading-relaxed">
              Relief tanker route redirected along East Highland Ridge (elevation &gt; 12.0m). Avoids 4 submerged causeways with automated gate lockouts.
            </p>
            <div className="flex items-center gap-4 mt-2 font-mono text-[10px] text-[#10B981]">
              <span>Distance: 4.8 km</span>
              <span>ETA: 13.7 min</span>
              <span>Clearance: Safe</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Inspection Photo Modal Dialog ── */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DCE3EC] shadow-2xl max-w-[480px] w-full overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-[#002147] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#B3802A]">photo_camera</span>
                <div>
                  <h3 className="text-[13px] font-bold">{selectedImage.feature_type} Inspection</h3>
                  <div className="text-[10px] text-[#cbd5e1] font-mono">{selectedImage.watershed_id}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-white hover:text-red-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Photo Thumbnail */}
            <div className="relative w-full h-[220px] bg-slate-900 overflow-hidden">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.feature_type}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                {selectedImage.latitude.toFixed(4)}&deg;N, {selectedImage.longitude.toFixed(4)}&deg;E
              </div>
            </div>

            {/* Diagnostics Body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#44474e]">Structural Health:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedImage.health_status.includes("Operational") || selectedImage.health_status.includes("Intact")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedImage.health_status}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#44474e]">AI Diagnostic Tag:</span>
                <div className="mt-1 p-2 bg-[#F4F6F9] rounded border border-[#DCE3EC] text-[11px] text-[#002147] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0B5CAB]">auto_awesome</span>
                  {selectedImage.ai_analysis_tag}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#74777f] font-mono pt-2 border-t border-[#DCE3EC]">
                <span>Logged: {new Date(selectedImage.timestamp).toLocaleString("en-IN")}</span>
                <span>Audit: GIS Verified</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#DCE3EC] flex justify-end">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-3 py-1.5 bg-[#0B5CAB] hover:bg-[#002147] text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
