import pandas as pd
import joblib

# Load models
clf = joblib.load("models/method_model.pkl")
reg = joblib.load("models/energy_model.pkl")
le = joblib.load("models/label_encoder.pkl")
features = joblib.load("models/feature_columns.pkl")

# -----------------------------
# INPUT
# -----------------------------

input_data = {
    "moisture_content_pct": 52.6,
    "HHV_MJ_kg": 6.9,
    "carbon_content_pct": 29.4,
    "ash_content_pct": 21.3,
    "volatile_matter_pct": 51.8,
    "fixed_carbon_pct": 26.9,
    "waste_category": "MSW"
}
volume = 12000

# -----------------------------
# Convert to DataFrame
# -----------------------------

df_input = pd.DataFrame([input_data])

# One-hot encode waste_category
df_input = pd.get_dummies(df_input)

# Ensure all training columns exist
for col in features:
    if col not in df_input.columns:
        df_input[col] = 0

df_input = df_input[features]

# -----------------------------
# PREDICTIONS
# -----------------------------

# Method
method_encoded = clf.predict(df_input)
method = le.inverse_transform(method_encoded)

# Energy per kg
energy_per_kg = reg.predict(df_input)[0]

# Total energy
total_energy = energy_per_kg * volume

# Efficiency
theoretical_energy = input_data["HHV_MJ_kg"] * 0.2778
efficiency = (energy_per_kg / theoretical_energy) * 100

# -----------------------------
# OUTPUT
# -----------------------------

print("\n🔍 Prediction Result:")
print("Waste Type:", input_data["waste_category"])
print("Recommended Method:", method[0])
print("Energy per kg (kWh):", round(energy_per_kg, 3))
print("Total Energy (kWh):", round(total_energy, 2))
print("Efficiency (%):", round(efficiency, 2))