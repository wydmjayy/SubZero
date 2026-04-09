# main.py — tell M2 to update the analyze endpoint
from logic import process_data, get_spending_by_category

@app.post("/analyze")
def analyze():
    from data import load_transactions   # M2 creates data.py
    transactions = load_transactions()
    return process_data(transactions)

@app.get("/categories")
def categories():
    from data import load_transactions
    transactions = load_transactions()
    return get_spending_by_category(transactions)
    