import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, loadProfile, startChallenge } from '../utils/storageUtils';

const GOALS = [
  'Improve focus', 'Reduce stress eating', 'Stop skipping meals',
  'Fix sleep routine', 'Build a healthy routine', 'Reduce stress',
  'Improve energy', 'Rebuild daily discipline',
];

const ROUTINE_BREAKERS = [
  'Stress', 'Job search pressure', 'Study pressure', 'Work pressure',
  'Late sleep', 'Phone / social media', 'Low motivation', 'Emotional eating',
  'No fixed schedule', "I don't know",
];

const Section = ({ num, title, children }) => (
  <div className="form-section">
    <div className="form-section-title">
      <span style={{ color: '#C96B3F', marginRight: '0.5rem' }}>{num}</span>
      {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
  </div>
);

const ToggleGroup = ({ label, value, onChange, options }) => (
  <div>
    {label && <label className="label">{label}</label>}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          style={{
            padding: '0.5rem 1.125rem', borderRadius: '100px',
            fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
            border: '1.5px solid', transition: 'all 0.18s',
            background: value === opt ? '#E4EAE0' : '#fff',
            color: value === opt ? '#3F503A' : '#7A6E65',
            borderColor: value === opt ? '#869F78' : '#DDD7D0',
          }}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const MultiChip = ({ label, value = [], onChange, options }) => (
  <div>
    {label && <label className="label">{label}</label>}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map(opt => {
        const sel = value.includes(opt);
        return (
          <button key={opt} type="button"
            onClick={() => onChange(sel ? value.filter(v => v !== opt) : [...value, opt])}
            className={`chip ${sel ? 'chip-selected' : 'chip-unselected'}`}>
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

export default function ProfileSetup() {
  const navigate  = useNavigate();
  const existing  = loadProfile() || {};

  const [form, setForm] = useState({
    name:               existing.name || '',
    age:                existing.age || '',
    gender:             existing.gender || '',
    weight:             existing.weight || '',
    height:             existing.height || '',
    goal:               existing.goal || '',
    wakeUpTime:         existing.wakeUpTime || '',
    sleepTime:          existing.sleepTime || '',
    mealsPerDay:        existing.mealsPerDay || '',
    skipMeals:          existing.skipMeals || '',
    overeatsWhenStressed: existing.overeatsWhenStressed || '',
    waterGlasses:       existing.waterGlasses || '',
    exercisesDaily:     existing.exercisesDaily || '',
    studyWorkHours:     existing.studyWorkHours || '',
    routineBreakers:    existing.routineBreakers || [],
    eatingRoutineType:     existing.eatingRoutineType || '',
    fastingStartTime:      existing.fastingStartTime || '',
    fastingEndTime:        existing.fastingEndTime || '',
    eatingWindowStartTime: existing.eatingWindowStartTime || '',
    eatingWindowEndTime:   existing.eatingWindowEndTime || '',
    usualBreakfastTime:    existing.usualBreakfastTime || '',
    usualLunchTime:        existing.usualLunchTime || '',
    usualDinnerTime:       existing.usualDinnerTime || '',
    fastingComfort:        existing.fastingComfort || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.goal || !form.gender) {
      alert('Please fill in your name, gender, and main goal to continue.');
      return;
    }
    saveProfile({ ...form, createdAt: existing.createdAt || new Date().toISOString() });
    startChallenge();
    navigate('/symptoms');
  };

  return (
    <div className="page-wrapper fade-in">

      <div style={{ marginBottom: '2.5rem' }}>
        <div className="step-pill">Step 1 of 3</div>
        <h1 className="section-title">A few things about you</h1>
        <p className="page-subtitle">
          This takes about 3 minutes. Everything is saved privately in your browser and never shared anywhere.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        <Section num="01" title="About you">
          <Field label="Your name">
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              className="input-field" placeholder="What should we call you?" required />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Age">
              <input type="number" min="10" max="100" value={form.age}
                onChange={e => set('age', e.target.value)} className="input-field" placeholder="e.g. 24" />
            </Field>
            <Field label="Weight (optional)">
              <input type="text" value={form.weight}
                onChange={e => set('weight', e.target.value)} className="input-field" placeholder="e.g. 65 kg" />
            </Field>
          </div>

          <Field label="Height (optional)">
            <input type="text" value={form.height}
              onChange={e => set('height', e.target.value)} className="input-field" placeholder="e.g. 165 cm" />
          </Field>

          <ToggleGroup label="Gender" value={form.gender} onChange={v => set('gender', v)}
            options={['Female', 'Male', 'General / Prefer not to say']} />
        </Section>

        <Section num="02" title="Your main goal for the next 21 days">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            {GOALS.map(g => (
              <button key={g} type="button" onClick={() => set('goal', g)}
                style={{
                  textAlign: 'left', padding: '0.875rem 1rem', borderRadius: '1rem',
                  fontSize: '0.8375rem', fontWeight: 500, cursor: 'pointer',
                  border: '1.5px solid', transition: 'all 0.18s',
                  background: form.goal === g ? '#E4EAE0' : '#fff',
                  color: form.goal === g ? '#3F503A' : '#5C5249',
                  borderColor: form.goal === g ? '#869F78' : '#EDE8E2',
                  boxShadow: form.goal === g ? '0 2px 8px rgba(60,80,50,0.10)' : 'none',
                }}>
                {g}
              </button>
            ))}
          </div>
        </Section>

        <Section num="03" title="Sleep &amp; meals">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Wake-up time">
              <input type="time" value={form.wakeUpTime} onChange={e => set('wakeUpTime', e.target.value)} className="input-field" />
            </Field>
            <Field label="Sleep time">
              <input type="time" value={form.sleepTime} onChange={e => set('sleepTime', e.target.value)} className="input-field" />
            </Field>
          </div>

          <Field label="Meals per day">
            <select value={form.mealsPerDay} onChange={e => set('mealsPerDay', e.target.value)} className="select-field">
              <option value="">Select…</option>
              {['1','2','3','4','5+'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>

          <ToggleGroup label="Do you often skip meals?" value={form.skipMeals}
            onChange={v => set('skipMeals', v)} options={['Yes', 'No']} />
          <ToggleGroup label="Do you overeat when stressed?" value={form.overeatsWhenStressed}
            onChange={v => set('overeatsWhenStressed', v)} options={['Yes', 'No']} />
        </Section>

        <Section num="04" title="Water &amp; movement">
          <Field label="Glasses of water per day">
            <input type="number" min="0" max="20" value={form.waterGlasses}
              onChange={e => set('waterGlasses', e.target.value)} className="input-field" placeholder="e.g. 4" />
          </Field>
          <ToggleGroup label="Do you exercise or walk daily?" value={form.exercisesDaily}
            onChange={v => set('exercisesDaily', v)} options={['Yes', 'No', 'Sometimes']} />
          <Field label="Hours spent studying, job searching, or working per day">
            <input type="number" min="0" max="20" value={form.studyWorkHours}
              onChange={e => set('studyWorkHours', e.target.value)} className="input-field" placeholder="e.g. 6" />
          </Field>
        </Section>

        <Section num="05" title="What usually breaks your routine?">
          <MultiChip label="Select all that apply"
            value={form.routineBreakers}
            onChange={v => set('routineBreakers', v)}
            options={ROUTINE_BREAKERS} />
        </Section>

        <Section num="06" title="Your eating routine">
          <ToggleGroup
            label="Do you follow any eating routine?"
            value={form.eatingRoutineType}
            onChange={v => set('eatingRoutineType', v)}
            options={[
              'I follow intermittent fasting',
              'I eat within a fixed eating window',
              'I try to eat at regular meal times',
              'I do not have a fixed eating time',
              'I am still figuring out my routine',
            ]}
          />

          {form.eatingRoutineType === 'I follow intermittent fasting' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Fasting starts at">
                  <input type="time" value={form.fastingStartTime}
                    onChange={e => set('fastingStartTime', e.target.value)} className="input-field" />
                </Field>
                <Field label="Fasting ends at">
                  <input type="time" value={form.fastingEndTime}
                    onChange={e => set('fastingEndTime', e.target.value)} className="input-field" />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Eating window starts">
                  <input type="time" value={form.eatingWindowStartTime}
                    onChange={e => set('eatingWindowStartTime', e.target.value)} className="input-field" />
                </Field>
                <Field label="Eating window ends">
                  <input type="time" value={form.eatingWindowEndTime}
                    onChange={e => set('eatingWindowEndTime', e.target.value)} className="input-field" />
                </Field>
              </div>
              <ToggleGroup
                label="Is this intentional and comfortable for you right now?"
                value={form.fastingComfort}
                onChange={v => set('fastingComfort', v)}
                options={['Yes', 'Sometimes', 'Not really']}
              />
            </div>
          )}

          {form.eatingRoutineType === 'I eat within a fixed eating window' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.25rem' }}>
              <Field label="Eating window starts">
                <input type="time" value={form.eatingWindowStartTime}
                  onChange={e => set('eatingWindowStartTime', e.target.value)} className="input-field" />
              </Field>
              <Field label="Eating window ends">
                <input type="time" value={form.eatingWindowEndTime}
                  onChange={e => set('eatingWindowEndTime', e.target.value)} className="input-field" />
              </Field>
            </div>
          )}

          {form.eatingRoutineType === 'I try to eat at regular meal times' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', paddingTop: '0.25rem' }}>
              <Field label="Usual breakfast time">
                <input type="time" value={form.usualBreakfastTime}
                  onChange={e => set('usualBreakfastTime', e.target.value)} className="input-field" />
              </Field>
              <Field label="Usual lunch time">
                <input type="time" value={form.usualLunchTime}
                  onChange={e => set('usualLunchTime', e.target.value)} className="input-field" />
              </Field>
              <Field label="Usual dinner time">
                <input type="time" value={form.usualDinnerTime}
                  onChange={e => set('usualDinnerTime', e.target.value)} className="input-field" />
              </Field>
            </div>
          )}

          {(form.eatingRoutineType === 'I do not have a fixed eating time' ||
            form.eatingRoutineType === 'I am still figuring out my routine') && (
            <p style={{
              fontSize: '0.8125rem', color: '#7A6E65', lineHeight: 1.6,
              background: '#F9F6F2', borderRadius: '0.75rem',
              padding: '0.875rem 1rem', margin: 0,
              border: '1px solid #EDE8E2',
            }}>
              That is completely okay. BalanceBite will gently track your eating patterns each day so you can notice what feels good, without any pressure to follow a strict schedule.
            </p>
          )}
        </Section>

        <div style={{ textAlign: 'center', paddingTop: '0.5rem', paddingBottom: '2rem' }}>
          <button type="submit" className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.875rem 2.25rem' }}>
            Save & Continue
          </button>
          <p className="microcopy" style={{ marginTop: '0.75rem' }}>
            All answers stay in your browser. Nothing is sent anywhere.
          </p>
        </div>
      </form>
    </div>
  );
}
