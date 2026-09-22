from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="JalSetu Engine", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NodeTelemetry(BaseModel):
    node_id: str
    lat: float
    lng: float
    pressure_bar: float
    flow_rate_lps: float
    status: str

@app.get("/api/telemetry/live", response_model=List[NodeTelemetry])
def get_live_telemetry():
    return [
        {
            "node_id": "PUMP_STATION_01",
            "lat": 19.8762,
            "lng": 75.3433,
            "pressure_bar": 3.8,
            "flow_rate_lps": 45.2,
            "status": "NORMAL"
        },
        {
            "node_id": "JUNCTION_VALVE_04",
            "lat": 19.8785,
            "lng": 75.3478,
            "pressure_bar": 0.6,
            "flow_rate_lps": 12.0,
            "status": "CRITICAL"
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True, app_dir="backend")