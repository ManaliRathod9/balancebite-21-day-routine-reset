import React from 'react';

const ToggleRow = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label className="label">{label}</label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt === value ? null : opt)}
          style={{
            padding: '0.4375rem 1rem', borderRadius: '100px',
            fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
            border: '1.5px solid', transition: 'all 0.18s',
            background: value === opt ? '#FAE6D8' : '#fff',
            color: value === opt ? '#884040' : '#7A6E65',
            borderColor: value === opt ? '#F4CCCA' : '#DDD7D0',
          }}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default function FemaleWellnessNotes({ data, onChange }) {
  const [open, setOpen] = React.useState(false);
  const set = (k, v) => onChange({ ...data, [k]: v });

  const insight = () => {
    const parts = [];
    if (data?.crampsLevel && data.crampsLevel !== 'None') parts.push('cramps');
    if (data?.lowEnergy === 'Yes') parts.push('low energy');
    if (data?.bloating === 'Yes') parts.push('bloating');
    if (parts.length >= 2) {
      return 'Your energy may be lower today because of physical discomfort. Keep your routine light. Focus on meals, water, and rest. This is not a setback. It is your body communicating.';
    }
    if (parts.length === 1) {
      return `You noted ${parts[0]} today. Be gentle with yourself. Small, consistent steps still count.`;
    }
    return null;
  };

  const insightText = insight();

  return (
    <div style={{
      background: '#FDF5F3', border: '1px solid #F4CCCA',
      borderRadius: '1.5rem', padding: '1.25rem',
      marginBottom: '1.25rem',
    }}>
      <button type="button" onClick={() => setOpen(v => !v)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🌸</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, color: '#884040', fontSize: '0.875rem' }}>Female Wellness Notes</p>
          <p style={{ fontSize: '0.75rem', color: '#B07070', marginTop: '0.15rem' }}>Optional, private and respectful</p>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#C09090', fontWeight: 600 }}>{open ? '▲ Hide' : '▼ Show'}</span>
      </button>

      {open && (
        <div style={{ marginTop: '1.25rem' }} className="fade-in">
          <div style={{
            background: 'rgba(244,204,202,0.3)', borderRadius: '0.875rem',
            padding: '0.75rem 0.875rem', marginBottom: '1rem',
            fontSize: '0.775rem', color: '#884040', lineHeight: 1.6,
          }}>
            ⚠️ This section is completely optional and for your personal awareness only.
            No medical claims are made here. Skip anything you prefer not to answer.
          </div>

          <ToggleRow label="Period day?" value={data?.periodDay} onChange={v => set('periodDay', v)}
            options={['Yes', 'No', 'Prefer not to answer']} />
          <ToggleRow label="Cramps?" value={data?.crampsLevel} onChange={v => set('crampsLevel', v)}
            options={['None', 'Mild', 'Moderate', 'Strong']} />
          <ToggleRow label="Cravings today?" value={data?.cravings} onChange={v => set('cravings', v)}
            options={['Yes', 'No']} />
          <ToggleRow label="Bloating?" value={data?.bloating} onChange={v => set('bloating', v)}
            options={['Yes', 'No']} />
          <ToggleRow label="Low energy today?" value={data?.lowEnergy} onChange={v => set('lowEnergy', v)}
            options={['Yes', 'No']} />

          {insightText && (
            <div style={{
              background: 'rgba(255,255,255,0.8)', border: '1px solid #F4CCCA',
              borderRadius: '0.875rem', padding: '0.875rem 1rem', marginTop: '0.5rem',
            }} className="fade-in">
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#884040', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                🌸 Gentle insight
              </p>
              <p style={{ fontSize: '0.8375rem', color: '#5C5249', lineHeight: 1.65 }}>{insightText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
