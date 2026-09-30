"""
JalSetu Multilingual Advisory & Alert Engine (Bhashini Pipeline)
Generates localized community push notifications and emergency alerts.
"""
from typing import Dict, Any


def generate_supply_schedule_alert(
    village_name: str,
    pumping_window: str,
    target_cluster: str,
    language: str = "mr"
) -> Dict[str, str]:
    """Generates scheduled water supply window broadcasts for Gram Panchayat SMS/WhatsApp."""
    templates = {
        "en": (
            f"[JalSetu JJM Notice] Water supply for {village_name} ({target_cluster}) "
            f"is scheduled today from {pumping_window}. Please store adequate potable water."
        ),
        "mr": (
            f"[जलसेतू जेजेएम सूचना] {village_name} ({target_cluster}) साठी आज "
            f"पाणीपुरवठा वेळ {pumping_window} निश्चित करण्यात आली आहे. कृपया पिण्याचे पाणी साठवून घ्यावे."
        ),
        "hi": (
            f"[जलसेतु जेजेएम सूचना] {village_name} ({target_cluster}) के लिए आज "
            f"पेयजल आपूर्ति समय {pumping_window} निर्धारित किया गया है। कृपया आवश्यक जल संचय करें।"
        )
    }
    return {
        "language": language,
        "message": templates.get(language, templates["en"]),
        "channel": "SMS_WHATSAPP_BROADCAST"
    }


def generate_critical_incident_alert(
    asset_id: str,
    incident_type: str,
    action_required: str,
    contractor_sla_hours: int,
    language: str = "mr"
) -> Dict[str, str]:
    """Generates automated escalation tickets dispatched to VWSC & the assigned contractor."""
    templates = {
        "en": (
            f"[CRITICAL ESCALATION] Rupture detected on {asset_id}. Fault: {incident_type}. "
            f"Required Action: {action_required}. Contractor SLA Clock: {contractor_sla_hours}h to avoid penalty."
        ),
        "mr": (
            f"[तातडीची सूचना] {asset_id} वर जलवाहिनी फुटल्याचे आढळले आहे. दोष: {incident_type}. "
            f"कृती: {action_required}. कंत्राटदार दुरुस्ती मुदत: दंड टाळण्यासाठी {contractor_sla_hours} तास."
        ),
        "hi": (
            f"[अति आवश्यक सूचना] {asset_id} पर पाइपलाइन टूटने की पुष्टि हुई है। समस्या: {incident_type}। "
            f"आवश्यक कदम: {action_required}। ठेकेदार मरम्मत समय सीमा: दंड से बचने हेतु {contractor_sla_hours} घंटे।"
        )
    }
    return {
        "language": language,
        "message": templates.get(language, templates["en"]),
        "channel": "CONTRACTOR_ESCALATION_RELAY"
    }