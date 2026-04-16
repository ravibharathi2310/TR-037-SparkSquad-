import pandas as pd
import numpy as np
import random

# -----------------------------
# 1. Config
# -----------------------------
n = 10000

waste_types = ["Organic", "Plastic", "Metal", "Glass", "Paper", "Mixed"]

# -----------------------------
# 2. Method selection logic
# -----------------------------
def choose_method(waste, volume):
    if waste == "Organic":
        return "Anaerobic Digestion" if volume > 200 else "Composting"
    
    elif waste == "Plastic":
        return "Pyrolysis" if volume > 300 else "Recycling"
    
    elif waste == "Metal":
        return "Recycling"
    
    elif waste == "Glass":
        return "Recycling"
    
    elif waste == "Paper":
        return "Incineration" if volume > 250 else "Recycling"
    
    elif waste == "Mixed":
        return "Incineration" if volume > 400 else "Recycling"

# -----------------------------
# 3. Energy factors (kWh/kg)
# -----------------------------
energy_factor = {
    ("Organic", "Anaerobic Digestion"): 0.5,
    ("Organic", "Composting"): 0.2,
    
    ("Plastic", "Pyrolysis"): 1.2,
    ("Plastic", "Recycling"): 0.6,
    
    ("Metal", "Recycling"): 0.3,
    
    ("Glass", "Recycling"): 0.2,
    
    ("Paper", "Incineration"): 0.8,
    ("Paper", "Recycling"): 0.4,
    
    ("Mixed", "Incineration"): 0.9,
    ("Mixed", "Recycling"): 0.5
}

# -----------------------------
# 4. Emission factors
# -----------------------------
emission_factor = {
    ("Organic", "Anaerobic Digestion"): 0.2,
    ("Organic", "Composting"): 0.1,
    
    ("Plastic", "Pyrolysis"): 0.9,
    ("Plastic", "Recycling"): 0.3,
    
    ("Metal", "Recycling"): 0.1,
    
    ("Glass", "Recycling"): 0.05,
    
    ("Paper", "Incineration"): 0.7,
    ("Paper", "Recycling"): 0.2,
    
    ("Mixed", "Incineration"): 1.0,
    ("Mixed", "Recycling"): 0.4
}

# -----------------------------
# 5. Generate dataset
# -----------------------------
data = []

for _ in range(n):
    waste = random.choice(waste_types)
    volume = random.randint(50, 1000)  # kg

    method = choose_method(waste, volume)

    # Base factors
    base_energy = energy_factor.get((waste, method), 0.5)
    base_emission = emission_factor.get((waste, method), 0.2)

    # Controlled randomness
    energy_per_kg = base_energy * np.random.uniform(0.9, 1.1)
    emission_per_kg = base_emission * np.random.uniform(0.9, 1.1)

    # Correct calculations
    total_energy = volume * energy_per_kg
    total_emission = volume * emission_per_kg

    # Efficiency calculation
    efficiency = (total_energy / (total_energy + total_emission)) * 100

    data.append([
        waste,
        method,
        volume,
        round(energy_per_kg, 4),
        round(total_energy, 2),
        round(efficiency, 2)
    ])

# -----------------------------
# 6. Create DataFrame
# -----------------------------
df = pd.DataFrame(data, columns=[
    "waste_type",
    "method",
    "volume",
    "energy_per_kg",
    "total_energy",
    "efficiency"
])

# -----------------------------
# 7. Save dataset
# -----------------------------
df.to_csv("waste_to_energy_10000.csv", index=False)

# -----------------------------
# 8. Output preview
# -----------------------------
print("✅ Dataset created successfully (10,000 rows)")
print(df.head())
print("\nShape:", df.shape)