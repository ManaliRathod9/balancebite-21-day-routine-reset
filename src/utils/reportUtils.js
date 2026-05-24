import { avg, avgScore, modeValue, modeValueArr, avgTimeStr } from './scoreUtils';

export const getWeekEntries = (entries, week) => {
  const start = (week - 1) * 7;
  return entries.slice(start, start + 7);
};

export const buildWeekSummary = (entries, week) => {
  const slice = week === 'all' ? entries : getWeekEntries(entries, week);
  if (!slice.length) return null;

  const skippedMealDays = slice.filter((e) => !e.breakfast || !e.lunch || !e.dinner).length;
  const overeatingDays = slice.filter((e) => e.overeating).length;
  const bestDay = slice.reduce((best, e) => (!best || e.routineScore > best.routineScore ? e : best), null);
  const worstDay = slice.reduce((worst, e) => (!worst || e.routineScore < worst.routineScore ? e : worst), null);
  const disturbedSleepDays = slice.filter((e) => e.sleepQuality === 'Light / disturbed' || e.sleepQuality === 'Very poor').length;
  const frequentWakeupDays = slice.filter((e) => e.wakeDuringSleep === 'Yes, more than 3 times' || e.wakeDuringSleep === 'Yes, 2 to 3 times').length;
  const lateNightEatingDays = slice.filter((e) => e.lateNightEating).length;
  const avgBreakfastTime = avgTimeStr(slice, 'breakfastTime');
  const avgLunchTime     = avgTimeStr(slice, 'lunchTime');
  const avgDinnerTime    = avgTimeStr(slice, 'dinnerTime');

  // Meal timing consistency: % of days where all logged meal times are within normal windows
  const timingOnTimeDays = slice.filter((e) => {
    const tH = (t) => (t ? Number(t.split(':')[0]) : null);
    const bOk = !e.breakfast || !e.breakfastTime || tH(e.breakfastTime) < 11;
    const lOk = !e.lunch    || !e.lunchTime     || tH(e.lunchTime)     < 15;
    const dOk = !e.dinner   || !e.dinnerTime    || tH(e.dinnerTime)    < 22;
    return bOk && lOk && dOk;
  }).length;
  const mealTimingConsistency = slice.length ? Math.round((timingOnTimeDays / slice.length) * 100) : 0;

  const eatingRoutineFollowedDays  = slice.filter(e => e.followedEatingRoutineToday === 'Yes').length;
  const eatingRoutinePartialDays   = slice.filter(e => e.followedEatingRoutineToday === 'Partially').length;
  const eatingRoutineFlexibleDays  = slice.filter(e => e.followedEatingRoutineToday === 'No').length;
  const stressDrivenEatingDays     = slice.filter(e => e.eatingFeltLike === 'Stress-driven').length;
  const noFixedPlanDays            = slice.filter(e => e.eatingFeltLike === 'No fixed plan').length;
  const cheatDays                  = slice.filter(e => e.eatingRoutineChangedReason === 'Cheat day').length;
  const mostCommonChangedReason    = modeValue(
    slice.filter(e => e.eatingRoutineChangedReason),
    'eatingRoutineChangedReason'
  );

  return {
    week,
    count: slice.length,
    avgScore: avgScore(slice),
    avgStress: avg(slice, 'stressLevel'),
    avgFocus: avg(slice, 'focusLevel'),
    avgSleep: avg(slice, 'sleepDuration'),
    avgWater: avg(slice, 'waterGlasses'),
    avgActivity: avg(slice, 'activityMinutes'),
    skippedMealDays,
    overeatingDays,
    disturbedSleepDays,
    frequentWakeupDays,
    mostCommonSleepQuality: modeValue(slice, 'sleepQuality'),
    lateNightEatingDays,
    avgBreakfastTime,
    avgLunchTime,
    avgDinnerTime,
    mealTimingConsistency,
    bestDay: bestDay?.date,
    worstDay: worstDay?.date,
    mostCommonMood: modeValue(slice, 'mood'),
    mostCommonFeeling: modeValueArr(slice, 'todayFeelings', 'todayFeeling'),
    mostCommonTrigger: modeValueArr(slice, 'triggersToday', 'trigger'),
    topPromise: modeValueArr(slice, 'tomorrowPromises', 'promiseForTomorrow'),
    eatingRoutineFollowedDays,
    eatingRoutinePartialDays,
    eatingRoutineFlexibleDays,
    stressDrivenEatingDays,
    noFixedPlanDays,
    cheatDays,
    mostCommonChangedReason,
  };
};

