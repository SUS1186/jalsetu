import time
import json
import argparse
import requests
import pandas as pd

def stream_telemetry(csv_file="telemetry_feed.csv", target_url="http://127.0.0.1:5000/api/telemetry", interval_sec=1.0, loop=True):
    """
    Simulates a live SCADA IoT Edge Device reading sensors and 
    transmitting data payloads to the JalSetu Backend API.
    """
    try:
        df = pd.read_csv(csv_file)
        print(f"[SCADA GATEWAY] Loaded {len(df)} records from '{csv_file}'")
    except FileNotFoundError:
        print(f"[ERROR] '{csv_file}' not found! Run 'python generate_telemetry.py' first.")
        return

    print(f"[SCADA GATEWAY] Starting telemetry stream to -> {target_url}")
    print(f"[SCADA GATEWAY] Transmission interval: {interval_sec}s per record tick")
    print("----------------------------------------------------------------------")

    tick_count = 0
    
    while True:
        for idx, row in df.iterrows():
            payload = {
                "timestamp_sec": int(row["timestamp_sec"]),
                "hour": int(row["hour"]),
                "node_id": str(row["node_id"]),
                "pressure_bar": float(row["pressure_bar"]),
                "flow_rate_lps": float(row["flow_rate_lps"]),
                "motor_amps": float(row["motor_amps"]),
                "grid_voltage_v": float(row["grid_voltage_v"]),
                "fault_type": str(row.get("fault_type", "normal")),
                "is_fault": int(row["is_fault"])
            }
            
            tick_count += 1
            
            try:
                # Transmit JSON payload to backend endpoint
                response = requests.post(
                    target_url, 
                    json=payload, 
                    headers={"Content-Type": "application/json"},
                    timeout=2.0
                )
                status_code = response.status_code
                status_msg = "SUCCESS" if status_code in [200, 201] else f"HTTP {status_code}"
            except requests.exceptions.ConnectionError:
                status_msg = "OFFLINE (Backend API not running)"
            except requests.exceptions.Timeout:
                status_msg = "TIMEOUT"

            # Print edge telemetry logs to terminal
            print(f"[TICK #{tick_count:04d}] Node: {payload['node_id']} | "
                  f"P: {payload['pressure_bar']} bar | "
                  f"Q: {payload['flow_rate_lps']} L/s | "
                  f"Status: {status_msg}")

            time.sleep(interval_sec)

        if not loop:
            print("\n[SCADA GATEWAY] Stream completed. Exiting.")
            break
            
        print("\n[SCADA GATEWAY] End of dataset reached. Looping stream...\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JalSetu Live SCADA IoT Edge Telemetry Streamer")
    parser.add_argument("--csv", type=str, default="telemetry_feed.csv", help="Source CSV dataset")
    parser.add_argument("--url", type=str, default="http://127.0.0.1:5000/api/telemetry", help="Target API endpoint")
    parser.add_argument("--interval", type=float, default=1.0, help="Stream interval in seconds per tick")
    parser.add_argument("--no-loop", action="store_true", help="Stop after one full dataset pass instead of looping")

    args = parser.parse_args()
    stream_telemetry(
        csv_file=args.csv, 
        target_url=args.url, 
        interval_sec=args.interval, 
        loop=not args.no_loop
    )