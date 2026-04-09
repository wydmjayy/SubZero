# logic.py

def process_data(data):
    subscriptions = detect_subscriptions(data)
    total = calculate_total(subscriptions)
    waste = detect_waste(subscriptions)

    return {
        "subscriptions": subscriptions,
        "total_spending": total,
        "waste": waste
    }

def detect_subscriptions(data):
    subscriptions = []

    for item in data:
        if item.get("recurring", False):
            subscriptions.append(item)

    return subscriptions

def calculate_total(data):
    total = 0

    for item in data:
        total += item["amount"]

    return total

from datetime import datetime

def detect_waste(data):
    waste = []

    for item in data:
        reason = None

        # Rule 1: High cost
        if item["amount"] > 1000:
            reason = "High cost subscription"

        # Rule 2: Not used recently
        if "last_used" in item:
            last_used = datetime.strptime(item["last_used"], "%Y-%m-%d")
            days_unused = (datetime.now() - last_used).days

            if days_unused > 60:
                reason = f"Not used for {days_unused} days"

        if reason:
            waste.append({
                "merchant": item["merchant"],
                "amount": item["amount"],
                "reason": reason
            })

    return waste
