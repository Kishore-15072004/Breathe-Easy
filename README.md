# Real-Time Air Pollution Monitoring and Prediction System (RTAPMS)

## Overview

Breathe Easy is a comprehensive, hardware–software integrated system for real-time air quality monitoring, forecasting, and alerting. It empowers communities, policymakers, and agencies with timely, actionable air quality insights using IoT sensor data, advanced data analytics, and machine learning models. The system is designed for scalability, reliability, and public health impact.

---

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Data Pipeline](#data-pipeline)
- [Machine Learning Models](#machine-learning-models)
- [Artifacts and Outputs](#artifacts-and-outputs)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Automated Data Ingestion:** Handles hundreds of time-series CSV files from distributed air quality sensors.
- **Data Cleaning & Preprocessing:** Schema validation, time alignment, missing value imputation, and normalization.
- **Advanced Forecasting:** Multi-output XGBoost and LSTM models for pollutant and AQI prediction.
- **Real-Time Alerts:** Email/SMS notifications when AQI exceeds thresholds.
- **Interactive Dashboard:** Visualize trends, forecasts, and station-level data (Streamlit/React frontend).
- **Scalable & Modular:** Easily extendable to new stations, pollutants, or geographies.

---

## System Architecture

- **Data Layer:** Raw sensor CSVs, metadata, and merged/cleaned datasets.
- **Backend:** Python (Flask/FastAPI), model inference, alerting, and API endpoints.
- **Frontend:** React-based dashboard for visualization and user interaction.
- **ML Models:** XGBoost (multi-output), LSTM (sequential), Prophet (trend analysis).
- **Utilities:** Scripts for model conversion, scaler serialization, and testing.

---

## Data Pipeline

1. **Ingestion:**  
   - Reads 450+ CSV files (one per station) from [datasets2/datasets](datasets2/datasets).
   - Uses metadata ([datasets2/stations_info.csv](datasets2/stations_info.csv)) for station context.

2. **Cleaning:**  
   - Standardizes column names (e.g., "PM2.5", "Temp").
   - Checks for missing/extra columns and time alignment (1-hour intervals ±5 min).
   - Handles missing values via linear interpolation.

3. **Merging:**  
   - Combines all station files into [merged_data_imputed.csv](merged_data_imputed.csv) and [merged_data_imputed_revised.csv](merged_data_imputed_revised.csv).

4. **Preprocessing:**  
   - Normalizes features using MinMaxScaler.
   - Splits data for training/testing.

---

## Machine Learning Models

- **XGBoost Multi-Output Regressor:**  
  Predicts concentrations of PM2.5, PM10, NO2, SO2, CO, Ozone from meteorological features.

- **LSTM Neural Network:**  
  Captures temporal dependencies for sequential pollutant forecasting.

- **Prophet:**  
  Used for trend and seasonality analysis in the dashboard.

- **AQI Computation:**  
  Converts pollutant predictions to AQI using standard breakpoints.

### Model Artifacts

- `xgb_multi_pollutants_model.pkl` — Trained XGBoost model (multi-output).
- `lstm_multi_pollutants_model.h5` — LSTM model (architecture + weights).
- `scaler_meteo.joblib`, `pollutant_scaler.joblib` — Preprocessing scalers.
- `multi_pollutant_aqi_predictions.csv` — Model predictions and computed AQI.

---

## Artifacts and Outputs

- **Merged Datasets:**  
  - `merged_data_imputed.csv`, `merged_data_imputed_revised.csv`

- **Model Files:**  
  - `backend/models/` contains all model and scaler files.

- **Predictions:**  
  - `multi_pollutant_aqi_predictions.csv`

- **Logs:**  
  - `app.log`, `debug.log`, `demo_debug.log`

---

## Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js (for frontend)
- [requirements.txt](requirements.txt) (Python dependencies)

### Backend Setup

```sh
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r ../requirements.txt
# Ensure models and scalers are present in backend/models/
python demo.py  # or real_time_api.py
```

### Frontend Setup

```sh
cd frontend
npm install
npm start
```

### Streamlit Dashboard

```sh
streamlit run ../archieves/streamlit_app_generic.py
```

---

## Usage

- **API Endpoints:**  
  - `/predict` — Get pollutant and AQI predictions.
  - `/live-aqi` — Real-time AQI for current location.
  - `/api/subscribe` — Register for alerts.

- **Dashboard:**  
  - Visualize station data, trends, and forecasts.

- **Alerts:**  
  - Email/SMS notifications for AQI breaches.

---

## Project Structure

```
RTAPMS/
│
├── app.log, debug.log, demo_debug.log
├── requirements.txt
├── merged_data_imputed.csv, merged_data_imputed_revised.csv
├── multi_pollutant_aqi_predictions.csv
│
├── backend/
│   ├── demo.py, real_time_api.py, db.py, save_scalers.py, ...
│   ├── models/ (XGBoost, LSTM, scalers)
│   └── .env
│
├── frontend/
│   └── src/pages/Learn.js, ...
│
├── archieves/
│   ├── streamlit_app_generic.py, resave_model.py, lstm_conversion, ...
│
├── datasets2/
│   ├── datasets/ (raw station CSVs)
│   └── stations_info.csv
│
├── training/
│   ├── Model_Training_Final.ipynb, ...
│
└── .ipynb_checkpoints/
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

---

## License

This project is for academic and research purposes.

---

## Acknowledgements

- [Kaggle India Air Quality Dataset (2010–2023)](https://www.kaggle.com/datasets)
- XGBoost, TensorFlow/Keras, Prophet, Streamlit, React

---

## Contact

For questions or collaboration, please contact the project maintainer.

---

## Authors

- Kishore Tadepalli — [@Kishore-15072004](https://github.com/Kishore-15072004)
- Srinithya Reddy Yelti — [Nithya-Reddy01](https://github.com/Nithya-Reddy01)
- Vanja Abhilash Reddy
- T Narendra
