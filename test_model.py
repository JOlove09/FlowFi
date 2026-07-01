import joblib

model = joblib.load("expense_classifier.pkl")

tests = [
    "BMTC BUS KA57F0280",
    "IRCTC ticket booking",
    "Dell laptop invoice",
    "OPPO MOBILES INDIA",
    "TATA 1mg Pharmacy",
    "Health records bill",
    "Zomato order",
    "Swiggy Instamart",
    "Electricity Bill BESCOM",
    "Consumer No Electricity Payment"
]

for t in tests:
    pred = model.predict([t])[0]
    print(f"{t}  -->  {pred}")