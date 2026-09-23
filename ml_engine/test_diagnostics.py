from diagnostics import evaluate_telemetry

# Test 1: Normal State
t1 = evaluate_telemetry({"pressure": 2.5, "flow": 10.0, "current": 8.0, "voltage": 230})
print("Test 1 (Normal):", t1['incident_type'])

# Test 2: Power Cut
t2 = evaluate_telemetry({"pressure": 0.0, "flow": 0.0, "current": 0.0, "voltage": 120})
print("Test 2 (Power Cut):", t2['incident_type'])

# Test 3: Pipe Burst
t3 = evaluate_telemetry({"pressure": 0.4, "flow": 18.0, "current": 12.0, "voltage": 220})
print("Test 3 (Pipe Burst):", t3['incident_type'])