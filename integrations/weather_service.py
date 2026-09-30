import urllib.request
import json
import time

CACHE = {"data": None, "last_fetch": 0}
CACHE_TTL = 300  # Cache for 5 minutes

def get_live_weather(lat: float = 19.8762, lng: float = 75.3433) -> dict:
    now = time.time()
    if CACHE["data"] and (now - CACHE["last_fetch"] < CACHE_TTL):
        return CACHE["data"]

    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "JalSetu-Core/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            raw = json.loads(resp.read().decode())
            current = raw.get("current", {})
            result = {
                "temperature_c": current.get("temperature_2m", 28.0),
                "precipitation_mm": current.get("precipitation", 0.0),
                "humidity_pct": current.get("relative_humidity_2m", 55),
                "is_monsoon_surge": current.get("precipitation", 0.0) > 10.0
            }
            CACHE["data"] = result
            CACHE["last_fetch"] = now
            return result
    except Exception as err:
        print(f"[Weather Ingestion] Live fetch failed, using fallback: {err}")
        return {
            "temperature_c": 28.5,
            "precipitation_mm": 0.0,
            "humidity_pct": 52,
            "is_monsoon_surge": False
        }