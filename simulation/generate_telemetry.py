import os
import json
import argparse
import numpy as np
import pandas as pd
import wntr

def create_network_with_geo():
    """Builds the village water distribution network with physical GPS coordinates."""
    wn = wntr.network.WaterNetworkModel()
    
    # 24-hour diurnal consumption pattern
    rural_pattern = [0.3, 0.2, 0.2, 0.5, 1.5, 2.5, 2.2, 1.8, 1.2, 0.9, 
                     0.8, 0.7, 0.6, 0.7, 0.9, 1.3, 2.0, 2.4, 1.8, 1.0, 
                     0.6, 0.4, 0.3, 0.2]
    wn.add_pattern('rural_daily', rural_pattern)
    
    # Add nodes with elevations & demand
    wn.add_junction('JUNC_01', elevation=10.0, base_demand=0.003, demand_pattern='rural_daily')
    wn.add_junction('JUNC_02', elevation=12.0, base_demand=0.005, demand_pattern='rural_daily')
    wn.add_junction('JUNC_03', elevation=15.0, base_demand=0.004, demand_pattern='rural_daily')
    wn.add_reservoir('SOURCE_OHSR', base_head=50.0)
    
    # Attach GPS coordinates for GIS / Leaflet frontend rendering
    coordinates = {
        'SOURCE_OHSR': (72.8777, 19.0760),
        'JUNC_01': (72.8790, 19.0780),
        'JUNC_02': (72.8830, 19.0810),
        'JUNC_03': (72.8850, 19.0830)
    }
    for node_id, (lng, lat) in coordinates.items():
        wn.get_node(node_id).coordinates = (lng, lat)
        
    # Add connecting pipes
    wn.add_pipe('PIPE_MAIN', 'SOURCE_OHSR', 'JUNC_01', length=500, diameter=0.2, roughness=100)
    wn.add_pipe('PIPE_02', 'JUNC_01', 'JUNC_02', length=300, diameter=0.15, roughness=100)
    wn.add_pipe('PIPE_03', 'JUNC_02', 'JUNC_03', length=400, diameter=0.15, roughness=100)
    
    return wn

def export_geojson(wn, output_path="network_topology.json"):
    """Exports network nodes and pipe links as a standard GeoJSON file for Leaflet maps."""
    features = []
    
    # Export Nodes
    for name, node in wn.nodes():
        if hasattr(node, 'coordinates') and node.coordinates:
            lng, lat = node.coordinates
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [lng, lat]},
                "properties": {
                    "id": name,
                    "type": "RESERVOIR" if name == "SOURCE_OHSR" else "JUNCTION",
                    "elevation": getattr(node, 'elevation', 0.0)
                }
            })
            
    # Export Pipes/Links
    for name, pipe in wn.pipes():
        start_node = wn.get_node(pipe.start_node_name)
        end_node = wn.get_node(pipe.end_node_name)
        if hasattr(start_node, 'coordinates') and hasattr(end_node, 'coordinates'):
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [list(start_node.coordinates), list(end_node.coordinates)]
                },
                "properties": {"id": name, "length_m": pipe.length, "diameter_m": pipe.diameter}
            })
            
    geojson = {"type": "FeatureCollection", "features": features}
    with open(output_path, "w") as f:
        json.dump(geojson, f, indent=2)
    print(f"[GIS] Network topology exported to '{output_path}'")

def inject_fault(wn, fault_type, start_hour):
    """Applies specific physical hydraulic failure mechanics."""
    print(f"[FAULT] Injecting failure type '{fault_type}' starting at Hour {start_hour}...")
    
    if fault_type == "leak":
        # Split main pipe and insert a leak emitter node
        wn = wntr.morph.split_pipe(wn, 'PIPE_MAIN', 'PIPE_MAIN_B', 'LEAK_NODE')
        leak_node = wn.get_node('LEAK_NODE')
        leak_node.coordinates = (72.8783, 19.0770)
        leak_node.emitter_coefficient = 0.005
        
    elif fault_type == "valve_clog":
        # Simulate heavy calcification / valve closure by increasing pipe roughness & restricting flow
        pipe = wn.get_link('PIPE_MAIN')
        pipe.roughness = 10  # Drop roughness coefficient drastically
        pipe.diameter = 0.05  # Restrict pipe cross-section
        
    elif fault_type == "pump_failure":
        # Pressure source drops, simulating power outage or pump motor trip
        reservoir = wn.get_node('SOURCE_OHSR')
        reservoir.head_pattern = None
        reservoir.base_head = 12.0  # Head drops to gravity-only pressure
        
    return wn

