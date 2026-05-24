import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadEntries, loadProfile, loadChallenge, getChallengeDay, loadBadges } from '../utils/storageUtils';
import { avg, avgScore, modeValue, modeValueArr, avgTimeStr } from '../utils/scoreUtils';
import { generateDashboardInsights } from '../utils/insightUtils';
import RoutineScoreCard from '../components/RoutineScoreCard';
import RecoveryModeCard from '../components/RecoveryModeCard';
import BadgeCard from '../components/BadgeCard';
import PatternStory from '../components/PatternStory';
import {
  ScoreChart, StressChart, FocusChart, SleepHoursChart,
  SleepQualityChart, MealTimingTrendChart, MealTimingChart,
  MealConsistencyChart, ActivityMoodChart, HabitSummaryChart,
  MoodDonutChart, TriggerDonutChart, SleepQualityDonutChart,
} from '../components/ChartCard';

const StatCard = ({ label, value, icon, sub, iconBg = '#E4EAE0', iconColor = '#3F503A' }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: iconBg }}>
      <span>{icon}</span>
    </div>
    <div style={{ minWidth: 0 }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{label}</p>
      <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.1rem', color: iconColor, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.7rem', color: '#B0A89E', marginTop: '0.25rem' }}>{sub}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const navigate      = useNavigate();
  const entries       = loadEntries();
  const profile       = loadProfile();
  const challenge     = loadChallenge();
  const challengeDay  = getChallengeDay() || 0;
  const badges        = loadBadges();
  const [activeTab, setActiveTab] = useState('overview');

  const latestEntry = entries[entries.length - 1];
  const latestScore = latestEntry?.routineScore || 0;
  const totalMeals  = entries.reduce((a, e) => a + (e.breakfast ? 1 : 0) + (e.lunch ? 1 : 0) + (e.dinner ? 1 : 0), 0);
  const mealPct     = entries.length ? Math.round((totalMeals / (entries.length * 3)) * 100) : 0;
  const insights    = generateDashboardInsights(entries);

  if (!profile) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🌿</span>
        <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.5rem', color: '#2E2924', marginBottom: '0.5rem' }}>No data yet</h2>
        <p style={{ color: '#9A8E84', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Complete your profile and first check-in to see your dashboard.</p>
        <button onClick={() => navigate('/profile')} className="btn-primary">Set Up Profile →</button>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'charts',   label: 'Charts'   },
    { id: 'insights', label: 'Insights' },
    { id: 'badges',   label: 'Badges'   },
  ];

  return (
    <div className="page-wrapper fade-in">

      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Dashboard</h1>
        <p className="page-subtitle">
          Hello, {profile.name}. {challengeDay > 0 ? `Day ${challengeDay} of 21.` : 'Start your first check-in to begin.'}
        </p>
      </div>

      {challenge && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }}>
                21-Day Reset
              </p>
              <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.5rem', color: '#2E2924' }}>
                Day {challengeDay} <span style={{ color: '#9A8E84', fontSize: '1rem' }}>of 21</span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#52664A' }}>{entries.length} check-ins</p>
              <p style={{ fontSize: '0.75rem', color: '#B0A89E', marginTop: '0.125rem' }}>{21 - challengeDay} days left</p>
            </div>
          </div>
          <div style={{ height: '6px', background: '#EDE8E2', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '10px',
              background: 'linear-gradient(90deg, #6B8260 0%, #52664A 100%)',
              width: `${(challengeDay / 21) * 100}%`,
              transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)',
            }} />
          </div>
          {challengeDay >= 21 && (
            <div style={{
              marginTop: '1rem', background: '#FFF9F0', border: '1px solid #F4D9A8',
              borderRadius: '0.875rem', padding: '0.875rem 1rem', textAlign: 'center',
            }}>
              <p style={{ fontWeight: 700, color: '#8A6020', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                🏆 Challenge Complete! Download your final report.
              </p>
              <button onClick={() => navigate('/reports')} className="btn-outline" style={{ fontSize: '0.8rem' }}>
                View Reports →
              </button>
            </div>
          )}
        </div>
      )}

      {latestEntry && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9A8E84', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>
            Latest Entry · {latestEntry.date}
          </p>
          <RoutineScoreCard score={latestScore} date={latestEntry.date} />
          {latestScore < 40 && <div style={{ marginTop: '1rem' }}><RecoveryModeCard /></div>}
        </div>
      )}

      <div style={{
        display: 'flex', gap: '0.25rem', background: '#F2EDE7',
        borderRadius: '1rem', padding: '0.25rem', marginBottom: '1.25rem',
        overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: '1', minWidth: 'fit-content', padding: '0.5rem 0.875rem',
            borderRadius: '0.75rem', fontSize: '0.8125rem', fontWeight: 600,
            background: activeTab === t.id ? '#fff' : 'transparent',
            color: activeTab === t.id ? '#3F503A' : '#9A8E84',
            border: 'none', cursor: 'pointer',
            boxShadow: activeTab === t.id ? '0 1px 6px rgba(60,40,20,0.10)' : 'none',
            transition: 'all 0.2s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="fade-in">
          {entries.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</p>
              <p style={{ fontWeight: 600, color: '#9A8E84', marginBottom: '0.375rem' }}>No entries yet</p>
              <p style={{ fontSize: '0.8rem', color: '#B0A89E', marginBottom: '1.25rem' }}>
                Complete your first check-in to start tracking.
              </p>
              <button onClick={() => navigate('/check-in')} className="btn-primary">Go to Check-In →</button>
            </div>
          ) : (
            <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.625rem' }}>
              <StatCard label="Avg Score"    value={`${avgScore(entries)}/100`}                icon="📊" iconBg="#E4EAE0" iconColor="#3F503A" />
              <StatCard label="Avg Stress"   value={`${avg(entries,'stressLevel')}/10`}        icon="😰" iconBg="#FFF5F5" iconColor="#884040" />
              <StatCard label="Avg Focus"    value={`${avg(entries,'focusLevel')}/10`}          icon="🧠" iconBg="#EEF4FA" iconColor="#3A5570" />
              <StatCard label="Avg Sleep"    value={`${avg(entries,'sleepDuration')} hrs`}      icon="😴" iconBg="#F7F4FB" iconColor="#6F519E" />
              <StatCard label="Avg Water"    value={`${avg(entries,'waterGlasses')} glasses`}   icon="💧" iconBg="#EEF9F8" iconColor="#2A7070" />
              <StatCard label="Meal Consistency" value={`${mealPct}%`} icon="🍽️"              iconBg="#FDF4EF" iconColor="#A85530" sub="of all possible meals" />
              <StatCard label="Avg Activity" value={`${avg(entries,'activityMinutes')} min`}    icon="🚶" iconBg="#E4EAE0" iconColor="#3F503A" />
              <StatCard label="Skipped Meals" value={`${entries.filter(e=>!e.breakfast||!e.lunch||!e.dinner).length} days`} icon="⏭️" iconBg="#FFF9F0" iconColor="#8A6020" />
              <StatCard label="Overeating"   value={`${entries.filter(e=>e.overeating).length} days`} icon="🍫" iconBg="#FFF5F5" iconColor="#884040" />
              <StatCard label="Common Mood"  value={modeValue(entries,'mood')||'None yet'}                                    icon="💭" iconBg="#F7F4FB" iconColor="#6F519E" />
              <StatCard label="Common Trigger" value={modeValueArr(entries,'triggersToday','trigger')||'None yet'}          icon="⚡" iconBg="#FFF9F0" iconColor="#8A6020" />
              <StatCard label="Common Feeling" value={modeValueArr(entries,'todayFeelings','todayFeeling')||'None yet'}     icon="💜" iconBg="#F7F4FB" iconColor="#6F519E" />
              <StatCard label="Sleep Quality"  value={modeValue(entries,'sleepQuality')||'Not logged'} icon="😴" iconBg="#F7F4FB" iconColor="#6F519E" sub="most common this period" />
              <StatCard label="Disturbed Sleep" value={`${entries.filter(e=>e.sleepQuality==='Light / disturbed'||e.sleepQuality==='Very poor').length} days`} icon="🌙" iconBg="#FFF5F5" iconColor="#884040" sub="light or very poor quality" />
              <StatCard label="Frequent Wake-ups" value={`${entries.filter(e=>e.wakeDuringSleep==='Yes, more than 3 times'||e.wakeDuringSleep==='Yes, 2 to 3 times').length} days`} icon="⏰" iconBg="#FFF9F0" iconColor="#8A6020" sub="2+ interruptions" />
              <StatCard label="Avg Breakfast" value={avgTimeStr(entries,'breakfastTime')}               icon="🌅" iconBg="#FFF9F0" iconColor="#8A6020" sub="average first meal time" />
              <StatCard label="Avg Lunch"     value={avgTimeStr(entries,'lunchTime')}                   icon="☀️" iconBg="#FDF4EF" iconColor="#A85530" sub="average midday meal time" />
              <StatCard label="Avg Dinner"    value={avgTimeStr(entries,'dinnerTime')}                  icon="🌙" iconBg="#F7F4FB" iconColor="#6F519E" sub="average evening meal time" />
              <StatCard label="Late-Night Eating" value={`${entries.filter(e=>e.lateNightEating).length} days`} icon="🌛" iconBg="#FFF5F5" iconColor="#884040" sub="eating after 10 PM" />
              <StatCard label="Eating Routine" value={profile?.eatingRoutineType ? profile.eatingRoutineType.replace('I follow ', '').replace('I eat ', '').replace('I try to eat at ', '').replace('I do not have a ', 'No ').replace('I am still figuring out my routine', 'Figuring it out') : 'Not set'} icon="🍽" iconBg="#FDF4EF" iconColor="#A85530" sub="from your profile" />
              <StatCard label="Routine Followed" value={`${entries.filter(e=>e.followedEatingRoutineToday==='Yes').length} days`} icon="✅" iconBg="#E4EAE0" iconColor="#3F503A" sub="fully on track" />
              <StatCard label="Partially Followed" value={`${entries.filter(e=>e.followedEatingRoutineToday==='Partially').length} days`} icon="〰️" iconBg="#FFF9F0" iconColor="#8A6020" sub="routine shifted a bit" />
              <StatCard label="Flexible Days" value={`${entries.filter(e=>e.followedEatingRoutineToday==='No').length} days`} icon="🌿" iconBg="#F3F5F0" iconColor="#52664A" sub="did not follow routine" />
              <StatCard label="Stress-Driven Eating" value={`${entries.filter(e=>e.eatingFeltLike==='Stress-driven').length} days`} icon="😰" iconBg="#FFF5F5" iconColor="#884040" sub="eating felt stress-driven" />
              <StatCard label="No Fixed Plan Days" value={`${entries.filter(e=>e.eatingFeltLike==='No fixed plan').length} days`} icon="📋" iconBg="#EEF4FA" iconColor="#3A5570" sub="unplanned eating day" />
              <StatCard label="Common Reason" value={modeValue(entries.filter(e=>e.eatingRoutineChangedReason),'eatingRoutineChangedReason')||'None logged'} icon="💬" iconBg="#F7F4FB" iconColor="#6F519E" sub="why routine shifted" />
            </div>

            {(() => {
              const followedDays    = entries.filter(e => e.followedEatingRoutineToday === 'Yes').length;
              const partialDays     = entries.filter(e => e.followedEatingRoutineToday === 'Partially').length;
              const flexibleDays    = entries.filter(e => e.followedEatingRoutineToday === 'No').length;
              const stressDrivenDays = entries.filter(e => e.eatingFeltLike === 'Stress-driven').length;
              const trackedDays     = followedDays + partialDays + flexibleDays;
              if (trackedDays < 1) return null;
              const followPct = Math.round(((followedDays + partialDays * 0.5) / trackedDays) * 100);

              let message = '';
              if (stressDrivenDays >= 3) {
                message = `Stress seemed to affect your eating on ${stressDrivenDays} days. Even one small pause before eating can help break that cycle over time.`;
              } else if (flexibleDays > followedDays) {
                message = `You had more flexible eating days than fully on-track ones. That is worth noticing, not judging. One simple meal time as an anchor can make the rest feel easier.`;
              } else if (followPct >= 70) {
                message = `Your eating routine is holding up well ${followPct > 0 ? `(${followPct}% of days)` : ''}. Small consistency like this builds real momentum.`;
              } else {
                message = `Life happens and routines shift. If you can keep even one consistent meal time each day, the rest tends to settle around it.`;
              }
              return (
                <div style={{
                  background: '#F3F5F0', border: '1px solid #C8D5C0',
                  borderRadius: '1.25rem', padding: '1.125rem 1.25rem', marginTop: '0.75rem',
                }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#52664A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.375rem' }}>
                    🍽 Eating Routine Pattern
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#3F503A', lineHeight: 1.65 }}>{message}</p>
                </div>
              );
            })()}
            </>
          )}

          {(latestEntry?.tomorrowPromises?.length > 0 || latestEntry?.promiseForTomorrow) && (() => {
            const promises = Array.isArray(latestEntry.tomorrowPromises) && latestEntry.tomorrowPromises.length > 0
              ? latestEntry.tomorrowPromises.filter(p => p !== 'Other')
              : (latestEntry.promiseForTomorrow ? [latestEntry.promiseForTomorrow] : []);
            const other = latestEntry.tomorrowPromiseOther;
            if (!promises.length && !other) return null;
            return (
              <div style={{
                background: '#F3F5F0', border: '1px solid #C8D5C0',
                borderRadius: '1.25rem', padding: '1.125rem 1.25rem', marginTop: '1rem',
              }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#52664A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.375rem' }}>
                  🌱 Promise for tomorrow
                </p>
                {promises.map(p => (
                  <p key={p} style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1rem', color: '#3F503A', lineHeight: 1.5 }}>{p}</p>
                ))}
                {other && (
                  <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1rem', color: '#3F503A', lineHeight: 1.5, fontStyle: 'italic' }}>{other}</p>
                )}
              </div>
            );
          })()}

          <div style={{
            background: '#EEF4FA', border: '1px solid #B8D0E8',
            borderRadius: '1rem', padding: '0.875rem 1rem', marginTop: '1rem',
            fontSize: '0.8rem', color: '#3A5570', lineHeight: 1.6,
          }}>
            💾 Your progress is saved in this browser.{' '}
            <button onClick={() => navigate('/backup')} style={{
              background: 'none', border: 'none', color: '#3A5570', fontWeight: 700,
              cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit',
            }}>
              Download a backup
            </button>{' '}
            once a week to protect it.
          </div>
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.length < 2 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📈</p>
              <p style={{ color: '#9A8E84', fontSize: '0.875rem' }}>Complete 2+ check-ins to see your charts.</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B0A89E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '-0.25rem' }}>
                Performance Trends
              </p>
              <ScoreChart entries={entries} />
              <StressChart entries={entries} />
              <FocusChart entries={entries} />
              <SleepHoursChart entries={entries} />

              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B0A89E', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem', marginBottom: '-0.25rem' }}>
                Sleep Detail
              </p>
              <SleepQualityChart entries={entries} />

              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B0A89E', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem', marginBottom: '-0.25rem' }}>
                Meal Patterns
              </p>
              <MealTimingTrendChart entries={entries} />
              <MealConsistencyChart entries={entries} />
              <MealTimingChart entries={entries} />

              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B0A89E', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem', marginBottom: '-0.25rem' }}>
                Habit Overview
              </p>
              <HabitSummaryChart entries={entries} />
              <ActivityMoodChart entries={entries} />

              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B0A89E', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem', marginBottom: '-0.25rem' }}>
                Distributions
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <MoodDonutChart entries={entries} />
                <TriggerDonutChart entries={entries} />
                <SleepQualityDonutChart entries={entries} />
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="fade-in">
          {insights.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {insights.map((ins, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                  background: '#F3F5F0', border: '1px solid #C8D5C0',
                  borderRadius: '1rem', padding: '1rem 1.125rem',
                }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{ins.icon}</span>
                  <p style={{ fontSize: '0.875rem', color: '#3A3530', lineHeight: 1.7 }}>{ins.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#9A8E84', fontSize: '0.875rem' }}>Insights appear after 3+ check-ins.</p>
            </div>
          )}
          {entries.length >= 3 && <PatternStory entries={entries} />}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="fade-in">
          <BadgeCard badges={badges} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button onClick={() => navigate('/check-in')} className="btn-primary" style={{ padding: '0.8125rem' }}>
          ✅ Check-In
        </button>
        <button onClick={() => navigate('/reports')} className="btn-secondary" style={{ padding: '0.8125rem' }}>
          📄 Reports
        </button>
      </div>
    </div>
  );
}
