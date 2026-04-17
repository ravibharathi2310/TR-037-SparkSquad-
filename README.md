# ⚡ EnergyAI: Waste-to-Energy Conversion Decision System

## 📌 Project Overview
EnergyAI is a **full-stack machine learning decision system** that predicts the most suitable energy conversion method for different types of waste and estimates the energy output. 

Moving beyond simple waste categorization, this system analyzes the **physicochemical properties** of waste streams (moisture, carbon, ash, etc.) to provide realistic, data-driven recommendations. Originally developed as a pure ML script, it has evolved into an interactive web dashboard complete with real-time analytics, environmental impact metrics, and exportable reporting.

---

## 🎯 Objectives
* Predict the **optimal waste-to-energy conversion method** (Gasification, Incineration, Pyrolysis, Anaerobic Digestion).
* Estimate **energy generation potential (kWh/kg)**.
* Calculate **total energy output** based on waste volume.
* Compute **conversion efficiency** and visualize the chemical profile.
* Translate raw energy data into **Community Impact** (Homes Powered/Day & CO2 Offset).

---

## 🛠️ Technical Stack

### **Frontend (User Interface)**
* **Framework**: React.js (via Vite)
* **Styling**: Tailwind CSS v4
* **Visualizations**: Recharts (Radar, Pie, and Bar charts)
* **Icons**: Lucide-React
* **Reporting**: `jsPDF` & `html-to-image` for high-fidelity PDF exports

### **Backend (API & Machine Learning)**
* **Server**: FastAPI (Python)
* **ML Engine**: Scikit-Learn (Random Forest)
* **Data Handling**: Pandas & NumPy
* **Model Storage**: Joblib (Managed via Git LFS due to >100MB file sizes)

---

## 📥 Input Features (Waste Parameters)
The model takes the following inputs via the interactive sidebar:
* **Waste Category** (e.g., Organic, Plastic, MSW, Medical, Biomass)
* **Moisture Content (%)**
* **Higher Heating Value (HHV) (MJ/kg)**
* **Carbon Content (%)**
* **Ash Content (%)**
* **Volatile Matter (%)**
* **Fixed Carbon (%)**
* **Volume (kg)**

*Note: The UI includes "Quick Presets" to auto-fill these parameters for common waste streams.*

---

## 📤 Outputs & Analytics
The system provides a comprehensive, exportable dashboard featuring:
* ✅ **Optimized Method**: The recommended thermal or biological conversion path.
* ⚡ **Energy Yield**: Raw kWh/kg metrics.
* 📊 **System Efficiency**: A dynamic gauge showing how effectively the waste is converted.
* 🕸️ **Chemical Profile**: A Radar chart mapping the balance of moisture, carbon, and ash.
* 🌍 **Real-World Impact**: Auto-calculated metrics translating energy into "Homes Powered" and "KG CO2 Offset."

---

## 🧠 Machine Learning Models Used

### 1. Classification Model (`method_model.pkl`)
* **Algorithm**: Random Forest Classifier
* **Purpose**: Predicts the best conversion method based on the chemical profile.

### 2. Regression Model (`energy_model.pkl`)
* **Algorithm**: Random Forest Regressor
* **Purpose**: Predicts the specific energy output per kg.

### 📊 Dataset Details
* ~20,000 rows of waste characterization data.
* Uses **One-Hot Encoding** for categorical data.
* Energy efficiency factors applied during training:
    * *Anaerobic Digestion* → ~50%
    * *Incineration* → ~70%
    * *Pyrolysis* → ~75%

---

## 📁 Project Structure

```text
project-root/
│
├── backend/                   # FastAPI Server & ML Models
│   ├── main.py                # API Endpoints (CORS configured)
│   └── models/                # Pre-trained .pkl models (Tracked via Git LFS)
│       ├── method_model.pkl
│       ├── energy_model.pkl
│       ├── label_encoder.pkl
│       └── feature_columns.pkl
│
├── energy-dashboard/          # React Frontend
│   ├── src/
│   │   ├── components/        # MetricCards, Charts, Gauges
│   │   ├── utils/             # Presets & PDF Export Logic
│   │   ├── App.jsx            # Main Layout & State Management
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitattributes             # Git LFS rules for large model files
└── README.md
