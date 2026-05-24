import React from 'react';
import { generatePatternStory } from '../utils/reportUtils';

export default function PatternStory({ entries, title = 'Your Pattern Story' }) {
  const story = generatePatternStory(entries);

  return (
    <div style={{
      background: 'linear-gradient(145deg, #F3F5F0 0%, #EDE8E2 100%)',
      border: '1px solid #C8D5C0',
      borderRadius: '1.5rem', padding: '1.75rem',
      boxShadow: '0 2px 10px rgba(60,40,20,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.25rem' }}>📖</span>
        <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.1rem', color: '#2E2924', fontWeight: 400 }}>
          {title}
        </h3>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.75 }}>{story}</p>

      {entries && entries.length >= 7 && (
        <div style={{ marginTop: '1.125rem', paddingTop: '1rem', borderTop: '1px solid #C8D5C0' }}>
          <p style={{ fontSize: '0.775rem', color: '#7A8C6E', fontStyle: 'italic' }}>
            Based on your last {entries.length} check-in{entries.length !== 1 ? 's' : ''}.
            Patterns become clearer with more data.
          </p>
        </div>
      )}
    </div>
  );
}
