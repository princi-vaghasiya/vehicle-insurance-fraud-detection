import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

# Exact 36 feature columns in required order
feature_columns = [
    "age_of_driver",
    "gender",
    "marital_status",
    "safety_rating",
    "annual_income",
    "high_education",
    "address_change",
    "property_status",
    "past_num_of_claims",
    "witness_present",
    "liab_prct",
    "police_report",
    "age_of_vehicle",
    "vehicle_price",
    "total_claim",
    "injury_claim",
    "policy deductible",
    "annual premium",
    "days open",
    "form defects",
    "claim_day_of_week_Friday",
    "claim_day_of_week_Monday",
    "claim_day_of_week_Saturday",
    "claim_day_of_week_Sunday",
    "claim_day_of_week_Thursday",
    "claim_day_of_week_Tuesday",
    "claim_day_of_week_Wednesday",
    "accident_site_Highway",
    "accident_site_Local",
    "accident_site_Parking Lot",
    "channel_Broker",
    "channel_Online",
    "channel_Phone",
    "vehicle_category_Compact",
    "vehicle_category_Large",
    "vehicle_category_Medium"
]

print(f"Total feature columns count: {len(feature_columns)}")
assert len(feature_columns) == 36, "Feature count must be exactly 36"

# Create synthetic representative dataset for model fitting
np.random.seed(42)
num_samples = 200

data = {}
for col in feature_columns:
    if col.startswith("claim_day_of_week_") or col.startswith("accident_site_") or col.startswith("channel_") or col.startswith("vehicle_category_"):
        data[col] = np.random.choice([0, 1], size=num_samples)
    elif col in ["gender", "marital_status", "high_education", "address_change", "property_status", "witness_present", "police_report"]:
        data[col] = np.random.choice([0, 1], size=num_samples)
    elif col == "age_of_driver":
        data[col] = np.random.randint(18, 80, size=num_samples)
    elif col == "safety_rating":
        data[col] = np.random.randint(1, 101, size=num_samples)
    elif col == "annual_income":
        data[col] = np.random.randint(15000, 150000, size=num_samples)
    elif col == "past_num_of_claims":
        data[col] = np.random.randint(0, 6, size=num_samples)
    elif col == "liab_prct":
        data[col] = np.random.randint(0, 101, size=num_samples)
    elif col == "age_of_vehicle":
        data[col] = np.random.randint(0, 15, size=num_samples)
    elif col == "vehicle_price":
        data[col] = np.random.randint(100000, 3000000, size=num_samples)
    elif col == "total_claim":
        data[col] = np.random.randint(5000, 200000, size=num_samples)
    elif col == "injury_claim":
        data[col] = np.random.randint(0, 50000, size=num_samples)
    elif col == "policy deductible":
        data[col] = np.random.randint(1000, 20000, size=num_samples)
    elif col == "annual premium":
        data[col] = np.random.randint(5000, 50000, size=num_samples)
    elif col == "days open":
        data[col] = np.random.randint(1, 120, size=num_samples)
    elif col == "form defects":
        data[col] = np.random.randint(0, 5, size=num_samples)
    else:
        data[col] = np.random.randn(num_samples)

X_train = pd.DataFrame(data, columns=feature_columns)

# Target labels (higher risk for high total_claim & high past_num_of_claims)
y_train = ((X_train["total_claim"] > 80000) & (X_train["past_num_of_claims"] >= 2)).astype(int)

# Exact Decision Tree specification requested by user
model = DecisionTreeClassifier(
    class_weight="balanced",
    criterion="gini",
    max_depth=2,
    min_samples_leaf=8,
    min_samples_split=2,
    random_state=42
)

model.fit(X_train, y_train)

# Save model and feature columns
joblib.dump(model, "best_model.pkl")
joblib.dump(feature_columns, "feature_columns.pkl")

print("Successfully created best_model.pkl and feature_columns.pkl")
