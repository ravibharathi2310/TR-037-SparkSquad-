import pandas as pd
import joblib

# ============================
# LOAD MODELS
# ============================

clf = joblib.load("models/method_model.pkl")
reg = joblib.load("models/energy_model.pkl")
le = joblib.load("models/label_encoder.pkl")
features = joblib.load("models/feature_columns.pkl")

# ============================
# INPUT (REAL TEST CASE)
# ============================

input_data = {
    "moisture_content_pct": 11.2,
    "HHV_MJ_kg": 13.8,
    "carbon_content_pct": 38.5,
    "ash_content_pct": 18.7,
    "volatile_matter_pct": 62.4,
    "fixed_carbon_pct": 18.9,
    "waste_category": "Organic"
}
volume = 5000  # kg (output from a small rice mill per day)

# ============================
# PREPROCESS INPUT
# ============================

df_input = pd.DataFrame([input_data])
df_input = pd.get_dummies(df_input)

# Add missing columns
for col in features:
    if col not in df_input.columns:
        df_input[col] = 0

df_input = df_input[features]

# ============================
# PREDICTIONS
# ============================

# Method
method_encoded = clf.predict(df_input)
method = le.inverse_transform(method_encoded)[0]

# Energy per kg
energy_per_kg = reg.predict(df_input)[0]

# Total energy
total_energy = energy_per_kg * volume

# Efficiency calculation
theoretical_energy = input_data["HHV_MJ_kg"] * 0.2778
efficiency = (energy_per_kg / theoretical_energy) * 100

# ============================
# OUTPUT
# ============================

print("\n🔍 Prediction Result:")
print("Waste Type:", input_data["waste_category"])
print("Recommended Method:", method)
print("Energy per kg (kWh):", round(energy_per_kg, 3))
print("Total Energy (kWh):", round(total_energy, 2))
print("Efficiency (%):", round(efficiency, 2))