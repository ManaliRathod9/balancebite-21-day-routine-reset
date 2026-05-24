import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile, loadChallenge, getChallengeDay } from '../utils/storageUtils';

const PLAN_MAP = {
  'Improve focus': {
    icon: '🧠', color: '#EEE8F7', border: '#DCCFEF', accent: '#6F519E',
    summary: 'Your reset centers on the habits that power clear thinking: consistent sleep, regular meals, hydration, and brief daily movement.',
    goals: [
      { emoji: '😴', goal: 'Sleep 7+ hours', why: 'Sleep is the number one focus booster, more effective than caffeine.' },
      { emoji: '🍽️', goal: 'Eat at least 2 proper meals', why: 'Skipping meals drops blood sugar and concentration.' },
      { emoji: '💧', goal: 'Drink 6+ glasses of water', why: 'Even mild dehydration reduces mental clarity.' },
      { emoji: '🚶', goal: 'Walk or stretch for 10 minutes', why: 'Movement increases oxygen flow to the brain.' },
      { emoji: '🎯', goal: 'One focused work/study block per day', why: 'One quality hour beats three distracted ones.' },
    ],
  },
  'Reduce stress eating': {
    icon: '🍽️', color: '#FDF4EF', border: '#F4CCAF', accent: '#A85530',
    summary: 'Your reset focuses on building a 5-minute pause before stress eating, and eating regular meals to prevent extreme hunger.',
    goals: [
      { emoji: '⏸️', goal: 'Use the 5-minute pause before overeating', why: 'A pause creates space between impulse and action.' },
      { emoji: '💧', goal: 'Drink water before snacking', why: 'Thirst is often confused with hunger.' },
      { emoji: '🍽️', goal: 'Eat regular meals to prevent extreme hunger', why: 'Extreme hunger makes stress eating harder to resist.' },
      { emoji: '📝', goal: 'Note your emotional eating triggers', why: 'Awareness reduces the automatic response.' },
      { emoji: '😰', goal: 'Track your stress before eating extra', why: 'Naming the emotion separates it from food.' },
    ],
  },
  'Stop skipping meals': {
    icon: '⏰', color: '#F3F5F0', border: '#C8D5C0', accent: '#52664A',
    summary: 'Simple and practical: eat breakfast within 1 hour of waking, keep small options nearby, and treat a snack as a meal when needed.',
    goals: [
      { emoji: '🌅', goal: 'Eat breakfast within 1 hour of waking', why: 'Starting with food sets your energy baseline.' },
      { emoji: '🥗', goal: 'Have lunch even if small', why: 'A mid-day meal prevents afternoon energy crashes.' },
      { emoji: '🌙', goal: 'Eat a light dinner before 9 PM', why: 'Evening meals help sleep hormones work properly.' },
      { emoji: '🍎', goal: 'Keep a simple snack nearby always', why: 'Convenience removes the barrier to eating.' },
      { emoji: '⏰', goal: 'Set one meal reminder on your phone', why: 'Busy people need reminders. That is not weakness.' },
    ],
  },
  'Fix sleep routine': {
    icon: '🌙', color: '#F7F4FB', border: '#DCCFEF', accent: '#6F519E',
    summary: 'Shift your sleep and wake-up times by 30 minutes each week and reduce stimulation before bed.',
    goals: [
      { emoji: '😴', goal: 'Sleep and wake within a 30-minute window', why: 'Consistency trains your internal clock.' },
      { emoji: '📵', goal: 'No screens 30 minutes before sleep', why: 'Blue light delays melatonin production.' },
      { emoji: '🌿', goal: 'Light stretch or breathing exercise before bed', why: 'Physical release signals the brain to wind down.' },
      { emoji: '☕', goal: 'Avoid caffeine after 3 PM', why: 'Caffeine has a 6-hour half-life in your system.' },
      { emoji: '📋', goal: "Write tomorrow's plan before sleeping", why: 'Clearing your mind reduces sleep-blocking anxiety.' },
    ],
  },
  'Build a healthy routine': {
    icon: '🏗️', color: '#F3F5F0', border: '#C8D5C0', accent: '#52664A',
    summary: 'Consistency in timing: wake up, eat, move, and sleep at similar times each day. Routine reduces decision fatigue and stress.',
    goals: [
      { emoji: '⏰', goal: 'Wake up within a consistent 30-minute window', why: 'Consistent wake time anchors a healthy routine.' },
      { emoji: '🍽️', goal: 'Eat meals at regular times', why: "Meal timing helps your body's energy cycles." },
      { emoji: '🚶', goal: 'Move your body for 10–20 minutes daily', why: 'Daily movement compounds over weeks.' },
      { emoji: '📵', goal: 'Reduce late-night screen time', why: 'Late screens push sleep later and damage morning energy.' },
      { emoji: '🌱', goal: 'Choose one small promise each night', why: 'Small daily promises build discipline slowly and gently.' },
    ],
  },
  'Reduce stress': {
    icon: '😌', color: '#FDF4EF', border: '#F4CCAF', accent: '#A85530',
    summary: 'Daily stress tracking, movement to release tension, and building pauses between high-stress tasks to protect recovery time.',
    goals: [
      { emoji: '📊', goal: 'Track your stress level daily', why: 'You can only manage what you measure.' },
      { emoji: '🚶', goal: 'Walk 10 minutes when stress is above 7', why: 'Physical movement metabolizes stress hormones.' },
      { emoji: '🌬️', goal: 'Practice 5 slow breaths once a day', why: 'Controlled breathing activates the rest system.' },
      { emoji: '📵', goal: 'Reduce news and social media in the evening', why: 'Information overload amplifies baseline stress.' },
      { emoji: '💤', goal: 'Prioritize 7–8 hours of sleep', why: 'Sleep resets your stress response capacity daily.' },
    ],
  },
  'Improve energy': {
    icon: '⚡', color: '#FFF9F0', border: '#F4D9A8', accent: '#A85530',
    summary: 'Four pillars of daily energy: sleep, water, food timing, and movement. Improving any two will make a visible difference within a week.',
    goals: [
      { emoji: '💧', goal: 'Drink 6–8 glasses of water daily', why: 'Dehydration is the most overlooked cause of fatigue.' },
      { emoji: '🍽️', goal: 'Eat 3 balanced meals with no long gaps', why: 'Energy crashes often follow prolonged fasting.' },
      { emoji: '😴', goal: 'Sleep 7–8 hours', why: 'No supplement replaces quality sleep for energy.' },
      { emoji: '🚶', goal: 'Walk 10 minutes when energy dips', why: 'Movement creates energy. It does not deplete it.' },
      { emoji: '☀️', goal: 'Morning sunlight within 30 minutes of waking', why: 'Sunlight sets your alertness rhythm for the day.' },
    ],
  },
  'Rebuild daily discipline': {
    icon: '🏋️', color: '#F3F5F0', border: '#C8D5C0', accent: '#52664A',
    summary: 'One small daily promise as the anchor habit. Discipline is built by showing up consistently, not perfectly.',
    goals: [
      { emoji: '🌱', goal: 'Choose one small promise each night', why: 'One kept promise builds the identity of a disciplined person.' },
      { emoji: '✅', goal: 'Complete your daily check-in every day', why: 'Tracking is itself a discipline habit.' },
      { emoji: '⏰', goal: 'Set a consistent wake-up time', why: 'Discipline starts with how you begin your day.' },
      { emoji: '📋', goal: 'Plan one focused work block each day', why: 'Planning reduces the friction of starting.' },
      { emoji: '🔥', goal: 'Track your consistency streak', why: 'Streaks create commitment momentum.' },
    ],
  },
};

