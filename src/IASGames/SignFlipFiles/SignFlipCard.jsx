import React from 'react';

const SignFlipCard = ({ flipped, matched, type, src, onClick, disabled }) => (
  <div className={`sign-flip-card-container ${matched ? 'matched' : ''}`}>
    <div className={`sign-flip-card-inner ${flipped ? 'flipped' : ''}`}>
      {/* Back face */}
      <div className="sign-flip-card-back" onClick={disabled ? undefined : onClick}>
        {matched ? '' : '🂠'}
      </div>
      {/* Front face */}
      <div className="sign-flip-card-front">
        {type === 'video' ? (
          <video 
            src={src} 
            width="60" 
            height="70" 
            autoPlay 
            loop 
            muted 
            className="sign-flip-card-media"
          />
        ) : (
          <img src={src} alt="sign" width={60} height={70} className="sign-flip-card-media" />
        )}
      </div>
    </div>

    <style>{`
      .sign-flip-card-container {
        width: 70px;
        height: 90px;
        perspective: 800px;
        margin: 0.4rem;
        display: inline-block;
        max-width: calc(100vw - 2rem);
        max-height: calc(100vh - 2rem);
        opacity: 1;
        pointer-events: auto;
        transition: opacity 0.3s ease;
      }

      .sign-flip-card-container.matched {
        opacity: 0.2;
        pointer-events: none;
      }

      .sign-flip-card-inner {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.5s cubic-bezier(.4,2,.6,1);
        transform: none;
      }

      .sign-flip-card-inner.flipped {
        transform: rotateY(180deg);
      }

      .sign-flip-card-back,
      .sign-flip-card-front {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 16px;
        box-shadow: 0 2px 8px #a18cd144;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 2px solid #fff;
      }

      .sign-flip-card-back {
        background: linear-gradient(135deg, #3a2373 0%, #ff6fa1 100%);
        color: #fff;
        font-weight: 800;
        font-size: 1.2rem;
      }

      .sign-flip-card-front {
        transform: rotateY(180deg);
        background: #fff;
        overflow: hidden;
        padding: 0;
      }

      .sign-flip-card-media {
        border-radius: 10px;
        background: #000;
        object-fit: cover;
      }

      .sign-flip-card-front img.sign-flip-card-media {
        background: #eee;
      }
    `}</style>
  </div>
);

export default SignFlipCard; 