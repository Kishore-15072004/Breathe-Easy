// frontend/src/pages/Learn.js

import React from 'react';

function Learn() {
  return (
    <div className="page bg-white/55 dark:bg-white/10 rounded shadow p-6 card text-gray-700 dark:text-gray-300">

      <h1 className="text-4xl font-extrabold text-blue-400 dark:text-blue-300 text-center mb-9">
        Learn About Air Quality & Environmental Impact
      </h1>

      <p className="mb-6">
        The <strong>Air Quality Index (AQI)</strong> provides a snapshot of the air you breathe by measuring concentrations of pollutants such as PM<sub>2.5</sub>, PM<sub>10</sub>, NO₂, SO₂, CO, and O₃. These values help people understand how polluted the air currently is or how polluted it is forecast to become. Meteorological factors like temperature, humidity, wind speed, and atmospheric pressure also influence air quality significantly.
      </p>

      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-8 border-l-4 border-blue-400">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Quick Facts</h3>
        <ul className="text-sm space-y-1">
          <li>• Air pollution causes 7 million premature deaths annually worldwide (<a href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">WHO</a>)</li>
          <li>• 91% of the world's population lives in places where air quality exceeds WHO guideline limits</li>
          <li>• Air pollution costs the global economy $2.9 trillion annually in health and welfare costs</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-200">
        What is Air Pollution?
      </h2>
      <p className="mb-4">
        Air pollution occurs when gases, dust particles, fumes, or odor are introduced into the atmosphere in a way that makes it harmful to humans, animals, and plants. Major contributors include vehicular emissions, industrial discharges, forest fires, and household combustion devices. Chronic exposure can cause respiratory infections, heart disease, strokes, and even cancer.
      </p>
      <p className="mb-6">
        According to the <a href="https://www.epa.gov/air-pollution-basics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">EPA</a>, air pollution can be classified into two main categories: outdoor (ambient) air pollution and indoor air pollution. Both pose significant health risks and environmental challenges.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Understanding Air Quality Standards
      </h2>
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6">
        <p className="mb-3">Different countries and organizations use various air quality standards:</p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>WHO Guidelines:</strong> The most stringent global standards (<a href="https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Learn more</a>)</li>
          <li><strong>US EPA Standards:</strong> National Ambient Air Quality Standards (NAAQS)</li>
          <li><strong>European Standards:</strong> EU Air Quality Directive</li>
          <li><strong>Chinese Standards:</strong> GB 3095-2012 National Standards</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        AQI Categories
      </h2>
      <div className="space-y-4">
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
          <h3 className="text-lg font-bold text-green-800 dark:text-green-100">Good (0 - 50)</h3>
          <p>Air quality is considered satisfactory, and air pollution poses little or no risk. Perfect for all outdoor activities.</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-700 p-4 rounded">
          <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-100">Moderate (51 - 100)</h3>
          <p>Acceptable air quality, but some pollutants may pose a moderate health concern for a very small number of sensitive individuals. Generally safe for outdoor activities.</p>
        </div>
        <div className="bg-orange-100 dark:bg-orange-600 p-4 rounded">
          <h3 className="text-lg font-bold text-orange-800 dark:text-orange-100">Unhealthy for Sensitive Groups (101 - 150)</h3>
          <p>Members of sensitive groups (children, elderly, people with heart/lung conditions) may experience health effects. Limit prolonged outdoor exertion.</p>
        </div>
        <div className="bg-red-100 dark:bg-red-600 p-4 rounded">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-100">Unhealthy (151 - 200)</h3>
          <p>Everyone may begin to experience health effects; sensitive groups may experience more serious effects. Avoid outdoor activities.</p>
        </div>
        <div className="bg-purple-200 dark:bg-purple-700 p-4 rounded">
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-100">Very Unhealthy (201 - 300)</h3>
          <p>Health alert: everyone may experience more serious health effects. Stay indoors and use air purifiers.</p>
        </div>
        <div className="bg-pink-300 dark:bg-pink-800 p-4 rounded">
          <h3 className="text-lg font-bold text-pink-800 dark:text-pink-100">Hazardous (301+)</h3>
          <p>Health warnings of emergency conditions. The entire population is more likely to be affected. Emergency measures may be issued.</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Common Air Pollutants & Their Sources
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Particulate Matter</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>PM2.5:</strong> Particles smaller than 2.5 microns, capable of entering the bloodstream and lungs, causing cardiovascular and respiratory issues. Sources: vehicle exhaust, power plants, wildfires.</li>
            <li><strong>PM10:</strong> Larger particles that can irritate the eyes, nose, and throat. Sources: dust storms, construction, road dust.</li>
          </ul>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Gaseous Pollutants</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>NO₂:</strong> Emitted from vehicles and power plants, it can inflame airways and decrease lung function.</li>
            <li><strong>SO₂:</strong> Arises mainly from fossil fuel combustion; linked to acid rain and respiratory distress.</li>
            <li><strong>CO:</strong> A colorless, odorless gas from incomplete combustion, can prevent oxygen delivery in the body.</li>
            <li><strong>O₃:</strong> Ground-level ozone formed by sunlight and pollutants, can trigger asthma and reduce lung function.</li>
          </ul>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-6 border-l-4 border-red-400">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Emerging Pollutants of Concern</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Ultrafine Particles (UFP):</strong> Smaller than PM2.5, can cross blood-brain barrier</li>
          <li>• <strong>Black Carbon:</strong> Major component of soot, contributes to climate change</li>
          <li>• <strong>Volatile Organic Compounds (VOCs):</strong> From paints, solvents, and industrial processes</li>
          <li>• <strong>Microplastics:</strong> Increasingly found in urban air from tire wear and synthetic textiles</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Health Effects by Population Group
      </h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Children</h3>
          <ul className="text-sm space-y-1">
            <li>• Developing lungs more susceptible</li>
            <li>• Higher breathing rates</li>
            <li>• Increased asthma risk</li>
            <li>• Cognitive development impacts</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">Elderly</h3>
          <ul className="text-sm space-y-1">
            <li>• Weakened immune systems</li>
            <li>• Existing health conditions</li>
            <li>• Increased hospitalization risk</li>
            <li>• Heart disease complications</li>
          </ul>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Pregnant Women</h3>
          <ul className="text-sm space-y-1">
            <li>• Low birth weight risk</li>
            <li>• Preterm delivery</li>
            <li>• Fetal development issues</li>
            <li>• Maternal health impacts</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Meteorological Factors & Their Impact
      </h2>
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Temperature:</strong> Influences chemical reactions in the atmosphere. Higher temperatures generally increase ozone formation and particle volatilization.</li>
              <li><strong>Humidity:</strong> High humidity promotes particulate formation and secondary aerosol creation, affecting visibility and health.</li>
              <li><strong>Wind Speed:</strong> Strong winds disperse pollutants over larger areas, while still air allows pollutants to accumulate locally.</li>
            </ul>
          </div>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Atmospheric Pressure:</strong> High pressure systems can trap pollutants close to ground level, leading to smog events, especially in valleys and basins.</li>
              <li><strong>Precipitation:</strong> Rain and snow help wash away airborne particles and water-soluble gases, providing temporary air quality improvements.</li>
              <li><strong>Solar Radiation:</strong> Drives photochemical reactions that create secondary pollutants like ozone.</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Global Air Pollution Hotspots
      </h2>
      <div className="mb-6">
        <p className="mb-4">Some regions face particularly severe air quality challenges:</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">Most Polluted Cities (PM2.5)</h3>
            <ul className="text-sm space-y-1">
              <li>• Delhi, India</li>
              <li>• Lahore, Pakistan</li>
              <li>• Dhaka, Bangladesh</li>
              <li>• Beijing, China</li>
              <li>• Mexico City, Mexico</li>
            </ul>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">Seasonal Pollution Events</h3>
            <ul className="text-sm space-y-1">
              <li>• California wildfires (summer/fall)</li>
              <li>• Asian dust storms (spring)</li>
              <li>• European heat waves (summer)</li>
              <li>• Crop burning in India (post-harvest)</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm">
          Track global air quality in real-time with <a href="https://www.iqair.com/world-most-polluted-cities" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">IQAir's World Air Quality Report</a> or <a href="https://waqi.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">World Air Quality Index Project</a>.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Climate Change & Air Quality Connection
      </h2>
      <p className="mb-4">
        Air pollution and climate change are intrinsically linked. Many air pollutants are also greenhouse gases, and climate change affects air quality patterns through:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>Increased wildfire frequency and intensity, producing more particulate matter</li>
        <li>Higher temperatures promoting ground-level ozone formation</li>
        <li>Changing precipitation patterns affecting pollutant washout</li>
        <li>Shifting weather patterns altering pollutant transport and dispersion</li>
        <li>Urban heat island effects concentrating pollutants in cities</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Indoor Air Quality
      </h2>
      <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-6 border-l-4 border-yellow-400">
        <p className="mb-3">
          Indoor air can be 2-5 times more polluted than outdoor air according to the <a href="https://www.epa.gov/indoor-air-quality-iaq" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">EPA</a>. Common indoor pollutants include:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Volatile Organic Compounds (VOCs) from furniture, carpets, and cleaning products</li>
            <li>Biological contaminants (mold, dust mites, pet dander)</li>
            <li>Combustion pollutants from gas stoves, fireplaces, and tobacco smoke</li>
          </ul>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Radon gas from soil and building materials</li>
            <li>Asbestos in older buildings</li>
            <li>Lead dust from old paint</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Advanced Air Quality Monitoring Technologies
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Traditional Monitoring</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Reference Monitors:</strong> High-precision instruments at fixed locations</li>
            <li><strong>Regulatory Networks:</strong> Government-operated stations for compliance</li>
            <li><strong>Satellite Monitoring:</strong> Global coverage using remote sensing</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">Emerging Technologies</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Low-cost Sensors:</strong> Affordable, widespread deployment</li>
            <li><strong>Mobile Monitoring:</strong> Vehicles and drones for dynamic mapping</li>
            <li><strong>Personal Monitors:</strong> Wearable devices for individual exposure</li>
            <li><strong>AI-powered Analytics:</strong> Machine learning for pattern recognition</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Policy & Regulatory Frameworks
      </h2>
      <p className="mb-4">
        Effective air quality management requires comprehensive policy approaches:
      </p>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-2">International Agreements</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><a href="https://www.ccacoalition.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Climate and Clean Air Coalition</a></li>
            <li>Paris Agreement (climate-air quality co-benefits)</li>
            <li>Montreal Protocol (ozone layer protection)</li>
            <li>UNECE Convention on Long-range Transboundary Air Pollution</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">National/Regional Policies</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Clean Air Acts and emission standards</li>
            <li>Vehicle emission regulations (Euro standards, CAFE)</li>
            <li>Industrial emission limits and permits</li>
            <li>Low Emission Zones in cities</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Personal Protection Strategies
      </h2>
      <div className="space-y-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">Daily Habits</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Check AQI before outdoor activities using apps like <a href="https://www.airnow.gov/airnow-mobile-app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">AirNow</a> or <a href="https://www.purpleair.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">PurpleAir</a></li>
            <li>Exercise indoors on high pollution days</li>
            <li>Keep windows closed during pollution episodes</li>
            <li>Use air conditioning with recirculation mode</li>
          </ul>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Indoor Air Improvement</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Use HEPA air purifiers (CADR rated for room size)</li>
            <li>Maintain HVAC systems and change filters regularly</li>
            <li>Add houseplants for natural air purification</li>
            <li>Minimize use of aerosols and chemical cleaners</li>
            <li>Ensure proper ventilation in kitchens and bathrooms</li>
          </ul>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">High-Risk Day Precautions</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Wear N95 or KN95 masks when outdoors (properly fitted)</li>
            <li>Limit time spent near busy roads and industrial areas</li>
            <li>Stay hydrated and eat antioxidant-rich foods</li>
            <li>Consider portable air cleaners for bedrooms</li>
            <li>Consult healthcare providers if you have respiratory conditions</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Community Action & Solutions
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Individual Actions</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Use public transport, carpool, bike, or walk for transportation</li>
            <li>Choose electric or hybrid vehicles when possible</li>
            <li>Switch to renewable energy sources (solar, wind)</li>
            <li>Reduce energy consumption at home and work</li>
            <li>Support businesses with sustainable practices</li>
            <li>Plant trees and support urban greening initiatives</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Community Initiatives</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Advocate for stronger air quality regulations</li>
            <li>Support public transportation infrastructure</li>
            <li>Participate in local environmental groups</li>
            <li>Promote green building standards</li>
            <li>Organize community air quality monitoring</li>
            <li>Education and awareness campaigns</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Future Innovations in Air Quality Management
      </h2>
      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Emerging Technologies</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Photocatalytic air purification surfaces</li>
              <li>Smart city integrated air quality systems</li>
              <li>Atmospheric water harvesting for pollution removal</li>
              <li>Bioengineered air-cleaning organisms</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Data & Analytics</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Real-time health impact modeling</li>
              <li>Predictive air quality forecasting</li>
              <li>Personalized exposure recommendations</li>
              <li>Blockchain-based emission trading systems</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-200">
        Useful Resources & Tools
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Mobile Apps</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><a href="https://www.airnow.gov/airnow-mobile-app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">AirNow</a> - Official US government air quality data</li>
            <li><a href="https://www.iqair.com/air-quality-monitor" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">IQAir AirVisual</a> - Global air quality monitoring</li>
            <li><a href="https://breezometer.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">BreezoMeter</a> - Hyperlocal air quality data</li>
            <li><a href="https://www.purpleair.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">PurpleAir</a> - Real-time sensor network</li>
          </ul>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Educational Resources</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><a href="https://www.epa.gov/air-quality-index" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">EPA Air Quality Index Guide</a></li>
            <li><a href="https://www.who.int/health-topics/air-pollution" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">WHO Air Pollution Resources</a></li>
            <li><a href="https://www.niehs.nih.gov/health/topics/conditions/asthma/air-pollution/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">NIH Air Pollution & Health</a></li>
            <li><a href="https://www.unep.org/interactive/air-pollution-note/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">UN Environment Air Pollution Note</a></li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border-l-4 border-green-400 mb-10">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Take Action Today</h3>
        <p className="text-sm mb-3">
          Every individual action contributes to cleaner air for everyone. Start with simple steps like checking daily air quality, using public transportation when possible, and supporting clean energy initiatives in your community.
        </p>
        <p className="text-sm">
          Remember: Clean air is not just an environmental issue—it's a public health priority that affects quality of life, economic productivity, and social equity. Together, we can build a cleaner, healthier future.
        </p>
      </div>

    </div>
  );
}

export default Learn;