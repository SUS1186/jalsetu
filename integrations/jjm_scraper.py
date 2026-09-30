"""
integrations/jjm_scraper.py
Scrapes official national and state-level tap water telemetry baselines
from the Jal Jeevan Mission IMIS portal (ejalshakti.gov.in).
"""

import re
import urllib3
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List

# Suppress SSL certificate warnings common with government portals
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

JJM_DASHBOARD_URL = "https://ejalshakti.gov.in/jjmreport/JJMIndia.aspx"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://ejalshakti.gov.in/",
}


def clean_number(text: str) -> int:
    """Converts Indian numbering formatted strings (e.g., '19,35,45,173') to int."""
    cleaned = re.sub(r"[^\d]", "", text)
    return int(cleaned) if cleaned else 0


def clean_percentage(text: str) -> float:
    """Extracts floating point percentage values (e.g., '82.43%')."""
    match = re.search(r"(\d+(\.\d+)?)", text)
    return float(match.group(1)) if match else 0.0


def scrape_jjm_national_metrics() -> Dict[str, Any]:
    """
    Scrapes the primary national summary cards from the JJM IMIS homepage.
    """
    try:
        response = requests.get(
            JJM_DASHBOARD_URL,
            headers=HEADERS,
            timeout=10,
            verify=False
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        print(f"[JJM Scraper] Failed to connect to official portal: {exc}")
        # Return fallback values mirroring current IMIS status
        return {
            "source": "JJM IMIS (Cached Baseline Fallback)",
            "status": "OFFLINE_CACHE",
            "total_households": 193545173,
            "connections_baseline_2019": 32362838,
            "connections_baseline_pct": 16.72,
            "remaining_households": 161182335,
            "connections_provided_since_launch": 127183600,
            "connections_provided_pct": 78.91,
            "total_functional_connections": 159546438,
            "national_coverage_pct": 82.43,
        }

    soup = BeautifulSoup(response.text, "html.parser")
    metrics: Dict[str, Any] = {
        "source": JJM_DASHBOARD_URL,
        "status": "LIVE",
    }

    # Strategy 1: Targeted ASP.NET / CSS class extraction
    # The portal renders counters inside stat cards, span tags, or specific labels
    text_content = soup.get_text()

    # Regex patterns targeting the dashboard summary fields
    patterns = {
        "total_households": r"Total\s*number\s*of\s*households.*?([\d,]{8,})",
        "connections_baseline_2019": r"Households\s*with\s*tap\s*water\s*connections\s*as\s*on\s*15\s*Aug\s*2019.*?([\d,]{7,})",
        "remaining_households": r"Remaining\s*households.*?([\d,]{7,})",
        "connections_provided_since_launch": r"connections\s*since\s*launch.*?([\d,]{7,})",
        "total_functional_connections": r"connections\s*as\s*on\s*date.*?([\d,]{7,})",
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, text_content, re.IGNORECASE | re.DOTALL)
        if match:
            metrics[key] = clean_number(match.group(1))

    # Parse percentages from span/badge elements
    pct_matches = re.findall(r"\(\s*(\d+(?:\.\d+)?)\s*%\s*\)", text_content)
    if len(pct_matches) >= 2:
        metrics["connections_baseline_pct"] = float(pct_matches[0])
        metrics["national_coverage_pct"] = float(pct_matches[-1])
    else:
        metrics["national_coverage_pct"] = round(
            (metrics.get("total_functional_connections", 0) /
             metrics.get("total_households", 1)) * 100, 2
        )

    return metrics


def scrape_state_coverage_table() -> List[Dict[str, Any]]:
    """
    Extracts state-wise functional tap water connection statistics from the summary table.
    """
    try:
        response = requests.get(
            JJM_DASHBOARD_URL,
            headers=HEADERS,
            timeout=10,
            verify=False
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        print(f"[JJM Scraper] Failed to fetch state table: {exc}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    state_records = []

    # Locate the state-wise data table
    table = soup.find("table", {"id": re.compile(r"gvState|tableState|Grid", re.IGNORECASE)})
    if not table:
        tables = soup.find_all("table")
        table = tables[0] if tables else None

    if not table:
        return state_records

    rows = table.find_all("tr")
    for row in rows[1:]:  # Skip header row
        cols = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cols) >= 5:
            state_name = cols[1] if cols[0].isdigit() else cols[0]
            state_records.append({
                "state_name": state_name,
                "total_households": clean_number(cols[2]),
                "fhtc_connections": clean_number(cols[3]),
                "coverage_pct": clean_percentage(cols[-1])
            })

    return state_records


if __name__ == "__main__":
    print("--- Scraping JJM-IMIS National Dashboard ---")
    national_data = scrape_jjm_national_metrics()
    for k, v in national_data.items():
        print(f"{k}: {v}")

    print("\n--- Scraping State-Wise Coverage Records (First 5) ---")
    states = scrape_state_coverage_table()
    for record in states[:5]:
        print(record)