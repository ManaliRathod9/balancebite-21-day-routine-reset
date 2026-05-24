export const generateWarnings = (entry, profile = {}) => {
  if (!entry) return [];
  const warnings = [];
  const {
    stressLevel, overeating, breakfast, lunch, dinner,
    sleepDuration, waterGlasses, activityMinutes,
    wakeUpTime, workHours, rejectionEvent,
    sleepQuality, wakeDuringSleep,
    breakfastTime, lunchTime, dinnerTime, lateNightEating,
    followedEatingRoutineToday, eatingFeltLike, eatingRoutineChangedReason,
  } = entry;
  const { eatingRoutineType, fastingComfort } = profile || {};

  const tH = (t) => (t ? Number(t.split(':')[0]) : null);
  const bfH = tH(breakfastTime), lnH = tH(lunchTime), dnH = tH(dinnerTime);

  const stress = Number(stressLevel) || 0;
  const water = Number(waterGlasses) || 0;
  const activity = Number(activityMinutes) || 0;
  const sleep = Number(sleepDuration) || 0;
  const work = Number(workHours) || 0;
  const skippedMeals = !breakfast || !lunch || !dinner;

  if (stress >= 8 && overeating) {
    warnings.push({
      id: 'stress-overeating',
      severity: 'red',
      title: 'High stress and overeating today',
      cause: 'Stress may be affecting your eating pattern today.',
      cons: 'You may feel heavy, low-energy, or have disrupted sleep tonight.',
      fix: 'Drink a glass of water, take a 5-minute pause, and try a short walk around the room.',
      pros: 'Better body awareness, lighter feeling, and more restful sleep.',
    });
  }

  if (breakfast === false) {
    warnings.push({
      id: 'skipped-breakfast',
      severity: 'yellow',
      title: 'Breakfast was skipped today',
      cause: 'Skipping the first meal can reduce morning energy for some people.',
      cons: 'Low focus, cravings, and overeating later.',
      fix: 'Try something simple tomorrow, like fruit, toast, oats, or yogurt.',
      pros: 'Better energy and a steadier start.',
    });
  }

  if (sleep > 0 && sleep < 6) {
    warnings.push({
      id: 'low-sleep',
      severity: 'red',
      title: 'Low sleep may affect tomorrow\'s focus',
      cause: 'Your body and brain may not have had enough recovery time last night.',
      cons: 'Poor concentration, mood swings, cravings, and low motivation are common after short sleep.',
      fix: 'Keep tomorrow\'s task list lighter and try to sleep 30 minutes earlier tonight.',
      pros: 'Better memory, mood, emotional regulation, and focused energy.',
    });
  }

  if (water > 0 && water < 4) {
    warnings.push({
      id: 'low-water',
      severity: 'yellow',
      title: 'Low water intake today',
      cause: 'Even mild dehydration can make you feel tired or mentally foggy.',
      cons: 'Headache, false hunger signals, low energy, and reduced focus.',
      fix: 'Drink one glass of water right now and keep a bottle on your desk.',
      pros: 'Better energy, clearer thinking, and fewer unnecessary cravings.',
    });
  }

  if (stress >= 7 && activity === 0) {
    warnings.push({
      id: 'stress-no-movement',
      severity: 'red',
      title: 'High stress and no movement today',
      cause: 'Sitting all day without movement can make stress feel heavier.',
      cons: 'Body stiffness, low mood, disrupted sleep, and reduced energy.',
      fix: 'Walk for 10 minutes or stretch for 5 minutes, even at home.',
      pros: 'Better mood, improved sleep quality, and a more relaxed body.',
    });
  }

  if (wakeUpTime) {
    const [h] = wakeUpTime.split(':').map(Number);
    if (h >= 10) {
      warnings.push({
        id: 'late-wakeup',
        severity: 'yellow',
        title: 'Late wake-up may be disturbing your routine',
        cause: 'Late wake-up can delay your meals and reduce focused morning hours.',
        cons: 'Skipped breakfast, delayed productive hours, and more pressure in the evening.',
        fix: 'Tomorrow, wake up just 30 minutes earlier as a small step.',
        pros: 'Better meal timing, more calm morning hours, and reduced evening pressure.',
      });
    }
  }

  if (work >= 5 && skippedMeals) {
    warnings.push({
      id: 'long-work-skipped-meals',
      severity: 'red',
      title: 'Long work session with skipped meals',
      cause: 'Extended work or job-search sessions can make it easy to forget meals.',
      cons: 'Burnout, lower-quality work output, cravings, and low focus.',
      fix: 'Try one focused work block, then take a proper meal break before continuing.',
      pros: 'Better-quality work, steadier energy, and a calmer mind.',
    });
  }

  if (rejectionEvent && stress >= 7) {
    warnings.push({
      id: 'rejection-stress',
      severity: 'yellow',
      title: 'A tough job-search day noted',
      cause: 'Rejection or stressful messages during job search can affect your mood and focus.',
      cons: 'Emotional drain, low motivation, stress eating, and negative self-talk.',
      fix: 'Acknowledge this is hard. Take a short break, do something kind for yourself, and rest early.',
      pros: 'Better emotional recovery, clearer mind tomorrow, and more resilient applications.',
    });
  }

  if (breakfast === true && bfH !== null && bfH >= 11) {
    warnings.push({
      id: 'late-breakfast',
      severity: 'yellow',
      title: 'Breakfast was later than usual today',
      cause: 'A late first meal can shift the rest of your routine.',
      cons: 'You may feel low energy in the morning, crave more later, or delay lunch and dinner.',
      fix: 'Try eating something simple within 1 to 2 hours after waking tomorrow.',
      pros: 'Better morning energy and a more stable meal routine through the day.',
    });
  }

  if (lunch === false) {
    warnings.push({
      id: 'skipped-lunch',
      severity: 'yellow',
      title: 'Lunch was skipped today',
      cause: 'Skipping lunch can make the afternoon feel heavier.',
      cons: 'Low energy, cravings, stress eating, or overeating at night.',
      fix: 'Try keeping one easy lunch option ready tomorrow.',
      pros: 'More stable energy and better focus.',
    });
  }

  if (lunch === true && lnH !== null && lnH >= 15) {
    warnings.push({
      id: 'late-lunch',
      severity: 'yellow',
      title: 'Lunch was later than usual today',
      cause: 'A delayed lunch can affect afternoon energy and focus.',
      cons: 'Low focus, cravings, overeating later, or evening tiredness.',
      fix: 'Plan one simple lunch break before starting a long work, study, or job-search session.',
      pros: 'Better focus and less evening hunger.',
    });
  }

  if (dinner === true && dnH !== null && dnH >= 22) {
    warnings.push({
      id: 'late-dinner',
      severity: 'yellow',
      title: 'Dinner was very late today',
      cause: 'Eating very late can sometimes disturb your sleep routine or make mornings feel heavy.',
      cons: 'Poor sleep quality, late wake-up, body heaviness, or low morning energy.',
      fix: 'Try keeping dinner earlier tomorrow, or choose something light if you eat late.',
      pros: 'Lighter sleep, better morning energy, and improved routine.',
    });
  }

  if (lateNightEating === true) {
    warnings.push({
      id: 'late-night-eating',
      severity: 'yellow',
      title: 'Late-night eating noticed today',
      cause: 'Eating late can happen when the day is stressful, busy, or irregular.',
      cons: 'Poor sleep, body heaviness, or low energy tomorrow.',
      fix: 'Use a 5-minute pause, drink water, and ask if you are hungry, stressed, bored, or tired.',
      pros: 'More awareness, calmer routine, and better sleep.',
    });
  }

  if (stress >= 8 && lateNightEating === true) {
    warnings.push({
      id: 'stress-late-eating',
      severity: 'red',
      title: 'Stress and late-night eating appeared together today',
      cause: 'Stress can push eating later at night, especially when the day feels heavy.',
      cons: 'Emotional eating, poor sleep, or low energy tomorrow.',
      fix: 'Use the stress pause before eating extra and choose one small reset for tomorrow.',
      pros: 'More control, calmer routine, and better sleep.',
    });
  }

  if (sleep >= 7 && (sleepQuality === 'Light / disturbed' || sleepQuality === 'Very poor')) {
    warnings.push({
      id: 'poor-sleep-quality',
      severity: 'yellow',
      title: 'Enough hours, but sleep was not restful',
      cause: 'You slept enough time, but the quality may have left your body less recovered than it looks.',
      cons: 'Poor sleep quality can cause tiredness, low focus, and low mood even after a full night.',
      fix: 'Try reducing screens 30 minutes before sleep and limit caffeine after 3 PM tonight.',
      pros: 'Better sleep quality means better mood, sharper focus, and more energy through the day.',
    });
  }

  if (wakeDuringSleep === 'Yes, more than 3 times') {
    warnings.push({
      id: 'frequent-wakeups',
      severity: 'yellow',
      title: 'Frequent wake-ups during sleep noted',
      cause: 'Waking up more than 3 times disrupts your sleep cycles and reduces deep rest.',
      cons: 'Fragmented sleep affects memory, mood, and recovery even if total hours look okay.',
      fix: 'Try a calmer wind-down routine: no heavy meals, no screens, and a consistent bedtime.',
      pros: 'Fewer interruptions lead to deeper sleep and more restored energy the next day.',
    });
  }

  // Eating routine warnings

  if (eatingRoutineType === 'I follow intermittent fasting' && fastingComfort && fastingComfort !== 'Yes') {
    warnings.push({
      id: 'fasting-discomfort',
      severity: 'yellow',
      title: 'Your fasting routine may not be feeling easy right now',
      cause: 'Intermittent fasting can feel harder on some days, especially during stress or low energy.',
      cons: 'Pushing through discomfort without adjusting can lead to overeating later or low mood.',
      fix: 'It is okay to have a lighter eating window today. One flexible day is not a setback.',
      pros: 'Listening to your body keeps your routine sustainable over time.',
    });
  }

  if (eatingRoutineType === 'I do not have a fixed eating time' && lateNightEating) {
    warnings.push({
      id: 'irregular-eating-pattern',
      severity: 'yellow',
      title: 'Irregular eating pattern noticed today',
      cause: 'Without a fixed meal schedule, eating can shift later in the day without you noticing.',
      cons: 'Late eating may affect your sleep, digestion, and energy the next morning.',
      fix: 'Try setting one simple meal time as an anchor, like a regular breakfast or lunch.',
      pros: 'Even one consistent meal time helps create structure and steadier energy.',
    });
  }

  if (eatingFeltLike === 'Stress-driven') {
    warnings.push({
      id: 'stress-driven-eating',
      severity: 'yellow',
      title: 'Stress-driven eating noticed today',
      cause: 'Stress can shift eating away from hunger signals and toward emotional relief.',
      cons: 'Stress eating may feel better briefly but can leave you feeling heavy or low afterwards.',
      fix: 'Next time, try a 5-minute pause before eating. Ask: am I hungry, stressed, bored, or tired?',
      pros: 'That small pause builds awareness and helps your body and mind feel more in sync.',
    });
  }

  if (
    (eatingRoutineType === 'I eat within a fixed eating window' ||
     eatingRoutineType === 'I follow intermittent fasting') &&
    (followedEatingRoutineToday === 'Partially' || followedEatingRoutineToday === 'No')
  ) {
    warnings.push({
      id: 'eating-window-shifted',
      severity: 'yellow',
      title: 'Your eating window shifted today',
      cause: 'Your usual eating schedule was not followed today.',
      cons: 'Shifting your window occasionally is fine, but frequent shifts can make the routine harder to maintain.',
      fix: 'One small reset: try returning to your usual window start time tomorrow, without pressure.',
      pros: 'Getting back on track gently is easier than trying to be perfect after a strict day.',
    });
  }

  // Supportive green messages for flexible eating days

  if (followedEatingRoutineToday === 'No' || followedEatingRoutineToday === 'Partially') {
    if (eatingRoutineChangedReason === 'Cheat day') {
      warnings.push({
        id: 'flexible-day',
        severity: 'green',
        title: 'Flexible day logged',
        cause: '',
        cons: '',
        fix: 'Enjoy it. One flexible day does not undo your progress. Come back tomorrow.',
        pros: 'Allowing flexibility keeps your routine sustainable and realistic.',
      });
    } else if (
      eatingRoutineChangedReason === 'Work or study got busy' ||
      eatingRoutineChangedReason === 'Job search pressure' ||
      eatingRoutineChangedReason === 'Woke up late' ||
      eatingRoutineChangedReason === 'Low energy'
    ) {
      warnings.push({
        id: 'busy-day-eating',
        severity: 'green',
        title: 'Busy day affected your eating routine',
        cause: '',
        cons: '',
        fix: 'You did what you could. Tomorrow, try one simple meal time as a small anchor.',
        pros: 'Noticing the pattern is the first step toward a gentler, more consistent routine.',
      });
    } else if (eatingRoutineChangedReason === 'Stress eating') {
      warnings.push({
        id: 'stress-eating-noted',
        severity: 'green',
        title: 'Stress affected your eating pattern today',
        cause: '',
        cons: '',
        fix: 'That is an honest check-in. Rest early tonight and give yourself a small reset tomorrow.',
        pros: 'Awareness without judgment is already a step forward.',
      });
    } else if (
      eatingRoutineChangedReason === 'Social event' ||
      eatingRoutineChangedReason === 'Travel or outside plans'
    ) {
      warnings.push({
        id: 'life-happened',
        severity: 'green',
        title: 'Routine changed because life happened',
        cause: '',
        cons: '',
        fix: 'Life and routine do not always match. That is expected. Return gently tomorrow.',
        pros: 'Adapting to life and coming back is what real consistency looks like.',
      });
    } else if (eatingRoutineChangedReason === 'Period discomfort') {
      warnings.push({
        id: 'gentle-day',
        severity: 'green',
        title: 'Gentle day logged',
        cause: '',
        cons: '',
        fix: 'Rest, eat what feels comforting, and be kind to yourself today.',
        pros: 'Listening to your body on harder days is part of a healthy routine.',
      });
    } else if (
      eatingRoutineChangedReason === 'Family or personal reason' ||
      eatingRoutineChangedReason === 'I forgot' ||
      eatingRoutineChangedReason === 'Other'
    ) {
      warnings.push({
        id: 'life-happened-other',
        severity: 'green',
        title: 'Routine changed because life happened',
        cause: '',
        cons: '',
        fix: 'That is part of real life. Return gently tomorrow with one simple meal time.',
        pros: 'Adapting and coming back is what real consistency looks like.',
      });
    } else if (eatingRoutineChangedReason === 'I just did not feel like following it today') {
      warnings.push({
        id: 'honest-checkin',
        severity: 'green',
        title: 'Honest check-in logged',
        cause: '',
        cons: '',
        fix: 'That is a real and valid day. Come back tomorrow without pressure.',
        pros: 'Logging an honest day takes more self-awareness than skipping it.',
      });
    }
  }

  if (warnings.length === 0) {
    warnings.push({
      id: 'great-day',
      severity: 'green',
      title: 'Your routine looks balanced today',
      cause: '',
      cons: '',
      fix: 'Keep this awareness going. One good day builds the next.',
      pros: 'Consistency compounds. Each balanced day makes the next one easier.',
    });
  }

  return warnings;
};
