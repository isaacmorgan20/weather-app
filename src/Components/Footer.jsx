import React from "react";

// ============================================================
// FOOTER CONFIGURATION DATA
// ============================================================
const FOOTER_LINKS = [
  {
    title: "Weather Services",
    links: [
      { label: "Regional Forecasts", href: "#" },
      { label: "Severe Weather Alerts", href: "#" },
      { label: "Aviation & Marine", href: "#" },
      { label: "Climatic Data History", href: "#" }
    ]
  },
  {
    title: "Data & Systems",
    links: [
      { label: "Radar Networks", href: "#" },
      { label: "Satellite Imagery", href: "#" },
      { label: "API Access", href: "#" },
      { label: "Station Network", href: "#" }
    ]
  },
  {
    title: "Organization",
    links: [
      { label: "About GH-Weather", href: "#" },
      { label: "Research & Projects", href: "#" },
      { label: "Contact & Support", href: "#" },
      { label: "Careers", href: "#" }
    ]
  }
];

// Modern SVG Icons for Footer Socials/Details
const SunCloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="#FFD23F" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" fill="#FFD23F"/>
    <path d="M22 17.5C22 15.57 20.43 14 18.5 14C18.21 14 17.94 14.04 17.68 14.11C16.94 12.28 15.12 11 13 11C10.24 11 8 13.24 8 16C8 16.17 8.01 16.33 8.03 16.5C6.34 16.74 5 18.22 5 20C5 21.1 5.9 22 7 22H18.5C20.43 22 22 20.43 22 17.5Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
  </svg>
);

// ============================================================
// MAIN FOOTER COMPONENT
// ============================================================
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .gh-footer {
          background: #0b1329;
          color: #cbd5e1;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
        }

        .gh-footer * {
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          box-sizing: border-box;
        }

        /* Subtle modern backdrop glow */
        .gh-footer::before {
          content: "";
          position: absolute;
          top: -150px;
          left: 10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(56, 189, 248, 0) 70%);
          pointer-events: none;
        }

        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 24px 32px 24px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 48px;
          margin-bottom: 48px;
        }

        /* Brand Column */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .footer-logo-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .footer-logo-title span {
          color: #38bdf8;
        }

        .footer-tagline {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 280px;
        }

        .gh-badge-container {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 8px;
        }

        .gh-flag-badge {
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px 10px;
          border-radius: 6px;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Link Columns */
        .footer-column-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #f8fafc;
          margin-bottom: 20px;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .footer-link:hover {
          color: #38bdf8;
          transform: translateX(4px);
        }

        /* Bottom Copyright Section */
        .footer-divider {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 32px;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .footer-legal-links {
          display: flex;
          gap: 24px;
        }

        .footer-legal-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-legal-link:hover {
          color: #94a3b8;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 640px) {
          .footer-inner {
            padding: 48px 20px 24px 20px;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .footer-legal-links {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>

      <footer className="gh-footer">
        <div className="footer-inner">
          
          {/* Main Content Grid */}
          <div className="footer-grid">
            
            {/* Brand Presentation */}
            <div className="footer-brand">
              <a href="/" className="footer-logo">
                <SunCloudIcon />
                <span className="footer-logo-title">GH<span>Weather</span></span>
              </a>
              <p className="footer-tagline">
                Providing high-precision meteorological monitoring, forecasting data, and radar insights across all regions of Ghana.
              </p>
              <div className="gh-badge-container">
                <span className="gh-flag-badge">🇬🇭 Official Grid</span>
                <span className="gh-flag-badge">WMO Certified</span>
              </div>
            </div>

            {/* Dynamic Contextual Links */}
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3 className="footer-column-title">{group.title}</h3>
                <ul className="footer-links-list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          <hr className="footer-divider" />

          {/* Bottom Utility Deck */}
          <div className="footer-bottom">
            <div>
              &copy; {currentYear} GH-Weather Platform. All rights reserved.
            </div>
            <div className="footer-legal-links">
              <a href="#" className="footer-legal-link">Privacy Policy</a>
              <a href="#" className="footer-legal-link">Terms of Service</a>
              <a href="#" className="footer-legal-link">Data Architecture & Licensing</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;