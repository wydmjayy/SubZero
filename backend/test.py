from logic import process_data

data = [
    {"merchant": "Netflix", "amount": 649, "recurring": True},
    {"merchant": "Spotify", "amount": 119, "recurring": True},
    {"merchant": "Gym", "amount": 999, "recurring": True, "last_used": "2023-12-01"},
    {"merchant": "LinkedIn Premium", "amount": 2600, "recurring": True}
]

result = process_data(data)

print(result)