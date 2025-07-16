import os
import sys
import io
import contextlib
import logging
import warnings

# -----------------------------------------------------------------------------
# Suppress TensorFlow INFO logs and Keras metric warnings
# -----------------------------------------------------------------------------
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
logging.getLogger("tensorflow").setLevel(logging.ERROR)
warnings.filterwarnings("ignore", message="Compiled the loaded model, but the compiled metrics have yet to be built")

# -----------------------------------------------------------------------------
# Prevent Flask development banner
# -----------------------------------------------------------------------------
import flask.cli
flask.cli.show_server_banner = lambda *args, **kwargs: None

# -----------------------------------------------------------------------------
# Load environment variables
# -----------------------------------------------------------------------------
from dotenv import load_dotenv
load_dotenv()

# -----------------------------------------------------------------------------
# Standard imports
# -----------------------------------------------------------------------------
import random
from datetime import datetime, timedelta, timezone, date

import numpy as np
import requests
import pymysql
import smtplib
from email.mime.text import MIMEText

from flask import Flask, request, jsonify
from flask_cors import CORS

from tensorflow.keras.models import load_model
from tensorflow.keras.losses import mse
from joblib import load as joblib_load
import xgboost as xgb

# -----------------------------------------------------------------------------
# Configure application & logging
# -----------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log", mode="w", encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)

# -----------------------------------------------------------------------------
# Paths and settings
# -----------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
API_KEY = os.getenv("OPENWEATHER_API_KEY")

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")

meteorological_features = ["RH", "WS (m/s)", "Temp", "BP (mmHg)"]
pollutants = ["PM2.5", "PM10", "NO2", "SO2", "CO", "Ozone"]

cached_location = None
cached_location_time = None
LOCATION_CACHE_DURATION = timedelta(minutes=10)

# -----------------------------------------------------------------------------
# Database helper
# -----------------------------------------------------------------------------
def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )

# -----------------------------------------------------------------------------
# Email helper
# -----------------------------------------------------------------------------
def send_email(to_address, subject, body):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = to_address

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_user, smtp_pass)
        smtp.send_message(msg)

# -----------------------------------------------------------------------------
# Load ML models
# -----------------------------------------------------------------------------
# 1) XGBoost JSON boosters
boosters = []
n_boosters = len(pollutants)
for idx in range(n_boosters):
    booster = xgb.Booster()
    booster.load_model(os.path.join(MODELS_DIR, f"xgb_booster_{idx}.json"))
    boosters.append(booster)

# 2) Scalers via joblib
scaler_meteo     = joblib_load(os.path.join(MODELS_DIR, "scaler_meteo.joblib"))
pollutant_scaler = joblib_load(os.path.join(MODELS_DIR, "pollutant_scaler.joblib"))

# 3) Keras LSTM model, then compile to silence metric warning
lstm_model = load_model(
    os.path.join(MODELS_DIR, "lstm_multi_pollutants_model.h5"),
    custom_objects={"mse": mse}
)
lstm_model.compile(optimizer="adam", loss=mse, metrics=["mse"] )

# -----------------------------------------------------------------------------
# Location utility
# -----------------------------------------------------------------------------
def get_dynamic_location():
    global cached_location, cached_location_time
    now = datetime.now(timezone.utc)
    if cached_location and cached_location_time and (now - cached_location_time < LOCATION_CACHE_DURATION):
        return cached_location
    try:
        resp = requests.get("https://ipinfo.io/json", timeout=5)
        resp.raise_for_status()
        data = resp.json()
        loc = data.get("loc", "")
        city = data.get("city", "").strip()
        lat, lon = map(float, loc.split(',')) if loc else (None, None)
        cached_location = (lat, lon, city)
        cached_location_time = now
    except Exception:
        logging.exception("Error fetching location")
        return (None, None, None)
    return cached_location

# -----------------------------------------------------------------------------
# AQI computation
# -----------------------------------------------------------------------------
def compute_real_aqi(absolute_pollutants):
    breakpoints = {
        "PM2.5": ([0.0,12.1,35.5,55.5,150.5,250.5,350.5],[0,50,100,150,200,300,400,500]),
        "PM10":  ([0,55,155,255,355,425,505],[0,50,100,150,200,300,400,500]),
        "NO2":   ([0,54,101,361,650,1250,1650],[0,50,100,150,200,300,400,500]),
        "SO2":   ([0,36,76,186,305,605,805],[0,50,100,150,200,300,400,500]),
        "CO":    ([0,4.5,9.5,12.5,15.5,30.5,40.5],[0,50,100,150,200,300,400,500]),
        "Ozone": ([0,55,71,86,106,201],[0,50,100,150,200,300,500])
    }
    aqi_vals = {}
    for pol, val in absolute_pollutants.items():
        conc, aqi = breakpoints[pol]
        for i in range(1, len(conc)):
            if val <= conc[i]:
                aqi_val = aqi[i-1] + (val-conc[i-1])*(aqi[i]-aqi[i-1])/(conc[i]-conc[i-1])
                break
        else:
            aqi_val = aqi[-1]
        aqi_vals[pol] = aqi_val
    overall = max(aqi_vals.values()) if aqi_vals else None
    return overall, aqi_vals

# -----------------------------------------------------------------------------
# Routes
# -----------------------------------------------------------------------------
@app.route('/test-email', methods=['GET'])
def test_email():
    smtp_user = os.getenv("SMTP_USER")
    try:
        send_email(
            to_address=smtp_user,
            subject="📧 AQI App: Test Email",
            body="If you’re reading this, your SMTP settings are correct!"
        )
        return jsonify(success=True, message=f"Sent test email to {smtp_user}"), 200
    except Exception as e:
        logging.exception("Test email failed")
        return jsonify(success=False, message=str(e)), 500

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    try:
        data     = request.get_json() or {}
        sub_type = data.get('subscriptionType')
        name     = data.get('name', '').strip()
        contact  = data.get('email' if sub_type=='email' else 'phone','').strip()

        lat, lon, city = get_dynamic_location()
        city = city or ""
        if not name or not contact or not city:
            return jsonify(success=False, message="Name, contact, and location are required"), 400

        conn = get_db_connection()
        with conn.cursor() as cursor:
            if sub_type=='email':
                cursor.execute("SELECT id FROM subscriptions WHERE email=%s", (contact,))
            else:
                cursor.execute("SELECT id FROM subscriptions WHERE phone=%s", (contact,))
            if cursor.fetchone():
                return jsonify(success=False, message="User already exists"), 409
            cursor.execute(
                "INSERT INTO subscriptions (name,email,phone,subscription_type,city) VALUES(%s,%s,%s,%s,%s)",
                (name, contact if sub_type=='email' else None,
                 contact if sub_type=='sms' else None,
                 sub_type, city)
            )
            conn.commit()
        conn.close()
        return jsonify(success=True, message="Subscription successful!", city=city), 200
    except Exception:
        logging.exception("Error in /api/subscribe")
        return jsonify(success=False, message="Server error"), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json or {}
        for old,new in {"WS":"WS (m/s)","BP":"BP (mmHg)"}.items():
            if old in data and new not in data:
                data[new]=data.pop(old)
        missing=[f for f in meteorological_features if f not in data]
        if missing:
            return jsonify(error=f"Missing features: {', '.join(missing)}"),400
        arr=np.array([[data[f] for f in meteorological_features]])
        scaled=scaler_meteo.transform(arr)
        dm=xgb.DMatrix(scaled)
        xgb_out=np.hstack([bst.predict(dm) for bst in boosters])[None,:]
        seq=np.repeat(scaled,10,axis=0)[None,...]
        lstm_out=lstm_model.predict(seq)
        ensemble=(xgb_out+lstm_out)/2
        abs_vals=pollutant_scaler.inverse_transform(ensemble)[0]
        # Changed: Convert negative values to their absolute value instead of clamping to 0
        absolute={pollutants[i]:float(abs(abs_vals[i])) for i in range(len(pollutants))}
        overall, indiv=compute_real_aqi(absolute)
        return jsonify(ensemble_absolute=absolute, computed_AQI=overall, individual_AQI=indiv)
    except Exception:
        logging.exception("Error in /predict")
        return jsonify(error="Internal server error"),500