export const generatePatternStory = (entries) => {
  if (!entries || entries.length < 3) {
    return 'Keep checking in. Your pattern story will appear once you have a few more entries.';
  }

  const parts = [];

  const highSleepDays = entries.filter((e) => Number(e.sleepDuration) >= 7);
  if (highSleepDays.length >= 2) {
    const avgFocusHigh = highSleepDays.reduce((a, e) => a + Number(e.focusLevel), 0) / highSleepDays.length;
    parts.push(`Your focus tended to be better on days when you slept 7 or more hours (average focus: ${avgFocusHigh.toFixed(1)}/10).`);
  }

  const lateNightDays = entries.filter((e) => e.lateNightEating);
  if (lateNightDays.length >= 2) {
    const avgStressLate = lateNightDays.reduce((a, e) => a + Number(e.stressLevel), 0) / lateNightDays.length;
    parts.push(`Late-night eating appeared on ${lateNightDays.length} days, often on higher-stress days (average stress: ${avgStressLate.toFixed(1)}/10). Next time, try a 5-minute pause and a glass of water before eating late.`);
  }

  const tH = (t) => (t ? Number(t.split(':')[0]) : null);
  const onTimeMealDays = entries.filter((e) => {
    const bOk = !e.breakfast || !e.breakfastTime || tH(e.breakfastTime) < 11;
    const lOk = !e.lunch    || !e.lunchTime     || tH(e.lunchTime)     < 15;
    const dOk = !e.dinner   || !e.dinnerTime    || tH(e.dinnerTime)    < 22;
    return bOk && lOk && dOk;
  });
  if (onTimeMealDays.length >= 2 && entries.length >= 3) {
    const pct = Math.round((onTimeMealDays.length / entries.length) * 100);
    if (pct >= 70) {
      parts.push(`Your meals were within comfortable timing windows on ${pct}% of days. That consistency tends to support steadier energy and focus.`);
    } else if (pct < 50) {
      parts.push(`Meal timing was irregular on more than half your days. Even shifting one meal 30 minutes earlier can create a noticeable difference in how you feel.`);
    }
  }

  const poorSleepDays = entries.filter((e) => e.sleepQuality === 'Light / disturbed' || e.sleepQuality === 'Very poor');
  if (poorSleepDays.length >= 2) {
    const avgFocusPoor = poorSleepDays.reduce((a, e) => a + Number(e.focusLevel), 0) / poorSleepDays.length;
    parts.push(`On the ${poorSleepDays.length} days you reported disturbed or poor sleep, your average focus was ${avgFocusPoor.toFixed(1)}/10. Sleep quality, not just duration, shapes how you feel.`);
  }

  const skipped = entries.filter((e) => !e.breakfast || !e.lunch || !e.dinner);
  if (skipped.length > 0) {
    const pct = Math.round((skipped.length / entries.length) * 100);
    parts.push(`You skipped at least one meal on ${skipped.length} of ${entries.length} days (${pct}% of the time), often on higher-stress days.`);
  }

  const best = entries.reduce((b, e) => (!b || e.routineScore > b.routineScore ? e : b), null);
  if (best) {
    const reasons = [];
    if (best.breakfast && best.lunch && best.dinner) reasons.push('ate all meals');
    if (Number(best.activityMinutes) >= 20) reasons.push(`walked/exercised for ${best.activityMinutes} minutes`);
    if (Number(best.waterGlasses) >= 6) reasons.push('drank enough water');
    if (Number(best.sleepDuration) >= 7) reasons.push('slept 7+ hours');
    parts.push(`Your best routine day so far was ${best.date}${reasons.length ? `. You ${reasons.join(', ')}` : ''}.`);
  }

  // Handles both new array fields and legacy single-string fields
  const triggers = entries.flatMap((e) =>
    Array.isArray(e.triggersToday) ? e.triggersToday : (e.trigger ? [e.trigger] : [])
  ).filter((t) => t && t !== 'Other');
  if (triggers.length >= 2) {
    const freq = {};
    triggers.forEach((t) => { freq[t] = (freq[t] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    if (top) parts.push(`Your most common trigger was "${top[0]}" (appeared ${top[1]} time${top[1] > 1 ? 's' : ''}).`);
  }

  const avgW = entries.reduce((a, e) => a + Number(e.waterGlasses), 0) / entries.length;
  const avgAct = entries.reduce((a, e) => a + Number(e.activityMinutes), 0) / entries.length;
  const suggestions = [];
  if (avgW < 5) suggestions.push('drinking a glass of water with each meal');
  if (avgAct < 15) suggestions.push('walking for 10 minutes after lunch');
  if (skipped.length > entries.length / 3) suggestions.push('keeping breakfast small but consistent');

  if (suggestions.length > 0) {
    parts.push(`For the next few days, focus on one small promise: ${suggestions[0]}.`);
  } else {
    parts.push('You are building real consistency. Keep one small promise each day and watch it compound.');
  }

  const followedDays   = entries.filter(e => e.followedEatingRoutineToday === 'Yes').length;
  const partialDays    = entries.filter(e => e.followedEatingRoutineToday === 'Partially').length;
  const flexibleDays   = entries.filter(e => e.followedEatingRoutineToday === 'No').length;
  const trackedEating  = followedDays + partialDays + flexibleDays;
  const stressDriven   = entries.filter(e => e.eatingFeltLike === 'Stress-driven').length;

  if (trackedEating >= 3) {
    const reasons = entries.map(e => e.eatingRoutineChangedReason).filter(Boolean);
    const freq = {};
    reasons.forEach(r => { freq[r] = (freq[r] || 0) + 1; });
    const topReason = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];

    if (stressDriven >= 2) {
      parts.push(`Stress-driven eating showed up on ${stressDriven} days. Using a 5-minute pause before eating on high-stress days can help break that pattern over time.`);
    } else if (flexibleDays > followedDays && topReason) {
      parts.push(`Your eating routine shifted on ${flexibleDays} days, most often because of "${topReason[0]}". Instead of making every day perfect, try focusing on one simple meal break during your heaviest days.`);
    } else if (followedDays >= Math.floor(trackedEating * 0.6)) {
      parts.push(`You followed your eating routine on ${followedDays} of ${trackedEating} tracked days. That kind of consistency adds up, especially when combined with on-time meal timing.`);
    }
  }

  return parts.join(' ');
};

export const generateImprovementSuggestion = (summary) => {
  if (!summary) return '';
  const s = [];

  if (summary.avgSleep < 6.5) s.push('Sleep earlier by 30 minutes each night. Even small improvements matter.');
  if (summary.avgWater < 5) s.push('Add one extra glass of water at each meal. That alone can reach 6 glasses a day.');
  if (summary.skippedMealDays > 3) s.push('Even a small snack counts as a meal. Try keeping quick options nearby.');
  if (summary.avgStress > 7) s.push('Your stress has been consistently high. A 10-minute walk or breathing exercise can lower it noticeably.');
  if (summary.avgActivity < 10) s.push('Any movement counts, even a 5-minute stretch. Try doing it right after you wake up.');

  if (s.length === 0) s.push('You are doing well overall. Focus on one small habit to deepen. Consistency beats intensity.');

  return s[0];
};
