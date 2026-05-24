import React from 'react';
import { getScoreStatus } from '../utils/scoreUtils';

const STATUS_STYLES = {
  'Strong Routine':    { ring: '#52664A', bg: '#F3F5F0', border: '#C8D5C0', textColor: '#3F503A', label: 'Strong Routine',    message: 'Great awareness and consistency today. Keep this momentum.' },
  'Improving Routine': { ring: '#5A7FA8', bg: '#EEF4FA', border: '#B8D0E8', textColor: '#3A5570', label: 'Improving Routine', message: 'You are building positive habits. One day at a time.' },
  'Needs Attention':   { ring: '#B8862A', bg: '#FFF9F0', border: '#F4D9A8', textColor: '#8A6020', label: 'Needs Attention',   message: 'Your routine needs a little care today. One step is enough.' },
  'Recovery Day':      { ring: '#B05050', bg: '#FFF5F5', border: '#F4CCCA', textColor: '#884040', label: 'Recovery Day',      message: 'Today is a recovery day, and that is completely okay.' },
};

const EMOJI_MAP = {
  'Strong Routine': '🌿', 'Improving Routine': '🌱', 'Needs Attention': '🌤️', 'Recovery Day': '🌧️',
};

export default function RoutineScoreCard({ score, date, compact = false }) {
  const status    = getScoreStatus(score);
  const style     = STATUS_STYLES[status.label] || STATUS_STYLES['Recovery Day'];
  const radius    = compact ? 36 : 50;
  const strokeW   = compact ? 7 : 8;
  const svgSize   = compact ? 90 : 120;
  const circumference = 2 * Math.PI * radius;
  const offset    = circumference - (score / 100) * circumference;

  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '1.5rem',
      padding: compact ? '1rem 1.25rem' : '1.5rem',
      display: 'flex',
      flexDirection: compact ? 'row' : 'column',
      alignItems: compact ? 'center' : 'center',
      gap: compact ? '1rem' : '0.875rem',
      boxShadow: '0 2px 10px rgba(60,40,20,0.07)',
    }} className="fade-in">

      <div style={{ position: 'relative', flexShrink: 0, width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={svgSize/2} cy={svgSize/2} r={radius}
            fill="none" stroke="#EDE8E2" strokeWidth={strokeW} />
          <circle cx={svgSize/2} cy={svgSize/2} r={radius}
            fill="none" stroke={style.ring} strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: compact ? '1.25rem' : '1.875rem', color: style.textColor, lineHeight: 1 }}>{score}</span>
          {!compact && <span style={{ fontSize: '0.7rem', color: '#9A8E84', marginTop: '0.1rem' }}>/100</span>}
        </div>
      </div>

      <div style={{ textAlign: compact ? 'left' : 'center', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', justifyContent: compact ? 'flex-start' : 'center' }}>
          <span style={{ fontSize: compact ? '1rem' : '1.25rem' }}>{EMOJI_MAP[status.label] || '🌱'}</span>
          <span style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: compact ? '0.975rem' : '1.2rem', color: style.textColor, fontWeight: 400 }}>
            {style.label}
          </span>
        </div>
        {date && <p style={{ fontSize: '0.75rem', color: '#9A8E84' }}>{date}</p>}
        {!compact && (
          <p style={{ fontSize: '0.825rem', color: '#7A6E65', marginTop: '0.5rem', lineHeight: 1.6 }}>
            {style.message}
          </p>
        )}
      </div>
    </div>
  );
}
