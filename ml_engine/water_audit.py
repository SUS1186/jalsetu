def calculate_mass_balance_loss(source_flow_lps: float, sum_consumer_flow_lps: float) -> dict:
    """
    Calculates Non-Revenue Water (NRW) loss across a village distribution zone.
    """
    if source_flow_lps <= 0:
        return {"loss_lps": 0.0, "loss_percentage": 0.0, "audit_status": "NO_FLOW"}
    
    unaccounted_loss = source_flow_lps - sum_consumer_flow_lps
    loss_percentage = round((unaccounted_loss / source_flow_lps) * 100, 2)
    
    if loss_percentage > 20.0:
        severity = "HIGH_UNACCOUNTED_LOSS"
    elif loss_percentage > 10.0:
        severity = "MODERATE_LEAKAGE"
    else:
        severity = "ACCEPTABLE_DISTRIBUTION"
        
    return {
        "source_supply_lps": source_flow_lps,
        "total_consumed_lps": sum_consumer_flow_lps,
        "water_loss_lps": round(unaccounted_loss, 2),
        "loss_percentage": max(loss_percentage, 0.0),
        "audit_status": severity
    }