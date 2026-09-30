"""
JalSetu 2.0 — SQLAlchemy ORM Models
Seven relational tables covering telemetry, incidents, flood monitoring,
vulnerable assets, emergency routes, contractor ledger, and national saturation.
"""
from sqlalchemy import (
    Column, Integer, Float, String, DateTime, Boolean, Text,
    Enum as SAEnum,
)
from sqlalchemy.sql import func
from backend.database import Base


class InfrastructureTelemetry(Base):
    """Time-series sensor readings from SCADA nodes."""
    __tablename__ = "infrastructure_telemetry"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    node_id = Column(String(50), nullable=False, index=True)
    pressure_bar = Column(Float, default=0.0)
    flow_rate_lps = Column(Float, default=0.0)
    motor_current_amps = Column(Float, default=0.0)
    vibration_rms = Column(Float, default=0.0)
    tank_level_pct = Column(Float, default=0.0)
    turbidity_ntu = Column(Float, default=0.0)
    residual_chlorine_mg_l = Column(Float, default=0.0)
    ph_value = Column(Float, default=7.0)


class PipelineBurstIncident(Base):
    """Pipeline burst / leak incident records with SLA tracking."""
    __tablename__ = "pipeline_burst_incidents"

    incident_id = Column(Integer, primary_key=True, autoincrement=True)
    node_id = Column(String(50), nullable=False)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    severity = Column(String(20), default="LOW")  # LOW, MEDIUM, CRITICAL
    pressure_drop_pct = Column(Float, default=0.0)
    estimated_water_loss_lph = Column(Float, default=0.0)
    lat = Column(Float, default=0.0)
    lng = Column(Float, default=0.0)
    sla_deadline_hours = Column(Float, default=12.0)
    repair_status = Column(String(30), default="PENDING")
    contractor_id = Column(String(50), nullable=True)
    liquidated_damages_inr = Column(Float, default=0.0)


class RiverFloodMonitoring(Base):
    """River gauge station readings with flood risk probabilities."""
    __tablename__ = "river_flood_monitoring"

    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(String(50), nullable=False, index=True)
    river_name = Column(String(100), nullable=False)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    current_level_meters = Column(Float, default=0.0)
    warning_level_meters = Column(Float, default=0.0)
    danger_level_meters = Column(Float, default=0.0)
    upstream_rainfall_24h_mm = Column(Float, default=0.0)
    soil_saturation_pct = Column(Float, default=0.0)
    flood_risk_probability = Column(Float, default=0.0)


class VulnerableAsset(Base):
    """Assets at risk during flood or infrastructure failure events."""
    __tablename__ = "vulnerable_assets"

    asset_id = Column(Integer, primary_key=True, autoincrement=True)
    asset_type = Column(String(50), nullable=False)  # HOUSEHOLD, ROAD_SEGMENT, BRIDGE, WATER_TREATMENT_PLANT
    name = Column(String(200), nullable=False)
    elevation_dem_meters = Column(Float, default=0.0)
    lat = Column(Float, default=0.0)
    lng = Column(Float, default=0.0)
    inundation_risk = Column(String(20), default="SAFE")  # SAFE, WARNING, SUBMERGED
    evacuation_priority = Column(Integer, default=3)


class EmergencyRoute(Base):
    """Pre-computed or dynamically routed flood-safe paths."""
    __tablename__ = "emergency_routes"

    route_id = Column(Integer, primary_key=True, autoincrement=True)
    origin_lat = Column(Float, nullable=False)
    origin_lng = Column(Float, nullable=False)
    dest_lat = Column(Float, nullable=False)
    dest_lng = Column(Float, nullable=False)
    safe_waypoints_json = Column(Text, default="[]")
    distance_km = Column(Float, default=0.0)
    travel_time_min = Column(Float, default=0.0)
    algorithm_used = Column(String(20), default="A_STAR")  # A_STAR or DIJKSTRA
    is_blocked_by_flood = Column(Boolean, default=False)


class ContractorLedger(Base):
    """Contractor accountability and escrow payment ledger."""
    __tablename__ = "contractor_ledger"

    contractor_id = Column(String(50), primary_key=True)
    agency_name = Column(String(200), nullable=False)
    contract_ref = Column(String(100), nullable=True)
    warranty_expiry = Column(String(20), nullable=True)
    escrow_balance_inr = Column(Float, default=0.0)
    escrow_status = Column(String(30), default="PERMITTED")  # PERMITTED or WITHHELD_ON_BREACH
    active_penalties_inr = Column(Float, default=0.0)


class NationalSaturationState(Base):
    """State-wise JJM saturation data (official + ground-verified)."""
    __tablename__ = "national_saturation_states"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state_name = Column(String(100), nullable=False, unique=True)
    total_households = Column(Integer, default=0)
    connections_provided = Column(Integer, default=0)
    saturation_pct = Column(Float, default=0.0)
    status = Column(String(20), default="REPORTED")  # REPORTED or CERTIFIED
