import pandas as pd

# Load raw dataset
df = pd.read_csv("waste_to_energy_dataset.csv")

# Drop unnecessary columns
df = df.drop(columns=["material_type"], errors='ignore')

# Fix method labels (take first part)
df["method"] = df["recommended_conversion_method"].apply(lambda x: x.split("/")[0].strip())

# Drop original column
df.drop(columns=["recommended_conversion_method"], inplace=True)

# Remove missing values
df.dropna(inplace=True)

# Save cleaned dataset
df.to_csv("cleaned_dataset.csv", index=False)

print("✅ Data cleaned and saved as cleaned_dataset.csv")