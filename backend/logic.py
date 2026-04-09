# backend/logic.py
from datetime import datetime, timedelta
from collections import defaultdict

def process_data(transactions):
    
    # Step 1 — only recurring
    subscriptions = [t for t in transactions if t.get("recurring") == True]

    # Step 2 — total spend
    total_spend = sum(t["amount"] for t in subscriptions)

    # Step 3 — zombie detection
    zombies = detect_zombies(subscriptions)

    # Step 4 — duplicate detection  ← THIS WAS MISSING
    duplicates = detect_duplicates(subscriptions)

    # Step 5 — total savings
    zombie_savings = sum(z["amount"] for z in zombies)
    duplicate_savings = sum(d["savings"] for d in duplicates)

    return {
        "total_monthly_spend": total_spend,
        "subscription_count": len(subscriptions),
        "subscriptions": subscriptions,
        "zombie_subscriptions": zombies,        # renamed from 'waste'
        "duplicate_services": duplicates,        # this was missing
        "potential_savings": zombie_savings + duplicate_savings
    }


def detect_zombies(subscriptions):
    cutoff = datetime.now() - timedelta(days=60)
    zombies = []

    for t in subscriptions:
        if t.get("last_used"):
            last_used = datetime.strptime(t["last_used"], "%Y-%m-%d")
            days_inactive = (datetime.now() - last_used).days

            if days_inactive > 30:
                zombies.append({
                    "merchant": t["merchant"],
                    "amount": t["amount"],
                    "last_used": t["last_used"],
                    "days_inactive": days_inactive,
                    "reason": f"Not used for {days_inactive} days (since {t['last_used']})",
                    "savings_if_cancelled": t["amount"]
                })

    return zombies


def detect_duplicates(subscriptions):
    # Group by merchant name
    merchant_groups = defaultdict(list)
    for t in subscriptions:
        merchant_groups[t["merchant"]].append(t)

    duplicates = []
    for merchant, entries in merchant_groups.items():
        if len(entries) > 1:
            total_paid = sum(e["amount"] for e in entries)
            family_cost = round(total_paid * 0.6)
            saving = total_paid - family_cost

            duplicates.append({
                "merchant": merchant,
                "users": [e.get("user", "user_" + str(i)) 
                          for i, e in enumerate(entries)],
                "current_total": total_paid,
                "family_plan_cost": family_cost,
                "savings": saving,
                "action": f"Merge to {merchant} Family Plan — save ₹{saving}/month"
            })

    return duplicates


def get_spending_by_category(transactions):
    grouped = defaultdict(float)
    for t in transactions:
        if t.get("recurring"):
            grouped[t.get("category", "Other")] += t["amount"]
    return [{"category": k, "amount": round(v)} 
            for k, v in grouped.items()]