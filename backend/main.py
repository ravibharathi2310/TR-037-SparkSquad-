from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()

# IMPORTANT: This allows your React app (on port 5173) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the models you trained earlier
clf = joblib.load("models/method_model.pkl")
reg = joblib.load("models/energy_model.pkl")
le = joblib.load("models/label_encoder.pkl")
features = joblib.load("models/feature_columns.pkl")

class WasteInput(BaseModel):
    waste_category: str
    moisture_content_pct: float
    HHV_MJ_kg: float
    carbon_content_pct: float
    ash_content_pct: float
    volatile_matter_pct: float
    fixed_carbon_pct: float
    volume: float

@app.post("/predict")
async def predict(data: WasteInput):
    # 1. Convert incoming JSON to DataFrame
    input_dict = data.dict()
    volume = input_dict.pop("volume")
    waste_cat = input_dict["waste_category"]
    
    df_input = pd.DataFrame([input_dict])
    
    # 2. One-hot encode waste_category (Matches your training logic)
    df_input = pd.get_dummies(df_input)

    # 3. Align with training feature columns
    for col in features:
        if col not in df_input.columns:
            df_input[col] = 0
    df_input = df_input[features]

    # 4. Generate Predictions
    method_encoded = clf.predict(df_input)
    method = le.inverse_transform(method_encoded)[0]
    energy_per_kg = float(reg.predict(df_input)[0])
    
    # 5. Calculate Metrics
    total_energy = energy_per_kg * volume
    # Constants used in your training script
    theoretical_energy = input_dict["HHV_MJ_kg"] * 0.2778 
    efficiency = (energy_per_kg / theoretical_energy) * 100 if theoretical_energy > 0 else 0
    # Get feature importance from the classifier
    importances = clf.feature_importances_
    importance_map = dict(zip(features, importances))
    
    # Sort and take top 3
    top_features = sorted(importance_map.items(), key=lambda x: x[1], reverse=True)[:3]
    top_feature_names = [f[0].replace("_pct", "").replace("_", " ") for f in top_features]

    return {
        "waste_type": waste_cat,
        "recommended_method": method,
        "energy_per_kg_kwh": round(energy_per_kg, 3),
        "total_energy_kwh": round(total_energy, 2),
        "efficiency_pct": round(efficiency, 2),
        "top_influencers": top_feature_names
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Waste-to-Energy API Server...")
    uvicorn.run(app, host="127.0.0.1", port=8000)