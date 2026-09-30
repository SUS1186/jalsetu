"""
JalSetu 2.0 — Database Seeder
Seeds all 7 tables with realistic civic infrastructure data for Gharat Village, 
Chhatrapati Sambhaji Nagar, Maharashtra and national JJM saturation figures.
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
)


def seed_telemetry(session):
    """Seed 72 hours of nominal baseline telemetry at 15-min intervals for 4 nodes."""
    nodes = [
        {"node_id": "INTAKE_PUMP_01", "base_pressure": 3.92, "base_flow": 3.62, "base_amps": 13.4, "base_vib": 0.18, "base_tank": 82.0, "base_turb": 1.2, "base_cl": 0.48, "base_ph": 7.3},
        {"node_id": "LEAK_NODE",      "base_pressure": 3.88, "base_flow": 3.58, "base_amps": 13.2, "base_vib": 0.15, "base_tank": 79.0, "base_turb": 1.4, "base_cl": 0.45, "base_ph": 7.2},
        {"node_id": "JUNC_01",        "base_pressure": 3.72, "base_flow": 3.55, "base_amps": 12.8, "base_vib": 0.12, "base_tank": 77.0, "base_turb": 1.5, "base_cl": 0.40, "base_ph": 7.1},
        {"node_id": "JUNC_03",        "base_pressure": 3.48, "base_flow": 3.50, "base_amps": 12.5, "base_vib": 0.10, "base_tank": 75.0, "base_turb": 1.6, "base_cl": 0.35, "base_ph": 7.0},
    ]

    now = datetime.utcnow()
    start = now - timedelta(hours=72)
    interval_minutes = 15
    total_ticks = int(72 * 60 / interval_minutes)  # 288 ticks

    records = []
    for tick in range(total_ticks):
        ts = start + timedelta(minutes=tick * interval_minutes)
        for n in nodes:
            jitter = lambda base, spread=0.05: round(base + random.uniform(-base * spread, base * spread), 3)
            records.append(InfrastructureTelemetry(
                timestamp=ts,
                node_id=n["node_id"],
                pressure_bar=jitter(n["base_pressure"]),
                flow_rate_lps=jitter(n["base_flow"]),
                motor_current_amps=jitter(n["base_amps"]),
                vibration_rms=jitter(n["base_vib"], 0.1),
                tank_level_pct=jitter(n["base_tank"], 0.03),
                turbidity_ntu=jitter(n["base_turb"], 0.08),
                residual_chlorine_mg_l=jitter(n["base_cl"], 0.06),
                ph_value=jitter(n["base_ph"], 0.02),
            ))

    session.bulk_save_objects(records)
    print(f"[Seeder] Inserted {len(records)} telemetry records (72h x 4 nodes)")


def seed_pipeline_burst(session):
    """Pre-seeded pipeline burst incident: sudden pressure drop at JUNC_03."""
    incident = PipelineBurstIncident(
        node_id="JUNC_03",
        timestamp=datetime.utcnow() - timedelta(hours=2),
        severity="CRITICAL",
        pressure_drop_pct=87.4,
        estimated_water_loss_lph=18500.0,
        lat=19.8740,
        lng=75.3490,
        sla_deadline_hours=12.0,
        repair_status="IN_PROGRESS",
        contractor_id="INFRA-MAHA-4091",
        liquidated_damages_inr=25000.0,
    )
    session.add(incident)
    print("[Seeder] Pipeline burst incident seeded (JUNC_03, CRITICAL)")


def seed_flood_monitoring(session):
    """Pre-seeded monsoon river flood incident: Godavari at danger level."""
    flood = RiverFloodMonitoring(
        station_id="GODAVARI_STN_04",
        river_name="Godavari",
        timestamp=datetime.utcnow(),
        current_level_meters=12.4,
        warning_level_meters=9.5,
        danger_level_meters=10.5,
        upstream_rainfall_24h_mm=184.0,
        soil_saturation_pct=92.0,
        flood_risk_probability=0.89,
    )
    session.add(flood)
    print("[Seeder] Flood monitoring record seeded (Godavari, 12.4m)")


def seed_vulnerable_assets(session):
    """4 road segments submerged + 142 households in flood-risk zone."""
    # Submerged road segments
    roads = [
        {"name": "NH-211 Underpass Segment A", "elev": 8.2, "lat": 19.881, "lng": 75.340, "risk": "SUBMERGED", "prio": 1},
        {"name": "State Highway SH-60 Bridge Link", "elev": 9.1, "lat": 19.878, "lng": 75.348, "risk": "SUBMERGED", "prio": 1},
        {"name": "Village Access Road — South", "elev": 9.8, "lat": 19.872, "lng": 75.352, "risk": "SUBMERGED", "prio": 2},
        {"name": "Farmland Connector Track", "elev": 10.2, "lat": 19.869, "lng": 75.345, "risk": "SUBMERGED", "prio": 2},
    ]
    for r in roads:
        session.add(VulnerableAsset(
            asset_type="ROAD_SEGMENT", name=r["name"],
            elevation_dem_meters=r["elev"], lat=r["lat"], lng=r["lng"],
            inundation_risk=r["risk"], evacuation_priority=r["prio"],
        ))

    # Household clusters in flood zone
    for i in range(1, 143):
        lat_offset = random.uniform(-0.008, 0.008)
        lng_offset = random.uniform(-0.008, 0.008)
        elev = round(random.uniform(8.0, 11.5), 1)
        risk = "SUBMERGED" if elev < 10.0 else "WARNING" if elev < 11.0 else "SAFE"
        prio = 1 if risk == "SUBMERGED" else 2 if risk == "WARNING" else 4
        session.add(VulnerableAsset(
            asset_type="HOUSEHOLD",
            name=f"HH-GHARAT-{i:03d}",
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
    """Official JJM state-wise saturation data."""
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


def run_seeder():
    """Main seeder — drops and recreates all tables, then populates."""
    print("\n[JalSetu 2.0 Seeder] Initializing database...")

    # Import models to register them with Base
    from backend.models import (
        InfrastructureTelemetry, PipelineBurstIncident,
        RiverFloodMonitoring, VulnerableAsset,
        EmergencyRoute, ContractorLedger, NationalSaturationState,
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
        session.commit()
        print("\n[JalSetu 2.0 Seeder] All data seeded successfully!\n")
    except Exception as e:
        session.rollback()
        print(f"[Seeder] ERROR: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    run_seeder()
