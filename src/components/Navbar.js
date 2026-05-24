import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loadChallenge, getChallengeDay } from '../utils/storageUtils';

const NAV_LINKS = [
  { to: '/',          label: 'Home'      },
  { to: '/profile',   label: 'Profile'   },
  { to: '/symptoms',  label: 'Symptoms'  },
  { to: '/plan',      label: 'Plan'      },
  { to: '/check-in',  label: 'Check-In'  },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reports',   label: 'Reports'   },
  { to: '/backup',    label: 'Backup'    },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const challenge  = loadChallenge();
  const day        = challenge ? getChallengeDay() : null;

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #EDE8E2', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(60,40,20,0.06)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '3.75rem', gap: '1.5rem' }}>

          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
          >
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '0.625rem',
              background: 'linear-gradient(135deg, #6B8260 0%, #3F503A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>
              🌿
            </div>
            <span style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.1rem', color: '#2E2924', letterSpacing: '-0.01em', lineHeight: 1 }}>
              BalanceBite
            </span>
          </button>

          <nav style={{ display: 'none', alignItems: 'center', gap: '0.125rem', flex: 1 }} className="desktop-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#3F503A' : '#8A7F75',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '100px',
                  background: isActive ? '#E4EAE0' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.18s',
                  whiteSpace: 'nowrap',
                })}
                onMouseEnter={e => { if (!e.target.style.background.includes('E4EAE0')) { e.target.style.background = '#F3F5F0'; e.target.style.color = '#52664A'; } }}
                onMouseLeave={e => { if (!e.target.style.background.includes('E4EAE0')) { e.target.style.background = 'transparent'; e.target.style.color = '#8A7F75'; } }}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexShrink: 0 }}>
            {day && (
              <div className="day-badge">
                <span style={{ fontSize: '0.7rem' }}>▸</span>
                Day {day} / 21
              </div>
            )}

            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
              style={{
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
                borderRadius: '0.625rem',
              }}
            >
              <span style={{ display: 'block', width: '1.25rem', height: '1.5px', background: '#5C5249', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(3px, 4px)' : 'none' }} />
              <span style={{ display: 'block', width: '1.25rem', height: '1.5px', background: '#5C5249', borderRadius: '2px', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '1.25rem', height: '1.5px', background: '#5C5249', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(3px, -5px)' : 'none' }} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ paddingBottom: '1rem' }} className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#3F503A' : '#7A6E65',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.875rem',
                    background: isActive ? '#E4EAE0' : '#F3F5F0',
                    textDecoration: 'none',
                    border: isActive ? '1px solid #C8D5C0' : '1px solid transparent',
                  })}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
