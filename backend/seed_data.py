"""
JalSetu — Database Seeder
Seeds all 8 tables with realistic Gharat Village baseline data.
"""
import os
import sys
import json
import random
from datetime import datetime, timedelta

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.database import engine, SessionLocal, Base
from backend.models import (
    InfrastructureTelemetry,
    PipelineBurstIncident,
    RiverFloodMonitoring,
    VulnerableAsset,
    EmergencyRoute,
    ContractorLedger,
    NationalSaturationState,
    GeocodedImage,
)


def seed_telemetry(session):
    """72 hours of nominal baseline telemetry for Gharat village."""
    nodes = ["INTAKE_PUMP_01", "LEAK_NODE", "JUNC_01", "JUNC_03"]
    base_time = datetime.utcnow() - timedelta(hours=72)
    count = 0
    for hour in range(72):
        ts = base_time + timedelta(hours=hour)
        for nid in nodes:
            # Baseline nominal readings
            p_base = 3.8 if nid != "INTAKE_PUMP_01" else 4.2
            q_base = 3.6 if nid != "INTAKE_PUMP_01" else 14.5
            p = round(p_base + random.uniform(-0.15, 0.15), 3)
            q = round(q_base + random.uniform(-0.2, 0.2), 2)
            amps = round(13.0 + random.uniform(-0.5, 0.5), 1) if "PUMP" in nid else 0.0
            vib = round(0.15 + random.uniform(-0.02, 0.02), 3) if "PUMP" in nid else 0.0
            tank = round(78.0 + random.uniform(-5.0, 5.0), 1)
            turb = round(1.4 + random.uniform(-0.2, 0.2), 2)
            chlorine = round(0.35 + random.uniform(-0.05, 0.05), 2)
            ph = round(7.2 + random.uniform(-0.1, 0.1), 2)

            session.add(InfrastructureTelemetry(
                timestamp=ts,
                node_id=nid,
                pressure_bar=p,
                flow_rate_lps=q,
                motor_current_amps=amps,
                vibration_rms=vib,
                tank_level_pct=tank,
                turbidity_ntu=turb,
                residual_chlorine_mg_l=chlorine,
                ph_value=ph,
            ))
            count += 1
    print(f"[Seeder] Telemetry seeded ({count} records)")


def seed_pipeline_burst(session):
    """Pre-seeded pipeline burst incident."""
    session.add(PipelineBurstIncident(
        node_id="LEAK_NODE",
        timestamp=datetime.utcnow() - timedelta(hours=3),
        severity="CRITICAL",
        pressure_drop_pct=87.4,
        estimated_water_loss_lph=18500.0,
        lat=19.8762,
        lng=75.3433,
        sla_deadline_hours=12.0,
        repair_status="CREW_DISPATCHED",
        contractor_id="INFRA-MAHA-4091",
        liquidated_damages_inr=25000.0,
    ))
    print("[Seeder] Pipeline burst incident seeded")


def seed_flood_monitoring(session):
    """Pre-seeded monsoon river flood monitoring."""
    session.add(RiverFloodMonitoring(
        station_id="GODAVARI_STN_04",
        river_name="Godavari River (Gharat Gauge)",
        timestamp=datetime.utcnow(),
        current_level_meters=12.4,
        warning_level_meters=9.2,
        danger_level_meters=10.5,
        upstream_rainfall_24h_mm=184.0,
        soil_saturation_pct=94.5,
        flood_risk_probability=0.885,
    ))
    print("[Seeder] River flood monitoring seeded (danger level: 12.4m vs 10.5m mark)")


