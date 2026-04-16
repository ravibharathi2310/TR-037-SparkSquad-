

## New Version
# 🔋 Waste-to-Energy Conversion Decision System

## 📌 Project Overview

This project is a **machine learning-based decision system** that predicts the most suitable energy conversion method for different types of waste and estimates the energy output.

The system uses **physicochemical properties of waste** instead of relying only on waste type, making it more accurate and realistic for real-world applications.

---

## 🎯 Objectives

* Predict the **optimal waste-to-energy conversion method**
* Estimate **energy generation potential (kWh/kg)**
* Calculate **total energy output based on waste volume**
* Compute **conversion efficiency**

---

## 📥 Input Features

The model takes the following inputs:

* Moisture Content (%)
* Higher Heating Value (HHV) (MJ/kg)
* Carbon Content (%)
* Ash Content (%)
* Volatile Matter (%)
* Fixed Carbon (%)
* Waste Category (Organic, Plastic, MSW, Paper)

---

## 📤 Outputs

The system provides:

* ✅ Recommended Conversion Method
  (e.g., Anaerobic Digestion, Pyrolysis, Incineration)
* ⚡ Energy per kg (kWh/kg)
* 📊 Total Energy Output (kWh)
* 📈 Efficiency (%)

---

## 🧠 Machine Learning Models Used

### 1. Classification Model

* Algorithm: Random Forest Classifier
* Purpose: Predict the best conversion method

### 2. Regression Model

* Algorithm: Random Forest Regressor
* Purpose: Predict energy output per kg

---

## ⚙️ How It Works

1. Waste composition data is given as input

2. The classification model predicts the best conversion method

3. The regression model estimates energy per kg

4. Total energy is calculated using:

   Total Energy = Energy per kg × Volume

5. Efficiency is calculated based on theoretical vs predicted energy

---

## 📊 Dataset

The model is trained on a dataset containing:

* ~20,000 rows of waste characterization data
* Multiple waste categories:

  * Organic
  * Plastic
  * Paper
  * Municipal Solid Waste (MSW)

### Features include:

* Moisture content
* HHV (wet & dry basis)
* Carbon, Hydrogen, Oxygen, Nitrogen, Sulfur
* Volatile matter & fixed carbon

### Target:

* Recommended conversion method

---

## 🔧 Data Processing

* Removed unnecessary columns (e.g., sample_id)

* Converted categorical data using **one-hot encoding**

* Generated realistic energy values using:

  Energy (kWh/kg) = HHV × 0.2778 × Efficiency Factor

* Efficiency factors vary by method:

  * Anaerobic Digestion → ~50%
  * Incineration → ~70%
  * Pyrolysis → ~75%

---

## 📁 Project Structure

```
project/
│
├── cleaned_dataset.csv
├── train_model.py
├── predict.py
├── method_model.pkl
├── energy_model.pkl
├── label_encoder.pkl
├── feature_columns.pkl
└── README.md
```

---

## ▶️ How to Run

### 1. Train the model

```
python train_new_model.py
```

### 2. Run prediction

```
python predict_new.py
```

---

## 🧪 Example Use Case

### Input:

* Waste Type: Organic (Food Waste)
* Moisture: 70%
* HHV: 4.5 MJ/kg
* Volume: 1000 kg

### Output:

* Method: Anaerobic Digestion
* Energy: ~0.5–0.7 kWh/kg
* Total Energy: ~500–700 kWh
* Efficiency: ~40–60%

---

## ⚠️ Limitations

* Efficiency values are approximated (not real plant data)
* Model depends on dataset quality
* Does not include economic or environmental cost analysis

---

## 🚀 Future Improvements

* Add emission prediction 🌍
* Include cost optimization 💰
* Build web interface (Flask/React)
* Integrate real-time waste data APIs

---

## 👨‍💻 Developed For

Tensor'26 Hackathon
SRM Institute of Science and Technology

---

## 📜 License

This project is for academic and research purposes.
