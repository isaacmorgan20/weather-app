import React, { useState, useRef, useEffect } from "react";

// ============================================================
// GHANA REGIONS LIST (for search suggestions)
// ============================================================
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
  "Bono",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Oti",
  "Western North",
];

const NAV_LINKS = ["Home", "Forecast", "Map", "About"];

// ============================================================
// SVG ICONS (Clean, modern alternatives to basic emojis)
// ============================================================
const SunCloudIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="#FFD23F" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" fill="#FFD23F"/>
    <path d="M22 17.5C22 15.57 20.43 14 18.5 14C18.21 14 17.94 14.04 17.68 14.11C16.94 12.28 15.12 11 13 11C10.24 11 8 13.24 8 16C8 16.17 8.01 16.33 8.03 16.5C6.34 16.74 5 18.22 5 20C5 21.1 5.9 22 7 22H18.5C20.43 22 22 20.43 22 17.5Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// ============================================================
// MAIN NAVBAR COMPONENT
// ============================================================
const Navbar = ({ onSearch, onLocationClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  const inputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      const filtered = GHANA_REGIONS.filter((region) =>
        region.toLowerCase().includes(val.toLowerCase())
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
          --nav-bg-solid: #1e3a8a;
          --nav-bg-glass: rgba(15, 32, 67, 0.75);
          --text-main: #ffffff;
          --text-muted: #94a3b8;
          --accent: #38bdf8;
          --accent-hover: #7dd3fc;
          --card-bg: rgba(255, 255, 255, 0.96);
          --border-color: rgba(255, 255, 255, 0.12);
        }

        .gh-nav * {
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          box-sizing: border-box;
        }

        /* Sophisticated Sticky Glassmorphic Header */
        .gh-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--nav-bg-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gh-nav.scrolled {
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
          background: rgba(10, 22, 47, 0.85);
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* Branding logo styling */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          user-select: none;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .logo-title span {
          color: var(--accent);
        }

        .logo-sub {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        /* Horizontal Desktop Nav Items */
        .nav-links {
          display: flex;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #cbd5e1;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .nav-link-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-link-btn.active {
          background: rgba(56, 189, 248, 0.15);
          color: var(--accent);
        }

        /* Fluid Search Architecture */
        .search-wrap {
          position: relative;
          flex: 1;
          max-width: 340px;
        }

        .search-form {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 2px;
          border: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .search-form:focus-within {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
        }

        .search-flag {
          padding-left: 14px;
          display: flex;
          align-items: center;
          font-size: 1.1rem;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 10px 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-main);
          background: transparent;
        }

        .search-input::placeholder {
          color: #64748b;
        }

        .search-btn {
          background: var(--accent);
          border: none;
          cursor: pointer;
          color: #0f172a;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 8px 14px;
          border-radius: 8px;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .search-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
        }

        /* Search Results Overlay Dropdown */
        .region-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--card-bg);
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          z-index: 999;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .dropdown-header {
          padding: 12px 16px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          letter-spacing: 0.5px;
        }

        .region-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          color: #1e293b;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .region-item:not(:last-child) {
          border-bottom: 1px solid #f1f5f9;
        }

        .region-item:hover {
          background: #f0f9ff;
          color: #0369a1;
          padding-left: 20px;
        }

        .region-dot {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
        }

        /* Action Buttons & Badges */
        .location-btn {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid var(--border-color);
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          transition: all 0.2s ease;
        }

        .location-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: var(--accent);
          border-color: var(--accent);
        }

        .weather-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 20px;
          padding: 6px 14px;
          color: #4ade80;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 8px #22c55e;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        /* Responsive Mobile Architecture */
        .mobile-toggle {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
        }

        .mobile-toggle span {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--text-main);
          border-radius: 2px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-toggle.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .mobile-toggle.open span:nth-child(2) { opacity: 0; }
        .mobile-toggle.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .mobile-menu {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.35s ease-in-out, opacity 0.2s ease;
          background: #0f172a;
          border-bottom: 1px solid var(--border-color);
        }

        .mobile-menu.open {
          max-height: 100vh;
          opacity: 1;
        }

        .mobile-inner {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          color: #94a3b8;
          font-size: 1rem;
          font-weight: 600;
          padding: 12px 16px;
          text-align: left;
          border-radius: 10px;
          width: 100%;
          transition: all 0.2s ease;
        }

        .mobile-link-btn:hover,
        .mobile-link-btn.active {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .mobile-divider {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 4px 0;
        }

        .mobile-search-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 4px 16px;
        }

        .mobile-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 10px 0;
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .mobile-actions {
          display: flex;
          gap: 10px;
        }

        .mobile-search-btn {
          flex: 1;
          background: var(--accent);
          border: none;
          cursor: pointer;
          font-weight: 700;
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #0f172a;
        }

        .mobile-loc-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          cursor: pointer;
          padding: 0 16px;
          border-radius: 12px;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-suggestions {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 12px;
          margin-top: 4px;
          max-height: 200px;
          overflow-y: auto;
        }

        .mobile-suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #0f172a;
          font-size: 0.9rem;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .weather-badge { display: none; }
        }

        @media (max-width: 768px) {
          .nav-links, .search-wrap, .location-btn {
            display: none !important;
          }
          .mobile-toggle {
            display: flex;
          }
          .nav-inner {
            height: 68px;
          }
        }
      `}</style>

      <nav className={`gh-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo Branding */}
          <a href="/" className="nav-logo">
            <SunCloudIcon />
            <div className="logo-text">
              <span className="logo-title">GH<span>Weather</span></span>
              <span className="logo-sub">Ghana Forecast Platform</span>
            </div>
          </a>

          {/* Desktop Nav Selection */}
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

          {/* Desktop Autocomplete Context Search */}
          <div className="search-wrap" ref={dropRef}>
            <form className="search-form" onSubmit={handleSubmit}>
              <span className="search-flag">🇬🇭</span>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowDrop(true)}
                placeholder="Search specific region..."
                autoComplete="off"
              />
              <button type="submit" className="search-btn">
                <SearchIcon />
                Search
              </button>
            </form>

            {showDrop && (
              <div className="region-dropdown">
                <div className="dropdown-header">Ghanaian Regions</div>
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

          {/* Quick Actions (Location & Status) */}
          <button className="location-btn" onClick={onLocationClick} title="Locate Device">
            <LocationIcon />
          </button>

          <div className="weather-badge">
            <span className="badge-dot" />
            Live System
          </div>

          {/* Hamburger Mobile Toggle */}
          <button
            className={`mobile-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Collapsible Mobile Control Board */}
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
                        <LocationIcon /> {region} Region
                      </div>
                    ))}
                  </div>
                )}
                <div className="mobile-actions">
                  <button type="submit" className="mobile-search-btn">
                    <SearchIcon /> Search
                  </button>
                  <button
                    type="button"
                    className="mobile-loc-btn"
                    onClick={() => {
                      onLocationClick?.();
                      setMenuOpen(false);
                    }}
                  >
                    <LocationIcon />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;