import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score

# -----------------------------
# 1. Load Dataset
# -----------------------------
df = pd.read_csv("dataset/waste_to_energy_10000.csv")

print("📊 Dataset Loaded")
print(df.head())

# -----------------------------
# 2. Add Emission Column (if not present)
# -----------------------------
# If your dataset already has emission_per_kg, skip this
if "emission_per_kg" not in df.columns:
    # Simple approximation (you can improve later)
    df["emission_per_kg"] = df["energy_per_kg"] * np.random.uniform(0.3, 0.8, size=len(df))

# -----------------------------
# 3. Encode Categorical Data
# -----------------------------
le_waste = LabelEncoder()
le_method = LabelEncoder()

df["waste_type_enc"] = le_waste.fit_transform(df["waste_type"])
df["method_enc"] = le_method.fit_transform(df["method"])

# -----------------------------
# 4. Features & Targets
# -----------------------------
X = df[["waste_type_enc", "volume"]]

y_energy = df["energy_per_kg"]
y_method = df["method_enc"]
y_emission = df["emission_per_kg"]

# -----------------------------
# 5. Train-Test Split
# -----------------------------
X_train, X_test, y_energy_train, y_energy_test = train_test_split(
    X, y_energy, test_size=0.2, random_state=42
)

_, _, y_method_train, y_method_test = train_test_split(
    X, y_method, test_size=0.2, random_state=42
)

_, _, y_emission_train, y_emission_test = train_test_split(
    X, y_emission, test_size=0.2, random_state=42
)

# -----------------------------
# 6. Train Energy Model
# -----------------------------
energy_model = RandomForestRegressor(n_estimators=100, random_state=42)
energy_model.fit(X_train, y_energy_train)

y_energy_pred = energy_model.predict(X_test)

print("\n📊 Energy Model:")
print("MAE:", round(mean_absolute_error(y_energy_test, y_energy_pred), 4))
print("R2:", round(r2_score(y_energy_test, y_energy_pred), 4))

# -----------------------------
# 7. Train Method Model
# -----------------------------
method_model = RandomForestClassifier(n_estimators=100, random_state=42)
method_model.fit(X_train, y_method_train)

y_method_pred = method_model.predict(X_test)

print("\n🎯 Method Model:")
print("Accuracy:", round(accuracy_score(y_method_test, y_method_pred), 4))

# -----------------------------
# 8. Train Emission Model
# -----------------------------
emission_model = RandomForestRegressor(n_estimators=100, random_state=42)
emission_model.fit(X_train, y_emission_train)

y_emission_pred = emission_model.predict(X_test)

print("\n🌫️ Emission Model:")
print("MAE:", round(mean_absolute_error(y_emission_test, y_emission_pred), 4))
print("R2:", round(r2_score(y_emission_test, y_emission_pred), 4))

# -----------------------------
# 9. Sample Prediction (FULL SYSTEM)
# -----------------------------
print("\n🔍 Sample Prediction:")

sample_waste = "Mixed"
sample_volume = 780

waste_encoded = le_waste.transform([sample_waste])[0]

sample_input = pd.DataFrame(
    [[waste_encoded, sample_volume]],
    columns=["waste_type_enc", "volume"]
)

# Predictions
energy_per_kg = energy_model.predict(sample_input)[0]
method_enc = method_model.predict(sample_input)[0]
emission_per_kg = emission_model.predict(sample_input)[0]

method = le_method.inverse_transform([method_enc])[0]

# Final calculations
total_energy = sample_volume * energy_per_kg
total_emission = sample_volume * emission_per_kg

efficiency = (total_energy / (total_energy + total_emission)) * 100

print(f"Waste: {sample_waste}")
print(f"Volume: {sample_volume} kg")
print(f"Method: {method}")
print(f"Energy/kg: {round(energy_per_kg, 4)}")
print(f"Total Energy: {round(total_energy, 2)} kWh")
print(f"Efficiency: {round(efficiency, 2)} %")

# -----------------------------
# 10. Save Models & Encoders
# -----------------------------
joblib.dump(energy_model, "models/energy_model.pkl")
joblib.dump(method_model, "models/method_model.pkl")
joblib.dump(emission_model, "models/emission_model.pkl")

joblib.dump(le_waste, "models/waste_encoder.pkl")
joblib.dump(le_method, "models/method_encoder.pkl")

print("\nAll models saved successfully!")