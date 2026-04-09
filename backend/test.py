# backend/test.py
from logic import process_data

sample = [
    {"merchant": "Netflix", "amount": 649, "recurring": True,
     "user": "rahul@email.com", "category": "OTT"},

    {"merchant": "Netflix", "amount": 649, "recurring": True,
     "user": "roommate@email.com", "category": "OTT"},  # ← TWO Netflix rows

    {"merchant": "Spotify", "amount": 119, "recurring": True,
     "category": "Music"},

    {"merchant": "CultFit", "amount": 999, "recurring": True,
     "last_used": "2023-12-01", "category": "Health"},

    {"merchant": "LinkedIn Premium", "amount": 2600, "recurring": True,
     "last_used": "2024-01-15", "category": "Professional"},
]

result = process_data(sample)

print("=== M3 LOGIC TEST ===")
print(f"Total spend:       ₹{result['total_monthly_spend']}")
print(f"Subscriptions:     {result['subscription_count']}")
print(f"Zombies:           {len(result['zombie_subscriptions'])}")
print(f"Duplicates:        {len(result['duplicate_services'])}")
print(f"Potential savings: ₹{result['potential_savings']}")

print("\n--- Zombies ---")
for z in result['zombie_subscriptions']:
    print(f"  {z['merchant']}: {z['reason']}")

print("\n--- Duplicates ---")
for d in result['duplicate_services']:
    print(f"  {d['merchant']}: {d['action']}")