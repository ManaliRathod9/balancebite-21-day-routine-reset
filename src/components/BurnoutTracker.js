import React from 'react';

export default function BurnoutTracker({ data, onChange }) {
  const [open, setOpen] = React.useState(false);
  const set = (k, v) => onChange({ ...data, [k]: v });

  const insight = () => {
    const hours    = Number(data?.workHours) || 0;
    const apps     = Number(data?.appsSubmitted) || 0;
    const rejections = data?.rejectionEvent;
    const skipped  = data?.skippedMeals;
    if (hours >= 5 && skipped) return 'You spent many hours working and skipped a meal. Tomorrow, try a shorter focused session with a meal break first.';
    if (rejections && hours >= 4) return 'A tough day with long hours and a difficult message. Rest is productive recovery. Be kind to yourself tonight.';
    if (apps >= 5) return `You submitted ${apps} applications today. That is real effort. Quality over quantity when you have the energy.`;
    return null;
  };

  const insightText = insight();

  return (
    <div style={{
      background: '#EEF4FA', border: '1px solid #B8D0E8',
      borderRadius: '1.5rem', padding: '1.25rem',
      marginBottom: '1.25rem',
    }}>
      <button type="button" onClick={() => setOpen(v => !v)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💼</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, color: '#3A5570', fontSize: '0.875rem' }}>Job Search / Study / Work Tracker</p>
          <p style={{ fontSize: '0.75rem', color: '#6A8EA8', marginTop: '0.15rem' }}>Optional: track your focus and pressure</p>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#8AAECC', fontWeight: 600 }}>{open ? '▲ Hide' : '▼ Show'}</span>
      </button>

      {open && (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="fade-in">

          <div>
            <label className="label">Applications submitted today</label>
            <input type="number" min="0" max="50" value={data?.appsSubmitted || ''}
              onChange={e => set('appsSubmitted', e.target.value)} className="input-field" placeholder="0" />
          </div>

          <div>
            <label className="label">LinkedIn messages / networking today</label>
            <input type="number" min="0" max="50" value={data?.linkedinMessages || ''}
              onChange={e => set('linkedinMessages', e.target.value)} className="input-field" placeholder="0" />
          </div>

          <div>
            <label className="label">Interview prep or focused study (minutes)</label>
            <input type="number" min="0" max="600" value={data?.prepMinutes || ''}
              onChange={e => set('prepMinutes', e.target.value)} className="input-field" placeholder="0" />
          </div>

          <div>
            <label className="label">Focused work / study blocks completed</label>
            <input type="number" min="0" max="20" value={data?.focusedBlocks || ''}
              onChange={e => set('focusedBlocks', e.target.value)} className="input-field" placeholder="0" />
          </div>

          <div>
            <label className="label">Rejection or stressful message today?</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Yes', 'No'].map(opt => (
                <button key={opt} type="button" onClick={() => set('rejectionEvent', opt === 'Yes')}
                  style={{
                    padding: '0.5rem 1.25rem', borderRadius: '100px',
                    fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                    border: '1.5px solid', transition: 'all 0.18s',
                    background: (opt === 'Yes' && data?.rejectionEvent === true) || (opt === 'No' && data?.rejectionEvent === false) ? '#D4E6F4' : '#fff',
                    color: (opt === 'Yes' && data?.rejectionEvent === true) || (opt === 'No' && data?.rejectionEvent === false) ? '#3A5570' : '#7A6E65',
                    borderColor: (opt === 'Yes' && data?.rejectionEvent === true) || (opt === 'No' && data?.rejectionEvent === false) ? '#8AAECC' : '#DDD7D0',
                  }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Emotional state after work / job search today</label>
            <select value={data?.emotionalStateAfterWork || ''} onChange={e => set('emotionalStateAfterWork', e.target.value)} className="select-field">
              <option value="">Select…</option>
              {['Motivated', 'Drained', 'Hopeful', 'Frustrated', 'Anxious', 'Neutral', 'Proud', 'Burned out'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {insightText && (
            <div style={{
              background: 'rgba(255,255,255,0.8)', border: '1px solid #B8D0E8',
              borderRadius: '0.875rem', padding: '0.875rem 1rem',
            }} className="fade-in">
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3A5570', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                💡 Insight
              </p>
              <p style={{ fontSize: '0.8375rem', color: '#5C5249', lineHeight: 1.65 }}>{insightText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
