import pandas as pd
import joblib

# Load models
clf = joblib.load("method_model.pkl")
reg = joblib.load("energy_model.pkl")
le = joblib.load("label_encoder.pkl")
features = joblib.load("feature_columns.pkl")

# -----------------------------
# INPUT
# -----------------------------

input_data = {
    "moisture_content_pct": 9.8,
    "HHV_MJ_kg": 16.2,
    "carbon_content_pct": 46.1,
    "ash_content_pct": 7.4,
    "volatile_matter_pct": 77.3,
    "fixed_carbon_pct": 15.3,
    "waste_category": "Paper"
}
volume = 3500  # kg (daily paper waste from a commercial/office complex)

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