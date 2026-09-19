import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Absolute path configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "feature_columns.pkl")

# Load model and feature columns safely at server startup
model = None
feature_columns = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
        model = joblib.load(MODEL_PATH)
        feature_columns = joblib.load(FEATURES_PATH)
        if len(feature_columns) != 36:
            raise ValueError(f"Feature count mismatch: expected 36, got {len(feature_columns)}")
        print("Model and 36 feature columns loaded successfully!")
    else:
        print("Warning: Model files missing in backend folder!")
except Exception as err:
    print(f"Error loading model files: {err}")
    model = None
    feature_columns = None

# Reasonable median defaults for missing numeric inputs
NUMERIC_DEFAULTS = {
    "age_of_driver": 38.0,
    "gender": 1.0,
    "marital_status": 1.0,
    "safety_rating": 75.0,
    "annual_income": 55000.0,
    "high_education": 1.0,
    "address_change": 0.0,
    "property_status": 1.0,
    "past_num_of_claims": 1.0,
    "witness_present": 0.0,
    "liab_prct": 25.0,
    "police_report": 1.0,
    "age_of_vehicle": 5.0,
    "vehicle_price": 600000.0,
    "total_claim": 45000.0,
    "injury_claim": 10000.0,
    "policy deductible": 5000.0,
    "annual premium": 25000.0,
    "days open": 30.0,
    "form defects": 0.0
}


@app.route("/", methods=["GET"])
def health_check():
    """Endpoint 1: Health check"""
    return jsonify({
        "message": "Vehicle Insurance Fraud Detection API",
        "status": "Backend is running"
    }), 200


@app.route("/model-info", methods=["GET"])
def model_info():
    """Endpoint 2: Model status and details"""
    return jsonify({
        "model_loaded": model is not None and feature_columns is not None,
        "feature_count": len(feature_columns) if feature_columns else 0,
        "model_type": "Decision Tree"
    }), 200


@app.route("/predict", methods=["POST"])
def predict():
    """Endpoint 3: Main claim fraud prediction"""
    if model is None or feature_columns is None:
        return jsonify({"error": "Model files are not loaded on server"}), 500

    try:
        raw_data = request.get_json(force=True, silent=True)
        if not raw_data or not isinstance(raw_data, dict):
            return jsonify({"error": "Invalid input data: JSON body required"}), 400

        # Map 24 frontend fields to base feature dictionary
        def parse_float(val, default_val=0.0):
            try:
                if val is None or val == "":
                    return default_val
                return float(val)
            except (ValueError, TypeError):
                return default_val

        # Helper conversions for strings & toggles
        gender_str = str(raw_data.get("gender", "")).strip().upper()
        gender_val = 1.0 if gender_str in ["M", "MALE", "1"] else 0.0

        prop_str = str(raw_data.get("property_status", "")).strip().upper()
        prop_val = 1.0 if prop_str in ["OWN", "1"] else 0.0

        row = {
            "age_of_driver": parse_float(raw_data.get("age_of_driver"), NUMERIC_DEFAULTS["age_of_driver"]),
            "gender": gender_val,
            "marital_status": parse_float(raw_data.get("marital_status"), 1.0),
            "safety_rating": parse_float(raw_data.get("safety_rating"), NUMERIC_DEFAULTS["safety_rating"]),
            "annual_income": parse_float(raw_data.get("annual_income"), NUMERIC_DEFAULTS["annual_income"]),
            "high_education": parse_float(raw_data.get("higher_education"), 1.0),
            "address_change": parse_float(raw_data.get("address_change"), 0.0),
            "property_status": prop_val,
            "past_num_of_claims": parse_float(raw_data.get("past_num_claims"), NUMERIC_DEFAULTS["past_num_of_claims"]),
            "witness_present": parse_float(raw_data.get("witness_present"), 0.0),
            "liab_prct": parse_float(raw_data.get("liability_pct"), NUMERIC_DEFAULTS["liab_prct"]),
            "police_report": parse_float(raw_data.get("police_report"), 1.0),
            "age_of_vehicle": parse_float(raw_data.get("age_of_vehicle"), NUMERIC_DEFAULTS["age_of_vehicle"]),
            "vehicle_price": parse_float(raw_data.get("vehicle_price"), NUMERIC_DEFAULTS["vehicle_price"]),
            "total_claim": parse_float(raw_data.get("total_claim"), NUMERIC_DEFAULTS["total_claim"]),
            "injury_claim": parse_float(raw_data.get("injury_claim"), NUMERIC_DEFAULTS["injury_claim"]),
            "policy deductible": parse_float(raw_data.get("policy_deductible"), NUMERIC_DEFAULTS["policy deductible"]),
            "annual premium": parse_float(raw_data.get("annual_premium"), NUMERIC_DEFAULTS["annual premium"]),
            "days open": parse_float(raw_data.get("days_open"), NUMERIC_DEFAULTS["days open"]),
            "form defects": parse_float(raw_data.get("form_defects"), NUMERIC_DEFAULTS["form defects"]),

            # Raw categorical strings for one-hot encoding
            "claim_day_of_week": str(raw_data.get("claim_day_of_week", "")).strip(),
            "accident_site": str(raw_data.get("accident_site", "")).strip(),
            "channel": str(raw_data.get("channel", "")).strip(),
            "vehicle_category": str(raw_data.get("vehicle_category", "")).strip()
        }

        # Convert dictionary to DataFrame
        df = pd.DataFrame([row])

        # Reproduce one-hot encoding used during model training
        df = pd.get_dummies(
            df,
            columns=["claim_day_of_week", "accident_site", "channel", "vehicle_category"],
            dtype=int
        )

        # Reindex to match EXACTLY 36 feature columns in exact order
        X = df.reindex(columns=feature_columns, fill_value=0)

        # Handle any remaining NaNs safely
        for col in feature_columns:
            if col in NUMERIC_DEFAULTS:
                X[col] = X[col].fillna(NUMERIC_DEFAULTS[col])
            else:
                X[col] = X[col].fillna(0)

        # Validate feature dimension count
        if X.shape[1] != 36:
            return jsonify({"error": f"Internal feature dimension mismatch: {X.shape[1]} instead of 36"}), 500

        # Execute decision tree prediction
        prediction = int(model.predict(X)[0])
        outcome = "fraud" if prediction == 1 else "safe"

        response_payload = {
            "prediction": prediction,
            "outcome": outcome
        }

        # Compute fraud probability if predict_proba is supported
        if hasattr(model, "predict_proba"):
            try:
                probabilities = model.predict_proba(X)[0]
                fraud_prob = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])
                response_payload["fraud_probability"] = round(fraud_prob, 4)
            except Exception:
                pass

        return jsonify(response_payload), 200

    except Exception as err:
        return jsonify({"error": "Failed to process prediction request"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
