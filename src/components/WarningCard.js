import React, { useState } from 'react';

const STYLES = {
  red:    { bg: '#FFF5F5', border: '#F4CCCA', leftBorder: '#C05E58', icon: '⚠️', labelColor: '#884040' },
  yellow: { bg: '#FFF9F0', border: '#F4D9A8', leftBorder: '#B8862A', icon: '💛', labelColor: '#8A6020' },
  green:  { bg: '#F3F5F0', border: '#C8D5C0', leftBorder: '#52664A', icon: '✓',  labelColor: '#3F503A' },
};

export default function WarningCard({ warning }) {
  const [expanded, setExpanded] = useState(false);
  const s = STYLES[warning.severity] || STYLES.yellow;

  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderLeft: `3px solid ${s.leftBorder}`,
      borderRadius: '1rem', marginBottom: '0.625rem',
      overflow: 'hidden',
    }} className="fade-in">
      <button
        style={{
          width: '100%', display: 'flex', alignItems: 'flex-start',
          gap: '0.75rem', padding: '0.875rem 1rem',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
        onClick={() => setExpanded(v => !v)}
      >
        <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '0.1rem', color: s.labelColor }}>{s.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, color: s.labelColor, fontSize: '0.875rem', lineHeight: 1.4 }}>
            {warning.title}
          </p>
          {warning.severity !== 'green' && (
            <p style={{ fontSize: '0.75rem', color: '#9A8E84', marginTop: '0.2rem' }}>
              {expanded ? 'Tap to collapse' : 'Tap for context and a small fix'}
            </p>
          )}
        </div>
        {warning.severity !== 'green' && (
          <span style={{ color: '#B0A89E', fontSize: '0.7rem', flexShrink: 0, marginTop: '0.25rem' }}>
            {expanded ? '▲' : '▼'}
          </span>
        )}
      </button>

      {expanded && (
        <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="fade-in">
          {warning.cause && (
            <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem', padding: '0.75rem 0.875rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Possible cause</p>
              <p style={{ fontSize: '0.8375rem', color: '#3A3530', lineHeight: 1.65 }}>{warning.cause}</p>
            </div>
          )}
          {warning.cons && (
            <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem', padding: '0.75rem 0.875rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>If unaddressed</p>
              <p style={{ fontSize: '0.8375rem', color: '#3A3530', lineHeight: 1.65 }}>{warning.cons}</p>
            </div>
          )}
          {warning.fix && (
            <div style={{ background: '#F3F5F0', border: '1px solid #C8D5C0', borderRadius: '0.75rem', padding: '0.75rem 0.875rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#52664A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>One small fix</p>
              <p style={{ fontSize: '0.8375rem', color: '#3A3530', lineHeight: 1.65 }}>{warning.fix}</p>
            </div>
          )}
          {warning.pros && (
            <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem', padding: '0.75rem 0.875rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>If you improve this</p>
              <p style={{ fontSize: '0.8375rem', color: '#3A3530', lineHeight: 1.65 }}>{warning.pros}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
