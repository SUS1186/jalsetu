# 🌊 JalSetu (Problem Statement ID: SIH26015)

> **AI-Driven Geospatial Analytics & Geo-Coded Ground Image Interpretation for Watershed Development Outcomes**
> *Ministry of Rural Development (MoRD) | Department of Land Resources | Theme: Space Technology & Smart Water Management*
> **Team:** Black Boxz

---

## 📌 Executive Summary

**JalSetu** is an enterprise Web GIS and cyber-physical operations platform designed to bridge upstream watershed interventions (PMKSY-WDC 2.0 / MGNREGA) with downstream drinking water supply security. It resolves the "passive digital receipt" limitation of ground photo archives through four integrated pillars:

* 🛰️ **Multi-Spectral Satellite Remote Sensing**: Continuous ingestion of Sentinel-2 Level-2A rasters and SRTM/CartoDEM elevation grids to compute multi-temporal $\Delta\text{NDVI}$ (biomass recovery), $\text{NDWI}$ (surface water permanence), and stream-order runoff velocity reduction.
* 📸 **Automated Geo-Coded Image Forensics & CV**: Automated parsing of EXIF spatial metadata (GPS coordinates, UTC timestamp, camera azimuth) validated against cadastral watershed boundaries, paired with a lightweight YOLOv8 and semantic segmentation engine for asset classification, siltation percentage estimation, and fracture detection.
* ⚙️ **Cyber-Physical Hydraulic Digital Twin**: Embedding an EPANET 2.2 nodal hydraulic solver to trace upstream aquifer recharge directly to downstream intake wells, treatment plants, elevated storage reservoirs (OHSR), and rural tap delivery.
* ⚖️ **Algorithmic Trust Scoring & Statutory SLA Auditing**: An unsupervised Isolation Forest anomaly detection engine linking physical water retention verified from orbit with contractor escrow releases, CAG compliance dossiers, and 5-Year O&M SLA accountability.

---

## 🚀 Core Architecture & Modules

| Module Tab | Function & Scientific Methodology | Tech / Data Integration |
| --- | --- | --- |
| **🛰️ 01 OVERVIEW & CATCHMENT** | Macro-watershed choropleth grid, 3-tier Sentinel-2 remote sensing metrics ($\Delta\text{NDVI}$, $\text{NDWI}$, Peak Runoff), and live Geo-Coded Ground Image inspection feed. | React 18, Tailwind CSS, MapLibre GL, Sentinel-2 / SRTM DEM |
| **⚙️ 02 SCADA TWIN** | Real-time cyber-physical hydraulic telemetry, EPANET 2.2 digital twin simulation, nodal pressure heads, burst leak detection, and transducer vibration health. | EPANET 2.2 Engine, WebSockets, Canvas/SVG Schematic |
| **🧪 03 WATER QUALITY (WQMIS)** | Potability assurance against BIS:10500 standards, real-time Turbidity (NTU), Free Residual Chlorine, pH monitoring, and lab vs. FTK sample distribution tracking. | Recharts, SVG Anti-Glitch Shields, WQMIS Protocol |
| **🏆 04 SURVEKSHAN** | 754-district performance ranking, 5-star validation tiers, and Har Ghar Jal institutional tap certification tracking. | Vector Grid Indexing, GeoJSON Analytics |
| **🏫 05 SCHOOLS & AWCS** | Specialized Child Hygiene & Ecological Infrastructure (WinS) monitoring across 9.35L schools and 9.73L Anganwadi centres with groundwater depletion alerts. | Comparative Analytics Engine, Progress Bar Telemetry |
| **📋 06 CAG AUDIT** | Statutory financial compliance ledger, actual LPCD delivery vs. state mandate audit, discrepancy source analysis, and tamper-evident audit dossiers. | Relational Ledger Engine, Fiscal Audit Framework |
| **🤝 07 CONTRACTOR SLA** | 5-Year O&M performance scorecard, MTTR countdowns, liquidated damages calculation, and automated milestone payment escrow release/hold triggers. | Isolation Forest Anomaly Core, Escrow Automation |
| **🌐 REGIONAL LOCALIZATION** | Instant, zero-flicker native translation across 11 Indian regional languages with virtual DOM reconciliation protection. | Custom `LanguageContext`, React DOM Patch |

---

## 🔬 Mathematical & Algorithmic Formulations

### 1. 🛰️ Satellite Spectral Indices

* **Normalized Difference Vegetation Index (NDVI)** to quantify biomass recovery within a $500\,\text{m}$ buffer around contour bunds:

$$\text{NDVI} = \frac{\rho_{\text{NIR}} - \rho_{\text{Red}}}{\rho_{\text{NIR}} + \rho_{\text{Red}}}$$


* **Normalized Difference Water Index (NDWI)** to verify surface water spread behind check dams across seasons:

$$\text{NDWI} = \frac{\rho_{\text{Green}} - \rho_{\text{NIR}}}{\rho_{\text{Green}} + \rho_{\text{NIR}}}$$



### 2. 🏔️ Micro-Watershed Terrain Routing

Hydrological flow accumulation and stream order delineation ($1^{\text{st}}$ to $5^{\text{th}}$ order Strahler classifications) derived from 30m Digital Elevation Models:


$$Q_p = 0.278 \cdot C \cdot I \cdot A$$


*(Where $C$ is the runoff coefficient derived from LULC, $I$ is rainfall intensity, and $A$ is micro-catchment area).*

### 3. 💧 Hydraulic Network Conservation (EPANET Twin)

Mass balance continuity at every pipe network junction node:


$$\sum Q_{\text{in}} - \sum Q_{\text{out}} = Q_{\text{demand}}$$


Frictional head loss calculated via the Hazen-Williams formulation:


$$h_f = 10.67 \cdot L \cdot Q^{1.852} \cdot C^{-1.852} \cdot D^{-4.87}$$

### 4. 🧠 Automated Anomaly Detection & Trust Scoring

Ground-to-orbit multi-variable correlation scored using an Isolation Forest ensemble ($h(x)$ being path length in isolation trees):


$$S(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$$

* Anomaly threshold triggers payment holds when claimed ground-water volume fails to produce persistent satellite $\text{NDWI}$ signatures ($S(x, n) > 0.65$).

---

## 🛠️ Tech Stack

* 💻 **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Material Symbols
* 🗺️ **Geospatial & Visualization**: MapLibre GL, Leaflet, GeoJSON, Recharts, SVG Dynamic Schematic Engine
* ⚙️ **Backend & Analytics**: Python (FastAPI), GDAL, Rasterio, PySheds, GeoPandas, NumPy
* 👁️ **Computer Vision & Forensics**: YOLOv8 (Asset Classification), OpenCV (Crack/Edge Detection), Piexif (EXIF Metadata Parsing)
* 🚰 **Hydraulic Modeling**: EPANET 2.2 Integration Engine
* 🌐 **Internationalization (i18n)**: Native 11-Language Engine (English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Punjabi, Malayalam, Odia) with DOM mutation protection

---

## ⚡ Getting Started

### Prerequisites

* 🟢 **Node.js** (v18.0.0 or higher)
* 🐍 **Python** (v3.10 or higher)
* 📦 **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/SUS1186/jalsetu.git
cd jalsetu

```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

> The application will launch locally at `http://localhost:5173`.

### 3. Backend & Spatial Pipeline (Optional for Local Telemetry)

```bash
cd ../backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000

```

---

## 📂 Repository Structure

```text
jalsetu/
├── 🌐 frontend/
│   ├── src/
│   │   ├── components/         # Navigation, SCADA schematics, audit cards
│   │   ├── context/            # LanguageContext (11-language dictionaries & DOM shields)
│   │   ├── pages/              # Overview, ScadaTwin, WaterQuality, Schools, SLA, CAG
│   │   ├── App.jsx             # Shell routing and protected telemetry ticker
│   │   ├── index.css           # Anti-glitch Recharts and SVG rules
│   │   └── main.jsx            # Application entry point
│   ├── package.json
│   └── vite.config.js
├── ⚙️ backend/
│   ├── routers/                # Telemetry, geospatial rasters, and audit endpoints
│   ├── models/                 # YOLOv8 weights and structural defect classifiers
│   ├── simulation/             # EPANET 2.2 hydraulic network model files (.inp)
│   └── main.py                 # FastAPI service runner
└── 📄 README.md

```

---

## 🛡️ License & Institutional Compliance

Developed under the **Smart India Hackathon 2026** for Problem Statement **SIH26015**. Compliant with Open Geospatial Consortium (OGC) standards and Ministry of Jal Shakti / Ministry of Rural Development technical data frameworks.
