import React, { useState } from 'react';

const STEPS = [
  { icon: '💧', title: 'Drink water',           desc: 'Take one slow, full glass of water before anything else.' },
  { icon: '🌬️', title: 'Five slow breaths',     desc: 'In for 4 counts, hold for 2, out for 6. Repeat 5 times.' },
  { icon: '🚶', title: 'Walk or stretch 2 min', desc: 'Stand up, roll your shoulders, walk around the room.' },
  { icon: '💭', title: 'Check in with yourself', desc: 'Am I actually hungry? Or stressed, bored, tired, or emotional?' },
];

const RESPONSES = [
  { id: 'still-eat',   label: 'I still want to eat',         emoji: '🍽️', message: 'That is completely okay. Eat mindfully and slowly. You are allowed to eat.' },
  { id: 'feel-better', label: 'I feel better now',           emoji: '✨', message: 'The pause worked. That is real self-awareness. Well done.' },
  { id: 'eat-light',   label: "I'll eat something light",    emoji: '🥗', message: 'A gentle choice. Something light can nourish without feeling heavy.' },
  { id: 'write-trigger', label: "I'll write what triggered this", emoji: '📝', message: 'Writing helps. Use the notes section to capture what you are feeling.' },
];

export default function StressEatingPause({ onResponse }) {
  const [open,   setOpen]   = useState(false);
  const [step,   setStep]   = useState(0);
  const [chosen, setChosen] = useState(null);

  const handleResponse = (r) => { setChosen(r); if (onResponse) onResponse(r.id); };
  const reset = () => { setOpen(false); setStep(0); setChosen(null); };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem',
        background: '#FFF9F0', border: '1.5px solid #F4D9A8',
        borderRadius: '1rem', padding: '0.875rem 1rem',
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#FDF4EF'}
      onMouseLeave={e => e.currentTarget.style.background = '#FFF9F0'}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⏸️</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, color: '#8A6020', fontSize: '0.875rem' }}>I feel like overeating</p>
          <p style={{ fontSize: '0.75rem', color: '#B0882A', marginTop: '0.15rem' }}>Tap for a gentle 5-minute pause, no judgment.</p>
        </div>
        <span style={{ color: '#C8A860', fontSize: '0.85rem' }}>→</span>
      </button>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(145deg, #FFF9F0 0%, #FDF4EF 100%)',
      border: '1px solid #F4D9A8', borderRadius: '1.5rem', padding: '1.5rem',
      boxShadow: '0 2px 12px rgba(180,120,40,0.08)',
    }} className="fade-in">

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⏸️</span>
          <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1rem', color: '#8A6020', fontWeight: 400 }}>
            5-Minute Pause
          </h3>
        </div>
        <button onClick={reset} style={{ background: 'none', border: 'none', color: '#9A8E84', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
          Close ✕
        </button>
      </div>

      <p style={{ fontSize: '0.8375rem', color: '#7A6E65', lineHeight: 1.65, marginBottom: '1.25rem' }}>
        You are not in trouble. This pause is a gentle tool. Go through each step slowly.
      </p>

      {!chosen ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                borderRadius: '0.875rem', padding: '0.75rem 0.875rem',
                background: i <= step ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                border: `1px solid ${i <= step ? '#F4D9A8' : 'transparent'}`,
                opacity: i <= step ? 1 : 0.45,
                transition: 'all 0.3s',
              }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#3A3530', fontSize: '0.8375rem' }}>{s.title}</p>
                  {i <= step && <p style={{ fontSize: '0.775rem', color: '#9A8E84', marginTop: '0.2rem', lineHeight: 1.55 }}>{s.desc}</p>}
                </div>
                {i < step && <span style={{ color: '#52664A', fontSize: '0.875rem', flexShrink: 0 }}>✓</span>}
              </div>
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-primary" style={{ width: '100%' }}>
              Next Step
            </button>
          ) : (
            <div>
              <p style={{ fontWeight: 600, color: '#3A3530', fontSize: '0.875rem', textAlign: 'center', marginBottom: '0.875rem' }}>
                How do you feel right now?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {RESPONSES.map(r => (
                  <button key={r.id} onClick={() => handleResponse(r)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: '#fff', border: '1.5px solid #F4D9A8',
                    borderRadius: '0.875rem', padding: '0.75rem 0.875rem',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
                    fontSize: '0.8rem', fontWeight: 600, color: '#5C5249',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFF9F0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>{r.emoji}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem 0' }} className="fade-in">
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>{chosen.emoji}</span>
          <p style={{ fontWeight: 600, color: '#3A3530', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{chosen.label}</p>
          <p style={{ fontSize: '0.8125rem', color: '#7A6E65', lineHeight: 1.65, marginBottom: '1.25rem' }}>{chosen.message}</p>
          <button onClick={reset} className="btn-outline" style={{ fontSize: '0.8rem' }}>Close pause</button>
        </div>
      )}
    </div>
  );
}