def seed_vulnerable_assets(session):
    """Pre-seeded vulnerable assets: 4 roads, 142 households, 1 WTP, 1 bridge."""
    roads = [
        {"name": "Gharat-Nandur High Road (KM 3-5)", "dem": 8.4, "lat": 19.871, "lng": 75.338, "risk": "SUBMERGED"},
        {"name": "East Feeder Approach Cause-Way", "dem": 9.1, "lat": 19.879, "lng": 75.348, "risk": "SUBMERGED"},
        {"name": "Zilla Parishad School Road", "dem": 10.2, "lat": 19.874, "lng": 75.341, "risk": "SUBMERGED"},
        {"name": "Old Godavari River Bridge Approach", "dem": 7.9, "lat": 19.883, "lng": 75.346, "risk": "SUBMERGED"},
    ]
    for r in roads:
        session.add(VulnerableAsset(
            asset_type="ROAD_SEGMENT",
            name=r["name"],
            elevation_dem_meters=r["dem"],
            lat=r["lat"],
            lng=r["lng"],
            inundation_risk=r["risk"],
            evacuation_priority=1,
        ))

    # 142 households in flood-risk zone (elevations 8.5m - 12.0m)
    for i in range(1, 143):
        elev = round(random.uniform(8.5, 12.0), 1)
        risk = "SUBMERGED" if elev < 10.5 else "WARNING"
        prio = 1 if elev < 9.5 else (2 if elev < 11.0 else 3)
        lat_offset = random.uniform(-0.008, 0.008)
        lng_offset = random.uniform(-0.008, 0.008)
        session.add(VulnerableAsset(
            asset_type="HOUSEHOLD",
            name=f"Household HH-GHARAT-{i:03d}",
            elevation_dem_meters=elev,
            lat=round(19.876 + lat_offset, 6),
            lng=round(75.343 + lng_offset, 6),
            inundation_risk=risk,
            evacuation_priority=prio,
        ))

    # Water treatment plant
    session.add(VulnerableAsset(
        asset_type="WATER_TREATMENT_PLANT", name="Gharat WTP (50 KLD)",
        elevation_dem_meters=11.8, lat=19.8762, lng=75.3433,
        inundation_risk="WARNING", evacuation_priority=1,
    ))

    # Bridge
    session.add(VulnerableAsset(
        asset_type="BRIDGE", name="Godavari River Crossing — Old Bridge",
        elevation_dem_meters=10.0, lat=19.883, lng=75.346,
        inundation_risk="SUBMERGED", evacuation_priority=1,
    ))

    print("[Seeder] Vulnerable assets seeded (4 roads, 142 households, 1 WTP, 1 bridge)")


def seed_emergency_routes(session):
    """Pre-computed flood-safe routes for relief logistics."""
    routes = [
        {
            "origin_lat": 19.8762, "origin_lng": 75.3433,
            "dest_lat": 19.890, "dest_lng": 75.360,
            "waypoints": [
                [19.8762, 75.3433], [19.878, 75.346],
                [19.882, 75.350], [19.886, 75.355], [19.890, 75.360]
            ],
            "dist": 3.8, "time": 12.5, "algo": "A_STAR", "blocked": False,
        },
        {
            "origin_lat": 19.8762, "origin_lng": 75.3433,
            "dest_lat": 19.865, "dest_lng": 75.330,
            "waypoints": [
                [19.8762, 75.3433], [19.874, 75.340],
                [19.870, 75.336], [19.865, 75.330]
            ],
            "dist": 2.4, "time": 8.0, "algo": "DIJKSTRA", "blocked": False,
        },
        {
            "origin_lat": 19.8762, "origin_lng": 75.3433,
            "dest_lat": 19.872, "dest_lng": 75.352,
            "waypoints": [[19.8762, 75.3433], [19.872, 75.352]],
            "dist": 1.2, "time": 4.0, "algo": "A_STAR", "blocked": True,
        },
    ]
    for r in routes:
        session.add(EmergencyRoute(
            origin_lat=r["origin_lat"], origin_lng=r["origin_lng"],
            dest_lat=r["dest_lat"], dest_lng=r["dest_lng"],
            safe_waypoints_json=json.dumps(r["waypoints"]),
            distance_km=r["dist"], travel_time_min=r["time"],
            algorithm_used=r["algo"], is_blocked_by_flood=r["blocked"],
        ))
    print("[Seeder] Emergency routes seeded (3 routes)")


def seed_contractor_ledger(session):
    """Contractor with escrow status."""
    session.add(ContractorLedger(
        contractor_id="INFRA-MAHA-4091",
        agency_name="L&T Rural Water Division",
        contract_ref="JJM/O&M/2024/774",
        warranty_expiry="2028-06-30",
        escrow_balance_inr=4850000.0,
        escrow_status="WITHHELD_ON_BREACH",
        active_penalties_inr=25000.0,
    ))
    print("[Seeder] Contractor ledger seeded")


