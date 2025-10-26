import React from 'react'

const Footer = () => {
  return (
    <footer
      style={{
        width: '100%',
        padding: '1.5rem 2rem',
        background: 'rgba(30,22,54,0.45)',
        boxShadow: '0 8px 32px 0 rgba(161, 140, 209, 0.18), 0 0 60px 0 rgba(255, 182, 230, 0.13)',
        border: '1.5px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        textAlign: 'center',
        color: '#ffb6e6',
        fontWeight: 500,
        fontSize: '1.05rem',
        zIndex: 10,
        marginTop: '10rem',
      }}
    >
      <div style={{ marginBottom: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '0.03em', background: 'linear-gradient(135deg, #ffb6e6 0%, #a18cd1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          IT'S A SIGN
        </span>
        <a href="#" style={{ color: '#ffe0fa', textDecoration: 'none', margin: '0 0.5rem', fontWeight: 500 }}>Privacy Policy</a>
        <a href="#" style={{ color: '#ffe0fa', textDecoration: 'none', margin: '0 0.5rem', fontWeight: 500 }}>Contact</a>
      </div>
      <div style={{ fontSize: '0.95rem', color: '#eae6f7', opacity: 0.8 }}>
        &copy; {new Date().getFullYear()} IT'S A SIGN. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer