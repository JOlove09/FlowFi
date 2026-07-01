from datetime import date

from flask import Flask, request, jsonify
from flask_cors import CORS

import pytesseract
import cv2
import numpy as np
import base64
import re
import joblib
from dateutil import parser

# ==========================================
# TESSERACT PATH
# ==========================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# ==========================================
# LOAD ML MODEL
# ==========================================

model = joblib.load(
    "expense_classifier.pkl"
)

# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)
CORS(app)

# ==========================================
# CATEGORY PREDICTION
# ==========================================

def predict_category(text):

    text_lower = text.lower()

# ==========================================
# TRAVEL
# ==========================================

    travel_keywords = [
        "bmtc",
        "irctc",
        "uber",
        "ola",
        "metro",
        "makemytrip",
        "redbus",
        "bus",
        "train",
        "flight",
        "ride details",
        "auto"
    ]

    if any(k in text_lower for k in travel_keywords):
        return "travel"

# ==========================================
# FOOD
# ==========================================

    food_keywords = [
        "zomato",
        "swiggy",
        "instamart",
        "restaurant",
        "burger king",
        "pizza",
        "food"
    ]

    if any(k in text_lower for k in food_keywords):
        return "food"

# ==========================================
# MEDICAL
# ==========================================

    medical_keywords = [
        "1mg",
        "pharmacy",
        "medical",
        "hospital",
        "doctor",
        "health",
        "capsule",
        "tablet"
    ]

    if any(k in text_lower for k in medical_keywords):
        return "Medical"

# ==========================================
# ELECTRICITY
# ==========================================

    electricity_keywords = [
        "electricity",
        "bescom",
        "consumer no",
        "kwh",
        "power bill"
    ]

    if any(k in text_lower for k in electricity_keywords):
        return "electricity"

# ==========================================
# SHOPPING
# ==========================================

    shopping_keywords = [
        "amazon",
        "flipkart",
        "dell",
        "oppo",
        "apple",
        "myntra"
    ]

    if any(k in text_lower for k in shopping_keywords):
        return "shopping"

    # ==========================================
    # ML FALLBACK
    # ==========================================

    try:

        prediction = model.predict([text])

        return prediction[0]

    except Exception as e:

        print("CATEGORY ERROR:", e)

        return "other"

    # ==========================================
    # ML MODEL
    # ==========================================

    try:

        prediction = model.predict([text])

        return prediction[0]

    except Exception as e:

        print("CATEGORY ERROR:", e)

        return "Other"

# ==========================================
# SMART AMOUNT EXTRACTION
# ==========================================

def extract_amount(text):

    text_lower = text.lower()

    lines = text_lower.split("\n")

    priority_keywords = [

        "grand total",
        "total paid",
        "net payable",
        "net amount",
        "invoice value",
        "bill amount",
        "amount paid",
        "final amount",
        "invoice total",
        "total amount",
        "total",
        "paid",
        "amount"

    ]

    candidate_amounts = []

    # ==========================================
    # STEP 1
    # SEARCH NEAR KEYWORDS
    # ==========================================

    text_lower = text_lower.replace("₹", "")
    text_lower = text_lower.replace("¥", "")
    text_lower = text_lower.replace("%", "")

    for keyword in priority_keywords:

        for line in lines:

            if keyword in line:

                nums = re.findall(
                    r"\d[\d,]*\.?\d*",
                    line
                )

                for n in nums:

                    try:

                        value = float(
                            n.replace(",", "")
                        )

                        # Ignore bad values

                        if (
                            10 <= value <= 100000
                        ):

                            candidate_amounts.append(
                                value
                            )

                    except:
                        pass

    print("\nCANDIDATE AMOUNTS:")
    print(candidate_amounts)

    # ==========================================
    # BEST MATCH
    # ==========================================

    for line in lines:

     if "grand total" in line:

        nums = re.findall(
            r"\d[\d,]*\.?\d*",
            line
        )

        if nums:

            return float(
                nums[-1].replace(",", "")
            )

    if candidate_amounts:

        return max(candidate_amounts)

    # ==========================================
    # STEP 2
    # FALLBACK
    # ==========================================

    nums = re.findall(
        r"\d[\d,]*\.?\d*",
        text
    )

    values = []

    for n in nums:

        try:

            value = float(
                n.replace(",", "")
            )

            # Ignore years

            if (
                value in [
                    2023,
                    2024,
                    2025,
                    2026,
                    2027,
                    2028
                ]
            ):

                continue

            # Ignore phone numbers

            if value > 999999:

                continue

            # Reasonable bill range

            if 10 <= value <= 100000:

                values.append(value)

        except:
            pass

    print("\nALL VALUES:")
    print(values)

    if values:

        # Prefer rounded numbers

        rounded = [

            v for v in values

            if v % 1 == 0
        ]

        if rounded:

            return max(rounded)

        return max(values)

    return 0
