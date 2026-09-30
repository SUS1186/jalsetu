import sys
import os
import time
import pandas as pd

# Add root folder to sys.path so ml_engine and backend modules resolve cleanly
SYS_PATH_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if SYS_PATH_ROOT not in sys.path:
    sys.path.append(SYS_PATH_ROOT)

# Backend imports
from database import Base, SessionLocal, engine
from models import Telemetry, IncidentTicket

# ML Engine import (Dev 2's function)
from ml_engine.diagnostics import evaluate_telemetry

# Ensure all database tables exist in jalsetu.db
Base.metadata.create_all(bind=engine)

def run_ingestion():
    db = SessionLocal()
    csv_path = os.path.join(SYS_PATH_ROOT, 'simulation', 'telemetry_feed.csv')

    if not os.path.exists(csv_path):
        print(f"❌ Error: CSV file not found at {csv_path}")
        return

    print(f"🚀 Starting JalSetu telemetry ingestion from: {csv_path}\n")
    df = pd.read_csv(csv_path)

    try:
        for index, row in df.iterrows():
            # Build payload matching Dev 2's evaluate_telemetry contract
            telemetry_payload = {
                "pressure": float(row.get('pressure', row.get('pressure_bar', 0.0))),
                "flow": float(row.get('flow', row.get('flow_rate_lps', 0.0))),
                "current": float(row.get('current', row.get('motor_current_amp', 0.0))),
                "voltage": float(row.get('voltage', row.get('grid_voltage_v', 220.0)))
            }

            # Run ML Diagnostic Model
            ml_output = evaluate_telemetry(telemetry_payload)

            # Extract fields safely from returned dictionary
            status = ml_output.get('status', 'NORMAL')
            incident_type = ml_output.get('incident_type', 'STEADY_STATE')
            confidence = float(ml_output.get('confidence_score', 0.95))
            node_id = str(row.get('node_id', 'NODE_01'))

            # Insert Telemetry Record into SQLite
            telemetry_entry = Telemetry(
                node_id=node_id,
                pressure_bar=telemetry_payload['pressure'],
                flow_rate_lps=telemetry_payload['flow'],
                motor_current_amp=telemetry_payload['current'],
                grid_voltage_v=telemetry_payload['voltage'],
                status=status,
                incident_type=incident_type,
                confidence_score=confidence
            )
            db.add(telemetry_entry)

            # Auto-generate an Incident Ticket if anomaly is detected
            if status in ['WARNING', 'CRITICAL']:
                ticket = IncidentTicket(
                    node_id=node_id,
                    incident_type=incident_type,
                    severity=status,
                    recommended_action=f"Automated Alert: {incident_type} detected on asset {node_id}."
                )
                db.add(ticket)

            # Commit the record to jalsetu.db
            db.commit()

            print(f"✅ [Row {index + 1}/{len(df)}] Node: {node_id} | Status: {status} | Event: {incident_type}")
            
            # 1-second delay to simulate real-time SCADA/IoT streaming
            time.sleep(1)

    except Exception as e:
        db.rollback()
        print(f"❌ Error during ingestion loop: {e}")
    finally:
        db.close()
        print("\n🏁 Ingestion stream completed. Database connection closed.")

if __name__ == '__main__':
    run_ingestion()