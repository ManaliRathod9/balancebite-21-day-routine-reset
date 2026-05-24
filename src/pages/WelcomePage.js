import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile, loadChallenge, importBackup } from '../utils/storageUtils';

const DISCLAIMER = 'BalanceBite provides lifestyle awareness only, not medical advice. If symptoms are severe or unusual, please consult a healthcare professional.';

export default function WelcomePage() {
  const navigate  = useNavigate();
  const profile   = loadProfile();
  const challenge = loadChallenge();
  const fileRef   = useRef();
  const [uploadMsg, setUploadMsg] = React.useState('');

  const handleStart = () => navigate(profile ? '/check-in' : '/profile');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        importBackup(JSON.parse(evt.target.result));
        setUploadMsg('Backup restored. Taking you to your dashboard.');
        setTimeout(() => navigate('/dashboard'), 1800);
      } catch {
        setUploadMsg('That file didn\'t look right. Try a BalanceBite JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh' }}>

      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '5rem', paddingBottom: '5rem' }}>

        <style>{`
          .hero-layout { display: grid; grid-template-columns: 1fr; gap: 0; align-items: center; }
          .hero-right  { display: none; }
          @media (min-width: 860px) {
            .hero-layout { grid-template-columns: 1fr 1fr; gap: 3.5rem; }
            .hero-right  { display: block; }
          }
        `}</style>

        <div style={{
          position: 'absolute', top: '-80px', right: '-120px',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, #E4EAE0 0%, transparent 70%)',
          opacity: 0.7, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-100px',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, #FAE6D8 0%, transparent 70%)',
          opacity: 0.5, pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}
          className="hero-layout">

          <div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#E4EAE0', borderRadius: '100px',
              padding: '0.3rem 1rem', marginBottom: '1.75rem',
            }}>
              <span style={{ fontSize: '0.75rem' }}>🌿</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3F503A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                21-Day Routine Reset
              </span>
            </div>

            <h1 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 400,
              color: '#2E2924',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
            }}>
              Track your routine.<br />
              Understand your stress.<br />
              <em style={{ color: '#52664A', fontStyle: 'italic' }}>Rebuild your focus one small step at a time.</em>
            </h1>

            <p style={{
              fontSize: '1.05rem', color: '#6B5E55', lineHeight: 1.75,
              marginBottom: '2.25rem',
            }}>
              Some days we overeat. Some days we skip meals. Some days we lose routine completely.
              <br /><br />
              BalanceBite helps you notice what is happening and rebuild one small step at a time.
            </p>

            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <button onClick={handleStart} className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.875rem 2rem' }}>
                {profile ? 'Continue My Reset' : 'Start My 21-Day Reset'}
              </button>
              <button onClick={() => fileRef.current.click()} className="btn-secondary" style={{ fontSize: '0.875rem' }}>
                Restore a Backup
              </button>
              <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleUpload} />
            </div>

            {uploadMsg && (
              <p style={{ fontSize: '0.8rem', color: '#52664A', marginTop: '0.5rem', fontWeight: 500 }}>{uploadMsg}</p>
            )}

            {challenge && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem',
                background: '#fff', border: '1px solid #EDE8E2', borderRadius: '100px',
                padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#7A6E65' }}>
                <span style={{ color: '#52664A', fontWeight: 600 }}>Day {loadChallenge() ? require('../utils/storageUtils').getChallengeDay() : '?'} of 21</span>
                <span>· Reset in progress</span>
              </div>
            )}
          </div>

          <div className="hero-right" style={{ position: 'relative', height: '480px' }}>

            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '340px', height: '300px', borderRadius: '50%',
              background: 'radial-gradient(ellipse, #FFF3E8 0%, transparent 68%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '10px' }}>
              <svg width="290" height="345" viewBox="0 0 290 345" fill="none" xmlns="http://www.w3.org/2000/svg">

                {/* Window */}
                <rect x="14" y="18" width="76" height="98" rx="8" fill="#FFF8E8" opacity="0.85" />
                <line x1="52" y1="18" x2="52" y2="116" stroke="#EDD5A0" strokeWidth="1.5" opacity="0.45" />
                <line x1="14" y1="67" x2="90" y2="67" stroke="#EDD5A0" strokeWidth="1.5" opacity="0.45" />
                <rect x="14" y="18" width="76" height="98" rx="8" fill="none" stroke="#E0CC98" strokeWidth="1.5" opacity="0.35" />
                <path d="M90 18 L110 50 L110 116 L90 116" fill="#FFF3D6" opacity="0.25" />

                {/* PLANT */}
                <path d="M224 250 L218 276 L248 276 L242 250 Z" fill="#C96B3F" />
                <ellipse cx="233" cy="250" rx="14" ry="5" fill="#A85530" />
                <ellipse cx="233" cy="276" rx="16" ry="5" fill="#A85530" opacity="0.6" />
                <ellipse cx="233" cy="250" rx="11" ry="3.5" fill="#5A3A20" />
                <path d="M233 247 Q216 228 208 210 Q222 221 233 239" fill="#52664A" />
                <path d="M233 247 Q251 226 260 208 Q246 220 233 239" fill="#6B8260" />
                <path d="M233 247 Q221 233 215 218 Q227 225 233 240" fill="#3F503A" opacity="0.8" />
                <path d="M233 247 Q244 230 252 216 Q241 224 233 240" fill="#52664A" opacity="0.75" />
                <path d="M233 247 Q233 236 233 222" stroke="#3F503A" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* DESK */}
                <rect x="32" y="245" width="238" height="13" rx="5" fill="#9B7848" />
                <rect x="37" y="257" width="230" height="5" rx="2" fill="#7A5A30" opacity="0.3" />
                <rect x="47" y="260" width="9" height="58" rx="4" fill="#8A6438" />
                <rect x="239" y="260" width="9" height="58" rx="4" fill="#8A6438" />
                <rect x="47" y="298" width="201" height="5" rx="2.5" fill="#7A5A30" opacity="0.4" />

                {/* CHAIR */}
                <rect x="114" y="175" width="62" height="68" rx="10" fill="#C8B898" />
                <rect x="118" y="179" width="54" height="60" rx="8" fill="#BCA888" />
                <rect x="107" y="237" width="76" height="14" rx="7" fill="#B8A888" />
                <rect x="117" y="249" width="8" height="52" rx="3" fill="#9A8060" />
                <rect x="165" y="249" width="8" height="52" rx="3" fill="#9A8060" />

                {/* PERSON */}
                <path d="M122 237 Q119 260 118 288" stroke="#4A5E40" strokeWidth="16" strokeLinecap="round" fill="none" />
                <path d="M168 237 Q171 260 172 288" stroke="#4A5E40" strokeWidth="16" strokeLinecap="round" fill="none" />
                <ellipse cx="117" cy="290" rx="12" ry="5.5" fill="#2A1A0A" />
                <ellipse cx="173" cy="290" rx="12" ry="5.5" fill="#2A1A0A" />
                <path d="M109 196 Q145 185 181 196 L176 238 Q145 245 114 238 Z" fill="#6B8260" />
                <path d="M135 196 Q145 190 155 196" stroke="#52664A" strokeWidth="1.5" fill="none" />
                <path d="M112 210 Q93 230 84 252" stroke="#C4906A" strokeWidth="12" strokeLinecap="round" fill="none" />
                <ellipse cx="83" cy="254" rx="7" ry="5.5" fill="#C4906A" />
                <path d="M178 210 Q197 228 202 248" stroke="#C4906A" strokeWidth="12" strokeLinecap="round" fill="none" />
                <ellipse cx="202" cy="251" rx="7" ry="5.5" fill="#C4906A" />
                <rect x="138" y="182" width="14" height="17" rx="6" fill="#C4906A" />
                <circle cx="145" cy="160" r="26" fill="#D4A070" />
                <path d="M119 157 Q121 131 145 127 Q169 131 171 157" fill="#2A1A0A" />
                <path d="M119 157 Q117 146 119 135" stroke="#2A1A0A" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M171 157 Q173 146 171 135" stroke="#2A1A0A" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M128 138 Q140 130 152 133" stroke="#3A2A10" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
                <ellipse cx="136" cy="159" rx="3" ry="3.2" fill="#2A1A0A" />
                <ellipse cx="154" cy="159" rx="3" ry="3.2" fill="#2A1A0A" />
                <circle cx="137.5" cy="157.5" r="1" fill="#E8C898" opacity="0.6" />
                <circle cx="155.5" cy="157.5" r="1" fill="#E8C898" opacity="0.6" />
                <path d="M139 170 Q145 174 151 170" stroke="#B07848" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* LAPTOP */}
                <rect x="140" y="241" width="80" height="10" rx="4" fill="#4A5568" />
                <rect x="155" y="243" width="50" height="6" rx="2" fill="#3A4558" />
                <path d="M143 241 L148 190 L220 190 L220 241 Z" fill="#3A4558" />
                <path d="M147 239 L151 194 L217 194 L217 239 Z" fill="#1A2530" />
                <polyline points="160,228 167,217 175,223 183,211 191,219 199,207 207,214"
                  stroke="#6B8260" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="151" y="194" width="66" height="45" rx="1" fill="#A8C8B8" opacity="0.05" />
                <line x1="143" y1="241" x2="220" y2="241" stroke="#2A3040" strokeWidth="1.5" />

                {/* JOURNAL */}
                <rect x="42" y="228" width="54" height="20" rx="4" fill="#F5EDD5" />
                <rect x="42" y="228" width="7" height="20" rx="3" fill="#C96B3F" />
                <line x1="54" y1="234" x2="92" y2="234" stroke="#E0D4B4" strokeWidth="1.5" />
                <line x1="54" y1="240" x2="92" y2="240" stroke="#E0D4B4" strokeWidth="1.5" />
                <line x1="54" y1="246" x2="84" y2="246" stroke="#E0D4B4" strokeWidth="1.5" />
                <rect x="93" y="225" width="4" height="22" rx="2" fill="#C8A060" transform="rotate(15 95 236)" />

                {/* MUG */}
                <path d="M93 230 L89 248 Q89 252 92 252 L106 252 Q109 252 109 248 L105 230 Z" fill="#C96B3F" />
                <path d="M107 235 Q115 235 115 241 Q115 247 107 247" stroke="#A85530" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <ellipse cx="99" cy="230" rx="8" ry="3" fill="#D98060" />
                <path d="M94 226 Q92 220 94 214" stroke="#D0B090" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
                <path d="M100 225 Q98 218 100 211" stroke="#D0B090" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
                <path d="M106 226 Q104 220 106 214" stroke="#D0B090" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />

                {/* WATER BOTTLE */}
                <rect x="111" y="212" width="16" height="35" rx="6" fill="#A8C8C4" />
                <rect x="113" y="207" width="12" height="8" rx="4" fill="#88A8A4" />
                <rect x="111" y="228" width="16" height="19" rx="0" fill="#88A8A4" opacity="0.3" style={{ borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }} />
                <rect x="113" y="218" width="10" height="10" rx="2" fill="#78989A" opacity="0.4" />

              </svg>
            </div>

            <div style={{
              position: 'absolute', top: '18px', right: '0px',
              background: '#F9F6F2', border: '1px solid #E8E0D5',
              borderRadius: '1rem', padding: '0.875rem 1rem',
              boxShadow: '0 6px 20px rgba(60,40,20,0.09)',
              transform: 'rotate(2deg)',
              zIndex: 4, minWidth: '148px',
            }}>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Routine Score</p>
              <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.75rem', color: '#52664A', lineHeight: 1, marginBottom: '0.5rem' }}>82</p>
              <div style={{ height: '4px', background: '#EDE8E2', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '82%', background: 'linear-gradient(90deg, #6B8260, #52664A)', borderRadius: '100px' }} />
              </div>
              <p style={{ fontSize: '0.6rem', color: '#9A8E84', marginTop: '0.375rem' }}>Strong routine day</p>
            </div>

            <div style={{
              position: 'absolute', bottom: '52px', left: '0px',
              background: '#F9F6F2', border: '1px solid #E8E0D5',
              borderRadius: '1rem', padding: '0.875rem 1rem',
              boxShadow: '0 6px 20px rgba(60,40,20,0.09)',
              transform: 'rotate(-2deg)',
              zIndex: 4, maxWidth: '178px',
            }}>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.375rem' }}>One small promise</p>
              <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '0.875rem', color: '#3A3530', lineHeight: 1.5, fontStyle: 'italic' }}>"Walk outside for 10 minutes today."</p>
            </div>

          </div>
        </div>
      </section>

      <section style={{ background: '#3F503A', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { label: 'One step is enough today.', sub: 'Progress is not always visible.' },
              { label: 'You are rebuilding, not failing.', sub: 'Every check-in counts.' },
              { label: 'Small changes compound.', sub: 'Awareness is where it starts.' },
            ].map(({ label, sub }) => (
              <div key={label}>
                <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.1rem', color: '#E4EAE0', lineHeight: 1.35, marginBottom: '0.375rem' }}>
                  "{label}"
                </p>
                <p style={{ fontSize: '0.78rem', color: '#869F78', letterSpacing: '0.02em' }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '4.5rem 1.5rem', background: '#FAF8F5' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="section-divider" />
            <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.9rem', color: '#2E2924', marginBottom: '0.5rem' }}>
              What BalanceBite tracks
            </h2>
            <p style={{ color: '#8A7F75', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Every field is designed to help you understand the connections between habits, not to judge your choices.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.875rem' }}>
            {[
              { icon: '😴', label: 'Sleep & wake-up consistency',       desc: 'When you sleep and when you rise matters more than you think.' },
              { icon: '🍽️', label: 'Meals, skips & stress eating',      desc: 'Understand your eating patterns without guilt.' },
              { icon: '💧', label: 'Water intake & hydration',          desc: 'Even mild dehydration changes your mood and focus.' },
              { icon: '🚶', label: 'Movement & activity',               desc: 'Any movement counts. Even 5 minutes changes your state.' },
              { icon: '🧠', label: 'Stress & focus levels',            desc: 'Track your mental load and spot patterns across days.' },
              { icon: '💭', label: 'Mood & emotional triggers',         desc: 'Name what you feel. Awareness reduces its hold.' },
              { icon: '💼', label: 'Job search & study pressure',       desc: 'Burnout from pressure is real. Track it honestly.' },
              { icon: '🌱', label: 'One daily promise for tomorrow',   desc: 'Small commitments build real discipline over time.' },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{
                background: '#fff', border: '1px solid #EDE8E2',
                borderRadius: '1.25rem', padding: '1.125rem 1.25rem',
                boxShadow: '0 1px 6px rgba(60,40,20,0.05)',
                display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 600, color: '#3A3530', fontSize: '0.875rem', marginBottom: '0.25rem', lineHeight: 1.35 }}>{label}</p>
                  <p style={{ fontSize: '0.78rem', color: '#9A8E84', lineHeight: 1.55 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '4.5rem 1.5rem', background: '#F3F5F0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="section-divider" />
            <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.9rem', color: '#2E2924', marginBottom: '0.5rem' }}>
              The 21-day reset
            </h2>
            <p style={{ color: '#8A7F75', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Not a challenge to win. A process to understand yourself.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { week: 'Week 1', theme: 'Awareness',        desc: 'Just notice. No pressure to change. Check in daily and observe your patterns.' },
              { week: 'Week 2', theme: 'One Small Shift',   desc: 'Choose one habit to gently improve. One glass of water. Thirty minutes earlier to sleep.' },
              { week: 'Week 3', theme: 'Routine Anchoring', desc: 'Connect the dots. See how sleep affects focus. How meals affect mood. How movement changes stress.' },
            ].map(({ week, theme, desc }, i) => (
              <div key={week} style={{
                background: '#fff', border: '1px solid #EDE8E2',
                borderRadius: '1.5rem', padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(60,40,20,0.07)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: '-10px', right: '-10px',
                  fontSize: '4rem', opacity: 0.05, fontFamily: '"DM Serif Display", Georgia, serif',
                  fontWeight: 400, lineHeight: 1, color: '#3F503A',
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#869F78', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>{week}</p>
                <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.25rem', color: '#2E2924', marginBottom: '0.625rem' }}>{theme}</p>
                <p style={{ fontSize: '0.825rem', color: '#7A6E65', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={handleStart} className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.875rem 2.25rem' }}>
              {profile ? 'Continue My Reset' : 'Start My 21-Day Reset'}
            </button>
            <p style={{ fontSize: '0.78rem', color: '#A8A098', marginTop: '0.875rem' }}>
              No account. No server. Everything stays privately in your browser.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '4.5rem 1.5rem', background: '#FAF8F5' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div className="section-divider" />
            <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.9rem', color: '#2E2924', marginBottom: '1.5rem' }}>
              What the app does
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                ['📊', 'Routine score from 0–100 based on your actual habits'],
                ['⚡', 'Smart habit warnings with gentle fixes and no shame'],
                ['📖', 'Weekly pattern story in plain, human language'],
                ['⏸️', 'Stress eating pause: a 5-minute grounding tool'],
                ['🏅', '14 encouraging badges celebrating small wins'],
                ['📄', 'Downloadable PDF report of your full journey'],
                ['💾', 'JSON backup. Your data stays with you, always.'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
                  <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.55 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(145deg, #3F503A 0%, #2E3B2A 100%)',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: '280px',
          }}>
            <p style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: '1.5rem', color: '#E4EAE0', lineHeight: 1.4,
              fontStyle: 'italic',
            }}>
              "You do not need a perfect day. You only need one honest check-in and one small step."
            </p>
            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#869F78', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                BalanceBite, daily reminder
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 1.5rem 3rem', background: '#FAF8F5' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            background: '#FFF9F0', border: '1px solid #F4D9A8',
            borderRadius: '1rem', padding: '1rem 1.25rem',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: '0.775rem', color: '#8A6A3A', lineHeight: 1.6 }}>
              <strong style={{ color: '#7A5A2A' }}>Please note:</strong>{' '}{DISCLAIMER}
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#B0A89E', textAlign: 'center', marginTop: '1.25rem' }}>
            💾 Your progress lives in this browser. Download a backup from the Backup page once a week to keep it safe.
          </p>
        </div>
      </section>
    </div>
  );
}
