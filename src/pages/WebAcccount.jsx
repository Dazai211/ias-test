import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// WebAcccount component with hover, active, and click-to-navigate functionality
const WebAcccount = () => {
  // State to track hover
  const [hovered, setHovered] = React.useState(false);
  // React Router navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  // Determine if the current route is /webaccount
  const isActive = location.pathname === '/webaccount';
  // Merge styles: active if hovered or on /webaccount
  const circleClass = (hovered || isActive)
    ? 'webaccount-circle webaccount-circle-active'
    : 'webaccount-circle';
  return (
    <div className="webaccount-btn-root">
      {/* Account circle with hover, active, and click-to-navigate */}
      <div
        className={circleClass}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate('/webaccount')}
      >
        A
      </div>
      <span className="webaccount-label">Account</span>
      <style>{`
        .webaccount-btn-root {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .webaccount-circle {
          color: #fff;
          text-decoration: none;
          font-size: 1.2rem;
          font-weight: 600;
          transition: color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          backdrop-filter: blur(2px);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          margin: 0 auto;
          box-shadow: 0 2px 8px rgba(58, 35, 115, 0.08);
          cursor: pointer;
        }
        .webaccount-circle-active {
          box-shadow: 0 0 16px 4px rgba(255, 111, 161, 0.35), 0 2px 8px rgba(58, 35, 115, 0.12);
          background: rgba(255, 111, 161, 0.18);
          color: #ff6fa1;
          transform: scale(1.12);
          z-index: 1;
        }
        .webaccount-label {
          margin-top: 0.3rem;
          font-size: 0.85rem;
          color: #fff;
          text-align: center;
          letter-spacing: 0.01em;
          font-weight: 400;
        }
      `}</style>
    </div>
  )
}

export default WebAcccount