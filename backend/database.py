"""
JalSetu — Persistent Database Engine
SQLAlchemy + SQLite for civic infrastructure data.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DB_PATH = os.path.join(BASE_DIR, "backend", "jalsetu.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables defined in models.py."""
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
    Base.metadata.create_all(bind=engine)
