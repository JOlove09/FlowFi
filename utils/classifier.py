import pickle
import re

# =========================
# LOAD ML MODEL
# =========================
with open("expense_classifier.pkl", "rb") as file:
    model = pickle.load(file)


# =========================
# EXTRACT AMOUNT
# =========================
def extract_amount(text):

    text = text.lower()

    # PRIORITY KEYWORDS
    priority_keywords = [
        "total paid",
        "net payable",
        "grand total",
        "amount paid",
        "final amount",
        "bill amount",
        "total amount",
        "payable amount",
        "net amount",
        "invoice amount",
        "total",
        "payable",
    ]

    lines = text.split("\n")

    possible_amounts = []

    # =========================
    # SEARCH NEAR KEYWORDS
    # =========================
    for line in lines:

        clean_line = line.lower()

        if any(keyword in clean_line for keyword in priority_keywords):

            # FIND NUMBERS
            amounts = re.findall(r"\d[\d,]*\.?\d*", line)

            for amt in amounts:

                try:

                    value = float(amt.replace(",", ""))

                    # FILTER BAD VALUES
                    if 20 <= value <= 100000:
                        possible_amounts.append(value)

                except:
                    pass

    # =========================
    # RETURN BEST AMOUNT
    # =========================
    if possible_amounts:

        # usually bill total is biggest near keywords
        final_amount = max(possible_amounts)

        print("FINAL AMOUNT:", final_amount)

        return final_amount

    # =========================
    # FALLBACK METHOD
    # =========================
    all_amounts = re.findall(r"\d[\d,]*\.?\d*", text)

    valid = []

    for amt in all_amounts:

        try:

            value = float(amt.replace(",", ""))

            if 20 <= value <= 100000:
                valid.append(value)

        except:
            pass

    if valid:

        final_amount = max(valid)

        print("FALLBACK AMOUNT:", final_amount)

        return final_amount

    return 0


# =========================
# PREDICT CATEGORY
# =========================
def predict_category(text):

    text = text.lower()

    # RULE-BASED BOOSTING
    if any(word in text for word in [
        "uber",
        "ola",
        "rapido",
        "petrol",
        "fuel",
        "bus",
        "train",
        "flight",
        "cab",
        "taxi",
    ]):
        return "Travel"

    if any(word in text for word in [
        "zomato",
        "swiggy",
        "restaurant",
        "pizza",
        "burger",
        "food",
        "cafe",
        "hotel",
    ]):
        return "Food"

    if any(word in text for word in [
        "apollo",
        "pharmacy",
        "hospital",
        "medicine",
        "tablet",
        "doctor",
        "medical",
    ]):
        return "Medical"

    if any(word in text for word in [
        "amazon",
        "flipkart",
        "shopping",
        "shirt",
        "shoe",
        "mall",
    ]):
        return "Shopping"

    # ML MODEL PREDICTION
    try:

        prediction = model.predict([text])[0]

        return prediction

    except Exception as e:

        print("Prediction Error:", e)

        return "Other"