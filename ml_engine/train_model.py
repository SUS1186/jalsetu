import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '../simulation/telemetry_feed.csv')
MODEL_SAVE_PATH = os.path.join(BASE_DIR, 'models/isolation_forest.joblib')

def find_column(df, candidates):
    """Finds the first matching column name from candidates."""
    for cand in candidates:
        if cand in df.columns:
            return cand
    return None

def train():
    print(f"Loading simulation telemetry from: {DATA_PATH}")
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Could not find dataset at {DATA_PATH}. Check that Dev 1's telemetry_feed.csv exists in /simulation.")

    df = pd.read_csv(DATA_PATH)
    print(f"Detected CSV columns: {list(df.columns)}")

    # Flexible candidate list for each feature
    col_maps = {
        'pressure': ['pressure_bar', 'pressure', 'p'],
        'flow': ['flow_rate_lps', 'flow_rate', 'flow', 'q'],
        'current': ['motor_amps', 'motor_current_amp', 'motor_current', 'current', 'amps', 'i'],
        'voltage': ['grid_voltage_v', 'grid_voltage', 'voltage', 'v']
    }

    # Auto-detect and map columns
    resolved = {}
    for key, candidates in col_maps.items():
        found = find_column(df, candidates)
        if not found:
            raise KeyError(f"Could not find column for '{key}'. Candidates: {candidates}. Found in CSV: {list(df.columns)}")
        resolved[key] = found

    # Standardize names for model features
    df['pressure_bar'] = df[resolved['pressure']]
    df['flow_rate_lps'] = df[resolved['flow']]
    df['motor_current_amp'] = df[resolved['current']]
    df['grid_voltage_v'] = df[resolved['voltage']]

    # Feature Engineering (Hydraulic resistance and Electrical efficiency ratios)
    df['hydraulic_ratio'] = df['pressure_bar'] / (df['flow_rate_lps']**2 + 1e-5)
    df['electrical_ratio'] = df['flow_rate_lps'] / (df['motor_current_amp'] + 1e-5)

    feature_cols = ['pressure_bar', 'flow_rate_lps', 'motor_current_amp', 'grid_voltage_v', 'hydraulic_ratio', 'electrical_ratio']
    X = df[feature_cols]

    print("Training Isolation Forest anomaly detection model...")
    model = IsolationForest(
        n_estimators=100,
        contamination=0.03,  # Expect ~3% baseline noise
        random_state=42
    )
    model.fit(X)

    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    joblib.dump(model, MODEL_SAVE_PATH)
    print(f"✅ Success! Model trained and saved to: {MODEL_SAVE_PATH}")

if __name__ == '__main__':
    train()