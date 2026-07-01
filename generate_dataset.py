import os
import csv
import cv2
import pytesseract

# ==========================================
# TESSERACT PATH
# ==========================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# ==========================================
# DATASET FOLDER
# ==========================================

DATASET_DIR = "dataset"

# ==========================================
# OUTPUT CSV
# ==========================================

OUTPUT_FILE = "expenses.csv"

rows = []

# ==========================================
# READ DATASET
# ==========================================

for category in os.listdir(DATASET_DIR):

    category_path = os.path.join(
        DATASET_DIR,
        category
    )

    if not os.path.isdir(category_path):
        continue

    for filename in os.listdir(category_path):

        image_path = os.path.join(
            category_path,
            filename
        )

        try:

            img = cv2.imread(image_path)

            text = pytesseract.image_to_string(img)

            text = text.replace("\n", " ")

            rows.append([
                text,
                category
            ])

            print(f"DONE: {filename}")

        except Exception as e:

            print(f"ERROR: {filename}")
            print(e)

# ==========================================
# SAVE CSV
# ==========================================

with open(
    OUTPUT_FILE,
    "w",
    newline="",
    encoding="utf-8"
) as f:

    writer = csv.writer(f)

    writer.writerow([
        "text",
        "category"
    ])

    writer.writerows(rows)

print("\nDATASET CREATED")