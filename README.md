# Waste to Energy Conversion System (ML Project)

## 📌 Overview
This project predicts the optimal waste-to-energy conversion method and estimates energy output using machine learning.

## 🎯 Objectives
- Classify best conversion method (Incineration, Pyrolysis, etc.)
- Predict energy generation (kWh)
- Estimate efficiency based on emissions

## 📊 Dataset
- Synthetic dataset (10,000 records)
- Features:
  - Waste Type
  - Volume
  - Energy per kg
  - Emission per kg

## 🤖 Models Used
- Random Forest Classifier (Method Prediction)
- Random Forest Regressor (Energy Prediction)
- Random Forest Regressor (Emission Prediction)

## ⚙️ How to Run
```bash
python train_model.py
python predict.py