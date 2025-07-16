import os
from pickle import load as pkl_load
from xgboost import Booster

# Point MODEL_DIR to the "models" folder beside this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
PICKLE_NAME = "xgb_multi_pollutants_model_resaved.pkl"

# Sanity‐check the folder
if not os.path.isdir(MODELS_DIR):
    raise FileNotFoundError(f"Models directory not found at {MODELS_DIR}")

pickle_path = os.path.join(MODELS_DIR, PICKLE_NAME)
if not os.path.isfile(pickle_path):
    raise FileNotFoundError(f"{pickle_path} not found")

# Load the old MultiOutputRegressor wrapper
with open(pickle_path, "rb") as f:
    mor = pkl_load(f)

# Extract and save each underlying XGBoost booster
for idx, est in enumerate(mor.estimators_):
    booster: Booster = est.get_booster()
    out_path = os.path.join(MODELS_DIR, f"xgb_booster_{idx}.json")
    booster.save_model(out_path)
    print(f"→ Saved booster #{idx} to {out_path}")
