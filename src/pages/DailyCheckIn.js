import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  saveEntry, getEntryByDate, loadProfile,
  getChallengeDay, addBadge, loadBadges,
} from '../utils/storageUtils';
import { calculateScore } from '../utils/scoreUtils';
import { generateWarnings } from '../utils/warningUtils';
import { generateEmotionalInsight } from '../utils/insightUtils';
import { calculateEntryBadges } from '../utils/badgeUtils';
import RoutineScoreCard from '../components/RoutineScoreCard';
import WarningCard from '../components/WarningCard';
import RecoveryModeCard from '../components/RecoveryModeCard';
import StressEatingPause from '../components/StressEatingPause';
import FemaleWellnessNotes from '../components/FemaleWellnessNotes';
import BurnoutTracker from '../components/BurnoutTracker';
import { SingleBadge } from '../components/BadgeCard';

const SYMPTOMS = [
  'Low concentration', 'Tiredness', 'Headache', 'Mood swings', 'Cravings',
  'Overeating', 'Skipping meals', 'Poor sleep', 'Stress', 'Low energy',
  'Bloating', 'Body heaviness', 'Anxiety feeling', 'No motivation',
  'Irregular wake-up time', 'Irregular sleep time', 'Too much screen time',
];

const FEELINGS  = ['Heavy', 'Guilty', 'Tired', 'Hopeful', 'Lost', 'Restless', 'Calm', 'Proud', 'Unmotivated', 'Emotionally drained', 'Okay but not focused', 'Other'];
const TRIGGERS  = ['Stress', 'Job search pressure', 'Study pressure', 'Work pressure', 'Loneliness', 'Boredom', 'Late sleep', 'No routine', 'Too much screen time', 'Emotional pressure', 'Rejection or failure feeling', 'Family/personal pressure', "I don't know", 'Other'];
const PROMISES  = ['Eat breakfast', 'Drink 5 glasses of water', 'Wake up 30 minutes earlier', 'Walk for 10 minutes', 'Apply/study/work for 1 focused hour', 'Sleep 30 minutes earlier', 'Avoid stress eating using a 5-minute pause', 'Take one proper meal without phone', 'Reduce late-night screen time', "Write tomorrow's plan before sleeping", 'Other'];
const MOODS     = ['Calm', 'Anxious', 'Sad', 'Motivated', 'Tired', 'Stressed', 'Happy', 'Low', 'Restless'];

const FormSection = ({ title, icon, children, accent = '#52664A' }) => (
  <div className="form-section" style={{ marginBottom: '1.125rem' }}>
    <div className="form-section-title" style={{ color: accent, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
      {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
  </div>
);

const YesNo = ({ label, value, onChange }) => (
  <div>
    <label className="label">{label}</label>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {['Yes', 'No'].map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt === 'Yes')}
          style={{
            padding: '0.5rem 1.375rem', borderRadius: '100px',
            fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
            border: '1.5px solid', transition: 'all 0.18s',
            background: (opt === 'Yes' && value === true) || (opt === 'No' && value === false) ? '#E4EAE0' : '#fff',
            color:      (opt === 'Yes' && value === true) || (opt === 'No' && value === false) ? '#3F503A' : '#7A6E65',
            borderColor:(opt === 'Yes' && value === true) || (opt === 'No' && value === false) ? '#869F78' : '#DDD7D0',
          }}>{opt}</button>
      ))}
    </div>
  </div>
);

const SliderInput = ({ label, value, onChange, min = 1, max = 10, leftLabel, rightLabel, accentColor = '#52664A' }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
        <label className="label" style={{ marginBottom: 0 }}>{label}</label>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: accentColor,
          background: `${accentColor}15`, padding: '0.125rem 0.625rem', borderRadius: '100px' }}>
          {value}
        </span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%', height: '5px', borderRadius: '10px', cursor: 'pointer',
          background: `linear-gradient(to right, ${accentColor} ${pct}%, #EDE8E2 ${pct}%)`,
          outline: 'none', border: 'none', WebkitAppearance: 'none', appearance: 'none',
          accentColor,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#B0A89E', marginTop: '0.25rem' }}>
        <span>{leftLabel || min}</span><span>{rightLabel || max}</span>
      </div>
    </div>
  );
};

