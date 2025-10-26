// This is the main page for the /webaccount route, separate from the WebAcccount button used in the UpperNavbar.
import React, { useState, useRef, useEffect } from 'react'
import EnhancedAuthForm from '../userProfile/EnhancedAuthForm'
import UserProfile from '../userProfile/UserProfile'
import { auth } from '../library/firebase'

const WebAccountPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(() => auth.currentUser);
  const cardRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!expanded) return;
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  return (
    <div className="webaccount-root">
      <div className="webaccount-title-wrap">
        <h1 className="webaccount-title">IT'S A SIGN</h1>
      </div>
      {/* Show expanding card only if not logged in */}
      {!user ? (
        <div
          ref={cardRef}
          className={expanded ? 'expanded-auth-card' : 'collapsed-login-card'}
          onClick={() => !expanded && setExpanded(true)}
        >
          {!expanded && 'LOGIN'}
          <div className={expanded ? 'form-container form-container-visible' : 'form-container'}>
            {expanded && <EnhancedAuthForm />}
          </div>
        </div>
      ) : (
        // Show user profile centered, not inside the card
        <div className="webaccount-profile-wrap">
          <UserProfile />
        </div>
      )}
      <style>{`
        .webaccount-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
        }
        .webaccount-title-wrap {
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .webaccount-title {
          color: #fff;
          font-weight: 900;
          font-size: 3rem;
          margin-top: 0;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(102, 126, 234, 0.5);
          background: linear-gradient(45deg, #fff, #f093fb, #667eea);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 2px;
        }
        .collapsed-login-card, .expanded-auth-card {
          border-radius: 2rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          background: linear-gradient(135deg, #e0eaff 0%, #b2d8ff 100%);
          color: #1a237e;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: width 0.4s cubic-bezier(.4,2,.6,1), height 0.4s cubic-bezier(.4,2,.6,1), padding 0.4s cubic-bezier(.4,2,.6,1);
          overflow: hidden;
          margin: 0 auto;
        }
        .collapsed-login-card {
          width: 320px;
          height: 80px;
          padding: 0;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-align: center;
          user-select: none;
          cursor: pointer;
        }
        .expanded-auth-card {
          width: 600px;
          min-height: 480px;
          height: auto;
          padding: 0.5rem 2rem 0.5rem 2rem;
          cursor: default;
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.22);
        }
        .form-container {
          width: 100%;
          transition: opacity 0.4s 0.1s, transform 0.4s 0.1s;
          opacity: 0;
          transform: translateY(30px);
          pointer-events: none;
        }
        .form-container-visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .webaccount-profile-wrap {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 700px) {
          .webaccount-root {
            padding: 0 !important;
            justify-content: center !important;
            min-height: 100vh;
          }
          .expanded-auth-card {
            width: 95vw !important;
            max-width: 380px !important;
            min-width: 0 !important;
            padding: 1.2rem !important;
            height: auto !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-top: 1.5rem !important;
          }
        
        }
      `}</style>
    </div>
  )
}

export default WebAccountPage 