@app.route('/live-aqi', methods=['GET'])
def live_aqi():
    # Generate random high pollutant concentrations
    pollutants = {
        "pm2_5": round(random.uniform(55.5, 250.0), 1),     # Unhealthy to Hazardous
        "pm10": round(random.uniform(155.0, 424.0), 1),     # Unhealthy to Hazardous
        "o3": round(random.uniform(0.125, 0.604), 3),       # Very Unhealthy to Hazardous
        "no2": round(random.uniform(0.2, 2.04), 3),         # Very Unhealthy to Hazardous
        "so2": round(random.uniform(0.2, 1.004), 3),        # Very Unhealthy to Hazardous
        "co": round(random.uniform(15.5, 50.4), 1)          # Hazardous
    }

    # Example logic to determine AQI category (simplified)
    aqi_category = "Unhealthy"
    max_pm = max(pollutants["pm2_5"], pollutants["pm10"])

    if max_pm > 250 or pollutants["co"] > 30:
        aqi_category = "Hazardous"
    elif max_pm > 150 or pollutants["o3"] > 0.3:
        aqi_category = "Very Unhealthy"

    response = {
        "aqi_category": aqi_category,
        "pollutants": pollutants
    }

    return jsonify(response)

@app.route('/forecast-aqi',methods=['GET'])
def forecast_aqi():
    lat,lon,city=get_dynamic_location()
    if not lat or not lon:
        return jsonify(error="Failed to determine location."),500
    if not API_KEY:
        now=datetime.now(timezone.utc)
        dummy=[{"time":(now+timedelta(hours=3*i)).strftime("%I %p"),"aqi":random.randint(50,200),"city":city,"components":{}}for i in range(6)]
        return jsonify(dummy)
    try:
        url=f"https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={API_KEY}"
        resp=requests.get(url,timeout=5);resp.raise_for_status()
        items=resp.json().get("list",[])
        forecast=[{"time":datetime.fromtimestamp(item["dt"],tz=timezone.utc).strftime("%I %p"),"aqi":item["main"]["aqi"],"components":item["components"],"city":city}for item in items]
        return jsonify(forecast)
    except Exception:
        logging.exception("Error fetching forecast-aqi")
        return jsonify(error="Forecast fetch failed"),500

@app.route('/history-aqi',methods=['GET'])
def history_aqi():
    try:
        conn=get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT DATE_FORMAT(date,'%Y-%m-%d') AS date,city,AQI,`PM2.5`,PM10,NO2 FROM history_aqi WHERE date<CURDATE() ORDER BY date DESC")
            rows=cursor.fetchall()
        conn.close()
        return jsonify(rows)
    except Exception:
        logging.exception("Error fetching history from DB")
        return jsonify(error="History fetch failed"),500

@app.route('/notify',methods=['POST'])
def notify_subscribers():
    alert=request.get_json() or {}
    city=alert.get('city','').strip()
    subject=f"AQI Alert for {city}: {alert.get('pollutant')} High"
    body=f"{alert.get('message')}\n\nLocation: {city}\nTime:     {alert.get('date')}\n"
    try:
        conn=get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT email FROM subscriptions WHERE subscription_type='email' AND email IS NOT NULL AND city=%s",(city,))
            subs=cursor.fetchall()
        conn.close()
        for row in subs:
            send_email(row['email'],subject,body)
        return jsonify(success=True),200
    except Exception:
        logging.exception("Error in /notify")
        return jsonify(success=False,message="Notification failed"),500

if __name__=='__main__':
    app.run(host='127.0.0.1', port=5001, debug=False, use_reloader=False)
