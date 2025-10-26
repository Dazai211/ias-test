import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../library/firebase';
import { getUserProfile } from '../userProfile/firebaseUtils';
import titles from '../achievements/titles';
import { getLevelFromExp, getExpProgress } from '../achievements/levelUtils';
import { onSnapshot, doc as firestoreDoc } from 'firebase/firestore';
import { db } from '../library/firebase';

function GameCard({ game, idx, navigate }) {
  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <div
      className={`game-card game-card-${idx}${hovered ? ' hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(game.route)}
    >
      <div className="game-card-gradient-overlay" />
      <div className={`game-card-icon${hovered ? ' hovered' : ''}`}>
        <span className={`game-card-icon-emoji${hovered ? ' hovered' : ''}`}>
          {typeof game.icon === 'string' && game.icon.endsWith('.svg') ? (
            <img
              src={game.icon}
              alt={game.title}
              style={{ width: 48, height: 48, display: 'block' }}
            />
          ) : (
            game.icon
          )}
        </span>
      </div>
      <h3 className="game-card-title">{game.title}</h3>
      <div className={`game-card-pill${hovered ? ' hovered' : ''}`}>{game.category} • {game.players}</div>
      <p className={`game-card-description${hovered ? ' hovered' : ''}`}>{game.description}</p>
      <button 
        className={`game-card-play-btn${hovered ? ' hovered' : ''}${buttonHovered ? ' btn-hovered' : ''}`}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          navigate(game.route);
        }}
      >
        <span className="game-card-play-btn-content">
          🎮 PLAY NOW
        </span>
      </button>
    </div>
  );
}

const games = [
  {
    id: 'sign-flip',
    title: 'Sign Flip',
    description: 'Test your memory and recognition by flipping cards to find matching signs.',
    route: '/games/sign-flip',
    image: '/Games/SignFlip.jpg',
    icon: '/SVGIcons/games/signFlip.svg',
    players: '1 Player',
    category: 'Memory',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glowColor: '#667eea',
  },
  {
    id: 'sign-quest',
    title: 'Sign Quest',
    description: 'Embark on a quest to answer sign language questions and boost your knowledge.',
    route: '/games/sign-quest',
    image: '/Games/SignQuest.jpg',
    icon: '/SVGIcons/games/signQuest.svg',
    players: '1 Player',
    category: 'Quiz',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    glowColor: '#f093fb',
  },
  {
    id: 'sign-sense',
    title: 'Sign Sense',
    description: 'Sharpen your senses with quick sign identification challenges.',
    route: '/games/sign-sense',
    image: '/Games/SignSense.jpg',
    icon: '/SVGIcons/games/signSense.svg',
    players: '1 Player',
    category: 'Speed',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    glowColor: '#4facfe',
  },
];

const Games = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeProfile;

    unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userDocRef = firestoreDoc(db, 'users', user.uid);
        unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
        if (unsubscribeProfile) unsubscribeProfile();
      }
    });

    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const getLastPlayedGame = () => {
    if (!userProfile?.gameHistory || Object.keys(userProfile.gameHistory).length === 0) {
      return null;
    }
    let mostRecentGame = null;
    let mostRecentTime = 0;
    Object.values(userProfile.gameHistory).forEach(gameResult => {
      const gameTime = new Date(gameResult.timestamp).getTime();
      if (gameTime > mostRecentTime) {
        mostRecentTime = gameTime;
        mostRecentGame = gameResult;
      }
    });
    if (!mostRecentGame) return null;
    const game = games.find(g => g.title === mostRecentGame.gameName);
    if (!game) return null;
    return {
      game,
      score: mostRecentGame.score || 0,
      time: new Date(mostRecentGame.timestamp).toLocaleString(),
      description: `You scored ${mostRecentGame.score || 0} points in ${mostRecentGame.gameName}!`
    };
  };

  const getPlayerInfo = () => {
    if (!userProfile) {
      return {
        name: 'Guest User',
        avatar: '/Avatars/ProfilePlaceholder.jpeg',
      };
    }
    return {
      name: userProfile.displayName || 'Player',
      avatar: userProfile.profilePicture || '/Avatars/ProfilePlaceholder.jpeg',
    };
  };

  const lastPlayed = getLastPlayedGame();
  const player = getPlayerInfo();
  const selectedTitle = userProfile ? titles.find(t => t.id === userProfile.selectedTitle) : null;
  const exp = userProfile?.exp ?? 0;
  const { level, expInLevel, expToNextLevel, percent } = getExpProgress(exp);

  if (loading) {
    return (
      <div className="games-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="games-root">
      <div className="games-header">
        <h1 className="games-title">
          IAS GAME CENTER
        </h1>
        <p className="games-subtitle">
          Level up your FSL skills through interactive challenges
        </p>
      </div>
      <div className="player-stats-outer">
        <div className="player-stats-container">
          {/* Top row: Profile and Last Played */}
          <div className="top-row">
            {/* Left: Profile section */}
            <div className="profile-section">
              <div className="profile-header">
                <div className="player-avatar">
                  <img 
                    src={player.avatar} 
                    alt="Player avatar" 
                    className="player-avatar-img"
                  />
                </div>
                <div className="user-info">
                  <h3 className="player-name">{player.name}</h3>
                  {selectedTitle && (
                    <div className="player-title-image-centered">
                      <img src={selectedTitle.image} alt={`Title ${selectedTitle.id}`} />
                    </div>
                  )}
                </div>
              </div>
              <div className="level-info">
                <span className="exp-bar-label">{expInLevel} / {expToNextLevel} EXP</span>
                <span className="player-level">| Level: {level}</span>
              </div>
              <div className="progress-section">
                <div className="exp-bar-outer">
                  <div className="exp-bar-inner" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
            
            {/* Right: Last played */}
            <div className="last-played-card">
              <div className="last-played-label">
                {lastPlayed ? 'Last Played' : 'No Games Played'}
              </div>
              {lastPlayed ? (
                <>
                  <div className="last-played-title">
                    {lastPlayed.game.title}
                  </div>
                  <div className="last-played-score">
                    Score: <span className="last-played-score-value">{lastPlayed.score}</span>
                  </div>
                  <div className="last-played-time">
                    {lastPlayed.time}
                  </div>
                </>
              ) : (
                <div className="last-played-empty">
                  Start your first game!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <h2 className="games-section-header">Games</h2>
      <div className="games-section-divider"></div>
      <div className="games-grid-outer">
        <div className="games-grid">
          <div className="games-grid-spacer" />
          {games.map((game, idx) => (
            <GameCard 
              key={game.id} 
              game={game} 
              idx={idx} 
              navigate={navigate}
            />
          ))}
          <div className="games-grid-spacer" />
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .games-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.2rem;
        }
        .games-root {
          min-height: 100vh;
          position: relative;
        }
        .games-header {
          padding: 2rem 0 1rem 0;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .games-title {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 0 30px rgba(255, 111, 161, 0.3);
          letter-spacing: 2px;
        }
        .games-subtitle {
          color: #bfc6e0;
          font-size: 1.2rem;
          margin: 0 0 2rem 0;
          font-weight: 500;
        }
        .player-stats-outer {
          max-width: 1000px;
          margin: 0 auto 3rem auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
        }
        .player-stats-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .top-row {
          display: flex;
          align-items: flex-start;
          gap: 2.5rem;
        }
        .profile-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }
        .progress-section {
          display: flex;
          align-items: center;
        }
        .last-played-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 111, 161, 0.1) 0%, rgba(58, 35, 115, 0.1) 100%);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 111, 161, 0.2);
          min-width: 250px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .player-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #ff6fa1;
          box-shadow: 0 0 25px rgba(255, 111, 161, 0.4);
          background: #fff;
          position: relative;
          flex-shrink: 0;
        }
        .player-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .player-name {
          color: #fff;
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0;
        }
        .level-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #bfc6e0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .player-level {
          color: #bfc6e0;
          font-size: 1rem;
          margin-top: 0.5rem;
          font-weight: 600;
        }
        .last-played-label {
          color: #ff6fa1;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .last-played-title {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .last-played-score {
          color: #bfc6e0;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .last-played-score-value {
          color: #43a1ff;
          font-weight: 700;
        }
        .last-played-time {
          color: #bfc6e0;
          font-size: 0.8rem;
        }
        .last-played-empty {
          color: #bfc6e0;
          font-size: 0.9rem;
          font-style: italic;
        }
        .games-section-header {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          margin-left: 2.5rem;
          margin-bottom: 0.5rem;
          margin-top: 0.5rem;
          letter-spacing: 1px;
        }
        .games-section-divider {
          height: 3px;
          width: 85%;
          background: #fff;
          margin-left: 2.5rem;
          margin-bottom: 1.2rem;
          border-radius: 1px;
        }
        .games-section-header,
        .games-section-divider {
          display: none;
        }
        .games-grid-spacer {
          display: none;
        }
        .games-grid-outer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 3rem 2rem;
          position: relative;
          z-index: 2;
        }
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          justify-content: center;
        }
        .game-card {
          background: rgba(255,255,255,0.10);
          border-radius: 24px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          border: 1.5px solid rgba(255,255,255,0.18);
          color: #fff;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          width: 100%;
          min-width: 0;
          max-width: 340px;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(.4,2,.3,1);
          cursor: pointer;
          padding: 1.2rem 1.2rem 1.5rem 1.2rem;
          margin: 0.2rem 0;
        }

        .game-card.hovered {
          box-shadow: 0 16px 48px 0 rgba(31, 38, 135, 0.28), 0 4px 24px 0 rgba(0,0,0,0.18);
          border: 2px solid rgba(255, 111, 161, 0.25);
          outline: 2px solid #ff6fa1;
          z-index: 2;
          transform: translateY(-8px) scale(1.035);
        }
        .game-card-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
          opacity: 0.13;
          z-index: 0;
          pointer-events: none;
        }
        .game-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: rgba(255,255,255,0.13);
          margin: 0 0 0.7rem 0;
          box-shadow: 0 0 8px #a18cd1, 0 2px 8px rgba(58, 35, 115, 0.10);
          transition: all 0.3s;
          font-size: 2.5rem;
          z-index: 1;
        }
        .game-card-icon.hovered {
          background: rgba(255, 182, 230, 0.18);
          box-shadow: 0 0 24px #ff6fa1, 0 2px 8px #a18cd1;
        }
        .game-card-icon-emoji {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 8px #a18cd1) drop-shadow(0 2px 8px rgba(58, 35, 115, 0.10));
          transition: filter 0.3s;
        }
        .game-card-icon-emoji.hovered {
          filter: drop-shadow(0 0 18px #ff6fa1) drop-shadow(0 0 8px #a18cd1);
        }
        .game-card-title {
          font-weight: 800;
          font-size: 1.25rem;
          margin: 0 0 0.4rem 0;
          color: #fff;
          text-shadow: 0 2px 8px rgba(58, 35, 115, 0.18), 0 1px 2px #fff2;
          text-align: center;
          letter-spacing: 0.01em;
          z-index: 1;
          transition: all 0.3s;
        }
        .game-card-pill {
          display: inline-block;
          padding: 0.18rem 0.9rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.13);
          color: #a18cd1;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.7rem;
          box-shadow: none;
          border: 1.5px solid #a18cd1;
          z-index: 1;
          transition: all 0.3s;
        }
        .game-card-pill.hovered {
          background: rgba(255, 182, 230, 0.18);
          color: #ff6fa1;
          box-shadow: 0 0 8px #ffb6e6;
        }
        .game-card-description {
          color: #ffe0fa;
          font-size: 0.98rem;
          text-align: center;
          margin: 0 0 1.1rem 0;
          opacity: 0.92;
          z-index: 1;
          min-height: 40px;
          transition: all 0.3s;
        }
        .game-card-description.hovered {
          color: #fff;
          opacity: 1;
        }
        .game-card-play-btn {
          width: 100%;
          margin-top: auto;
          padding: 0.6rem 0;
          border-radius: 1.2rem;
          border: none;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(58, 35, 115, 0.10);
          transition: all 0.3s ease-out;
          outline: none;
          z-index: 1;
          transform: scale(1);
        }
        .game-card-play-btn.hovered {
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          color: #3a2373;
          box-shadow: 0 6px 24px rgba(255, 111, 161, 0.28);
          transform: scale(1.07);
        }
        .game-card-play-btn.btn-hovered {
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          color: #3a2373;
          box-shadow: 0 6px 24px rgba(255, 111, 161, 0.28);
          transform: scale(1.07);
        }
        .game-card-play-btn-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .player-title-image-centered {
          margin: 0.5rem auto 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .player-title-image-centered img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 30px;
          display: block;
          border-radius: 80px;
        }

        .player-level {
          margin-left: 0.5rem;
        }
        .exp-bar-outer {
          width: 600px;
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin: 0;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .exp-bar-inner {
          height: 100%;
          background: linear-gradient(90deg, #ff6fa1 0%, #ffb6e6 100%);
          border-radius: 10px;
          transition: width 0.5s ease;
        }
        .exp-bar-label {
          color: #bfc6e0;
          font-size: 0.95rem;
          margin-top: 0.2rem;
          font-weight: 500;
        }

        .exp-bar-outer {
          margin: 0;
        }
        .player-level {
          color: #bfc6e0;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }
        @media (max-width: 700px) {

        .player-title-image-centered img {
          max-height: 40px;
         
        }
          .games-title {
            font-size: 2rem;
          }
          .player-stats-outer {
            padding-left: 2.2rem;
            padding-right: 2.2rem;
          }
          .player-stats-container {
            gap: 1rem;
            padding: 1.5rem;
          }
          .top-row {
            flex-direction: column;
            gap: 2rem;
          }
          .profile-section {
            width: 100%;
          }
          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          .player-avatar {
            width: 70px;
            height: 70px;
          }
          .user-info {
            width: 100%;
            text-align: center;
          }
          .player-name {
            font-size: 1.2rem;
          }
          .level-info {
            justify-content: center;
            text-align: center;
            margin-top: 0.5rem;
          }
          .last-played-card {
            min-width: 0;
            width: 100%;
            margin-top: 1rem;
            padding: 1rem;
            text-align: center;
          }
          .games-grid-outer {
            padding: 0;
            margin: 0;
            max-width: none;
            width: 100vw;
            overflow-x: auto;
            box-sizing: border-box;
            background: transparent;
          }
          .games-grid {
            display: flex;
            gap: 1rem;
            padding-left: 0rem;
            padding-right: 0rem;
            width: auto;
            box-sizing: border-box;
            position: relative;
            overflow-x: visible;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            justify-content: flex-start;
          }
          .games-grid::-webkit-scrollbar {
            display: none;
          }
          .game-card {
            flex: 0 0 280px;
            max-width: 280px;
            min-width: 280px;
            width: 280px;
            scroll-snap-align: start;
            padding: 1rem 0.5rem 1.2rem 0.5rem;
            margin: 0;
            box-sizing: border-box;
            position: relative;
          }
          .games-grid .game-card:first-of-type {
            margin-left: 0 !important;
          }
          .games-section-header,
          .games-section-divider {
            display: block;
          }
          .games-section-header {
            font-size: 1.3rem;
            margin-left: 1.5rem;
            margin-bottom: 0.5rem;
            margin-top: 0.5rem;
          }
          .games-section-divider {
            width: 80%;
            margin-left: 1.5rem;
            margin-bottom: 1rem;
            height: 2.5px;
            background: #fff;
          }
          .games-grid-spacer {
            display: block;
            min-width: 1rem;
          }
                 }

         /* Unified Animation System */
         .games-header {
           opacity: 0;
           animation: fadeIn 1s ease-out forwards;
         }

         .player-stats-container {
           opacity: 0;
           animation: fadeIn 1s ease-out 0.2s forwards;
         }

         .game-card-0 {
           opacity: 0;
           animation: fadeIn 0.8s ease-out 0.3s forwards;
         }

         .game-card-1 {
           opacity: 0;
           animation: fadeIn 0.8s ease-out 0.4s forwards;
         }

         .game-card-2 {
           opacity: 0;
           animation: fadeIn 0.8s ease-out 0.5s forwards;
         }

         @keyframes fadeIn {
           from {
             opacity: 0;
           }
           to {
             opacity: 1;
           }
         }
       `}</style>
    </div>
  );
};

export default Games;
