import os
from pickle import load as pkl_load
from joblib import dump

# Make MODELS_DIR point to the “models” folder next to this script:
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Check that the folder exists
if not os.path.isdir(MODELS_DIR):
    raise FileNotFoundError(f"Models directory not found at {MODELS_DIR}")

# 1) Resave scaler_meteo
old_path = os.path.join(MODELS_DIR, "scaler_meteo.pkl")
if not os.path.isfile(old_path):
    raise FileNotFoundError(f"{old_path} not found")

with open(old_path, "rb") as f:
    scaler_meteo = pkl_load(f)

new_path = os.path.join(MODELS_DIR, "scaler_meteo.joblib")
dump(scaler_meteo, new_path)
print(f"Resaved scaler_meteo → {new_path}")

# 2) Resave pollutant_scaler
old_path = os.path.join(MODELS_DIR, "pollutant_scaler.pkl")
if not os.path.isfile(old_path):
    raise FileNotFoundError(f"{old_path} not found")

with open(old_path, "rb") as f:
    pollutant_scaler = pkl_load(f)

new_path = os.path.join(MODELS_DIR, "pollutant_scaler.joblib")
dump(pollutant_scaler, new_path)
print(f"Resaved pollutant_scaler → {new_path}")
