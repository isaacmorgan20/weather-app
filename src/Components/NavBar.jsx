import React, { useState, useRef, useEffect } from "react";

const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Brong-Ahafo",
  "Bono",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Oti",
  "Western North",
];

const NAV_LINKS = ["Home", "Forecast", "Map", "About"];

const Navbar = ({ onSearch, onLocationClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  // Navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const filtered = GHANA_REGIONS.filter((r) =>
        r.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDrop(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowDrop(false);
    }
  };

  const handleSelect = (region) => {
    setSearchQuery(region);
    setShowDrop(false);
    setSuggestions([]);
    if (onSearch) onSearch(region);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = GHANA_REGIONS.find(
      (r) => r.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (match) {
      handleSelect(match);
    } else if (searchQuery.trim()) {
      if (onSearch) onSearch(searchQuery.trim());
    }
    setShowDrop(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDrop(false);
      inputRef.current?.blur();
    }
  };

  return (
    <>
      {/* ── GLOBAL WEATHER STYLES (Sky / Ocean / Sun accents) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

        .gh-nav * { font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box; }

        .gh-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: linear-gradient(135deg, #0F4C75 0%, #3282B8 50%, #0B3B5F 100%);
          transition: box-shadow 0.3s ease;
        }

        .gh-nav.scrolled {
          box-shadow: 0 10px 30px -8px rgba(0,0,0,0.25);
        }

        /* subtle weather line (like a sun ray / cloud streak) */
        .gh-nav::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #F9C74F, #F9844A, #90BE6D, #F9C74F);
          opacity: 0.8;
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* Logo + Weather icon */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          text-decoration: none;
        }

        .logo-icon-wrap {
          position: relative;
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.12);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(6px);
        }

        .logo-icon-wrap .weather-icon {
          font-size: 24px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .logo-icon-wrap .star-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #F9C74F;
          color: #0B3B5F;
          font-size: 11px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          border: 1.5px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
        .logo-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.3px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .logo-title span { color: #F9C74F; font-weight: 800; }
        .logo-sub {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Desktop nav links - clean & modern */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.85);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 40px;
          transition: all 0.2s ease;
          position: relative;
        }
        .nav-link-btn:hover {
          background: rgba(255,255,255,0.12);
          color: white;
        }
        .nav-link-btn.active {
          background: rgba(255,255,255,0.2);
          color: #F9C74F;
          backdrop-filter: blur(4px);
        }

        /* Search container */
        .search-wrap {
          position: relative;
          flex: 1;
          max-width: 380px;
        }

        .search-form {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 56px;
          backdrop-filter: blur(12px);
          transition: all 0.2s;
        }
        .search-form:focus-within {
          background: rgba(255,255,255,0.18);
          border-color: #F9C74F;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.3);
        }

        .search-flag {
          padding: 0 6px 0 16px;
          font-size: 1rem;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 10px 6px;
          min-width: 0;
        }
        .search-input::placeholder {
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }

        .search-btn {
          background: #F9C74F;
          border: none;
          cursor: pointer;
          color: #0B3B5F;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 7px 18px;
          border-radius: 56px;
          margin: 3px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          letter-spacing: 0.3px;
        }
        .search-btn:hover {
          background: #FFD966;
          transform: scale(1.02);
        }

        /* Region dropdown (weather-inspired) */
        .region-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #0f2b3c;
          border: 1px solid rgba(249,199,79,0.3);
          border-radius: 20px;
          overflow: hidden;
          z-index: 999;
          box-shadow: 0 20px 35px -10px rgba(0,0,0,0.4);
          backdrop-filter: blur(12px);
          animation: fadeDown 0.2s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          padding: 10px 16px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #F9C74F;
          background: rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .region-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          cursor: pointer;
          color: rgba(255,255,255,0.85);
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .region-item:last-child { border-bottom: none; }
        .region-item:hover {
          background: rgba(249,199,79,0.15);
          color: #F9C74F;
        }
        .region-dot {
          width: 8px;
          height: 8px;
          background: #BBE1FA;
          border-radius: 50%;
          transition: background 0.1s;
        }
        .region-item:hover .region-dot { background: #F9C74F; }

        /* Location button */
        .location-btn {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          color: white;
          cursor: pointer;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.2s;
          backdrop-filter: blur(6px);
        }
        .location-btn:hover {
          background: #F9C74F;
          color: #0B3B5F;
          border-color: #F9C74F;
          transform: scale(1.05);
        }

        /* Live weather badge */
        .weather-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 60px;
          padding: 6px 14px;
          color: rgba(255,255,255,0.9);
          font-size: 0.75rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
        }
        .badge-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 1.8s infinite;
          box-shadow: 0 0 4px #4ade80;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        /* Mobile toggle (hamburger) */
        .mobile-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          padding: 10px 12px;
          cursor: pointer;
        }
        .mobile-toggle span {
          display: block;
          width: 20px;
          height: 2px;
          background: white;
          border-radius: 2px;
          transition: all 0.25s ease;
        }
        .mobile-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .mobile-toggle.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .mobile-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu panel */
        .mobile-menu {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.35s ease, opacity 0.25s ease;
          background: rgba(11, 59, 95, 0.96);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(249,199,79,0.2);
        }
        .mobile-menu.open {
          max-height: 600px;
          opacity: 1;
        }
        .mobile-inner {
          padding: 20px 20px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .mobile-link-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.85);
          font-size: 1rem;
          font-weight: 600;
          padding: 12px 16px;
          text-align: left;
          border-radius: 14px;
          transition: all 0.2s;
          width: 100%;
        }
        .mobile-link-btn:hover,
        .mobile-link-btn.active {
          background: rgba(249,199,79,0.12);
          color: #F9C74F;
        }
        .mobile-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .mobile-search-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mobile-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 18px;
          padding: 6px 12px 6px 18px;
          transition: border 0.2s;
        }
        .mobile-input-wrap:focus-within {
          border-color: #F9C74F;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.2);
        }
        .mobile-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 10px 0;
        }
        .mobile-input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .mobile-actions {
          display: flex;
          gap: 12px;
        }
        .mobile-search-btn {
          flex: 1;
          background: #F9C74F;
          border: none;
          cursor: pointer;
          color: #0B3B5F;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 12px 16px;
          border-radius: 40px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .mobile-search-btn:hover {
          background: #FFD966;
        }
        .mobile-loc-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          cursor: pointer;
          color: white;
          font-size: 1.2rem;
          padding: 0 20px;
          border-radius: 40px;
          transition: all 0.2s;
        }
        .mobile-loc-btn:hover {
          background: #F9C74F;
          color: #0B3B5F;
          border-color: #F9C74F;
        }
        .mobile-footer-text {
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 0.7rem;
          font-weight: 500;
        }
        .mobile-suggestions {
          background: #0B2A3E;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(249,199,79,0.2);
        }
        .mobile-suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          color: rgba(255,255,255,0.85);
          font-size: 0.85rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }
        .mobile-suggestion-item:last-child { border-bottom: none; }
        .mobile-suggestion-item:hover {
          background: rgba(249,199,79,0.1);
          color: #F9C74F;
        }

        @media (max-width: 1024px) {
          .weather-badge { display: none; }
          .search-wrap { max-width: 260px; }
        }
        @media (max-width: 768px) {
          .nav-links, .search-wrap, .location-btn, .weather-badge { display: none !important; }
          .mobile-toggle { display: flex; }
          .nav-inner { height: 64px; }
        }
      `}</style>

      <nav className={`gh-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo with weather icon + Ghana star */}
          <a href="/" className="nav-logo">
            <div className="logo-icon-wrap">
              <span className="weather-icon">☀️</span>
              <span className="star-badge">★</span>
            </div>
            <div className="logo-text">
              <span className="logo-title">GH<span>-Weather</span></span>
              <span className="logo-sub">Ghana Forecast</span>
            </div>
          </a>

          {/* Desktop nav */}
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <button
                  className={`nav-link-btn ${activeLink === link ? "active" : ""}`}
                  onClick={() => setActiveLink(link)}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop search with region suggestions */}
          <div className="search-wrap" ref={dropRef}>
            <form className="search-form" onSubmit={handleSubmit}>
              <span className="search-flag">🇬🇭</span>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowDrop(true)}
                placeholder="Search region (e.g., Ashanti)..."
                autoComplete="off"
              />
              <button type="submit" className="search-btn">
                🔍 Search
              </button>
            </form>

            {showDrop && (
              <div className="region-dropdown">
                <div className="dropdown-header">🌍 All Ghana Regions</div>
                {suggestions.map((region) => (
                  <div
                    key={region}
                    className="region-item"
                    onMouseDown={() => handleSelect(region)}
                  >
                    <span className="region-dot" />
                    {region} Region
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location button + live status */}
          <button className="location-btn" onClick={onLocationClick} title="Use my current location">
            📍
          </button>
          <div className="weather-badge">
            <span className="badge-dot" />
            Live Updates
          </div>

          {/* Mobile hamburger */}
          <button
            className={`mobile-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="mobile-inner">
            <ul className="mobile-links">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <button
                    className={`mobile-link-btn ${activeLink === link ? "active" : ""}`}
                    onClick={() => {
                      setActiveLink(link);
                      setMenuOpen(false);
                    }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
            <hr className="mobile-divider" />
            <div className="mobile-search-form">
              <form onSubmit={(e) => { handleSubmit(e); setMenuOpen(false); }}>
                <div className="mobile-input-wrap">
                  <span>🇬🇭</span>
                  <input
                    type="text"
                    className="mobile-input"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search region..."
                    autoComplete="off"
                  />
                </div>
                {suggestions.length > 0 && (
                  <div className="mobile-suggestions">
                    {suggestions.map((region) => (
                      <div
                        key={region}
                        className="mobile-suggestion-item"
                        onMouseDown={() => {
                          handleSelect(region);
                          setMenuOpen(false);
                        }}
                      >
                        <span style={{ fontSize: 12, color: "#F9C74F" }}>⛅</span>
                        {region} Region
                      </div>
                    ))}
                  </div>
                )}
                <div className="mobile-actions">
                  <button type="submit" className="mobile-search-btn">
                    🔍 Search
                  </button>
                  <button
                    type="button"
                    className="mobile-loc-btn"
                    onClick={() => {
                      onLocationClick?.();
                      setMenuOpen(false);
                    }}
                  >
                    📍
                  </button>
                </div>
              </form>
            </div>
            <p className="mobile-footer-text">🇬🇭 All 16 regions · Real‑time weather data</p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;