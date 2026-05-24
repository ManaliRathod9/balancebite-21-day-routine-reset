import React from 'react';
import { getBadgeDef, getUniqueBadges } from '../utils/badgeUtils';

export function SingleBadge({ badge, size = 'md' }) {
  const def  = getBadgeDef(badge.id);
  const isLg = size === 'lg';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      background: 'linear-gradient(145deg, #FFF9F0 0%, #FAE6D8 100%)',
      border: '1px solid #F4D9A8',
      borderRadius: '1.25rem',
      padding: isLg ? '1.25rem 1rem' : '0.875rem 0.75rem',
      boxShadow: '0 2px 8px rgba(180,100,40,0.08)',
    }}>
      <span style={{ fontSize: isLg ? '2.25rem' : '1.5rem', marginBottom: isLg ? '0.5rem' : '0.375rem' }}>{def.emoji}</span>
      <p style={{ fontWeight: 600, color: '#8A5A2A', fontSize: isLg ? '0.8125rem' : '0.75rem', lineHeight: 1.35 }}>{def.label}</p>
      {isLg && <p style={{ fontSize: '0.75rem', color: '#9A8E84', marginTop: '0.375rem', lineHeight: 1.5 }}>{def.desc}</p>}
      {badge.date && <p style={{ fontSize: '0.7rem', color: '#B0A89E', marginTop: '0.375rem' }}>{badge.date}</p>}
    </div>
  );
}

export default function BadgeCard({ badges, title = 'Badges Earned' }) {
  const unique = getUniqueBadges(badges || []);

  if (!unique.length) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🏅</span>
        <p style={{ fontWeight: 600, color: '#9A8E84', fontSize: '0.875rem' }}>No badges yet</p>
        <p style={{ fontSize: '0.8rem', color: '#B0A89E', marginTop: '0.375rem' }}>
          Complete your first check-in to earn your first badge.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <p style={{ fontWeight: 700, color: '#3A3530', fontSize: '0.875rem' }}>🏅 {title}</p>
        <span style={{
          background: '#FAE6D8', color: '#A85530', fontSize: '0.7rem', fontWeight: 700,
          padding: '0.2rem 0.625rem', borderRadius: '100px',
        }}>{unique.length}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.625rem' }}>
        {unique.map(b => <SingleBadge key={b.id} badge={b} size="md" />)}
      </div>
    </div>
  );
}
