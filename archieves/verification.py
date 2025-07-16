import numpy as np
import pickle

def verify_scaling(scaler_path):
    """
    Load the scaler from the specified path and verify its behavior by:
    - Printing out internal parameters (min, max, scale)
    - Transforming a sample input
    - Inversing the transformation to recover the original input
    """
    with open(scaler_path, "rb") as f:
        scaler = pickle.load(f)
        
    print("Scaler Parameters:")
    print("Data Min:", scaler.data_min_)
    print("Data Max:", scaler.data_max_)
    print("Scale:", scaler.scale_)
    
    # Example sample data (1 row with 6 features corresponding to your pollutants)
    sample_data = np.array([[50, 80, 100, 40, 1.2, 70]])
    print("\nOriginal Sample Data:")
    print(sample_data)
    
    # Forward transformation (scaling)
    scaled_data = scaler.transform(sample_data)
    print("\nScaled Sample Data:")
    print(scaled_data)
    
    # Inverse transformation (should return to original values)
    recovered_data = scaler.inverse_transform(scaled_data)
    print("\nRecovered Sample Data (After Inverse Transform):")
    print(recovered_data)
    
    return scaler

def adjust_predictions(ensemble_pred, pollutant_scaler, pollutants):
    """
    Given predictions in scaled space (ensemble_pred), this function:
    - Inversely transforms these predictions to absolute values.
    - Clips any negative values to 0.0 (since negative pollutant concentrations are not physically possible).
    
    Returns:
      A dictionary mapping pollutant names to their (clipped) predicted values.
    """
    # Inverse transform the scaled ensemble predictions
    absolute_preds = pollutant_scaler.inverse_transform(ensemble_pred)
    
    # Clip any negative values to zero, and make a dictionary for clarity
    clipped_preds = {
        pollutants[i]: max(0.0, float(absolute_preds[0, i]))
        for i in range(len(pollutants))
    }
    return clipped_preds

def main():
    # Specify the path to your pollutant scaler (the one used to scale pollutant concentrations)
    scaler_path = r"backend\models\pollutant_scaler.pkl"
    
    # Verify that the scaler behaves as expected
    pollutant_scaler = verify_scaling(scaler_path)
    
    # Example: Suppose your ensemble model produced a scaled prediction for 6 pollutants.
    # We deliberately include negative values to see if the clipping works.
    ensemble_pred = np.array([[-0.1, 0.5, -0.2, 0.8, 0.4, 0.9]])
    
    # Define the pollutant names in the same order as the scaler was fit.
    pollutants = ["CO", "NO2", "Ozone", "PM10", "PM2.5", "SO2"]
    
    # Adjust predictions: inverse transform and clip negatives
    adjusted_predictions = adjust_predictions(ensemble_pred, pollutant_scaler, pollutants)
    print("\nAdjusted (Clipped) Predictions:")
    print(adjusted_predictions)

if __name__ == '__main__':
    main()
