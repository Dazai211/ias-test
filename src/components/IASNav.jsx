// --- IASNav: Filipino Sign Language App Navigation ---
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WebAcccount from '../pages/WebAcccount';

// === STYLES ===
// Header & Container Styles
const headerStyle = {
  width: '100%',
  background: 'rgba(58, 35, 115, 0.15)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '11px 0',
  zIndex: 1000,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 28px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '28px',
  position: 'relative',
};

// Brand Section Styles
const brandSectionStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flex: '0 0 auto',
  gap: '7px',
};

const logoStyle = {
  height: '48px',
  width: 'auto',
  objectFit: 'contain',
};

const brandTextStyle = {
  fontSize: '21px',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #ffa7d1 0%, #7a5ac8 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
  display: 'inline-block',
  letterSpacing: '0.02em',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
};

// Navigation Section Styles
const navSectionStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  transform: 'translateX(-70px)',
};

const navContainerStyle = {
  background: 'rgba(58, 35, 115, 0.25)',
  borderRadius: '50px',
  padding: '9px 18px',
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
};

// Link Styles
const linkBase = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '17px',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  width: '39px',
  height: '39px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  cursor: 'pointer',
  position: 'relative',
};

const linkActive = {
  background: 'linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%)',
  border: '1px solid rgba(255,255,255,0.3)',
  transform: 'scale(1.1)',
  boxShadow: '0 4px 12px rgba(255, 111, 161, 0.3)',
};

const labelStyle = {
  marginTop: '3px',
  fontSize: '12.5px',
  color: '#fff',
  textAlign: 'center',
  letterSpacing: '0.01em',
  fontWeight: 400,
};

// Dropdown Styles
const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(58, 35, 115, 0.95)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '12px',
  padding: '8px 0',
  marginTop: '8px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  zIndex: 1001,
  minWidth: '160px',
};

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
};

const dropdownItemHoverStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  transform: 'translateX(4px)',
};

// Mobile Styles
const mobileLinkBase = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  cursor: 'pointer',
  position: 'relative',
};

const mobileLabelStyle = {
  marginTop: '2px',
  fontSize: '10px',
  color: '#fff',
  textAlign: 'center',
  letterSpacing: '0.01em',
  fontWeight: 400,
};

const webAccountContainer = {
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
};

