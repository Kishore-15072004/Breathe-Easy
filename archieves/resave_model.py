import os
import pickle
from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBRegressor

# Define model directory path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Load old model (the one created with scikit-learn 1.4.2)
model_path = os.path.join(MODELS_DIR, "xgb_multi_pollutants_model.pkl")

try:
    with open(model_path, "rb") as f:
        model = pickle.load(f)

    # Optionally, test the model here with model.predict() to ensure it's valid

    # Re-save it using the current version of scikit-learn (1.5.2)
    new_model_path = os.path.join(MODELS_DIR, "xgb_multi_pollutants_model_resaved.pkl")
    with open(new_model_path, "wb") as f:
        pickle.dump(model, f)

    print(f"Model re-saved successfully at {new_model_path}")

except FileNotFoundError:
    print(f"Error: The model file '{model_path}' was not found. Please check the path.")
