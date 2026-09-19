# Vehicle Insurance Fraud Detection - Flask Backend API

This is the Python Flask backend service for the Vehicle Insurance Fraud Detection machine learning application.

## Project Structure

```text
backend/
├── app.py
├── best_model.pkl
├── feature_columns.pkl
├── train_and_save_model.py
├── requirements.txt
└── README.md
```

## Setup & Installation

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Activate virtual environment (if available) or create one:
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the API

Start the Flask server:
```bash
python app.py
```
The server will run at: `http://127.0.0.1:5000/`

## API Endpoints

### 1. Health Check
- **GET** `/`
- **Response**:
  ```json
  {
    "message": "Vehicle Insurance Fraud Detection API",
    "status": "Backend is running"
  }
  ```

### 2. Model Status Info
- **GET** `/model-info`
- **Response**:
  ```json
  {
    "feature_count": 36,
    "model_loaded": true,
    "model_type": "Decision Tree"
  }
  ```

### 3. Claim Prediction
- **POST** `/predict`
- **Request Body**: JSON containing 24 claim fields from the frontend form.
- **Response**:
  ```json
  {
    "prediction": 1,
    "outcome": "fraud",
    "fraud_probability": 0.87
  }
  ```
