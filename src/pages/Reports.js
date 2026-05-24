import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  loadEntries, loadProfile, loadChallenge, loadLetter,
  loadBadges, exportBackup, importBackup, saveChallenge,
} from '../utils/storageUtils';
import { buildWeekSummary, generateImprovementSuggestion } from '../utils/reportUtils';
import { getUniqueBadges, getBadgeDef } from '../utils/badgeUtils';
import { generatePDF } from '../utils/pdfUtils';
import PatternStory from '../components/PatternStory';
import LetterToSelf from '../components/LetterToSelf';
import { ScoreChart, StressChart, SleepHoursChart, MealTimingTrendChart, HabitSummaryChart } from '../components/ChartCard';

const StatRow = ({ label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F2EDE7' }}>
    <span style={{ fontSize: '0.8125rem', color: '#9A8E84' }}>{label}</span>
    <span style={{ fontWeight: 600, color: '#3A3530', fontSize: '0.8125rem' }}>{value ?? 'N/A'}</span>
  </div>
);

const ScorePill = ({ score }) => {
  const bg = score >= 80 ? '#E4EAE0' : score >= 60 ? '#EEF4FA' : score >= 40 ? '#FFF9F0' : '#FFF5F5';
  const color = score >= 80 ? '#3F503A' : score >= 60 ? '#3A5570' : score >= 40 ? '#8A6020' : '#884040';
  return <span style={{ background: bg, color, fontWeight: 700, fontSize: '0.8125rem', padding: '0.25rem 0.875rem', borderRadius: '100px' }}>{score}/100</span>;
};

const WeekCard = ({ week, entries }) => {
  const label   = week === 'all' ? '21-Day Full Summary' : `Week ${week} · Days ${(week-1)*7+1}–${week*7}`;
  const summary = buildWeekSummary(entries, week);
  const suggestion = generateImprovementSuggestion(summary);

  if (!summary || summary.count === 0) return (
    <div className="card" style={{ marginBottom: '1rem', opacity: 0.55 }}>
      <p style={{ fontWeight: 700, color: '#9A8E84', fontSize: '0.875rem', marginBottom: '0.375rem' }}>{label}</p>
      <p style={{ fontSize: '0.8rem', color: '#B0A89E' }}>No entries for this period yet.</p>
    </div>
  );

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.125rem', color: '#2E2924', fontWeight: 400 }}>{label}</h3>
        <ScorePill score={summary.avgScore} />
      </div>

      <StatRow label="Check-ins"         value={`${summary.count} of ${week === 'all' ? 21 : 7}`} />
      <StatRow label="Avg Stress"        value={`${summary.avgStress}/10`} />
      <StatRow label="Avg Focus"         value={`${summary.avgFocus}/10`} />
      <StatRow label="Avg Sleep"         value={`${summary.avgSleep} hrs`} />
      <StatRow label="Avg Water"         value={`${summary.avgWater} glasses/day`} />
      <StatRow label="Avg Activity"      value={`${summary.avgActivity} min/day`} />
      <StatRow label="Skipped Meal Days"    value={summary.skippedMealDays} />
      <StatRow label="Overeating Days"      value={summary.overeatingDays} />
      <StatRow label="Most Common Sleep Quality" value={summary.mostCommonSleepQuality || 'Not logged'} />
      <StatRow label="Disturbed Sleep Days" value={summary.disturbedSleepDays} />
      <StatRow label="Avg Breakfast Time"   value={summary.avgBreakfastTime} />
      <StatRow label="Avg Lunch Time"       value={summary.avgLunchTime} />
      <StatRow label="Avg Dinner Time"      value={summary.avgDinnerTime} />
      <StatRow label="Late-Night Eating"    value={`${summary.lateNightEatingDays} days`} />
      <StatRow label="Meal Timing Consistency" value={`${summary.mealTimingConsistency}% on-time`} />
      <StatRow label="Routine Followed Days"   value={`${summary.eatingRoutineFollowedDays} days`} />
      <StatRow label="Partially Followed"      value={`${summary.eatingRoutinePartialDays} days`} />
      <StatRow label="Flexible Days"           value={`${summary.eatingRoutineFlexibleDays} days`} />
      <StatRow label="Stress-Driven Eating"    value={`${summary.stressDrivenEatingDays} days`} />
      <StatRow label="Cheat Days"              value={`${summary.cheatDays} days`} />
      <StatRow label="Common Shift Reason"     value={summary.mostCommonChangedReason || 'Not logged'} />
      <StatRow label="Best Routine Day"     value={summary.bestDay} />
      <StatRow label="Most Common Mood"  value={summary.mostCommonMood} />
      <StatRow label="Most Common Trigger" value={summary.mostCommonTrigger} />
      <StatRow label="Top Promise"       value={summary.topPromise} />

      {suggestion && (
        <div style={{ marginTop: '0.875rem', background: '#F3F5F0', border: '1px solid #C8D5C0', borderRadius: '0.875rem', padding: '0.875rem 1rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#52664A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>💡 Improvement suggestion</p>
          <p style={{ fontSize: '0.8375rem', color: '#3A3530', lineHeight: 1.65 }}>{suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default function Reports() {
  const navigate  = useNavigate();
  const entries   = loadEntries();
  const profile   = loadProfile();
  const challenge = loadChallenge();
  const letter    = loadLetter();
  const badges    = loadBadges();
  const fileRef   = useRef();
  const [uploadMsg, setUploadMsg]   = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPDF = () => {
    setPdfLoading(true);
    try { generatePDF({ profile, entries, challenge, letter, badges }); }
    catch (err) { console.error(err); }
    finally { setTimeout(() => setPdfLoading(false), 1000); }
  };

  const handleDownloadJSON = () => {
    const data = exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `BalanceBite_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleUploadJSON = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try { importBackup(JSON.parse(evt.target.result)); setUploadMsg('✅ Backup restored! Reload the page to see your data.'); }
      catch { setUploadMsg('❌ Invalid file. Please use a BalanceBite JSON backup.'); }
    };
    reader.readAsText(file);
  };

  const uniqueBadges = getUniqueBadges(badges);

  if (!profile) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📄</span>
      <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.5rem', color: '#2E2924', marginBottom: '0.5rem' }}>No data yet</h2>
      <p style={{ color: '#9A8E84', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Complete your profile and check-ins to see reports.</p>
      <button onClick={() => navigate('/profile')} className="btn-primary">Get Started →</button>
    </div>
  );

  return (
    <div className="page-wrapper fade-in">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Reports</h1>
          <p className="page-subtitle">{entries.length} check-ins · {profile.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button onClick={handleDownloadPDF} disabled={pdfLoading || !entries.length}
            className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem', opacity: (!entries.length || pdfLoading) ? 0.4 : 1 }}>
            {pdfLoading ? '⏳ Generating…' : '📥 Download PDF'}
          </button>
          <button onClick={handleDownloadJSON} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>
            💾 Download JSON
          </button>
        </div>
      </div>

      {/* Upload */}
      <div style={{
        background: '#EEF4FA', border: '1px solid #B8D0E8',
        borderRadius: '1.25rem', padding: '1rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        flexWrap: 'wrap', marginBottom: '1.5rem',
      }}>
        <div>
          <p style={{ fontWeight: 600, color: '#3A5570', fontSize: '0.875rem' }}>Restore from backup</p>
          <p style={{ fontSize: '0.78rem', color: '#6A8EA8', marginTop: '0.125rem' }}>Upload a previously downloaded JSON backup file.</p>
        </div>
        <button onClick={() => fileRef.current.click()} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1.125rem' }}>
          📂 Upload Backup
        </button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleUploadJSON} />
      </div>

      {uploadMsg && (
        <div style={{
          borderRadius: '0.875rem', padding: '0.875rem 1rem', marginBottom: '1rem',
          fontSize: '0.875rem', fontWeight: 500,
          background: uploadMsg.startsWith('✅') ? '#F3F5F0' : '#FFF5F5',
          color: uploadMsg.startsWith('✅') ? '#3F503A' : '#884040',
          border: `1px solid ${uploadMsg.startsWith('✅') ? '#C8D5C0' : '#F4CCCA'}`,
        }}>{uploadMsg}</div>
      )}

      {/* Day-21 letter prompt */}
      {entries.length >= 21 && <div style={{ marginBottom: '1.25rem' }}><LetterToSelf day={21} /></div>}

      {/* Day-1 letter display */}
      {letter?.day1 && (
        <div style={{ background: '#F7F4FB', border: '1px solid #DCCFEF', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6F519E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            💌 Your letter from Day 1
          </p>
          <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.75, fontStyle: 'italic' }}>"{letter.day1}"</p>
        </div>
      )}

      {!entries.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📋</p>
          <p style={{ fontWeight: 600, color: '#9A8E84', marginBottom: '0.375rem' }}>No check-ins yet</p>
          <p style={{ fontSize: '0.8rem', color: '#B0A89E', marginBottom: '1.25rem' }}>Complete your first check-in to generate reports.</p>
          <button onClick={() => navigate('/check-in')} className="btn-primary">Go to Check-In →</button>
        </div>
      ) : (
        <>
          <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.25rem', color: '#2E2924', marginBottom: '0.875rem' }}>
            Weekly Summaries
          </h2>
          <WeekCard week={1} entries={entries} />
          <WeekCard week={2} entries={entries} />
          <WeekCard week={3} entries={entries} />

          <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.25rem', color: '#2E2924', margin: '0.5rem 0 0.875rem' }}>
            Full Summary
          </h2>
          <WeekCard week="all" entries={entries} />

          {entries.length >= 3 && <div style={{ marginBottom: '1.25rem' }}><PatternStory entries={entries} title="Your Pattern Story" /></div>}

          {entries.length >= 2 && (
            <>
              <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.25rem', color: '#2E2924', margin: '0.5rem 0 0.875rem' }}>
                Visual Trends
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                <ScoreChart entries={entries} />
                <StressChart entries={entries} />
                <SleepHoursChart entries={entries} />
                <MealTimingTrendChart entries={entries} />
                <HabitSummaryChart entries={entries} />
              </div>
            </>
          )}

          {uniqueBadges.length > 0 && (
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontWeight: 700, color: '#8A5A2A', fontSize: '0.875rem', marginBottom: '1rem' }}>
                🏅 All Badges Earned ({uniqueBadges.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {uniqueBadges.map(b => {
                  const def = getBadgeDef(b.id);
                  return (
                    <div key={b.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      background: 'linear-gradient(145deg, #FFF9F0 0%, #FAE6D8 100%)',
                      border: '1px solid #F4D9A8', borderRadius: '0.875rem', padding: '0.75rem 1rem',
                    }}>
                      <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{def.emoji}</span>
                      <div>
                        <p style={{ fontWeight: 600, color: '#8A5A2A', fontSize: '0.8375rem' }}>{def.label}</p>
                        <p style={{ fontSize: '0.75rem', color: '#B0A89E' }}>{def.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{
            background: '#FFF9F0', border: '1px solid #F4D9A8',
            borderRadius: '1rem', padding: '0.875rem 1rem',
            display: 'flex', gap: '0.625rem', marginBottom: '1.25rem',
          }}>
            <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: '0.775rem', color: '#8A6A3A', lineHeight: 1.6 }}>
              BalanceBite provides lifestyle awareness only and is not medical advice.
              If symptoms are severe or unusual, please consult a healthcare professional.
            </p>
          </div>
        </>
      )}

      {/* Challenge complete */}
      {entries.length >= 21 && (
        <div style={{
          background: 'linear-gradient(145deg, #FFF9F0 0%, #FAE6D8 100%)',
          border: '2px solid #F4D9A8', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center',
        }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏆</p>
          <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.5rem', color: '#8A6020', marginBottom: '0.5rem' }}>
            Challenge Complete
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#7A6E65', lineHeight: 1.65, marginBottom: '1.5rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
            You completed your 21-day reset. Download your full report to remember this achievement.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleDownloadPDF} disabled={pdfLoading} className="btn-terra">
              {pdfLoading ? '⏳ Generating…' : '📥 Download Final Report'}
            </button>
            <button onClick={() => {
              if (window.confirm('Start a new 21-day cycle? Your current entries will be kept.')) {
                saveChallenge({ startDate: new Date().toISOString().split('T')[0], currentDay: 1, completed: false });
                navigate('/dashboard');
              }
            }} className="btn-outline">
              🔄 New Cycle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
