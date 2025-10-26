import React, { useState, useEffect } from 'react';

const Loader = ({ isLoading, delay = 1000 }) => {
  const [shouldShowLoader, setShouldShowLoader] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isLoading) {
      // Only show loader after the specified delay
      timeoutId = setTimeout(() => {
        setShouldShowLoader(true);
      }, delay);
    } else {
      // Hide loader immediately when loading stops
      setShouldShowLoader(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  if (!shouldShowLoader) {
    return null;
  }

  return (
  <div className="loader-outer">
    <div className="loader-blur-bg" />
    <div className="loader-title-center">
      <div className="loader-title">
        {"IT'S A SIGN".split("").map((char, i) => (
          <span className="loader-title-letter" style={{ animationDelay: `${i * 0.12}s` }} key={i}>{char === ' ' ? '\u00A0' : char}</span>
        ))}
      </div>
    </div>
    <style>{`
      .loader-outer {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: all;
      }
      .loader-blur-bg {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        width: 100vw;
        height: 100vh;
        background: transparent;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: 1;
      }
      .loader-title-center {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        pointer-events: none;
      }
      .loader-title {
        display: flex;
        font-weight: 900;
        font-size: 3rem;
        letter-spacing: 2px;
        text-align: center;
        color: #fff;
        text-shadow: 0 4px 16px #000, 0 0 20px #fff;
        font-family: 'Poppins', 'Montserrat', Arial, sans-serif;
      }
      .loader-title-letter {
        display: inline-block;
        animation: loader-jump 1.2s infinite;
        transform-origin: bottom center;
      }
      @keyframes loader-jump {
        0%, 100% { transform: translateY(0); }
        20% { transform: translateY(-18px) scale(1.1); }
        40% { transform: translateY(0); }
      }
    `}</style>
  </div>
  );
};

export default Loader; 