const ChipGroup = ({ label, value = [], onChange, options, single = false }) => (
  <div>
    {label && <label className="label">{label}</label>}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4375rem' }}>
      {options.map(opt => {
        const sel = single ? value === opt : value.includes(opt);
        return (
          <button key={opt} type="button"
            onClick={() => single ? onChange(value === opt ? '' : opt) : onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])}
            className={`chip ${sel ? 'chip-selected' : 'chip-unselected'}`}>
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

export default function DailyCheckIn() {
  const navigate      = useNavigate();
  const profile       = loadProfile();
  const today         = new Date().toISOString().split('T')[0];
  const challengeDay  = getChallengeDay();
  const existing      = getEntryByDate(today) || {};

  const [form, setForm] = useState({
    date: today, wakeUpTime: existing.wakeUpTime || '',
    sleepTime: existing.sleepTime || '', sleepDuration: existing.sleepDuration || 7,
    wakeDuringSleep: existing.wakeDuringSleep || '',
    awakeDurationDuringSleep: existing.awakeDurationDuringSleep || '',
    sleepQuality: existing.sleepQuality || '',
    breakfast: existing.breakfast ?? null, lunch: existing.lunch ?? null,
    dinner: existing.dinner ?? null, overeating: existing.overeating ?? null,
    breakfastTime: existing.breakfastTime || '',
    lunchTime: existing.lunchTime || '',
    dinnerTime: existing.dinnerTime || '',
    snackTime: existing.snackTime || '',
    lastMealTime: existing.lastMealTime || '',
    lateNightEating: existing.lateNightEating ?? null,
    followedEatingRoutineToday: existing.followedEatingRoutineToday || '',
    eatingFeltLike:             existing.eatingFeltLike || '',
    eatingRoutineChangedReason: existing.eatingRoutineChangedReason || '',
    eatingRoutineChangedNote:   existing.eatingRoutineChangedNote || '',
    stressLevel: existing.stressLevel || 5, focusLevel: existing.focusLevel || 5,
    mood: existing.mood || '', waterGlasses: existing.waterGlasses || 4,
    activityMinutes: existing.activityMinutes || 0, workHours: existing.workHours || 0,
    appsSubmitted: existing.appsSubmitted || '', rejectionEvent: existing.rejectionEvent ?? null,
    symptoms: existing.symptoms || [], notes: existing.notes || '',
    // Backward compat: convert legacy single-string fields to arrays
    todayFeelings: Array.isArray(existing.todayFeelings) ? existing.todayFeelings
      : (existing.todayFeeling ? [existing.todayFeeling] : []),
    todayFeelingOther: existing.todayFeelingOther || '',
    triggersToday: Array.isArray(existing.triggersToday) ? existing.triggersToday
      : (existing.trigger ? [existing.trigger] : []),
    triggerOther: existing.triggerOther || '',
    tomorrowPromises: Array.isArray(existing.tomorrowPromises) ? existing.tomorrowPromises
      : (existing.promiseForTomorrow ? [existing.promiseForTomorrow] : []),
    tomorrowPromiseOther: existing.tomorrowPromiseOther || '',
    kindnessReflection: existing.kindnessReflection || '',
    femaleWellness: existing.femaleWellness || {}, burnout: existing.burnout || {},
    stressPauseResponse: existing.stressPauseResponse || '', letterDay1: existing.letterDay1 || '',
  });

  const [result, setResult]     = useState(null);
  const [newBadges, setNewBadges] = useState([]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (form.wakeUpTime && form.sleepTime) {
      const toMins = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
      let wake = toMins(form.wakeUpTime), sleep = toMins(form.sleepTime);
      if (sleep > wake) sleep -= 1440;
      const dur = +((wake - sleep) / 60).toFixed(1);
      if (dur > 0 && dur < 24) set('sleepDuration', dur);
    }
  }, [form.wakeUpTime, form.sleepTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const score = calculateScore(form);
    const warnings = generateWarnings(form, profile);
    const emotionalInsight = generateEmotionalInsight(form);
    const entry = { ...form, routineScore: score, savedAt: new Date().toISOString() };
    const allEntries = saveEntry(entry);
    const prevEntry = allEntries[allEntries.indexOf(entry) - 1];
    const earnedRaw = calculateEntryBadges(entry, prevEntry, challengeDay);
    const allBadges = loadBadges();
    const trulyNew  = earnedRaw.filter(b => !allBadges.find(ab => ab.id === b.id && ab.date === b.date));
    earnedRaw.forEach(b => addBadge(b));
    setNewBadges(trulyNew);
    setResult({ score, warnings, emotionalInsight, entry });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) {
    return (
      <div className="page-wrapper fade-in">
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 className="section-title">Today's Summary</h1>
          <p className="page-subtitle">{today}{challengeDay ? ` · Day ${challengeDay} of 21` : ''}</p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <RoutineScoreCard score={result.score} date={today} />
        </div>

        {result.score < 40 && <div style={{ marginBottom: '1.25rem' }}><RecoveryModeCard /></div>}

        {newBadges.length > 0 && (
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontWeight: 700, color: '#8A5A2A', fontSize: '0.875rem', marginBottom: '0.875rem' }}>🏅 Badges earned today</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.625rem' }}>
              {newBadges.map(b => <SingleBadge key={b.id} badge={b} />)}
            </div>
          </div>
        )}

        {result.emotionalInsight && (
          <div style={{
            background: 'linear-gradient(145deg, #F7F4FB 0%, #EEE8F7 100%)',
            border: '1px solid #DCCFEF', borderRadius: '1.5rem', padding: '1.25rem',
            marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>💜</span>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6F519E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                Emotional insight
              </p>
              <p style={{ fontSize: '0.875rem', color: '#3A3530', lineHeight: 1.7 }}>{result.emotionalInsight}</p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>
            Habit observations
          </p>
          {result.warnings.map(w => <WarningCard key={w.id} warning={w} />)}
        </div>

        {form.tomorrowPromises?.length > 0 && (
          <div style={{
            background: '#F3F5F0', border: '1px solid #C8D5C0', borderRadius: '1.25rem',
            padding: '1rem 1.25rem', marginBottom: '1.25rem', textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#52664A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
              🌱 Your promise for tomorrow
            </p>
            {form.tomorrowPromises.filter(p => p !== 'Other').map(p => (
              <p key={p} style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '0.9375rem', color: '#3F503A', lineHeight: 1.5 }}>{p}</p>
            ))}
            {form.tomorrowPromises.includes('Other') && form.tomorrowPromiseOther && (
              <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '0.9375rem', color: '#3F503A', lineHeight: 1.5, fontStyle: 'italic' }}>
                {form.tomorrowPromiseOther}
              </p>
            )}
          </div>
        )}

        {challengeDay === 21 && (
          <div style={{
            background: 'linear-gradient(145deg, #FFF9F0 0%, #FAE6D8 100%)',
            border: '2px solid #F4D9A8', borderRadius: '1.5rem', padding: '2rem',
            marginBottom: '1.25rem', textAlign: 'center',
          }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏆</p>
            <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.375rem', color: '#8A6020', marginBottom: '0.5rem' }}>
              Challenge Complete!
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#7A6E65', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              You completed 21 days of your reset. Download your final report to celebrate this.
            </p>
            <button onClick={() => navigate('/reports')} className="btn-terra">
              View Final Report →
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '0.5rem' }}>
          <button onClick={() => setResult(null)} className="btn-secondary">← Edit Check-In</button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">View Dashboard →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Daily Check-In</h1>
        <p className="page-subtitle">
          {today}
          {challengeDay ? ` · Day ${challengeDay} of 21` : ''}
          {existing.savedAt ? ' · Updating today\'s entry' : ''}
        </p>
      </div>

      {challengeDay === 1 && (
        <div style={{
          background: 'linear-gradient(145deg, #F7F4FB 0%, #EEE8F7 100%)',
          border: '1px solid #DCCFEF', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💌</span>
            <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.05rem', color: '#2E2924' }}>
              Day 1: Letter to Myself
            </p>
          </div>
          <textarea value={form.letterDay1} onChange={e => set('letterDay1', e.target.value)}
            rows={3} placeholder="Why are you starting this 21-day reset? Be honest and kind with yourself…"
            className="input-field" style={{ resize: 'none', fontSize: '0.875rem', lineHeight: 1.7 }} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormSection title="Sleep" icon="😴">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Wake-up time</label>
              <input type="time" value={form.wakeUpTime} onChange={e => set('wakeUpTime', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Bedtime (last night)</label>
              <input type="time" value={form.sleepTime} onChange={e => set('sleepTime', e.target.value)} className="input-field" />
            </div>
          </div>
          <SliderInput label="Sleep duration (hours)" value={form.sleepDuration} onChange={v => set('sleepDuration', v)}
            min={1} max={12} leftLabel="1 hr" rightLabel="12 hrs" />
          <ChipGroup label="Did you wake up during sleep?" value={form.wakeDuringSleep}
            onChange={v => set('wakeDuringSleep', v)}
            options={['No', 'Yes, 1 time', 'Yes, 2 to 3 times', 'Yes, more than 3 times']} single />
          {form.wakeDuringSleep && form.wakeDuringSleep !== 'No' && (
            <ChipGroup label="How long were you awake in between? (approximate)"
              value={form.awakeDurationDuringSleep}
              onChange={v => set('awakeDurationDuringSleep', v)}
              options={['Less than 10 minutes', '10 to 30 minutes', '30 to 60 minutes', 'More than 1 hour']} single />
          )}
          <ChipGroup label="How would you describe your sleep quality?"
            value={form.sleepQuality}
            onChange={v => set('sleepQuality', v)}
            options={['Deep', 'Okay', 'Light / disturbed', 'Very poor']} single />
        </FormSection>

        <FormSection title="Meals and Timing" icon="🍽️" accent="#A85530">
          <YesNo label="Ate breakfast?" value={form.breakfast} onChange={v => set('breakfast', v)} />
          {form.breakfast === true && (
            <div>
              <label className="label">Breakfast time</label>
              <input type="time" value={form.breakfastTime} onChange={e => set('breakfastTime', e.target.value)} className="input-field" />
            </div>
          )}

          <YesNo label="Ate lunch?" value={form.lunch} onChange={v => set('lunch', v)} />
          {form.lunch === true && (
            <div>
              <label className="label">Lunch time</label>
              <input type="time" value={form.lunchTime} onChange={e => set('lunchTime', e.target.value)} className="input-field" />
            </div>
          )}

          <YesNo label="Ate dinner?" value={form.dinner} onChange={v => set('dinner', v)} />
          {form.dinner === true && (
            <div>
              <label className="label">Dinner time</label>
              <input type="time" value={form.dinnerTime} onChange={e => set('dinnerTime', e.target.value)} className="input-field" />
            </div>
          )}

          <div>
            <label className="label">
              Snack time
              <span style={{ color: '#B0A89E', fontWeight: 400, marginLeft: '0.375rem' }}>(optional)</span>
            </label>
            <input type="time" value={form.snackTime} onChange={e => set('snackTime', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Last meal or snack of the day</label>
            <input type="time" value={form.lastMealTime} onChange={e => set('lastMealTime', e.target.value)} className="input-field" />
          </div>

          <YesNo label="Did you eat anything after 10 PM?" value={form.lateNightEating} onChange={v => set('lateNightEating', v)} />
          <YesNo label="Overeating today?" value={form.overeating} onChange={v => set('overeating', v)} />
          <StressEatingPause onResponse={r => set('stressPauseResponse', r)} />
        </FormSection>

        <FormSection title="Today's Eating Pattern" icon="🍽" accent="#B8862A">
          <ChipGroup
            label="Did you follow your eating routine today?"
            value={form.followedEatingRoutineToday}
            onChange={v => set('followedEatingRoutineToday', v)}
            single
            options={['Yes', 'Partially', 'No', 'Not applicable']}
          />
          <ChipGroup
            label="Did your eating feel intentional or stress-driven today?"
            value={form.eatingFeltLike}
            onChange={v => set('eatingFeltLike', v)}
            single
            options={['Intentional', 'Stress-driven', 'Boredom-driven', 'No fixed plan', 'Not sure']}
          />
          {(form.followedEatingRoutineToday === 'Partially' || form.followedEatingRoutineToday === 'No') && (
            <>
              <ChipGroup
                label="What changed today? (pick what fits)"
                value={form.eatingRoutineChangedReason}
                onChange={v => set('eatingRoutineChangedReason', v)}
                single
                options={[
                  'Cheat day',
                  'Work or study got busy',
                  'Job search pressure',
                  'Travel or outside plans',
                  'Social event',
                  'Woke up late',
                  'Stress eating',
                  'Low energy',
                  'Period discomfort',
                  'Family or personal reason',
                  'I forgot',
                  'I just did not feel like following it today',
                  'Other',
                ]}
              />
              <div>
                <label className="label">
                  Anything else you want to note?
                  <span style={{ color: '#B0A89E', fontWeight: 400, marginLeft: '0.375rem' }}>(optional)</span>
                </label>
                <textarea
                  value={form.eatingRoutineChangedNote}
                  onChange={e => set('eatingRoutineChangedNote', e.target.value)}
                  className="input-field"
                  rows={2}
                  placeholder="Just write whatever feels true today..."
                  style={{ resize: 'vertical', minHeight: '60px' }}
                />
              </div>
            </>
          )}
        </FormSection>

        <FormSection title="Mood &amp; Energy" icon="🧠" accent="#6F519E">
          <SliderInput label="Stress level" value={form.stressLevel} onChange={v => set('stressLevel', v)}
            min={1} max={10} leftLabel="1 · Very calm" rightLabel="10 · Overwhelmed" accentColor="#C05E58" />
          <SliderInput label="Focus level" value={form.focusLevel} onChange={v => set('focusLevel', v)}
            min={1} max={10} leftLabel="1 · Distracted" rightLabel="10 · Laser-focused" accentColor="#52664A" />
          <div>
            <label className="label">Overall mood today</label>
            <select value={form.mood} onChange={e => set('mood', e.target.value)} className="select-field">
              <option value="">Select…</option>
              {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </FormSection>

        <FormSection title="Water &amp; Movement" icon="💧">
          <SliderInput label="Water glasses today" value={form.waterGlasses} onChange={v => set('waterGlasses', v)}
            min={0} max={15} leftLabel="0" rightLabel="15+" />
          <SliderInput label="Activity / exercise (minutes)" value={form.activityMinutes} onChange={v => set('activityMinutes', v)}
            min={0} max={120} leftLabel="0 min" rightLabel="2 hrs+" />
        </FormSection>

        <FormSection title="Work / Study / Job Search" icon="💼" accent="#3A5570">
          <SliderInput label="Hours spent today" value={form.workHours} onChange={v => set('workHours', v)}
            min={0} max={16} leftLabel="0 hrs" rightLabel="16 hrs" accentColor="#3A5570" />
          <YesNo label="Any rejection or stressful event today?" value={form.rejectionEvent} onChange={v => set('rejectionEvent', v)} />
        </FormSection>

        <BurnoutTracker data={form.burnout} onChange={v => set('burnout', v)} />

        {profile?.gender === 'Female' && (
          <FemaleWellnessNotes data={form.femaleWellness} onChange={v => set('femaleWellness', v)} />
        )}

        <FormSection title="Symptoms Today" icon="🔍">
          <ChipGroup label="Select any symptoms you noticed today" value={form.symptoms}
            onChange={v => set('symptoms', v)} options={SYMPTOMS} />
        </FormSection>

        <FormSection title="How are you really doing?" icon="💜" accent="#6F519E">

          <div>
            <ChipGroup
              label="Today I feel… (choose all that apply)"
              value={form.todayFeelings}
              onChange={v => set('todayFeelings', v)}
              options={FEELINGS}
            />
            {form.todayFeelings.includes('Other') && (
              <input
                type="text"
                value={form.todayFeelingOther}
                onChange={e => set('todayFeelingOther', e.target.value)}
                placeholder="Write how you feel today"
                className="input-field"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div>
            <ChipGroup
              label="What triggered this today? (choose all that apply)"
              value={form.triggersToday}
              onChange={v => set('triggersToday', v)}
              options={TRIGGERS}
            />
            {form.triggersToday.includes('Other') && (
              <input
                type="text"
                value={form.triggerOther}
                onChange={e => set('triggerOther', e.target.value)}
                placeholder="Write what triggered this today"
                className="input-field"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div>
            <label className="label">One small promise for tomorrow</label>
            <p style={{ fontSize: '0.775rem', color: '#B0A89E', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
              Choose one or a few small promises. Do not try to fix everything at once.
            </p>
            <ChipGroup
              value={form.tomorrowPromises}
              onChange={v => set('tomorrowPromises', v)}
              options={PROMISES}
            />
            {form.tomorrowPromises.includes('Other') && (
              <input
                type="text"
                value={form.tomorrowPromiseOther}
                onChange={e => set('tomorrowPromiseOther', e.target.value)}
                placeholder="Write your own small promise"
                className="input-field"
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          <div>
            <label className="label">What is one thing you want to be kinder to yourself about today?
              <span style={{ color: '#B0A89E', fontWeight: 400, marginLeft: '0.25rem' }}>(optional)</span>
            </label>
            <textarea value={form.kindnessReflection} onChange={e => set('kindnessReflection', e.target.value)}
              rows={2} placeholder="I want to be kinder to myself about…"
              className="input-field" style={{ resize: 'none', fontSize: '0.875rem' }} />
          </div>
        </FormSection>

        <FormSection title="Notes" icon="📝">
          <div>
            <label className="label">Anything else?
              <span style={{ color: '#B0A89E', fontWeight: 400, marginLeft: '0.25rem' }}>(optional)</span>
            </label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              rows={3} placeholder="Any thoughts, observations, or reflections from today…"
              className="input-field" style={{ resize: 'none', fontSize: '0.875rem' }} />
          </div>
        </FormSection>

        <div style={{ textAlign: 'center', background: '#F3F5F0', border: '1px solid #C8D5C0', borderRadius: '1rem', padding: '0.875rem', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.8125rem', color: '#52664A', fontStyle: 'italic' }}>
            "You showed up today. That already counts."
          </p>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
          <button type="submit" className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.875rem 2.5rem' }}>
            Save Today's Check-In
          </button>
          <p className="microcopy" style={{ marginTop: '0.625rem' }}>Saved locally. You can edit it anytime today.</p>
        </div>
      </form>
    </div>
  );
}
