import React, { useState, useEffect, useCallback } from "react";


const GHANA_CITIES = {
  "Accra": { lat: 5.6037, lon: -0.1870 },
  "Kumasi": { lat: 6.6884, lon: -1.6244 },
  "Tamale": { lat: 9.4008, lon: -0.8393 },
  "Takoradi": { lat: 4.8986, lon: -1.7554 },
  "Cape Coast": { lat: 5.1315, lon: -1.2795 },
  "Sunyani": { lat: 7.3349, lon: -2.3266 },
  "Ho": { lat: 6.6001, lon: 0.4727 },
  "Bolgatanga": { lat: 10.7855, lon: -0.8514 },
  "Wa": { lat: 10.0601, lon: -2.5099 },
  "Koforidua": { lat: 6.0940, lon: -0.2572 },
};


const WMO_CODES = {
  0: { desc: "Clear Sky", icon: "☀️", bg: "linear-gradient(135deg,#F9C74F 0%,#F9844A 100%)" },
  1: { desc: "Mainly Clear", icon: "🌤️", bg: "linear-gradient(135deg,#F9C74F 0%,#3282B8 100%)" },
  2: { desc: "Partly Cloudy", icon: "⛅", bg: "linear-gradient(135deg,#3282B8 0%,#0F4C75 100%)" },
  3: { desc: "Overcast", icon: "☁️", bg: "linear-gradient(135deg,#5C6B7A 0%,#2C3E50 100%)" },
  45: { desc: "Foggy", icon: "🌫️", bg: "linear-gradient(135deg,#636e72 0%,#2d3436 100%)" },
  48: { desc: "Rime Fog", icon: "🌫️", bg: "linear-gradient(135deg,#636e72 0%,#2d3436 100%)" },
  51: { desc: "Light Drizzle", icon: "🌦️", bg: "linear-gradient(135deg,#3282B8 0%,#0B3B5F 100%)" },
  53: { desc: "Moderate Drizzle", icon: "🌦️", bg: "linear-gradient(135deg,#3282B8 0%,#0B3B5F 100%)" },
  55: { desc: "Dense Drizzle", icon: "🌧️", bg: "linear-gradient(135deg,#2C3E50 0%,#0B3B5F 100%)" },
  61: { desc: "Light Rain", icon: "🌧️", bg: "linear-gradient(135deg,#3282B8 0%,#0B3B5F 100%)" },
  63: { desc: "Moderate Rain", icon: "🌧️", bg: "linear-gradient(135deg,#2C3E50 0%,#0B3B5F 100%)" },
  65: { desc: "Heavy Rain", icon: "🌧️", bg: "linear-gradient(135deg,#1a1a2e 0%,#0B3B5F 100%)" },
  80: { desc: "Light Showers", icon: "🌦️", bg: "linear-gradient(135deg,#3282B8 0%,#0B3B5F 100%)" },
  81: { desc: "Moderate Showers", icon: "🌧️", bg: "linear-gradient(135deg,#2C3E50 0%,#0B3B5F 100%)" },
  82: { desc: "Violent Showers", icon: "⛈️", bg: "linear-gradient(135deg,#1a1a2e 0%,#0B3B5F 100%)" },
  95: { desc: "Thunderstorm", icon: "⛈️", bg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)" },
  96: { desc: "Thunderstorm + Hail", icon: "⛈️", bg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)" },
  99: { desc: "Thunderstorm + Heavy Hail", icon: "⛈️", bg: "linear-gradient(135deg,#0d0d1a 0%,#16213e 100%)" },
};

