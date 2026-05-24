// ─── Badge Definitions ────────────────────────────────────────────────────────
export const BADGE_DEFS = [
  { id: 'stayed-aware', emoji: '👁️', label: 'Stayed Aware Today', desc: 'You completed a daily check-in.' },
  { id: 'one-proper-meal', emoji: '🍱', label: 'Ate One Proper Meal', desc: 'At least one full meal today.' },
  { id: 'came-back', emoji: '🌅', label: 'Came Back After a Hard Day', desc: 'You checked in after a tough day.' },
  { id: 'walked-5min', emoji: '🚶', label: 'Walked Even for 5 Minutes', desc: 'Any movement today counts.' },
  { id: 'did-not-give-up', emoji: '💪', label: 'Did Not Give Up', desc: 'You showed up today despite difficulty.' },
  { id: 'slept-earlier', emoji: '🌙', label: 'Slept Earlier Than Yesterday', desc: 'Better sleep timing today.' },
  { id: 'more-water', emoji: '💧', label: 'Drank More Water Than Yesterday', desc: 'Hydration improvement.' },
  { id: 'focused-block', emoji: '🎯', label: 'Completed One Focused Block', desc: 'You did meaningful work today.' },
  { id: 'chose-promise', emoji: '🌱', label: 'Chose a Promise for Tomorrow', desc: 'You set an intention for tomorrow.' },
  { id: 'all-meals', emoji: '🥗', label: 'All Three Meals Today', desc: 'Breakfast, lunch, and dinner. All done.' },
  { id: 'stress-pause', emoji: '⏸️', label: 'Used the Stress Pause', desc: 'You paused before overeating. That is real strength.' },
  { id: 'day-7', emoji: '🔥', label: 'Week 1 Complete', desc: 'You have reached Day 7 of your reset.' },
  { id: 'day-14', emoji: '⭐', label: 'Week 2 Complete', desc: 'You have reached Day 14 of your reset.' },
  { id: 'day-21', emoji: '🏆', label: '21-Day Reset Complete', desc: 'You completed the full 21-day reset. You rebuilt your routine.' },
];

// ─── Calculate Badges for a Single Entry ─────────────────────────────────────
export const calculateEntryBadges = (entry, previousEntry, challengeDay) => {
  const earned = [];
  const today = entry.date;

  // Always: Stayed aware
  earned.push({ id: 'stayed-aware', date: today });

  // At least one proper meal
  if (entry.breakfast || entry.lunch || entry.dinner) {
    earned.push({ id: 'one-proper-meal', date: today });
  }

  // All three meals
  if (entry.breakfast && entry.lunch && entry.dinner) {
    earned.push({ id: 'all-meals', date: today });
  }

  // Walked 5+ min
  if (Number(entry.activityMinutes) >= 5) {
    earned.push({ id: 'walked-5min', date: today });
  }

  // Came back after hard day (score was low yesterday, still checked in)
  if (previousEntry && (previousEntry.routineScore || 0) < 40) {
    earned.push({ id: 'came-back', date: today });
  }

  // Did not give up (stress >= 7 but still checked in)
  if (Number(entry.stressLevel) >= 7) {
    earned.push({ id: 'did-not-give-up', date: today });
  }

  // Slept earlier than yesterday
  if (previousEntry && entry.sleepTime && previousEntry.sleepTime) {
    const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    if (toMins(entry.sleepTime) < toMins(previousEntry.sleepTime)) {
      earned.push({ id: 'slept-earlier', date: today });
    }
  }

  // Drank more water than yesterday
  if (previousEntry && Number(entry.waterGlasses) > Number(previousEntry.waterGlasses)) {
    earned.push({ id: 'more-water', date: today });
  }

  // Focused block (work hours >= 1)
  if (Number(entry.workHours) >= 1) {
    earned.push({ id: 'focused-block', date: today });
  }

  // Chose a promise (handles both new array and legacy string)
  if ((Array.isArray(entry.tomorrowPromises) && entry.tomorrowPromises.length > 0) || entry.promiseForTomorrow) {
    earned.push({ id: 'chose-promise', date: today });
  }

  // Stress pause used
  if (entry.stressPauseResponse) {
    earned.push({ id: 'stress-pause', date: today });
  }

  // Milestone badges
  if (challengeDay === 7) earned.push({ id: 'day-7', date: today });
  if (challengeDay === 14) earned.push({ id: 'day-14', date: today });
  if (challengeDay === 21) earned.push({ id: 'day-21', date: today });

  return earned;
};

// ─── Get Badge Definition by ID ───────────────────────────────────────────────
export const getBadgeDef = (id) => BADGE_DEFS.find((b) => b.id === id) || {
  id, emoji: '🏅', label: id, desc: '',
};

// ─── Unique badges earned ─────────────────────────────────────────────────────
export const getUniqueBadges = (allBadges) => {
  const seen = new Set();
  return allBadges.filter((b) => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });
};