// === MAIN COMPONENT ===
const IASNav = () => {
  // === STATE & HOOKS ===
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMore, setShowMore] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  
  // Refs for dropdown handling
  const moreButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // === EFFECTS ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMoreDropdownOpen && moreButtonRef.current && 
          !moreButtonRef.current.contains(event.target) && 
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
      if (showMore && mobileDropdownRef.current && 
          !mobileDropdownRef.current.contains(event.target)) {
        setShowMore(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreDropdownOpen, showMore]);

  // === NAVIGATION DATA ===
  const navItems = [
    { to: '/', label: 'Home', abbr: 'H', icon: <img src="/SVGIcons/Navbar/home.svg" alt="Home" style={{ width: 21, height: 21 }} /> },
    { to: '/lessons', label: 'Lessons', abbr: 'L', icon: <img src="/SVGIcons/Navbar/lessons.svg" alt="Lessons" style={{ width: 21, height: 21 }} /> },
    { to: '/games', label: 'Games', abbr: 'G', icon: <img src="/SVGIcons/Navbar/games.svg" alt="Games" style={{ width: 21, height: 21 }} /> },
    { to: '/dictionary', label: 'Dictionary', abbr: 'D', icon: <img src="/SVGIcons/Navbar/Dictionary.svg" alt="Dictionary" style={{ width: 21, height: 21 }} /> },
    { to: '/more', label: 'More', abbr: 'M', icon: '⋯' },
  ];

  const moreDropdownItems = [
    { label: 'Tutorials', icon: '🎓', action: () => alert('Tutorials') },
    { label: 'Contact Us', icon: '📞', action: () => alert('Contact Us') },
    { label: 'Download', icon: '⬇️', action: () => alert('Download') },
    { label: 'About Us', icon: 'ℹ️', action: () => alert('About Us') },
  ];

  // === RENDER FUNCTIONS ===
  const renderDesktopNav = () => (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Brand Section */}
        <div style={brandSectionStyle}>
          <img src="/IASLogo/IASLogo.png" alt="IT'S A SIGN Logo" style={logoStyle} />
          <span style={brandTextStyle}>IT'S A SIGN</span>
        </div>

        {/* Navigation Section */}
        <div style={navSectionStyle}>
          <nav style={navContainerStyle}>
            {navItems.filter(item => item.label !== 'More').map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <div key={item.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Link
                    to={item.to}
                    style={{
                      ...linkBase,
                      ...(isActive ? linkActive : {}),
                    }}
                  >
                    <span role="img" aria-label={item.label}>
                      {item.icon}
                    </span>
                  </Link>
                  <span style={labelStyle}>{item.label}</span>
                </div>
              );
            })}

            {/* More Dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <button
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                ref={moreButtonRef}
                style={{
                  ...linkBase,
                  background: isMoreDropdownOpen ? 'linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%)' : 'rgba(255,255,255,0.1)',
                  border: isMoreDropdownOpen ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <span role="img" aria-label="More">⋯</span>
              </button>
              <span style={labelStyle}>More</span>
              
              {isMoreDropdownOpen && (
                <div style={dropdownStyle} ref={dropdownRef}>
                  {moreDropdownItems.map((item, index) => (
                    <div
                      key={index}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => {
                        e.target.style.background = dropdownItemHoverStyle.background;
                        e.target.style.transform = dropdownItemHoverStyle.transform;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateX(0)';
                      }}
                      onClick={() => {
                        item.action();
                        setIsMoreDropdownOpen(false);
                      }}
                    >
                      <span role="img" aria-label={item.label}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Account Section */}
        <div style={webAccountContainer}>
          <WebAcccount />
        </div>
      </div>
    </header>
  );

  const renderMobileNav = () => (
    <header style={{ 
      width: '100%', 
      background: 'rgba(58,35,115,0.15)', 
      borderBottom: '1px solid rgba(255,255,255,0.1)', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
      zIndex: 1000 
    }}>
      {/* Top row: Brand + Account */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0.7rem 1rem 0.3rem 1rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 7, 
          justifyContent: 'center', 
          width: '100%' 
        }}>
          <img src="/IASLogo/IASLogo.png" alt="IT'S A SIGN Logo" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          <span style={brandTextStyle}>IT'S A SIGN</span>
        </div>
        <WebAcccount />
      </div>

      {/* Nav row: 5 buttons */}
      <nav style={{ 
        background: 'rgba(58, 35, 115, 0.25)', 
        borderRadius: '50px', 
        padding: '8px 8px',
        margin: '0 0.5rem 0.5rem 0.5rem',
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        border: '1px solid rgba(255, 255, 255, 0.2)', 
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        justifyContent: 'space-between'
      }}>
        {navItems.map((item) => (
          <React.Fragment key={item.to}>
            {item.label !== 'More' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link
                  to={item.to}
                  style={{
                    ...mobileLinkBase,
                    ...(location.pathname === item.to ? linkActive : {}),
                  }}
                >
                  <span role="img" aria-label={item.label}>
                    {item.icon}
                  </span>
                </Link>
                <span style={mobileLabelStyle}>{item.label}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <button
                  type="button"
                  style={{
                    ...mobileLinkBase,
                    background: showMore ? 'linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%)' : 'rgba(255,255,255,0.1)',
                    border: showMore ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
                  }}
                  onClick={() => setShowMore((v) => !v)}
                >
                  <span role="img" aria-label="More">{item.icon}</span>
                </button>
                <span style={mobileLabelStyle}>{item.label}</span>
                
                {/* More menu dropdown */}
                {showMore && (
                  <div 
                    ref={mobileDropdownRef}
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      right: '0',
                      background: 'rgba(58, 35, 115, 0.95)', 
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderRadius: '12px', 
                      padding: '8px 0',
                      marginTop: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.2)', 
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      zIndex: 1001,
                      minWidth: '160px',
                      maxWidth: '200px',
                      className: 'more-dropdown-container'
                    }}>
                    {moreDropdownItems.map((item, i) => (
                      <button
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          fontSize: '14px',
                          padding: '12px 16px',
                          borderRadius: '0',
                          fontWeight: 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.transform = 'translateX(0)';
                        }}
                        onClick={() => { 
                          setShowMore(false); 
                          item.action(); 
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>
    </header>
  );

  // === MAIN RETURN ===
  return isMobile ? renderMobileNav() : renderDesktopNav();
};

export default IASNav; 