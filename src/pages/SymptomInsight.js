import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile, save } from '../utils/storageUtils';
import { generateSymptomInsights } from '../utils/insightUtils';

const ALL_SYMPTOMS = [
  'Low concentration', 'Tiredness', 'Headache', 'Mood swings', 'Cravings',
  'Overeating', 'Skipping meals', 'Poor sleep', 'Stress', 'Low energy',
  'Bloating', 'Body heaviness', 'Anxiety feeling', 'No motivation',
  'Irregular wake-up time', 'Irregular sleep time', 'Too much screen time',
  'Feeling guilty after eating', 'Feeling lost or unproductive',
  'Job-search burnout', 'Study/work burnout',
];

const DISCLAIMER_NOTE = 'These are observations based on common lifestyle patterns, not diagnoses. Nothing here is medical advice.';

export default function SymptomInsight() {
  const navigate = useNavigate();
  const profile  = loadProfile();
  const [selected, setSelected] = useState([]);
  const [insights, setInsights]  = useState(null);

  const toggle = (s) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleGenerate = () => {
    const result = generateSymptomInsights(selected, profile);
    setInsights(result);
    save('balanceBiteSymptoms', selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper fade-in">

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="step-pill">Step 2 of 3</div>
        <h1 className="section-title">What have you been experiencing?</h1>
        <p className="page-subtitle">
          Select anything that feels relevant recently. This helps us show you meaningful patterns, not to worry you, but to help you understand yourself.
        </p>
      </div>

      {!insights ? (
        <>
          {/* Symptom chips */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#9A8E84', marginBottom: '1rem', lineHeight: 1.55 }}>
              Tap any symptom or struggle you have noticed in the past week or two. You can always update this.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ALL_SYMPTOMS.map(s => (
                <button key={s} type="button" onClick={() => toggle(s)}
                  className={`chip ${selected.includes(s) ? 'chip-selected' : 'chip-unselected'}`}>
                  {s}
                </button>
              ))}
            </div>

            {selected.length > 0 && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #EDE8E2' }}>
                <p style={{ fontSize: '0.8rem', color: '#52664A', fontWeight: 600 }}>
                  {selected.length} item{selected.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{
            background: '#FFF9F0', border: '1px solid #F4D9A8',
            borderRadius: '1rem', padding: '0.875rem 1rem',
            display: 'flex', gap: '0.625rem', marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: '0.775rem', color: '#8A6A3A', lineHeight: 1.6 }}>{DISCLAIMER_NOTE}</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={handleGenerate} className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.875rem 2.25rem' }}>
              {selected.length === 0 ? 'Continue without selecting →' : 'Show My Insights →'}
            </button>
          </div>
        </>
      ) : (
        <div className="fade-in">

          {/* Intro callout */}
          <div style={{
            background: '#F3F5F0', border: '1px solid #C8D5C0',
            borderRadius: '1.25rem', padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🌿</span>
            <div>
              <p style={{ fontWeight: 600, color: '#3F503A', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Possible patterns based on your selections
              </p>
              <p style={{ fontSize: '0.78rem', color: '#7A8C6E', lineHeight: 1.55 }}>
                These are gentle observations, not conclusions. Use them as starting points, not verdicts.
              </p>
            </div>
          </div>

          {/* Insight cards */}
          {insights.map((ins, i) => (
            <div key={i} className="card" style={{ marginBottom: '1rem', borderLeft: '3px solid #869F78' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.375rem' }}>{ins.icon}</span>
                <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.125rem', color: '#2E2924', fontWeight: 400 }}>
                  {ins.title}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div style={{ background: '#F3F5F0', borderRadius: '0.875rem', padding: '0.875rem 1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#52664A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    One possible pattern
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#3A3530', lineHeight: 1.65 }}>{ins.pattern}</p>
                </div>

                <div style={{ background: '#F7F4FB', borderRadius: '0.875rem', padding: '0.875rem 1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6F519E', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    Why this may happen
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#3A3530', lineHeight: 1.65 }}>{ins.why}</p>
                </div>

                <div style={{ background: '#FFF9F0', border: '1px solid #F4D9A8', borderRadius: '0.875rem', padding: '0.875rem 1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#A85530', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    🌱 One thing to try today
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#3A3530', lineHeight: 1.65 }}>{ins.today}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Disclaimer */}
          <div style={{
            background: '#FFF9F0', border: '1px solid #F4D9A8',
            borderRadius: '1rem', padding: '0.875rem 1rem',
            display: 'flex', gap: '0.625rem', marginBottom: '1.75rem',
          }}>
            <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: '0.775rem', color: '#8A6A3A', lineHeight: 1.6 }}>
              BalanceBite provides lifestyle awareness only and is not medical advice.
              If symptoms are severe, unusual, or continue, please consult a healthcare professional.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => setInsights(null)} className="btn-secondary">← Change selections</button>
            <button onClick={() => navigate('/plan')} className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Build My 21-Day Plan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
