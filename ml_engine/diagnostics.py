import os
import joblib
import pandas as pd
import warnings

# Suppress minor sklearn warnings for production cleanliness
warnings.filterwarnings('ignore', category=UserWarning)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models/isolation_forest.joblib')

try:
    model = joblib.load(MODEL_PATH)
    print("✅ ML Engine: Isolation Forest model loaded successfully.")
except Exception as e:
    print(f"⚠️ ML Engine Warning: Could not load model from {MODEL_PATH}. Error: {e}")
    model = None

FEATURE_COLS = [
    'pressure_bar', 
    'flow_rate_lps', 
    'motor_current_amp', 
    'grid_voltage_v', 
    'hydraulic_ratio', 
    'electrical_ratio'
]

def evaluate_telemetry(data: dict) -> dict:
    """
    Accepts raw telemetry dictionary from backend/simulator:
    {
        "node_id": "JUNC_PMP_03",
        "pressure": 0.85,
        "flow": 18.4,
        "current": 12.1,
        "voltage": 224
    }
    Returns standardized diagnostic dictionary matching API contract.
    """
    # Extract values with fallback defaults
    p = float(data.get('pressure', data.get('pressure_bar', 0)))
    q = float(data.get('flow', data.get('flow_rate_lps', 0)))
    i = float(data.get('current', data.get('motor_current_amp', 0)))
    v = float(data.get('voltage', data.get('grid_voltage_v', 0)))

    # Feature Engineering
    h_ratio = p / (q**2 + 1e-5)
    e_ratio = q / (i + 1e-5)

    # ML Anomaly Score (-1 = Anomaly, 1 = Normal)
    ml_pred = 1
    confidence_score = 0.99

    if model is not None:
        features = pd.DataFrame([[p, q, i, v, h_ratio, e_ratio]], columns=FEATURE_COLS)
        ml_pred = model.predict(features)[0]
        raw_score = float(model.score_samples(features)[0])
        # Map raw anomaly score to a 0.50 - 0.99 confidence scale
        confidence_score = round(min(max((0.5 - raw_score) * 2, 0.50), 0.99), 2)

    # -------------------------------------------------------------
    # Rule Engine: Disambiguating Physical Faults vs Grid Realities
    # -------------------------------------------------------------

    # Rule 1: Rural Power Load Shedding / Phase Drop (NOT a pipe fault)
    if v < 160 or (v < 180 and i == 0 and q == 0):
        return {
            "status": "WARNING",
            "incident_type": "GRID_POWER_TRIP",
            "confidence_score": 0.98,
            "recommended_action": "Grid voltage low or phase trip. System paused to prevent motor burnout.",
            "severity": "LOW"
        }

    # Rule 2: Pump Cavitation / Dry Run (High motor current, negligible flow)
    if v >= 180 and i > 15.0 and q < 2.0:
        return {
            "status": "CRITICAL",
            "incident_type": "PUMP_DRY_RUN_CAVITATION",
            "confidence_score": confidence_score,
            "recommended_action": "Cutoff pump relay immediately! Borewell source low or intake blocked.",
            "severity": "HIGH"
        }

    # Rule 3: Major Mainline Pipe Burst (Flow spike with sudden pressure drop)
    if ml_pred == -1 and p < 1.0 and q > 12.0:
        return {
            "status": "CRITICAL",
            "incident_type": "PIPE_BURST",
            "confidence_score": confidence_score,
            "recommended_action": "Isolate Valve V-02 immediately. Suspected mainline rupture detected.",
            "severity": "HIGH"
        }

    # Rule 4: Slow Pressure Leak / Non-Revenue Water Loss
    if ml_pred == -1 and p < 1.2 and q <= 12.0:
        return {
            "status": "WARNING",
            "incident_type": "GRADUAL_PRESSURE_LEAK",
            "confidence_score": confidence_score,
            "recommended_action": "Schedule physical inspection. Non-revenue water loss detected in segment.",
            "severity": "MEDIUM"
        }

    # Default: Steady State Operation
    return {
        "status": "NORMAL",
        "incident_type": "STEADY_STATE",
        "confidence_score": 0.99,
        "recommended_action": "System operating within optimal hydraulic parameters.",
      
        "severity": "NONE"
    }

def check_sensor_health(historical_readings: list) -> dict:
    """
    Analyzes a buffer of the last 10 readings for a single sensor.
    Detects frozen sensors (zero variance) or abnormal noise/drift.
    """
    if len(historical_readings) < 5:
        return {"sensor_healthy": True, "issue": "INSUFFICIENT_DATA"}
    
    pressures = [r.get('pressure', 0) for r in historical_readings]
    p_std = np.std(pressures)
    
    # 1. Frozen Sensor Check (Sensor reading identical value endlessly)
    if p_std == 0.0 and pressures[-1] > 0:
        return {
            "sensor_healthy": False, 
            "issue": "SENSOR_FROZEN", 
            "detail": "Pressure sensor reading stuck at constant value. Field calibration required."
        }
    
    # 2. Out-of-Range Outlier Noise Check
    if max(pressures) > 10.0 or min(pressures) < -0.5:
        return {
            "sensor_healthy": False, 
            "issue": "TELEMETRY_NOISE_OUT_OF_BOUNDS", 
            "detail": "Spike exceeds physical limits. Electrical interference suspected."
        }
        
    return {"sensor_healthy": True, "issue": "NONE"}

def calculate_pump_health(motor_amps: float, flow_lps: float, baseline_amps: float = 10.0) -> dict:
    """
    Calculates Remaining Useful Life (RUL) percentage based on motor current draw vs hydraulic yield.
    """
    if flow_lps <= 0:
        return {"health_score_pct": 100.0, "status": "INACTIVE"}
    
    # Hydraulic Efficiency = Flow delivered per Amp of motor current
    efficiency = flow_lps / (motor_amps + 1e-5)
    baseline_efficiency = 12.0 / baseline_amps # Normal baseline
    
    health_ratio = min(max(efficiency / baseline_efficiency, 0.0), 1.0)
    health_score_pct = round(health_ratio * 100, 1)
    
    if health_score_pct < 40.0:
        recommendation = "CRITICAL WEAR: Motor drawing high current for low yield. Schedule bearing replacement within 48h."
    elif health_score_pct < 70.0:
        recommendation = "MODERATE DEGRADATION: Impeller wear detected. Perform routine O&M inspection."
    else:
        recommendation = "HEALTHY: Motor operating at optimal electromechanical efficiency."
        
    return {
        "health_score_pct": health_score_pct,
        "recommendation": recommendation
    }

