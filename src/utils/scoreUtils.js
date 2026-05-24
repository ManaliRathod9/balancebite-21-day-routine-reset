// ─── Routine Score Calculator (out of 100) ───────────────────────────────────
export const calculateScore = (entry) => {
  if (!entry) return 0;
  let score = 0;

  const {
    sleepDuration, breakfast, lunch, dinner, overeating,
    waterGlasses, activityMinutes, focusLevel, stressLevel,
    sleepQuality, wakeDuringSleep,
    breakfastTime, lunchTime, dinnerTime, lateNightEating,
  } = entry;

  // Sleep 7–8 hours → +20, with quality deductions
  let sleepPoints = 0;
  if (sleepDuration >= 7 && sleepDuration <= 9) sleepPoints = 20;
  else if (sleepDuration >= 6) sleepPoints = 10;
  if (sleepQuality === 'Light / disturbed') sleepPoints = Math.max(0, sleepPoints - 5);
  else if (sleepQuality === 'Very poor') sleepPoints = Math.max(0, sleepPoints - 10);
  if (wakeDuringSleep === 'Yes, more than 3 times') sleepPoints = Math.max(0, sleepPoints - 5);
  score += sleepPoints;

  // Meals
  if (breakfast) score += 10;
  if (lunch) score += 10;
  if (dinner) score += 10;

  // No overeating → +10
  if (!overeating) score += 10;

  // Meal timing bonuses (+3 each) — gentle awareness, not punishment
  const tH = (t) => (t ? Number(t.split(':')[0]) : null);
  const bH = tH(breakfastTime), lH = tH(lunchTime), dH = tH(dinnerTime);
  if (breakfast && bH !== null && bH < 11)  score += 3;
  if (lunch    && lH !== null && lH < 15)   score += 3;
  if (dinner   && dH !== null && dH < 22)   score += 3;
  if (lateNightEating) score -= 5;

  // Water 6+ glasses → +10
  if (Number(waterGlasses) >= 6) score += 10;
  else if (Number(waterGlasses) >= 4) score += 5;

  // Activity 20+ minutes → +10
  if (Number(activityMinutes) >= 20) score += 10;
  else if (Number(activityMinutes) >= 10) score += 5;

  // Focus level 7+ → +10
  if (Number(focusLevel) >= 7) score += 10;
  else if (Number(focusLevel) >= 5) score += 5;

  // Stress below 6 → +10
  if (Number(stressLevel) <= 5) score += 10;
  else if (Number(stressLevel) <= 7) score += 5;

  return Math.max(0, Math.min(score, 100));
};

// ─── Score Status Label & Colors ─────────────────────────────────────────────
export const getScoreStatus = (score) => {
  if (score >= 80) return {
    label: 'Strong Routine',
    color: 'text-sage-700',
    bg: 'bg-sage-50',
    border: 'border-sage-300',
    ring: 'ring-sage-400',
    bar: 'bg-sage-500',
    emoji: '🌿',
  };
  if (score >= 60) return {
    label: 'Improving Routine',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    ring: 'ring-blue-400',
    bar: 'bg-blue-500',
    emoji: '🌱',
  };
  if (score >= 40) return {
    label: 'Needs Attention',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    ring: 'ring-amber-400',
    bar: 'bg-amber-500',
    emoji: '🌤️',
  };
  return {
    label: 'Recovery Day',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    ring: 'ring-rose-400',
    bar: 'bg-rose-400',
    emoji: '🌧️',
  };
};

// ─── Average from entries ─────────────────────────────────────────────────────
export const avg = (entries, key) => {
  if (!entries.length) return 0;
  const vals = entries.map((e) => Number(e[key]) || 0);
  return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
};

export const avgScore = (entries) => {
  if (!entries.length) return 0;
  return +(entries.reduce((a, e) => a + (e.routineScore || 0), 0) / entries.length).toFixed(1);
};

// ─── Average time string from entries ────────────────────────────────────────
// Returns a human-readable average time like "7:30 AM" or "Not logged"
export const avgTimeStr = (entries, key) => {
  const times = entries.map((e) => e[key]).filter(Boolean);
  if (!times.length) return 'Not logged';
  const mins = times.map((t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  });
  const avgMins = Math.round(mins.reduce((a, b) => a + b, 0) / mins.length);
  const h = Math.floor(avgMins / 60);
  const m = avgMins % 60;
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

export const modeValue = (entries, key) => {
  if (!entries.length) return '';
  const freq = {};
  entries.forEach((e) => { if (e[key]) freq[e[key]] = (freq[e[key]] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
};

// Mode value that handles both array fields (new) and legacy string fields (old)
export const modeValueArr = (entries, arrayKey, legacyKey = '') => {
  const freq = {};
  entries.forEach((e) => {
    let vals = [];
    if (Array.isArray(e[arrayKey])) vals = e[arrayKey];
    else if (legacyKey && e[legacyKey]) vals = [e[legacyKey]];
    vals.filter((v) => v && v !== 'Other').forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
};
