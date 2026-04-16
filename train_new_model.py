import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, classification_report, mean_absolute_error, r2_score

# ============================
# LOAD DATA
# ============================

df = pd.read_csv("dataset/cleaned_dataset.csv")

# ----------------------------
# HANDLE WASTE CATEGORY
# ----------------------------

df = pd.get_dummies(df, columns=["waste_category"])

# ----------------------------
# FIX METHOD COLUMN (if needed)
# ----------------------------

df["method"] = df["method"].astype(str)

# ============================
# ADD REALISTIC ENERGY
# ============================

def get_efficiency(method):
    if "Anaerobic" in method:
        return 0.5
    elif "Incineration" in method:
        return 0.7
    elif "Pyrolysis" in method:
        return 0.75
    elif "Gasification" in method:
        return 0.72
    else:
        return 0.6

# Apply efficiency
df["eff_factor"] = df["method"].apply(get_efficiency)

# Convert HHV → realistic energy
df["energy_per_kg"] = df["HHV_MJ_kg"] * 0.2778 * df["eff_factor"]

# ============================
# FEATURES
# ============================

features = [
    "moisture_content_pct",
    "HHV_MJ_kg",
    "carbon_content_pct",
    "ash_content_pct",
    "volatile_matter_pct",
    "fixed_carbon_pct"
]

# Add waste category columns
waste_cols = [col for col in df.columns if "waste_category_" in col]
features.extend(waste_cols)

X = df[features]

# ============================
# TARGETS
# ============================

le = LabelEncoder()
y_class = le.fit_transform(df["method"])
y_reg = df["energy_per_kg"]

# ============================
# SPLIT
# ============================

X_train, X_test, y_train, y_test = train_test_split(
    X, y_class, test_size=0.2, random_state=42
)

X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
    X, y_reg, test_size=0.2, random_state=42
)

# ============================
# TRAIN MODELS
# ============================

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train_r, y_train_r)

# ============================
# EVALUATION
# ============================

print("\n🎯 Classification Results:")
y_pred = clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

print("\n📊 Regression Results:")
y_pred_r = reg.predict(X_test_r)
print("MAE:", mean_absolute_error(y_test_r, y_pred_r))
print("R2 Score:", r2_score(y_test_r, y_pred_r))

# ============================
# SAVE MODELS
# ============================

joblib.dump(clf, "models/method_model.pkl")
joblib.dump(reg, "models/energy_model.pkl")
joblib.dump(le, "models/label_encoder.pkl")
joblib.dump(features, "models/feature_columns.pkl")

print("\n✅ Models saved successfully!")