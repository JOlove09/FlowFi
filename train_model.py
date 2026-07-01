import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.naive_bayes import MultinomialNB

from sklearn.pipeline import Pipeline

import joblib

# ==========================================
# LOAD DATASET
# ==========================================

data = pd.read_csv(
    "dataset.csv"
)

# ==========================================
# INPUT + OUTPUT
# ==========================================

X = data["text"]

y = data["category"]

# ==========================================
# CREATE MODEL
# ==========================================

model = Pipeline([

    ("tfidf", TfidfVectorizer(
    stop_words="english",
    lowercase=True,
    ngram_range=(1,2),
    min_df=2
)),

    ("classifier", MultinomialNB())

])

# ==========================================
# TRAIN MODEL
# ==========================================

model.fit(X, y)

# ==========================================
# SAVE MODEL
# ==========================================

joblib.dump(
    model,
    "expense_classifier.pkl"
)

print("MODEL TRAINED SUCCESSFULLY")