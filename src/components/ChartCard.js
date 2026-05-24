import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart, ReferenceLine,
  PieChart, Pie, Cell,
} from 'recharts';

const C = {
  sage:    '#6B8260',
  deepSage:'#3F503A',
  terra:   '#C96B3F',
  muted:   '#A0907F',
  blue:    '#5A7FA8',
  purple:  '#8A68BA',
  teal:    '#3A8080',
  rose:    '#C05E58',
  amber:   '#B8862A',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #EDE8E2',
      borderRadius: '0.875rem', boxShadow: '0 4px 16px rgba(60,40,20,0.12)',
      padding: '0.75rem 1rem', fontSize: '0.78rem',
    }}>
      <p style={{ fontWeight: 700, color: '#7A6E65', marginBottom: '0.5rem' }}>Day {label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: '#9A8E84' }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: '#3A3530' }}>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const AXIS_STYLE = { fontSize: 10, fill: '#B0A89E', fontFamily: 'Inter, system-ui, sans-serif' };

export function ScoreChart({ entries }) {
  const data = entries.map((e, i) => ({ day: i + 1, score: e.routineScore || 0 }));
  return (
    <ChartCard title="Routine Score" subtitle="Your daily score over 21 days" icon="📊">
      <ResponsiveContainer width="100%" height={190}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.sage} stopOpacity={0.25} />
              <stop offset="95%" stopColor={C.sage} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[0, 100]} tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={60} stroke={C.amber} strokeDasharray="4 4" strokeWidth={1} />
          <Area type="monotone" dataKey="score" name="Score" stroke={C.sage} strokeWidth={2} fill="url(#sg)"
            dot={{ fill: C.sage, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 5, fill: C.deepSage }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function StressFocusChart({ entries }) {
  const data = entries.map((e, i) => ({ day: i + 1, stress: +e.stressLevel || 0, focus: +e.focusLevel || 0 }));
  return (
    <ChartCard title="Stress vs Focus" subtitle="See how your mental load and clarity relate" icon="🧠">
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[0, 10]} tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#9A8E84' }} />
          <Line type="monotone" dataKey="stress" name="Stress" stroke={C.rose} strokeWidth={2}
            dot={{ fill: C.rose, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} />
          <Line type="monotone" dataKey="focus"  name="Focus"  stroke={C.blue} strokeWidth={2}
            dot={{ fill: C.blue, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SleepWaterChart({ entries }) {
  const data = entries.map((e, i) => ({ day: i + 1, sleep: +e.sleepDuration || 0, water: +e.waterGlasses || 0 }));
  return (
    <ChartCard title="Sleep &amp; Water" subtitle="Two habits that quietly control your energy" icon="💧">
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#9A8E84' }} />
          <ReferenceLine y={7} stroke={C.purple} strokeDasharray="4 4" strokeWidth={1} />
          <Line type="monotone" dataKey="sleep" name="Sleep (hrs)"    stroke={C.purple} strokeWidth={2} dot={{ fill: C.purple, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} />
          <Line type="monotone" dataKey="water" name="Water (glasses)" stroke={C.teal}   strokeWidth={2} dot={{ fill: C.teal,   r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ActivityMoodChart({ entries }) {
  const data = entries.map((e, i) => ({ day: i + 1, activity: +e.activityMinutes || 0, stress: +e.stressLevel || 0 }));
  return (
    <ChartCard title="Activity &amp; Stress" subtitle="See how movement affects your stress levels" icon="🚶">
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#9A8E84' }} />
          <Bar dataKey="activity" name="Activity (min)" fill={C.sage}  radius={[3,3,0,0]} />
          <Bar dataKey="stress"   name="Stress"          fill={C.rose}  radius={[3,3,0,0]} opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MealConsistencyChart({ entries }) {
  const data = entries.map((e, i) => ({
    day: i + 1,
    meals:     (e.breakfast ? 1 : 0) + (e.lunch ? 1 : 0) + (e.dinner ? 1 : 0),
    overeating: e.overeating ? 1 : 0,
  }));
  return (
    <ChartCard title="Meal Consistency" subtitle="Meals eaten and overeating events" icon="🍽️">
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[0, 3]} tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#9A8E84' }} />
          <Bar dataKey="meals"     name="Meals"      fill={C.teal}  radius={[3,3,0,0]} />
          <Bar dataKey="overeating" name="Overeating" fill={C.amber} radius={[3,3,0,0]} opacity={0.75} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MealTimingChart({ entries }) {
  const tH = (t) => (t ? Number(t.split(':')[0]) + Number(t.split(':')[1]) / 60 : null);

  const data = entries.map((e, i) => {
    // Count how many logged meal times were within comfortable windows
    let onTime = 0, logged = 0;
    if (e.breakfast && e.breakfastTime) { logged++; if (tH(e.breakfastTime) < 11) onTime++; }
    if (e.lunch    && e.lunchTime)     { logged++; if (tH(e.lunchTime)     < 15) onTime++; }
    if (e.dinner   && e.dinnerTime)    { logged++; if (tH(e.dinnerTime)    < 22) onTime++; }
    return {
      day: i + 1,
      onTime,
      lateNight: e.lateNightEating ? 1 : 0,
      logged,
    };
  }).filter((d) => d.logged > 0 || d.lateNight > 0);

  if (data.length === 0) return null;

  return (
    <ChartCard title="Meal Timing" subtitle="On-time meals per day (max 3) and late-night eating events" icon="🕐">
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#9A8E84' }} />
          <Bar dataKey="onTime"    name="On-time meals" fill={C.teal}  radius={[3,3,0,0]} />
          <Bar dataKey="lateNight" name="Late-night eating" fill={C.rose} radius={[3,3,0,0]} opacity={0.75} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SleepQualityChart({ entries }) {
  // Map quality labels to numeric scores for charting
  const qualityScore = (q) => {
    if (q === 'Deep')             return 4;
    if (q === 'Okay')             return 3;
    if (q === 'Light / disturbed') return 2;
    if (q === 'Very poor')        return 1;
    return null;
  };
  const wakeScore = (w) => {
    if (w === 'No')                    return 0;
    if (w === 'Yes, 1 time')           return 1;
    if (w === 'Yes, 2 to 3 times')     return 2;
    if (w === 'Yes, more than 3 times') return 3;
    return null;
  };

  const data = entries
    .map((e, i) => ({
      day: i + 1,
      quality: qualityScore(e.sleepQuality),
      wakeups: wakeScore(e.wakeDuringSleep),
    }))
    .filter((d) => d.quality !== null || d.wakeups !== null);

  if (data.length === 0) return null;

  const QualityTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const qualityLabels = ['', 'Very poor', 'Light / disturbed', 'Okay', 'Deep'];
    const wakeLabels    = ['No wake-ups', '1 time', '2 to 3 times', 'More than 3 times'];
    return (
      <div style={{
        background: '#fff', border: '1px solid #EDE8E2',
        borderRadius: '0.875rem', boxShadow: '0 4px 16px rgba(60,40,20,0.12)',
        padding: '0.75rem 1rem', fontSize: '0.78rem',
      }}>
        <p style={{ fontWeight: 700, color: '#7A6E65', marginBottom: '0.5rem' }}>Day {label}</p>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
            <span style={{ color: '#9A8E84' }}>{p.name}:</span>
            <span style={{ fontWeight: 700, color: '#3A3530' }}>
              {p.name === 'Quality' ? (qualityLabels[p.value] || p.value) : (wakeLabels[p.value] || p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartCard title="Sleep Quality" subtitle="Quality and interruptions over time (4 = Deep, 1 = Very poor)" icon="😴">
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={AXIS_STYLE} />
          <Tooltip content={<QualityTooltip />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#9A8E84' }} />
          <ReferenceLine y={3} stroke={C.sage} strokeDasharray="4 4" strokeWidth={1} />
          <Line type="monotone" dataKey="quality"  name="Quality"  stroke={C.purple} strokeWidth={2}
            dot={{ fill: C.purple, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} connectNulls />
          <Line type="monotone" dataKey="wakeups"  name="Wake-ups" stroke={C.amber}  strokeWidth={2}
            dot={{ fill: C.amber,  r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Individual trend charts ──────────────────────────────────────────────────

export function StressChart({ entries }) {
  const data = entries.map((e, i) => ({ day: i + 1, stress: +e.stressLevel || 0 }));
  return (
    <ChartCard title="Stress Level" subtitle="Daily stress over time — dashed line at 7 (high)" icon="😰">
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.rose} stopOpacity={0.2} />
              <stop offset="95%" stopColor={C.rose} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[0, 10]} tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={7} stroke={C.rose} strokeDasharray="4 4" strokeWidth={1} />
          <Area type="monotone" dataKey="stress" name="Stress" stroke={C.rose} strokeWidth={2}
            fill="url(#roseGrad)" dot={{ fill: C.rose, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function FocusChart({ entries }) {
  const data = entries.map((e, i) => ({ day: i + 1, focus: +e.focusLevel || 0 }));
  return (
    <ChartCard title="Focus Level" subtitle="Daily focus over time — dashed line at 6 (good)" icon="🧠">
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.blue} stopOpacity={0.2} />
              <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[0, 10]} tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={6} stroke={C.blue} strokeDasharray="4 4" strokeWidth={1} />
          <Area type="monotone" dataKey="focus" name="Focus" stroke={C.blue} strokeWidth={2}
            fill="url(#blueGrad)" dot={{ fill: C.blue, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SleepHoursChart({ entries }) {
  const data = entries.map((e, i) => ({ day: i + 1, sleep: +e.sleepDuration || 0 }));
  return (
    <ChartCard title="Sleep Hours" subtitle="Hours slept each night — dashed line at 7 hrs" icon="😴">
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="purpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.purple} stopOpacity={0.2} />
              <stop offset="95%" stopColor={C.purple} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[0, 12]} tick={AXIS_STYLE} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={7} stroke={C.purple} strokeDasharray="4 4" strokeWidth={1} />
          <Area type="monotone" dataKey="sleep" name="Sleep (hrs)" stroke={C.purple} strokeWidth={2}
            fill="url(#purpGrad)" dot={{ fill: C.purple, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Meal timing trend (time as decimal hours) ────────────────────────────────

export function MealTimingTrendChart({ entries }) {
  const toDecimal = (t) => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return +(h + m / 60).toFixed(2);
  };
  const fmtHr = (h) => {
    if (h == null) return '';
    const hr = Math.floor(h);
    const dh = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    return `${dh}${hr < 12 ? 'AM' : 'PM'}`;
  };

  const data = entries
    .map((e, i) => ({
      day:       i + 1,
      breakfast: toDecimal(e.breakfastTime),
      lunch:     toDecimal(e.lunchTime),
      dinner:    toDecimal(e.dinnerTime),
    }))
    .filter((d) => d.breakfast !== null || d.lunch !== null || d.dinner !== null);

  if (data.length === 0) return null;

  const MealTimeTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: '#fff', border: '1px solid #EDE8E2', borderRadius: '0.875rem',
        padding: '0.75rem 1rem', fontSize: '0.78rem', boxShadow: '0 4px 16px rgba(60,40,20,0.12)',
      }}>
        <p style={{ fontWeight: 700, color: '#7A6E65', marginBottom: '0.5rem' }}>Day {label}</p>
        {payload.map((p, i) => p.value != null && (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
            <span style={{ color: '#9A8E84' }}>{p.name}:</span>
            <span style={{ fontWeight: 700, color: '#3A3530' }}>{fmtHr(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartCard title="Meal Timing Trend" subtitle="When each meal was eaten, plotted as time of day" icon="🕐">
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" />
          <XAxis dataKey="day" tick={AXIS_STYLE} />
          <YAxis domain={[5, 24]} ticks={[6, 9, 12, 15, 18, 21, 24]} tickFormatter={fmtHr} tick={AXIS_STYLE} />
          <Tooltip content={<MealTimeTip />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#9A8E84' }} />
          <Line type="monotone" dataKey="breakfast" name="Breakfast" stroke={C.amber}  strokeWidth={2}
            dot={{ fill: C.amber,  r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} connectNulls />
          <Line type="monotone" dataKey="lunch"     name="Lunch"     stroke={C.terra}  strokeWidth={2}
            dot={{ fill: C.terra,  r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} connectNulls />
          <Line type="monotone" dataKey="dinner"    name="Dinner"    stroke={C.purple} strokeWidth={2}
            dot={{ fill: C.purple, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4.5 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Habit summary (horizontal bar) ──────────────────────────────────────────

export function HabitSummaryChart({ entries }) {
  if (!entries.length) return null;
  const total = entries.length;
  const FILL  = [C.amber, C.rose, C.terra, C.purple];
  const data  = [
    { name: 'Skipped Meals',     days: entries.filter((e) => !e.breakfast || !e.lunch || !e.dinner).length },
    { name: 'Overeating',        days: entries.filter((e) => e.overeating).length },
    { name: 'Late-night Eating', days: entries.filter((e) => e.lateNightEating).length },
    { name: 'Disturbed Sleep',   days: entries.filter((e) => e.sleepQuality === 'Light / disturbed' || e.sleepQuality === 'Very poor').length },
  ];

  const HabitTip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div style={{
        background: '#fff', border: '1px solid #EDE8E2', borderRadius: '0.875rem',
        padding: '0.75rem 1rem', fontSize: '0.78rem', boxShadow: '0 4px 16px rgba(60,40,20,0.12)',
      }}>
        <p style={{ fontWeight: 700, color: d.fill, marginBottom: '0.25rem' }}>{d.payload.name}</p>
        <p style={{ color: '#3A3530' }}>
          {d.value} of {total} days ({Math.round((d.value / total) * 100)}%)
        </p>
      </div>
    );
  };

  return (
    <ChartCard title="Habit Summary" subtitle={`Across ${total} check-ins — how often each pattern appeared`} icon="📋">
      <ResponsiveContainer width="100%" height={185}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#EDE8E2" horizontal={false} />
          <XAxis type="number" tick={AXIS_STYLE} domain={[0, total]} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ ...AXIS_STYLE, textAnchor: 'end' }} width={118} />
          <Tooltip content={<HabitTip />} />
          <Bar dataKey="days" name="Days" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={FILL[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Distribution donuts ──────────────────────────────────────────────────────

const DONUT_COLORS = [
  '#6B8260', '#C96B3F', '#5A7FA8', '#8A68BA',
  '#B8862A', '#3A8080', '#C05E58', '#9AAE8A', '#8AAAC8',
];

function DonutChart({ entries, dataKey, title, subtitle, icon }) {
  const freq = {};
  entries.forEach((e) => { const v = e[dataKey]; if (v) freq[v] = (freq[v] || 0) + 1; });
  const data = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  if (data.length === 0) return null;
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <ChartCard title={title} subtitle={subtitle} icon={icon}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ width: '130px', height: '130px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={34} outerRadius={56}
                dataKey="value" strokeWidth={2} stroke="#FAF8F5">
                {data.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [
                  `${val} days (${Math.round((val / total) * 100)}%)`, name,
                ]}
                contentStyle={{
                  background: '#fff', border: '1px solid #EDE8E2',
                  borderRadius: '0.875rem', fontSize: '0.75rem',
                  boxShadow: '0 4px 12px rgba(60,40,20,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {data.slice(0, 6).map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '2px',
                background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0,
              }} />
              <span style={{ fontSize: '0.72rem', color: '#5C5249', flex: 1, lineHeight: 1.3 }}>{d.name}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9A8E84' }}>
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

export function MoodDonutChart({ entries }) {
  return (
    <DonutChart entries={entries} dataKey="mood"
      title="Mood Distribution" subtitle="How you felt most often" icon="💭" />
  );
}

export function TriggerDonutChart({ entries }) {
  return (
    <DonutChart entries={entries} dataKey="trigger"
      title="What Triggered You" subtitle="Most common triggers across all days" icon="⚡" />
  );
}

export function SleepQualityDonutChart({ entries }) {
  return (
    <DonutChart entries={entries} dataKey="sleepQuality"
      title="Sleep Quality Distribution" subtitle="How your sleep felt across all nights" icon="🌙" />
  );
}

/* ── Generic wrapper ── */
export default function ChartCard({ title, subtitle, icon, children }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '1.125rem' }}>
        {icon && <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>{icon}</span>}
        <div>
          <h3 style={{ fontWeight: 700, color: '#3A3530', fontSize: '0.875rem', lineHeight: 1.3 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '0.75rem', color: '#B0A89E', marginTop: '0.2rem' }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