def seed_national_saturation(session):
    """Official state-wise saturation data."""
    states = [
        {"name": "Andhra Pradesh",     "hh": 8149807,  "conn": 6512440,  "pct": 79.91, "status": "REPORTED"},
        {"name": "Arunachal Pradesh",  "hh": 226891,   "conn": 226891,   "pct": 100.0, "status": "CERTIFIED"},
        {"name": "Assam",              "hh": 6206365,  "conn": 3714118,  "pct": 59.84, "status": "REPORTED"},
        {"name": "Bihar",              "hh": 18097895, "conn": 11597432, "pct": 64.08, "status": "REPORTED"},
        {"name": "Chhattisgarh",       "hh": 4755925,  "conn": 4018500,  "pct": 84.49, "status": "REPORTED"},
        {"name": "Goa",                "hh": 278550,   "conn": 278550,   "pct": 100.0, "status": "CERTIFIED"},
        {"name": "Gujarat",            "hh": 10841806, "conn": 10841806, "pct": 100.0, "status": "CERTIFIED"},
        {"name": "Haryana",            "hh": 4282800,  "conn": 4282800,  "pct": 100.0, "status": "CERTIFIED"},
        {"name": "Himachal Pradesh",   "hh": 1701072,  "conn": 1701072,  "pct": 100.0, "status": "CERTIFIED"},
        {"name": "Jharkhand",          "hh": 5560700,  "conn": 3948200,  "pct": 71.00, "status": "REPORTED"},
        {"name": "Karnataka",          "hh": 9178450,  "conn": 7342760,  "pct": 80.00, "status": "REPORTED"},
        {"name": "Kerala",             "hh": 7202390,  "conn": 4321434,  "pct": 60.00, "status": "REPORTED"},
        {"name": "Madhya Pradesh",     "hh": 12150000, "conn": 9720000,  "pct": 80.00, "status": "REPORTED"},
        {"name": "Maharashtra",        "hh": 12228980, "conn": 11082510, "pct": 90.62, "status": "REPORTED"},
        {"name": "Manipur",            "hh": 499810,   "conn": 284000,   "pct": 56.82, "status": "REPORTED"},
        {"name": "Meghalaya",          "hh": 539000,   "conn": 210000,   "pct": 38.96, "status": "REPORTED"},
        {"name": "Mizoram",            "hh": 178000,   "conn": 142000,   "pct": 79.78, "status": "REPORTED"},
        {"name": "Nagaland",           "hh": 351000,   "conn": 175500,   "pct": 50.00, "status": "REPORTED"},
        {"name": "Odisha",             "hh": 8979000,  "conn": 5838000,  "pct": 65.02, "status": "REPORTED"},
        {"name": "Punjab",             "hh": 3625642,  "conn": 3625642,  "pct": 100.0, "status": "CERTIFIED"},
        {"name": "Rajasthan",          "hh": 12290000, "conn": 10876650, "pct": 88.50, "status": "REPORTED"},
        {"name": "Sikkim",             "hh": 124500,   "conn": 124500,   "pct": 100.0, "status": "CERTIFIED"},
        {"name": "Tamil Nadu",         "hh": 7553712,  "conn": 7117108,  "pct": 94.22, "status": "REPORTED"},
        {"name": "Telangana",          "hh": 5568920,  "conn": 5568920,  "pct": 100.0, "status": "CERTIFIED"},
        {"name": "Tripura",            "hh": 750000,   "conn": 600000,   "pct": 80.00, "status": "REPORTED"},
        {"name": "Uttar Pradesh",      "hh": 26372760, "conn": 16927271, "pct": 64.17, "status": "REPORTED"},
        {"name": "Uttarakhand",        "hh": 1872500,  "conn": 1685250,  "pct": 90.00, "status": "REPORTED"},
        {"name": "West Bengal",        "hh": 16418190, "conn": 8209095,  "pct": 50.00, "status": "REPORTED"},
        {"name": "A&N Islands",        "hh": 82077,    "conn": 82077,    "pct": 100.0, "status": "CERTIFIED"},
        {"name": "D&NH and D&D",       "hh": 92000,    "conn": 92000,    "pct": 100.0, "status": "CERTIFIED"},
        {"name": "J&K",                "hh": 1960000,  "conn": 1568000,  "pct": 80.00, "status": "REPORTED"},
        {"name": "Ladakh",             "hh": 42500,    "conn": 34000,    "pct": 80.00, "status": "REPORTED"},
        {"name": "Puducherry",         "hh": 152000,   "conn": 152000,   "pct": 100.0, "status": "CERTIFIED"},
    ]

    for s in states:
        session.add(NationalSaturationState(
            state_name=s["name"],
            total_households=s["hh"],
            connections_provided=s["conn"],
            saturation_pct=s["pct"],
            status=s["status"],
        ))
    print(f"[Seeder] National saturation data seeded ({len(states)} states/UTs)")