def extract_date(text):

    # ==========================================
    # STEP 1
    # Look for explicit dates like:
    # 24 Jan 2026
    # 27 January 2026
    # ==========================================

    month_pattern = re.search(
        r"\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b",
        text,
        re.IGNORECASE
    )

    if month_pattern:

        try:

            dt = parser.parse(
                month_pattern.group(),
                dayfirst=True
            )

            return dt.strftime("%d-%m-%Y")

        except:
            pass

    # ==========================================
    # STEP 2
    # Look for dates like:
    # 30/04/26
    # 30-04-2026
    # ==========================================

    numeric_pattern = re.search(
        r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
        text
    )

    if numeric_pattern:

        try:

            dt = parser.parse(
                numeric_pattern.group(),
                dayfirst=True
            )

            return dt.strftime("%d-%m-%Y")

        except:
            pass

    # ==========================================
    # STEP 3
    # Search lines containing "date"
    # ==========================================

    for line in text.split("\n"):

        if "date" in line.lower():

            try:

                dt = parser.parse(
                    line,
                    fuzzy=True,
                    dayfirst=True
                )

                if 2000 <= dt.year <= 2100:

                    return dt.strftime(
                        "%d-%m-%Y"
                    )

            except:
                pass

    return ""
# ==========================================
# OCR FUNCTION
# ==========================================

def extract_text(img):

    gray = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2GRAY
    )

    # Resize for better OCR

    gray = cv2.resize(
        gray,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    # Blur

    gray = cv2.GaussianBlur(
        gray,
        (3, 3),
        0
    )

    # Threshold

    gray = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2
    )

    # Save debug image

    cv2.imwrite(
        "debug_receipt.jpg",
        gray
    )

    
    # OCR TEST

    original_gray = cv2.cvtColor(
    img,
    cv2.COLOR_BGR2GRAY
)

    original_gray = cv2.resize(
        original_gray,
        None,
        fx=4,
        fy=4,
        interpolation=cv2.INTER_CUBIC
    )

    text4 = pytesseract.image_to_string(
        original_gray,
        config="--oem 3 --psm 4"
    )

    print("\n========== PSM 4 ==========\n")
    print(text4)

    print("\nUSING PSM 4\n")

    return text4

"""
    text6 = pytesseract.image_to_string(
        gray,
        config="--oem 3 --psm 6"
    )

    text11 = pytesseract.image_to_string(
        gray,
        config="--oem 3 --psm 11"
    )

    print("\n========== PSM 6 ==========\n")
    print(text6)

    print("\n========== PSM 11 ==========\n")
    print(text11)
"""

    # Prefer OCR that contains Grand Total + an amount
"""
    if re.search(
        r"grand\s*total.*\d",
        text4,
        re.IGNORECASE
    ):

        print("\nUSING PSM 4\n")

        return text4
   
    if re.search(
        r"grand\s*total.*\d",
        text6,
        re.IGNORECASE
    ):

        print("\nUSING PSM 6\n")

        return text6
    
    # fallback

    if len(text6) > len(text4):

        print("\nUSING PSM 6 (fallback)\n")

        return text6
"""

# ==========================================
# MAIN API
# ==========================================

@app.route("/scan-bill", methods=["POST"])
def scan_bill():

    try:

        data = request.json

        if not data or "image" not in data:

            return jsonify({

                "success": False,

                "error": "No image found"

            }), 400

        # ==========================================
        # BASE64 IMAGE
        # ==========================================

        image_data = data["image"]

        if "," in image_data:

            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(
            image_data
        )

        np_arr = np.frombuffer(
            image_bytes,
            np.uint8
        )

        img = cv2.imdecode(
            np_arr,
            cv2.IMREAD_COLOR
        )

        cv2.imwrite("incoming.jpg", img)

        if img is None:

            return jsonify({

                "success": False,

                "error": "Image decode failed"

            }), 400

        print("\nIMAGE RECEIVED")

        # ==========================================
        # OCR
        # ==========================================

        text = extract_text(img)

        print("\n========== OCR TEXT ==========\n")

        print(text)

        # ==========================================
        # AMOUNT
        # ==========================================

        amount = extract_amount(text)

        amount = round(amount, 2)

        date = extract_date(text)

        print("\nDATE:")
        print(date)

        print("\nFINAL AMOUNT:")
        print(amount)

        # ==========================================
        # CATEGORY
        # ==========================================

        category = predict_category(text)

        print("\nCATEGORY:")
        print(category)

        # ==========================================
        # RESPONSE
        # ==========================================

        return jsonify({

            "success": True,

            "amount": amount,

            "category": category,

             "date": date,

            "raw_text": text

        })

    except Exception as e:

        print("\nERROR:")
        print(str(e))

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500

# ==========================================
# RUN APP
# ==========================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )