// ─── Lifestyle Insight Generator (Rule-based, no AI) ─────────────────────────
// Returns array of insight objects { title, pattern, why, today, icon }

export const generateSymptomInsights = (symptoms, profile) => {
  const s = symptoms || [];
  const p = profile || {};
  const insights = [];

  const has = (...items) => items.every((item) => s.includes(item));
  const hasAny = (...items) => items.some((item) => s.includes(item));

  // Low concentration + skipped meals + poor sleep
  if (has('Low concentration', 'Skipping meals', 'Poor sleep')) {
    insights.push({
      title: 'Focus & Meal Connection',
      icon: '🧠',
      pattern: 'Your low concentration may be connected to irregular meals and poor sleep.',
      why: 'When sleep and meals are inconsistent, your brain has less glucose and rest to work with, making focus harder.',
      today: 'Eat something light now, drink a glass of water, take a 10-minute walk, and keep today\'s main task small.',
    });
  }

  // Stress + overeating
  if (has('Stress', 'Overeating')) {
    insights.push({
      title: 'Stress & Eating Pattern',
      icon: '🍽️',
      pattern: 'Stress eating may be happening because your body or routine is under pressure.',
      why: 'When stress rises, the body often craves quick comfort, usually food. This is a normal response, not a character flaw.',
      today: 'Before eating extra, pause for 5 minutes, drink water, and gently ask: Am I hungry, or am I stressed?',
    });
  }

  // Low energy + low water
  if (hasAny('Low energy', 'Tiredness') && hasAny('Bloating', 'Body heaviness')) {
    insights.push({
      title: 'Energy & Hydration',
      icon: '💧',
      pattern: 'Low energy may be connected to low water intake and less movement.',
      why: 'Even mild dehydration can cause fatigue, brain fog, and body heaviness that feels like laziness but is actually a hydration signal.',
      today: 'Drink one glass of water now and go for a 10-minute walk. See if you feel even slightly lighter.',
    });
  }

  // Job-search burnout + skipped meals
  if (has('Job-search burnout', 'Skipping meals')) {
    insights.push({
      title: 'Job-Search & Meal Timing',
      icon: '💼',
      pattern: 'Your job-search pressure may be affecting your meal timing and energy.',
      why: 'When focus is fully on job searching, meals get skipped, which then drops energy and makes applications feel harder.',
      today: 'Try one focused job-search block (1–2 hours), then take a proper meal break before continuing.',
    });
  }

  // Study/work burnout
  if (has('Study/work burnout', 'No motivation')) {
    insights.push({
      title: 'Study/Work Burnout',
      icon: '📚',
      pattern: 'Your study or work pressure may be draining your daily motivation.',
      why: 'Extended hours of mental work without rest can lead to a mental wall where even simple tasks feel exhausting.',
      today: 'Use the Pomodoro method: 25 minutes focused, 5 minutes break. Eat a small meal and reduce screen time this evening.',
    });
  }

  // Mood swings + poor sleep
  if (has('Mood swings', 'Poor sleep')) {
    insights.push({
      title: 'Mood & Sleep Connection',
      icon: '🌙',
      pattern: 'Your mood swings may be connected to inconsistent or low-quality sleep.',
      why: 'Sleep regulates emotional hormones. Even one or two poor sleep nights can create noticeable mood changes.',
      today: 'Avoid screens 30 minutes before bed. Try a short stretch or light reading. Aim to sleep 30 minutes earlier tonight.',
    });
  }

  // Anxiety + no motivation
  if (has('Anxiety feeling', 'No motivation')) {
    insights.push({
      title: 'Anxiety & Motivation',
      icon: '🌿',
      pattern: 'Anxiety and low motivation often appear together when the routine feels out of control.',
      why: 'When we feel behind or uncertain, anxiety can block motivation. This is a signal to simplify, not push harder.',
      today: 'Write down just one small task for today. Complete only that. Then rest. Starting small is still starting.',
    });
  }

  // Feeling guilty after eating
  if (s.includes('Feeling guilty after eating')) {
    insights.push({
      title: 'Eating & Emotional Guilt',
      icon: '💛',
      pattern: 'Feeling guilty after eating may be connected to emotional stress or an irregular routine.',
      why: 'Guilt around food often increases during high-stress periods. Your body is not the problem. Your routine needs some gentle support.',
      today: 'After your next meal, take 5 slow breaths and say: "I am nourishing my body." Food is not a reward or punishment.',
    });
  }

  // Irregular wake/sleep times
  if (has('Irregular wake-up time', 'Irregular sleep time')) {
    insights.push({
      title: 'Irregular Sleep Schedule',
      icon: '⏰',
      pattern: 'Your irregular wake and sleep times may be affecting your energy and focus across the day.',
      why: 'Your body\'s internal clock (circadian rhythm) depends on consistent timing. Irregular schedules can disrupt hormones, appetite, and mental clarity.',
      today: 'Pick one target wake-up time and one target sleep time. Try to stay within 30 minutes of them for 3 days.',
    });
  }

  // Too much screen time
  if (s.includes('Too much screen time')) {
    insights.push({
      title: 'Screen Time & Rest',
      icon: '📱',
      pattern: 'Too much screen time may be affecting your sleep quality and mental stillness.',
      why: 'Blue light and constant information input can overstimulate your brain, making it harder to relax, sleep, or focus when you want to.',
      today: 'Set one 30-minute period today with no screens. Use it to eat, walk, or simply sit quietly.',
    });
  }

  // Feeling lost or unproductive
  if (s.includes('Feeling lost or unproductive')) {
    insights.push({
      title: 'Feeling Lost',
      icon: '🌄',
      pattern: 'Feeling lost or unproductive is often a sign that your routine needs a gentle reset, not more pressure.',
      why: 'When everything feels uncertain, it\'s hard to know where to start. This is a routine signal, not a character flaw.',
      today: 'Pick just one thing to complete today. Something small and visible. Then acknowledge yourself for doing it.',
    });
  }

  // Profile-based: skips meals + overeat
  if (p.skipMeals === 'yes' && p.overeatsWhenStressed === 'yes') {
    insights.push({
      title: 'Meal Skipping & Stress Eating Pattern',
      icon: '🔄',
      pattern: 'You mentioned skipping meals and overeating when stressed. These two patterns often feed each other.',
      why: 'Skipping meals lowers blood sugar and raises stress hormones. The body then craves high-calorie food to compensate, leading to overeating.',
      today: 'Focus on eating small, consistent meals today rather than one or two large ones. Even a small snack counts.',
    });
  }

  // Generic if no insights
  if (insights.length === 0) {
    insights.push({
      title: 'Good Awareness',
      icon: '✨',
      pattern: 'Your selected patterns don\'t suggest any strong lifestyle conflicts right now.',
      why: 'Everyone has different rhythms. The key is staying aware of how habits affect your daily energy and mood.',
      today: 'Keep checking in daily. Awareness is the first step and you are already taking it.',
    });
  }

  return insights;
};

// ─── Emotional Insight Generator ─────────────────────────────────────────────
export const generateEmotionalInsight = (entry) => {
  // Support both new array fields and legacy single-string fields
  const feelings = Array.isArray(entry?.todayFeelings) ? entry.todayFeelings
    : (entry?.todayFeeling ? [entry.todayFeeling] : []);
  const triggers = Array.isArray(entry?.triggersToday) ? entry.triggersToday
    : (entry?.trigger ? [entry.trigger] : []);
  const feeling = feelings[0]; // primary feeling for insight
  const trigger = triggers[0]; // primary trigger
  const stress = Number(entry?.stressLevel) || 0;

  if (!feeling) return null;

  const map = {
    Heavy: 'Feeling heavy is often a sign your body or mind is carrying more than usual. Take it slowly today.',
    Guilty: 'Guilt about habits is a signal, not a verdict. You are allowed to reset gently any time.',
    Tired: 'Tiredness can come from sleep, stress, or emotional weight. Rest without guilt is still productive.',
    Hopeful: 'Holding onto hope is its own form of strength. Let this feeling guide your small steps today.',
    Lost: 'Feeling lost is common during uncertain times. You don\'t need a map. Just take one next step.',
    Restless: 'Restlessness often means your mind needs an outlet. A short walk or a written list can help.',
    Calm: 'Calm is a resource. Use it to do one focused task or to rest deliberately.',
    Proud: 'Something made you feel proud today. Hold onto that. It tells you what works for you.',
    Unmotivated: 'Low motivation often means your body needs rest or your goal needs to feel smaller. Try one thing.',
    'Emotionally drained': 'Emotional drain is real and valid. Protect your energy today. Say no to extras and rest early.',
    'Okay but not focused': 'Being okay but unfocused is very human. Try removing one distraction and working for 25 minutes.',
  };

  let insight = map[feeling] || 'Your emotional awareness today is already a step forward.';

  if (trigger === 'Job search pressure' && stress >= 7) {
    insight += ' Job-search pressure can be exhausting. Remember: one good application beats ten rushed ones.';
  } else if (trigger === 'Rejection or failure feeling') {
    insight += ' Rejection stings, but it does not define your direction. Rest tonight and reset tomorrow.';
  } else if (trigger === 'Family/personal pressure') {
    insight += ' Personal pressure is hard to compartmentalize. Give yourself space to feel it without judgment.';
  }

  return insight;
};

// ─── Dashboard Insights ───────────────────────────────────────────────────────
export const generateDashboardInsights = (entries) => {
  if (!entries || entries.length < 3) return [];

  const insights = [];

  // Sleep vs Focus correlation
  const highSleep = entries.filter((e) => Number(e.sleepDuration) >= 7);
  const lowSleep = entries.filter((e) => Number(e.sleepDuration) < 6);
  if (highSleep.length >= 2 && lowSleep.length >= 1) {
    const avgFocusHigh = highSleep.reduce((a, e) => a + Number(e.focusLevel), 0) / highSleep.length;
    const avgFocusLow = lowSleep.reduce((a, e) => a + Number(e.focusLevel), 0) / lowSleep.length;
    if (avgFocusHigh > avgFocusLow + 1) {
      insights.push({ icon: '🌙', text: 'Your focus was noticeably better on days when you slept 7+ hours.' });
    }
  }

  // Overeating on high-stress days
  const highStress = entries.filter((e) => Number(e.stressLevel) >= 7);
  if (highStress.length >= 2) {
    const overeatRate = highStress.filter((e) => e.overeating).length / highStress.length;
    if (overeatRate >= 0.5) {
      insights.push({ icon: '🍽️', text: 'Overeating appeared more often on your high-stress days. A 5-minute pause before snacking can help.' });
    }
  }

  // Skipped meals + low focus
  const skippedDays = entries.filter((e) => !e.breakfast || !e.lunch || !e.dinner);
  if (skippedDays.length >= 2) {
    const avgFocusSkipped = skippedDays.reduce((a, e) => a + Number(e.focusLevel), 0) / skippedDays.length;
    if (avgFocusSkipped < 5) {
      insights.push({ icon: '🧠', text: 'Skipped meals may be connected to your lower-focus days. Even a small meal makes a difference.' });
    }
  }

  // Most common trigger (handles both array and legacy string fields)
  const allTriggers = entries.flatMap((e) =>
    Array.isArray(e.triggersToday) ? e.triggersToday : (e.trigger ? [e.trigger] : [])
  ).filter((t) => t && t !== 'Other');
  if (allTriggers.length >= 3) {
    const freq = {};
    allTriggers.forEach((t) => { freq[t] = (freq[t] || 0) + 1; });
    const topTrigger = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    if (topTrigger) {
      insights.push({ icon: '⚡', text: `Your most common trigger recently was "${topTrigger[0]}". Awareness of this is already the first step.` });
    }
  }

  // Water improvement
  const avgWater = entries.reduce((a, e) => a + Number(e.waterGlasses), 0) / entries.length;
  if (avgWater >= 6) {
    insights.push({ icon: '💧', text: `Your strongest reset habit so far is staying hydrated, averaging ${avgWater.toFixed(1)} glasses a day. Keep it going.` });
  }

  return insights;
};
