import React from 'react'
import { useNavigate } from 'react-router-dom'

// Data for each card: title, description, button text, route, and gradient
const cardData = [
  {
    title: 'Learn',
    description: 'Start your journey by learning the basics of sign language with interactive lessons.',
    button: 'Start Learning',
    to: '/lessons',
    icon: <img src="/SVGIcons/Navbar/lessons.svg" alt="Lessons" style={{ width: 48, height: 48 }} />,
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    title: 'Play',
    description: 'Test your knowledge and have fun with sign language games and challenges.',
    button: 'Play Games',
    to: '/games',
    icon: <img src="/SVGIcons/Navbar/games.svg" alt="Games" style={{ width: 48, height: 48 }} />,
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    title: 'Dictionary',
    description: 'Explore our comprehensive dictionary to find signs for any word you need.',
    button: 'Open Dictionary',
    to: '/dictionary',
    icon: <img src="/SVGIcons/Navbar/Dictionary.svg" alt="Dictionary" style={{ width: 48, height: 48 }} />,
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
];

// Stats data
const statsData = [
  { number: '200+', label: 'Signs to Learn', icon: '📝' },
  { number: '3', label: 'Interactive Games', icon: '🎯' },
  { number: '24/7', label: 'Available', icon: '🕰️' },
  { number: '100%', label: 'Free Access', icon: '☑️' },
];

const Home = () => {
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [hoveredButton, setHoveredButton] = React.useState(null);
  const [hoveredStat, setHoveredStat] = React.useState(null);
  const navigate = useNavigate();
  
  return (
    <div className="home-container">
      {/* Decorative background elements */}
      <div className="decorative-circle decorative-circle-1" />
      <div className="decorative-circle decorative-circle-2" />
      
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Master Filipino Sign Language
        </h1>
        <p className="hero-subtitle">
          Discover the beauty of FSL through interactive lessons, engaging games, and a comprehensive dictionary. 
          Start your journey to becoming fluent in sign language today.
        </p>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`stat-card ${hoveredStat === index ? 'stat-card-hovered' : ''}`}
            onMouseEnter={() => setHoveredStat(index)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Divider Text */}
      <div className="divider-text">
        Explore your next step below!
        <div className="divider-line" />
      </div>

      {/* Cards Section */}
      <section className="cards-container">
        {cardData.map((card, idx) => (
          <div
            key={idx}
            className={`card ${hoveredCard === idx ? 'card-hovered' : ''}`}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`card-background ${hoveredCard === idx ? 'card-background-hovered' : ''}`} />
            <span className={`card-icon ${hoveredCard === idx ? 'card-icon-hovered' : ''}`}>{card.icon}</span>
            <h2 className={`card-title ${hoveredCard === idx ? 'card-title-hovered' : ''}`}>{card.title}</h2>
            <p className={`card-description ${hoveredCard === idx ? 'card-description-hovered' : ''}`}>{card.description}</p>
            <div className="card-spacer" />
            <button
              className={`card-button ${hoveredButton === idx ? 'card-button-hovered' : ''}`}
              onMouseEnter={() => setHoveredButton(idx)}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => navigate(card.to)}
            >
              {card.button}
            </button>
          </div>
        ))}
      </section>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          background: transparent;
        }

        .decorative-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          pointer-events: none;
          z-index: -1;
        }

        .decorative-circle-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 5%;
          animation: float 6s ease-in-out infinite;
        }

        .decorative-circle-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 10%;
          animation: float 8s ease-in-out infinite reverse;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 800px;
          width: 100%;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: #fff;
          font-weight: 400;
          margin-bottom: 2rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .stats-section {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: clamp(1rem, 3vw, 3rem);
          margin-bottom: 4rem;
          flex-wrap: wrap;
          max-width: 1000px;
          width: 100%;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          padding: 2rem 1.2rem;
          text-align: center;
          min-width: 120px;
          flex: 1 1 200px;
          transition: all 0.35s cubic-bezier(.4,2,.3,1);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .stat-card-hovered {
          transform: translateY(-8px) scale(1.035);
          box-shadow: 
            0 16px 48px 0 rgba(31, 38, 135, 0.45),
            0 4px 24px 0 rgba(0,0,0,0.18),
            0 0 0 2px rgba(255,255,255,0.13);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #ffe0fa;
          font-weight: 500;
        }

        .divider-text {
          display: inline-block;
          text-align: center;
          margin: 2.5rem 0 2rem 0;
          color: #ffb6e6;
          font-weight: 600;
          font-size: 1.25rem;
          letter-spacing: 0.01em;
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          border: 1px solid rgba(255,255,255,0.13);
          padding: 1.1rem 2.5rem 1.3rem 2.5rem;
          min-width: 220px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .divider-line {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          border-radius: 2px;
          margin: 0.7rem auto 0 auto;
          opacity: 0.7;
        }

        .cards-container {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 2rem;
          flex-wrap: wrap;
          max-width: 1200px;
          width: 100%;
        }

        .card {
          background: rgba(255, 255, 255, 0.10);
          border-radius: 2.5rem 1.5rem 2.5rem 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          padding: 1.7rem 1.2rem 1.4rem 1.2rem;
          margin: 0.75rem;
          min-width: 200px;
          max-width: 260px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1.5px solid rgba(255,255,255,0.18);
          color: #2d0036;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(.4,2,.3,1);
          outline: none;
          z-index: 1;
        }

        .card-hovered {
          transform: translateY(-5px) scale(1.005) translateZ(0);
          box-shadow: 0 24px 36px rgba(0, 0, 0, 0.11), 0 24px 46px rgba(161, 140, 209, 0.48);
          z-index: 2;
          transition: all 0.3s ease-out;
          border: 2px solid rgba(255, 111, 161, 0.25);
          color: #fff;
          outline: 2px solid #ff6fa1;
        }

        .card-background {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.13);
          transform: translate(-50%, -50%) scale(1);
          transition: all 0.35s cubic-bezier(.4,2,.3,1);
          z-index: 0;
        }

        .card-background-hovered {
          width: 90px;
          height: 90px;
          background: rgba(255, 111, 161, 0.13);
          transform: translate(-50%, -50%) scale(4.5);
        }

        .card-icon {
          font-size: 3.2rem;
          margin-bottom: 1.2rem;
          filter: drop-shadow(0 0 8px #a18cd1) drop-shadow(0 2px 8px rgba(58, 35, 115, 0.10)); rers
          transition: filter 0.3s;
          position: relative;
          z-index: 1;
        }

        .card-icon-hovered {
          filter: drop-shadow(0 0 18px #ff6fa1) drop-shadow(0 0 8px #a18cd1);
        }

        .card-title {
          margin-bottom: 0.7rem;
          font-weight: 700;
          text-align: center;
          font-size: 1.18rem;
          color: #ffb6e6;
          transition: all 0.3s;
          position: relative;
          z-index: 1;
        }

        .card-title-hovered {
          color: #fff;
          text-shadow: 0 1px 8px rgba(58, 35, 115, 0.13);
        }

        .card-description {
          margin-bottom: 0.7rem;
          text-align: center;
          flex: 1;
          font-size: 0.98rem;
          color: #ffb6e6;
          transition: all 0.3s;
          position: relative;
          z-index: 1;
        }

        .card-description-hovered {
          color: #fff;
          text-shadow: 0 1px 8px rgba(58, 35, 115, 0.10);
        }

        .card-spacer {
          flex: 1;
        }

        .card-button {
          margin-top: 1rem;
          padding: 0.6rem 1.2rem;
          border-radius: 1.2rem;
          border: none;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(58, 35, 115, 0.10);
          transition: all 0.3s ease-out;
          outline: none;
          position: relative;
          z-index: 1;
        }

        .card-button-hovered {
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          color: #3a2373;
          transform: scale(1.07);
          box-shadow: 0 6px 24px rgba(255, 111, 161, 0.28);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* Pure CSS Animations */
        .hero-section {
          animation: fadeInUp 1s ease-out;
        }

        .stats-section {
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .stat-card {
          animation: slideInUp 0.8s ease-out both;
        }

        .stat-card:nth-child(1) { animation-delay: 0.3s; }
        .stat-card:nth-child(2) { animation-delay: 0.4s; }
        .stat-card:nth-child(3) { animation-delay: 0.5s; }
        .stat-card:nth-child(4) { animation-delay: 0.6s; }

        .divider-text {
          animation: fadeInUp 1s ease-out 0.8s both;
        }

        .cards-container {
          animation: fadeInUp 1s ease-out 1s both;
        }

        .card {
          animation: slideInUp 0.8s ease-out both;
        }

        .card:nth-child(1) { animation-delay: 1.1s; }
        .card:nth-child(2) { animation-delay: 1.2s; }
        .card:nth-child(3) { animation-delay: 1.3s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 700px) {
          .stats-section {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 1.2rem;
            justify-items: center;
            align-items: center;
            margin-bottom: 2.5rem;
          }
          .stat-card {
            min-width: 0 !important;
            width: 100%;
            max-width: 100%;
            flex: none !important;
            font-size: 0.95rem;
          }
          .stat-number {
            font-size: 1.2rem !important;
            font-weight: 600 !important;
          }
          .stat-label {
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Home