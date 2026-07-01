import os
import pandas as pd
import pytesseract
from PIL import Image

# ==========================================
# TESSERACT PATH
# ==========================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# ==========================================
# DATASET FOLDER
# ==========================================

DATASET_FOLDER = "dataset"

# ==========================================
# DEBUG INFO
# ==========================================

print("=" * 50)
print("Current Directory:")
print(os.getcwd())
print("=" * 50)

if not os.path.exists(DATASET_FOLDER):
    print(f"ERROR: '{DATASET_FOLDER}' folder not found!")
    exit()

print("Dataset Contents:")
print(os.listdir(DATASET_FOLDER))
print("=" * 50)

rows = []
total_images = 0

# ==========================================
# READ DATASET
# ==========================================

for category in os.listdir(DATASET_FOLDER):

    category_path = os.path.join(
        DATASET_FOLDER,
        category
    )

    if not os.path.isdir(category_path):
        continue

    print(f"\nProcessing Category: {category}")

    files = os.listdir(category_path)

    print(f"Found {len(files)} files")

    for file in files:

        if not file.lower().endswith(
            (".jpg", ".jpeg", ".png", ".webp")
        ):
            continue

        image_path = os.path.join(
            category_path,
            file
        )

        try:

            img = Image.open(image_path)

            text = pytesseract.image_to_string(img)

            text = text.replace("\n", " ")
            text = text.strip()

            rows.append([
                text,
                category
            ])

            total_images += 1

            print(f"Added: {file}")

        except Exception as e:

            print(f"Failed: {file}")
            print(e)

# ==========================================
# SAVE CSV
# ==========================================

df = pd.DataFrame(
    rows,
    columns=[
        "text",
        "category"
    ]
)

df.to_csv(
    "dataset.csv",
    index=False,
    encoding="utf-8"
)

# ==========================================
# RESULT
# ==========================================

print("\n" + "=" * 50)
print(f"Images Processed : {total_images}")
print(f"Rows Created     : {len(df)}")
print("Output File      : dataset.csv")
print("=" * 50)