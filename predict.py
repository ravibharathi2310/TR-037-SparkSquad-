import pandas as pd
import joblib

# -----------------------------
# 1. Load Saved Models
# -----------------------------
energy_model = joblib.load("energy_model.pkl")
method_model = joblib.load("method_model.pkl")
emission_model = joblib.load("emission_model.pkl")

# Load encoders
le_waste = joblib.load("waste_encoder.pkl")
le_method = joblib.load("method_encoder.pkl")

print("✅ Models loaded successfully!")

# -----------------------------
# 2. User Input
# -----------------------------
# You can change these values
waste = input("Enter waste type (Organic/Plastic/Metal/Glass/Paper/Mixed): ")
volume = float(input("Enter volume (kg): "))

# -----------------------------
# 3. Encode Input
# -----------------------------
try:
    waste_enc = le_waste.transform([waste])[0]
except:
    print("❌ Invalid waste type!")
    exit()

sample = pd.DataFrame(
    [[waste_enc, volume]],
    columns=["waste_type_enc", "volume"]
)

# -----------------------------
# 4. Predictions
# -----------------------------
energy_per_kg = energy_model.predict(sample)[0]
method_enc = method_model.predict(sample)[0]
emission_per_kg = emission_model.predict(sample)[0]

# Decode method
method = le_method.inverse_transform([method_enc])[0]

# -----------------------------
# 5. Final Calculations
# -----------------------------
total_energy = volume * energy_per_kg
total_emission = volume * emission_per_kg

efficiency = (total_energy / (total_energy + total_emission)) * 100

# -----------------------------
# 6. Output Results
# -----------------------------
print("\n🔍 Prediction Result")
print("----------------------------")
print(f"Waste Type: {waste}")
print(f"Volume: {volume} kg")
print(f"Recommended Method: {method}")
print(f"Energy per kg: {round(energy_per_kg, 4)} kWh/kg")
print(f"Total Energy: {round(total_energy, 2)} kWh")
print(f"Estimated Efficiency: {round(efficiency, 2)} %")