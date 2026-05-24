import React from 'react';

const STEPS = [
  { emoji: '💧', action: 'Drink a glass of water',     detail: 'Right now. One glass is a real, complete step.' },
  { emoji: '🍽️', action: 'Eat one proper meal',        detail: 'Even something simple like toast, fruit, or soup counts.' },
  { emoji: '🌙', action: 'Sleep 30 minutes earlier tonight', detail: 'One earlier night can shift your whole next day.' },
];

export default function RecoveryModeCard() {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #FFF5F5 0%, #FDF4EF 100%)',
      border: '1px solid #F4CCCA',
      borderRadius: '1.5rem',
      padding: '1.75rem',
      boxShadow: '0 2px 12px rgba(180,80,60,0.07)',
    }} className="fade-in">

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>🌧️</span>
        <div>
          <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.125rem', color: '#884040', fontWeight: 400, marginBottom: '0.25rem' }}>
            Today is a recovery day, not a failed day.
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#B07070', fontStyle: 'italic' }}>
            You are rebuilding, not failing.
          </p>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#7A6E65', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        Your routine needs a little care today. Do not try to fix everything at once.
        Three small, gentle steps are enough for now.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
        {STEPS.map(({ emoji, action, detail }, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            background: 'rgba(255,255,255,0.75)', borderRadius: '1rem', padding: '0.875rem 1rem',
          }}>
            <span style={{ fontSize: '1.125rem', flexShrink: 0, marginTop: '0.1rem' }}>{emoji}</span>
            <div>
              <p style={{ fontWeight: 600, color: '#3A3530', fontSize: '0.875rem', lineHeight: 1.35 }}>{action}</p>
              <p style={{ fontSize: '0.775rem', color: '#9A8E84', marginTop: '0.25rem', lineHeight: 1.55 }}>{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(200,140,120,0.2)' }}>
        <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1rem', color: '#B05050', fontStyle: 'italic' }}>
          "One small step still counts."
        </p>
        <p style={{ fontSize: '0.75rem', color: '#B0A89E', marginTop: '0.375rem' }}>
          You showed up. That is already more than nothing.
        </p>
      </div>
    </div>
  );
}