def seed_geocoded_images(session):
    """Seeds 6 geo-coded field inspection records around Gharat village (lat ~19.876, lng ~75.343)."""
    records = [
        {
            "watershed_id": "WS_MAHA_09_CD01",
            "lat": 19.8792,
            "lng": 75.3410,
            "image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80",
            "feature_type": "Check Dam",
            "health_status": "Silted (65%)",
            "ai_tag": "High Siltation Detected — Desiltation Required",
        },
        {
            "watershed_id": "WS_MAHA_09_IW02",
            "lat": 19.8745,
            "lng": 75.3468,
            "image_url": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=400&q=80",
            "feature_type": "Intake Well",
            "health_status": "Operational",
            "ai_tag": "Submersible Pump & Sump Nominal",
        },
        {
            "watershed_id": "WS_MAHA_09_PT03",
            "lat": 19.8820,
            "lng": 75.3385,
            "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
            "feature_type": "Percolation Tank",
            "health_status": "Intact",
            "ai_tag": "Aquifer Recharge Seepage Normal",
        },
        {
            "watershed_id": "WS_MAHA_09_PS04",
            "lat": 19.8710,
            "lng": 75.3490,
            "image_url": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80",
            "feature_type": "Pipeline Siltation",
            "health_status": "Severe Erosion",
            "ai_tag": "Embankment Scour Risk — Reinforce Riprap",
        },
        {
            "watershed_id": "WS_MAHA_09_CD05",
            "lat": 19.8855,
            "lng": 75.3440,
            "image_url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80",
            "feature_type": "Check Dam",
            "health_status": "Intact",
            "ai_tag": "Spillway Free of Debris & Micro-Fissures",
        },
        {
            "watershed_id": "WS_MAHA_09_PT06",
            "lat": 19.8680,
            "lng": 75.3415,
            "image_url": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80",
            "feature_type": "Percolation Tank",
            "health_status": "Operational",
            "ai_tag": "Soil Moisture Index Optimal (NDVI 0.62)",
        },
    ]
    for r in records:
        session.add(GeocodedImage(
            watershed_id=r["watershed_id"],
            latitude=r["lat"],
            longitude=r["lng"],
            image_url=r["image_url"],
            feature_type=r["feature_type"],
            health_status=r["health_status"],
            ai_analysis_tag=r["ai_tag"],
        ))
    print(f"[Seeder] Geocoded inspection images seeded ({len(records)} records)")


def run_seeder():
    """Main seeder — drops and recreates all tables, then populates."""
    print("\n[JalSetu Seeder] Initializing database...")

    # Import models to register them with Base
    from backend.models import (
        InfrastructureTelemetry, PipelineBurstIncident,
        RiverFloodMonitoring, VulnerableAsset,
        EmergencyRoute, ContractorLedger, NationalSaturationState,
        GeocodedImage,
    )

    # Drop existing and recreate
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("[Seeder] Tables created.")

    session = SessionLocal()
    try:
        seed_telemetry(session)
        seed_pipeline_burst(session)
        seed_flood_monitoring(session)
        seed_vulnerable_assets(session)
        seed_emergency_routes(session)
        seed_contractor_ledger(session)
        seed_national_saturation(session)
        seed_geocoded_images(session)
        session.commit()
        print("\n[JalSetu Seeder] All 8 tables seeded successfully!\n")
    except Exception as e:
        session.rollback()
        print(f"[Seeder] ERROR: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    run_seeder()