const DEFAULT_PLAN = PLAN_MAP['Build a healthy routine'];

export default function ResetPlan() {
  const navigate   = useNavigate();
  const profile    = loadProfile();
  const challenge  = loadChallenge();
  const day        = getChallengeDay();
  const plan       = PLAN_MAP[profile?.goal] || DEFAULT_PLAN;
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="page-wrapper fade-in">

      <div style={{ marginBottom: '2.5rem' }}>
        <div className="step-pill">Step 3 of 3</div>
        <h1 className="section-title">Your 21-Day Reset Plan</h1>
        <p className="page-subtitle">
          Personalized for {profile?.name || 'you'}, based on your goal and what you shared.
        </p>
      </div>

      <div style={{
        background: plan.color, border: `1px solid ${plan.border}`,
        borderRadius: '1.5rem', padding: '1.75rem',
        marginBottom: '1.25rem',
        borderLeft: `4px solid ${plan.accent}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
          <span style={{ fontSize: '1.75rem' }}>{plan.icon}</span>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: plan.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Your main goal
            </p>
            <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.25rem', color: '#2E2924', fontWeight: 400 }}>
              {profile?.goal || 'Build a healthy routine'}
            </h2>
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.7 }}>{plan.summary}</p>
      </div>

      {challenge && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.375rem' }}>
                Challenge Progress
              </p>
              <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.5rem', color: '#2E2924' }}>
                Day {day} <span style={{ color: '#A8A098', fontSize: '1rem' }}>of 21</span>
              </p>
              <p style={{ fontSize: '0.78rem', color: '#9A8E84', marginTop: '0.25rem' }}>Started {challenge.startDate}</p>
            </div>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="#EDE8E2" strokeWidth="7" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#52664A" strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - day / 21)}
                  style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#52664A' }}>{Math.round((day / 21) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>
          Your daily focus goals
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {plan.goals.map(({ emoji, goal, why }, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
              padding: '0.875rem 1rem', borderRadius: '1rem',
              background: '#FDFAF7', border: '1px solid #EDE8E2',
              transition: 'background 0.18s',
            }}>
              <span style={{ fontSize: '1.125rem', flexShrink: 0, marginTop: '0.1rem' }}>{emoji}</span>
              <div>
                <p style={{ fontWeight: 600, color: '#3A3530', fontSize: '0.875rem', lineHeight: 1.35 }}>{goal}</p>
                <p style={{ fontSize: '0.775rem', color: '#9A8E84', marginTop: '0.25rem', lineHeight: 1.55 }}>{why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(145deg, #3F503A 0%, #2E3B2A 100%)',
        borderRadius: '1.5rem', padding: '2rem',
        marginBottom: '1.75rem', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: '1.375rem', color: '#E4EAE0',
          lineHeight: 1.4, fontStyle: 'italic', marginBottom: '0.875rem',
        }}>
          "You do not need a perfect day."
        </p>
        <p style={{ fontSize: '0.875rem', color: '#869F78', lineHeight: 1.65 }}>
          You only need one honest check-in and one small step.
          Every day you show up, even when it is hard, you are already doing the work.
        </p>
      </div>

      {profile && (
        <div className="card-warm" style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
            Based on your profile
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              profile.wakeUpTime && ['Wake-up', profile.wakeUpTime],
              profile.sleepTime && ['Bedtime', profile.sleepTime],
              profile.waterGlasses && ['Water now', `${profile.waterGlasses} glasses/day`],
              profile.studyWorkHours && ['Work/study', `${profile.studyWorkHours} hrs/day`],
              profile.skipMeals && ['Skips meals', profile.skipMeals],
              profile.overeatsWhenStressed && ['Stress eating', profile.overeatsWhenStressed],
            ].filter(Boolean).map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: '0.375rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#9A8E84' }}>{label}:</span>
                <span style={{ color: '#3A3530', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <button onClick={() => navigate('/check-in')} className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.875rem 2.25rem' }}>
          Go to Today's Check-In
        </button>
        <p className="microcopy" style={{ marginTop: '0.75rem' }}>
          Your plan is saved and visible anytime from the Plan page.
        </p>
      </div>
    </div>
  );
}