const getWeatherInfo = (code) => WMO_CODES[code] || { desc: "Unknown", icon: "🌡️", bg: "linear-gradient(135deg,#0F4C75 0%,#3282B8 100%)" };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Hero = ({ searchTerm, onSearchProcessed }) => {
  const [city, setCity] = useState("Accra");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [time, setTime] = useState(new Date());

  /* ── Live clock ── */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Fetch weather from Open-Meteo ── */
  const fetchWeather = useCallback(async (lat, lon, cityName) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,uv_index,cloud_cover` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`
      );
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m),
        pressure: Math.round(data.current.pressure_msl),
        code: data.current.weather_code,
        uvIndex: data.current.uv_index ?? "N/A",
        cloudCover: data.current.cloud_cover ?? "N/A",
      });

      const days = data.daily.time.slice(1).map((date, i) => ({
        day: DAY_NAMES[new Date(date).getDay()],
        date: new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        high: Math.round(data.daily.temperature_2m_max[i + 1]),
        low: Math.round(data.daily.temperature_2m_min[i + 1]),
        code: data.daily.weather_code[i + 1],
      }));
      setForecast(days);
      setCity(cityName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Initial load ── */
  useEffect(() => {
    const coords = GHANA_CITIES["Accra"];
    fetchWeather(coords.lat, coords.lon, "Accra");
  }, [fetchWeather]);

  /* ── Geolocation ── */
  const handleGeolocate = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, "My Location"),
      () => setError("Location access denied"),
    );
  };

  // React to external search term from Navbar
  useEffect(() => {
    if (!searchTerm) return;
    const term = searchTerm.trim();
    const key = Object.keys(GHANA_CITIES).find(
      (k) => k.toLowerCase() === term.toLowerCase()
    );
    if (key) {
      fetchWeather(GHANA_CITIES[key].lat, GHANA_CITIES[key].lon, key);
    } else if (term) {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=1&language=en`)
        .then((r) => r.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const loc = data.results[0];
            fetchWeather(loc.latitude, loc.longitude, loc.name);
          } else {
            setError(`City "${term}" not found`);
          }
        })
        .catch(() => setError("Search failed"));
    }
    if (onSearchProcessed) onSearchProcessed();
  }, [searchTerm]);

  /* ── City search ── */
  const handleSearch = (e) => {
    e.preventDefault();
    const key = Object.keys(GHANA_CITIES).find(
      (k) => k.toLowerCase() === searchInput.trim().toLowerCase()
    );
    if (key) {
      fetchWeather(GHANA_CITIES[key].lat, GHANA_CITIES[key].lon, key);
      setSearchInput("");
      setShowSearch(false);
    } else if (searchInput.trim()) {
      // Use geocoding API for custom cities
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchInput.trim())}&count=1&language=en`)
        .then((r) => r.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const loc = data.results[0];
            fetchWeather(loc.latitude, loc.longitude, loc.name);
          } else {
            setError(`City "${searchInput}" not found`);
          }
        })
        .catch(() => setError("Search failed"));
      setSearchInput("");
      setShowSearch(false);
    }
  };

  const info = weather ? getWeatherInfo(weather.code) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');

        .hero-weather * {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .hero-weather {
          min-height: 100vh;
          background: #070b14;
          color: white;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px 60px;
        }

        /* ── Animated background orbs ── */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          animation: orbFloat 12s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          background: #0F4C75;
          top: -100px; left: -100px;
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          background: #F9C74F;
          bottom: -50px; right: -100px;
          animation-delay: -4s;
          animation-duration: 15s;
        }
        .hero-orb-3 {
          width: 300px; height: 300px;
          background: #3282B8;
          top: 40%; left: 50%;
          animation-delay: -8s;
        }
        @keyframes orbFloat {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -30px) scale(1.15); }
        }

        /* ── Main weather card ── */
        .hero-main-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 520px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 32px;
          padding: 40px 36px 36px;
          text-align: center;
          box-shadow:
            0 30px 60px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1);
          transition: box-shadow 0.3s;
        }
        .hero-main-card:hover {
          box-shadow:
            0 35px 70px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* ── Top controls row ── */
        .hero-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .hero-live-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(74,222,128,0.12);
          border: 1px solid rgba(74,222,128,0.3);
          border-radius: 40px;
          padding: 5px 14px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #4ade80;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .hero-live-dot {
          width: 7px; height: 7px;
          background: #4ade80;
          border-radius: 50%;
          animation: livePulse 1.8s infinite;
          box-shadow: 0 0 6px #4ade80;
        }
        @keyframes livePulse {
          0%,100% { opacity:1; transform: scale(1); }
          50% { opacity:0.5; transform: scale(0.75); }
        }
        .hero-actions-row {
          display: flex;
          gap: 8px;
        }
        .hero-icon-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: white;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .hero-icon-btn:hover {
          background: #F9C74F;
          color: #0B3B5F;
          border-color: #F9C74F;
          transform: scale(1.08);
        }

        /* ── Search overlay ── */
        .hero-search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hero-search-card {
          background: #0f1c2e;
          border: 1px solid rgba(249,199,79,0.3);
          border-radius: 24px;
          padding: 28px;
          width: 90%;
          max-width: 440px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-search-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: #F9C74F;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 16px;
        }
        .hero-search-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .hero-search-input {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 14px;
          padding: 12px 16px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          outline: none;
          transition: border 0.2s;
        }
        .hero-search-input::placeholder { color: rgba(255,255,255,0.4); }
        .hero-search-input:focus {
          border-color: #F9C74F;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.2);
        }
        .hero-search-submit {
          background: #F9C74F;
          border: none;
          border-radius: 14px;
          padding: 12px 20px;
          color: #0B3B5F;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hero-search-submit:hover { background: #FFD966; transform: scale(1.03); }
        .hero-quick-cities {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hero-city-chip {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 40px;
          padding: 7px 16px;
          color: rgba(255,255,255,0.8);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .hero-city-chip:hover {
          background: rgba(249,199,79,0.15);
          color: #F9C74F;
          border-color: rgba(249,199,79,0.4);
        }
        .hero-search-close {
          position: absolute;
          top: 20px;
          right: 24px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          font-size: 1.3rem;
          width: 36px; height: 36px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hero-search-close:hover { background: rgba(255,255,255,0.2); }

        /* ── City & time ── */
        .hero-city-name {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 2px;
        }
        .hero-city-name span {
          color: #F9C74F;
        }
        .hero-time {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
          margin-bottom: 28px;
          letter-spacing: 0.5px;
        }

        
        .hero-weather-icon-wrap {
          position: relative;
          margin: 0 auto 12px;
          width: 120px; height: 120px;
          display: flex; align-items: center; justify-content: center;
        }
        .hero-weather-icon-glow {
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 50%;
          opacity: 0.35;
          filter: blur(30px);
          animation: glowPulse 4s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%,100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        .hero-weather-icon {
          font-size: 5rem;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3));
          animation: iconBob 4s ease-in-out infinite;
        }
        @keyframes iconBob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* ── Temperature ── */
        .hero-temp {
          font-size: 5.5rem;
          font-weight: 900;
          letter-spacing: -4px;
          line-height: 1;
          background: linear-gradient(135deg, #ffffff 0%, #F9C74F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 6px;
        }
        .hero-condition {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          margin-bottom: 28px;
        }

        /* ── Divider ── */
        .hero-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          margin-bottom: 24px;
        }

        /* ── Stats grid ── */
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 0;
        }
        .hero-stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 16px 14px;
          text-align: left;
          transition: all 0.2s ease;
        }
        .hero-stat-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(249,199,79,0.25);
          transform: translateY(-2px);
        }
        .hero-stat-label {
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hero-stat-value {
          font-size: 1.35rem;
          font-weight: 700;
          color: white;
        }
        .hero-stat-unit {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          margin-left: 3px;
        }

        /* ── Forecast section ── */
        .hero-forecast-section {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 520px;
          margin-top: 20px;
        }
        .hero-forecast-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 14px;
          padding-left: 4px;
        }
        .hero-forecast-grid {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .hero-forecast-grid::-webkit-scrollbar { height: 4px; }
        .hero-forecast-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .hero-forecast-card {
          flex: 0 0 auto;
          min-width: 90px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 16px 14px;
          text-align: center;
          transition: all 0.2s;
          cursor: default;
        }
        .hero-forecast-card:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(249,199,79,0.3);
          transform: translateY(-3px);
        }
        .forecast-day {
          font-size: 0.72rem;
          font-weight: 700;
          color: #F9C74F;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .forecast-date {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
          margin-bottom: 10px;
        }
        .forecast-icon {
          font-size: 1.8rem;
          margin-bottom: 10px;
          display: block;
        }
        .forecast-temps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .forecast-high {
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
        }
        .forecast-low {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
        }

        /* ── Loading skeleton ── */
        .hero-skeleton {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 40px 0;
        }
        .skeleton-bar {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Error message ── */
        .hero-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 16px;
          padding: 14px 20px;
          color: #fca5a5;
          font-size: 0.85rem;
          font-weight: 500;
          text-align: center;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .hero-weather { padding: 24px 14px 40px; }
          .hero-main-card { padding: 28px 20px 28px; border-radius: 24px; }
          .hero-city-name { font-size: 1.5rem; }
          .hero-temp { font-size: 4rem; letter-spacing: -3px; }
          .hero-weather-icon { font-size: 3.5rem; }
          .hero-weather-icon-wrap { width: 90px; height: 90px; }
          .hero-stats { gap: 8px; }
          .hero-stat-card { padding: 12px 10px; border-radius: 14px; }
          .hero-stat-value { font-size: 1.1rem; }
        }
      `}</style>

      <div className="hero-weather">
        {/* Background orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* ── MAIN WEATHER CARD ── */}
        <div className="hero-main-card">
          {/* Top controls */}
          <div className="hero-top-row">
            <div className="hero-live-badge">
              <span className="hero-live-dot" />
              Live Weather
            </div>
            <div className="hero-actions-row">
              <button
                className="hero-icon-btn"
                onClick={() => setShowSearch(true)}
                title="Search city"
              >
                🔍
              </button>
              <button
                className="hero-icon-btn"
                onClick={handleGeolocate}
                title="Use my location"
              >
                📍
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="hero-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {loading ? (
            /* Skeleton loader */
            <div className="hero-skeleton">
              <div className="skeleton-bar" style={{ width: "50%", height: 24 }} />
              <div className="skeleton-bar" style={{ width: "30%", height: 14 }} />
              <div className="skeleton-bar" style={{ width: 90, height: 90, borderRadius: "50%" }} />
              <div className="skeleton-bar" style={{ width: "40%", height: 60 }} />
              <div className="skeleton-bar" style={{ width: "60%", height: 16 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" }}>
                <div className="skeleton-bar" style={{ height: 70 }} />
                <div className="skeleton-bar" style={{ height: 70 }} />
                <div className="skeleton-bar" style={{ height: 70 }} />
                <div className="skeleton-bar" style={{ height: 70 }} />
              </div>
            </div>
          ) : weather ? (
            <>
              {/* City + time */}
              <h1 className="hero-city-name">
                {city.split(",")[0]}
                {city.includes(",") ? <span>, {city.split(",").slice(1).join(",")}</span> : <span> 🇬🇭</span>}
              </h1>
              <p className="hero-time">
                {time.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
                {" · "}
                {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>

              {/* Big weather icon */}
              <div className="hero-weather-icon-wrap">
                <div className="hero-weather-icon-glow" style={{ background: info.bg }} />
                <span className="hero-weather-icon">{info.icon}</span>
              </div>

              {/* Temperature */}
              <p className="hero-temp">{weather.temp}°</p>
              <p className="hero-condition">{info.desc}</p>

              {/* Divider */}
              <div className="hero-divider" />

              {/* Stats */}
              <div className="hero-stats">
                <div className="hero-stat-card">
                  <p className="hero-stat-label">💧 Humidity</p>
                  <p className="hero-stat-value">
                    {weather.humidity}<span className="hero-stat-unit">%</span>
                  </p>
                </div>
                <div className="hero-stat-card">
                  <p className="hero-stat-label">💨 Wind</p>
                  <p className="hero-stat-value">
                    {weather.wind}<span className="hero-stat-unit">km/h</span>
                  </p>
                </div>
                <div className="hero-stat-card">
                  <p className="hero-stat-label">🌡️ Feels Like</p>
                  <p className="hero-stat-value">
                    {weather.feelsLike}<span className="hero-stat-unit">°C</span>
                  </p>
                </div>
                <div className="hero-stat-card">
                  <p className="hero-stat-label">📊 Pressure</p>
                  <p className="hero-stat-value">
                    {weather.pressure}<span className="hero-stat-unit">hPa</span>
                  </p>
                </div>
                <div className="hero-stat-card">
                  <p className="hero-stat-label">☀️ UV Index</p>
                  <p className="hero-stat-value">{weather.uvIndex}</p>
                </div>
                <div className="hero-stat-card">
                  <p className="hero-stat-label">☁️ Cloud Cover</p>
                  <p className="hero-stat-value">
                    {weather.cloudCover}<span className="hero-stat-unit">%</span>
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* ── 5-DAY FORECAST ── */}
        {!loading && forecast.length > 0 && (
          <div className="hero-forecast-section">
            <p className="hero-forecast-title">📅 5-Day Forecast</p>
            <div className="hero-forecast-grid">
              {forecast.map((day, i) => {
                const dayInfo = getWeatherInfo(day.code);
                return (
                  <div className="hero-forecast-card" key={i}>
                    <p className="forecast-day">{day.day}</p>
                    <p className="forecast-date">{day.date}</p>
                    <span className="forecast-icon">{dayInfo.icon}</span>
                    <div className="forecast-temps">
                      <span className="forecast-high">{day.high}°</span>
                      <span className="forecast-low">{day.low}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SEARCH OVERLAY ── */}
        {showSearch && (
          <div className="hero-search-overlay" onClick={() => setShowSearch(false)}>
            <div className="hero-search-card" onClick={(e) => e.stopPropagation()}>
              <p className="hero-search-title">🌍 Search City</p>
              <form className="hero-search-form" onSubmit={handleSearch}>
                <input
                  className="hero-search-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter city name..."
                  autoFocus
                />
                <button type="submit" className="hero-search-submit">
                  Search
                </button>
              </form>
              <div className="hero-quick-cities">
                {Object.keys(GHANA_CITIES).map((c) => (
                  <button
                    key={c}
                    className="hero-city-chip"
                    onClick={() => {
                      fetchWeather(GHANA_CITIES[c].lat, GHANA_CITIES[c].lon, c);
                      setShowSearch(false);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button className="hero-search-close" onClick={() => setShowSearch(false)}>
              ✕
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;