def run_simulation(fault_type="leak", start_hour=14, duration_hours=24, output_csv="telemetry_feed.csv"):
    wn = create_network_with_geo()
    
    # Export topology for frontend rendering
    export_geojson(wn)
    
    # Configure time step
    wn.options.time.duration = duration_hours * 3600
    wn.options.time.hydraulic_timestep = 900  # 15-min intervals
    
    # Inject fault hydraulics
    wn = inject_fault(wn, fault_type, start_hour)
    
    print("[ENGINE] Executing WNTR Hydraulic Physics Engine...")
    sim = wntr.sim.WNTRSimulator(wn)
    results = sim.run_sim()
    
    node_pressure = results.node['pressure']
    link_flow = results.link['flowrate']
    
    records = []
    print("[SCADA] Generating electrical parameters and sensor noise...")
    
    for t in node_pressure.index:
        hour = int(t / 3600)
        is_fault = 1 if hour >= start_hour else 0
        
        for node_id in wn.junction_name_list:
            if node_id in node_pressure.columns:
                p_raw = max(0.0, float(node_pressure.loc[t, node_id]) * 0.0980665)
                q_raw = abs(float(link_flow.iloc[:, 0].loc[t])) * 1000
                
                # Electrical signature adjustments based on fault type
                if is_fault and fault_type == "pump_failure":
                    grid_voltage = 0.0 if np.random.rand() > 0.3 else 140.0  # Power outage / brownout
                    motor_amps = 0.0
                elif is_fault and fault_type == "valve_clog":
                    grid_voltage = 220.0 + np.random.normal(0, 3.0)
                    motor_amps = 22.5 + np.random.normal(0, 1.2)  # Overworking motor current spike
                else:
                    grid_voltage = 220.0 + np.random.normal(0, 4.0)
                    motor_amps = 12.5 + (q_raw * 0.25)
                    
                # Add 2% Gaussian noise to sensor pressure & flow
                p_noisy = max(0.0, p_raw + np.random.normal(0, 0.015))
                q_noisy = max(0.0, q_raw + np.random.normal(0, 0.02))
                
                records.append({
                    "timestamp_sec": int(t),
                    "hour": hour,
                    "node_id": node_id,
                    "pressure_bar": round(p_noisy, 3),
                    "flow_rate_lps": round(q_noisy, 2),
                    "motor_amps": round(motor_amps, 2),
                    "grid_voltage_v": round(grid_voltage, 1),
                    "fault_type": fault_type if is_fault else "normal",
                    "is_fault": is_fault
                })

    df = pd.DataFrame(records)
    df.to_csv(output_csv, index=False)
    
    print("--------------------------------------------------")
    print(f"SUCCESS: Exported {len(df)} telemetry rows -> '{output_csv}'")
    print(f"Fault Configured: '{fault_type.upper()}' starting at Hour {start_hour}")
    print("--------------------------------------------------")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JalSetu SCADA & Hydraulic Telemetry Generator")
    parser.add_argument("--fault", type=str, choices=["leak", "valve_clog", "pump_failure"], default="leak", help="Fault scenario type")
    parser.add_argument("--start-hour", type=int, default=14, help="Hour when fault begins (0-23)")
    parser.add_argument("--duration", type=int, default=24, help="Total simulation length in hours")
    parser.add_argument("--output", type=str, default="telemetry_feed.csv", help="Output CSV path")
    
    args = parser.parse_args()
    run_simulation(fault_type=args.fault, start_hour=args.start_hour, duration_hours=args.duration, output_csv=args.output)