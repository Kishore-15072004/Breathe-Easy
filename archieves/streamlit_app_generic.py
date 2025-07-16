# streamlit_app_generic.py
import os
import streamlit as st
import pandas as pd
import io
from prophet import Prophet
import matplotlib.pyplot as plt

# Debug: Show current working directory and list its files.
st.write("**Current working directory:**", os.getcwd())
st.write("**Files in current directory:**", os.listdir(os.getcwd()))

# ---------- Step 1: Load and Prepare Data ----------
@st.cache_data
def load_data():
    # Change this to the absolute path where your CSV file is located.
    file_path = r"C:\Users\kisho\PythonProjects\RTAPMS\dtst\merged_data_imputed.csv"
    try:
        df = pd.read_csv(
            file_path, 
            parse_dates=["From Date", "To Date"], 
            dtype={"Station": str}
        )
        df["Station"] = df["Station"].astype(str)
        return df
    except FileNotFoundError:
        st.error(f"File '{file_path}' not found. Please create the file with the expected columns.")
        return pd.DataFrame()

data = load_data()

if data.empty:
    st.write("No data available. Please ensure that merged_data_imputed.csv exists in the designated directory.")
else:
    # Automatically detect pollutant columns by excluding metadata columns.
    all_columns = data.columns.tolist()
    excluded_columns = ["From Date", "To Date", "Station"]
    pollutant_cols = []
    for col in all_columns:
        if col not in excluded_columns:
            try:
                data[col] = pd.to_numeric(data[col])
                pollutant_cols.append(col)
            except Exception:
                continue
    
    # ---------- Step 2: Dashboard UI Setup ----------
    st.title("Multi-Pollutant Air Quality Forecast Dashboard")
    st.write("This dashboard builds forecasting models for any pollutant detected in your dataset using Prophet.")
    
    # Sidebar controls for selecting pollutants, forecast horizon, and alert threshold.
    selected_pollutants = st.sidebar.multiselect("Select Pollutants", options=pollutant_cols, default=pollutant_cols)
    forecast_period = st.sidebar.slider("Forecast Horizon (Days)", min_value=30, max_value=180, value=90)
    default_threshold = st.sidebar.number_input("Default Alert Threshold", value=150.0, step=1.0, format="%.1f")
    
    if not selected_pollutants:
        st.write("Please select at least one pollutant to forecast.")
    else:
        # Loop through each selected pollutant and build forecasts.
        for pollutant in selected_pollutants:
            st.header(f"Forecast for {pollutant}")
            
            # ---------- Step 3: Data Aggregation for Pollutant ----------
            df_pollutant = data.groupby("From Date")[pollutant].mean().reset_index()
            df_pollutant = df_pollutant.rename(columns={"From Date": "ds", pollutant: "y"})
            df_pollutant["y"] = df_pollutant["y"].interpolate(method="linear")
            
            # ---------- Step 4: Build & Fit the Prophet Model ----------
            model = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
            model.fit(df_pollutant)
            
            # ---------- Step 5: Generate Forecast ----------
            future_df = model.make_future_dataframe(periods=forecast_period)
            forecast = model.predict(future_df)
            
            # ---------- Step 6: Plot Forecasts ----------
            def generate_plots(prophet_model, forecast_data):
                # Overall forecast plot.
                fig_forecast = prophet_model.plot(forecast_data)
                buf_forecast = io.BytesIO()
                fig_forecast.savefig(buf_forecast, format="png")
                buf_forecast.seek(0)
                # Forecast components plot.
                fig_components = prophet_model.plot_components(forecast_data)
                buf_components = io.BytesIO()
                fig_components.savefig(buf_components, format="png")
                buf_components.seek(0)
                return buf_forecast, buf_components
    
            buf_forecast, buf_components = generate_plots(model, forecast)
            
            # ---------- Step 7: Display Forecast & Summary ----------
            st.subheader("Forecast Plot")
            st.image(buf_forecast, caption=f"Forecast for {pollutant}", use_column_width=True)
            
            st.subheader("Forecast Components")
            st.image(buf_components, caption="Forecast Components", use_column_width=True)
            
            latest_forecast = forecast[['ds', 'yhat']].tail(forecast_period)
            max_forecast = latest_forecast['yhat'].max()
            st.write(f"**Maximum forecasted {pollutant}:** {max_forecast:.1f}")
            
            if max_forecast > default_threshold:
                st.error(f"**Alert:** Forecasted {pollutant} levels exceed the threshold ({default_threshold})!")
            else:
                st.success(f"Forecasted {pollutant} levels are within the acceptable range (< {default_threshold}).")
            
            st.subheader("Forecast Data")
            st.dataframe(latest_forecast.sort_values(by="ds"))
            st.markdown("---")
