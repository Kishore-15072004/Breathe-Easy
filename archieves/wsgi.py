from waitress import serve
from real_time_api import compute_real_aqi  # Make sure 'app' is your Flask instance

serve(compute_real_aqi, host="0.0.0.0", port=5000)
