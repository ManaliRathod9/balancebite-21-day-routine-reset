import React, { useState } from 'react';
import { saveLetter, loadLetter } from '../utils/storageUtils';

export default function LetterToSelf({ day, onSave }) {
  const existing = loadLetter();
  const [text, setText] = useState(day === 1 ? existing.day1 : existing.day21);
  const [saved, setSaved] = useState(!!(day === 1 ? existing.day1 : existing.day21));

  const handleSave = () => {
    const letter = loadLetter();
    if (day === 1) letter.day1 = text;
    else letter.day21 = text;
    saveLetter(letter);
    setSaved(true);
    if (onSave) onSave(letter);
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #F7F4FB 0%, #EEE8F7 100%)',
      border: '1px solid #DCCFEF',
      borderRadius: '1.5rem', padding: '1.75rem',
      boxShadow: '0 2px 10px rgba(100,60,180,0.07)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.125rem' }}>
        <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>💌</span>
        <div>
          <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.125rem', color: '#2E2924', fontWeight: 400 }}>
            {day === 1 ? 'Letter to Myself, Day 1' : 'Reflection, Day 21'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#8A68BA', marginTop: '0.25rem', fontStyle: 'italic' }}>
            {day === 1
              ? 'Why are you starting this 21-day reset?'
              : 'What changed in the way you understand your routine?'}
          </p>
        </div>
      </div>

      {day === 21 && existing.day1 && (
        <div style={{
          background: 'rgba(255,255,255,0.7)', border: '1px solid #DCCFEF',
          borderRadius: '1rem', padding: '1rem', marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6F519E', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            You started this reset because:
          </p>
          <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.7, fontStyle: 'italic' }}>"{existing.day1}"</p>
        </div>
      )}

      {saved && !day ? (
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '1rem', padding: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.7, fontStyle: 'italic' }}>"{text}"</p>
          <button onClick={() => setSaved(false)} style={{
            background: 'none', border: 'none', color: '#6F519E',
            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem',
          }}>Edit ✏️</button>
        </div>
      ) : (
        <>
          <textarea value={text} onChange={e => setText(e.target.value)}
            rows={4}
            placeholder={day === 1
              ? 'Write your reason for starting. Be honest and gentle with yourself…'
              : 'Reflect on the journey. What feels different now?…'}
            className="input-field"
            style={{ resize: 'none', fontSize: '0.875rem', lineHeight: 1.7 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.875rem' }}>
            <p className="microcopy">Saved privately in your browser.</p>
            <button onClick={handleSave} disabled={!text?.trim()} className="btn-primary"
              style={{ fontSize: '0.8375rem', padding: '0.5rem 1.25rem', opacity: !text?.trim() ? 0.4 : 1 }}>
              {saved ? '✓ Saved' : 'Save Letter'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
