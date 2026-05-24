import jsPDF from 'jspdf';
import { buildWeekSummary, generatePatternStory, generateImprovementSuggestion } from './reportUtils';
import { getUniqueBadges, getBadgeDef } from './badgeUtils';

const DISCLAIMER = 'BalanceBite provides lifestyle awareness only and is not medical advice. If symptoms are severe, unusual, or continue, please consult a healthcare professional.';

const addText = (doc, text, x, y, opts = {}) => {
  const { size = 10, bold = false, color = [60, 60, 60], maxWidth = 170 } = opts;
  doc.setFontSize(size);
  doc.setTextColor(...color);
  if (bold) doc.setFont('helvetica', 'bold');
  else doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(String(text || ''), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * (size * 0.4 + 1.5);
};

const addSection = (doc, title, y) => {
  if (y > 260) { doc.addPage(); y = 20; }
  doc.setFillColor(86, 120, 85);
  doc.rect(15, y - 4, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(title, 18, y + 1);
  return y + 10;
};

const addRow = (doc, label, value, x, y) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(String(label) + ':', x, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const lines = doc.splitTextToSize(String(value || 'Not recorded'), 110);
  doc.text(lines, x + 55, y);
  return y + lines.length * 5 + 1;
};

export const generatePDF = ({ profile, entries, challenge, letter, badges }) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 20;

  // ── Header ──
  doc.setFillColor(240, 247, 240);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(60, 100, 60);
  doc.text('BalanceBite', 15, 15);
  doc.setFontSize(11);
  doc.setTextColor(80, 120, 80);
  doc.text('21-Day Stress, Meal and Routine Reset: Personal Report', 15, 23);
  doc.setFontSize(8);
  doc.setTextColor(120, 140, 120);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 15, 30);
  y = 42;

  // ── Profile ──
  y = addSection(doc, 'Profile', y);
  y = addRow(doc, 'Name', profile?.name, 15, y);
  y = addRow(doc, 'Age', profile?.age, 15, y);
  y = addRow(doc, 'Goal', profile?.goal, 15, y);
  y = addRow(doc, 'Gender', profile?.gender, 15, y);
  y = addRow(doc, 'Challenge Start', challenge?.startDate, 15, y);
  y = addRow(doc, 'Days Completed', `${entries.length} of 21`, 15, y);
  y += 4;

  // ── Summary Stats ──
  if (entries.length > 0) {
    y = addSection(doc, 'Overall Summary', y);
    const summary = buildWeekSummary(entries, 'all');
    y = addRow(doc, 'Avg Routine Score', `${summary.avgScore}/100`, 15, y);
    y = addRow(doc, 'Avg Stress Level', `${summary.avgStress}/10`, 15, y);
    y = addRow(doc, 'Avg Focus Level', `${summary.avgFocus}/10`, 15, y);
    y = addRow(doc, 'Avg Sleep', `${summary.avgSleep} hours`, 15, y);
    y = addRow(doc, 'Avg Water Intake', `${summary.avgWater} glasses/day`, 15, y);
    y = addRow(doc, 'Avg Activity', `${summary.avgActivity} min/day`, 15, y);
    y = addRow(doc, 'Skipped Meal Days', `${summary.skippedMealDays} days`, 15, y);
    y = addRow(doc, 'Overeating Days', `${summary.overeatingDays} days`, 15, y);
    y = addRow(doc, 'Most Common Sleep Quality', summary.mostCommonSleepQuality || 'Not recorded', 15, y);
    y = addRow(doc, 'Disturbed Sleep Days', `${summary.disturbedSleepDays} days`, 15, y);
    y = addRow(doc, 'Avg Breakfast Time', summary.avgBreakfastTime, 15, y);
    y = addRow(doc, 'Avg Lunch Time', summary.avgLunchTime, 15, y);
    y = addRow(doc, 'Avg Dinner Time', summary.avgDinnerTime, 15, y);
    y = addRow(doc, 'Late-Night Eating Days', `${summary.lateNightEatingDays} days`, 15, y);
    y = addRow(doc, 'Meal Timing Consistency', `${summary.mealTimingConsistency}% of days on time`, 15, y);
    y = addRow(doc, 'Eating Routine Type', profile?.eatingRoutineType || 'Not set', 15, y);
    y = addRow(doc, 'Eating Routine Followed', `${summary.eatingRoutineFollowedDays} days`, 15, y);
    y = addRow(doc, 'Partially Followed', `${summary.eatingRoutinePartialDays} days`, 15, y);
    y = addRow(doc, 'Flexible Days', `${summary.eatingRoutineFlexibleDays} days`, 15, y);
    y = addRow(doc, 'Stress-Driven Eating', `${summary.stressDrivenEatingDays} days`, 15, y);
    y = addRow(doc, 'Cheat Days', `${summary.cheatDays} days`, 15, y);
    y = addRow(doc, 'Most Common Shift Reason', summary.mostCommonChangedReason || 'Not logged', 15, y);
    y = addRow(doc, 'Most Common Mood', summary.mostCommonMood, 15, y);
    y = addRow(doc, 'Most Common Feeling', summary.mostCommonFeeling, 15, y);
    y = addRow(doc, 'Most Common Trigger', summary.mostCommonTrigger, 15, y);
    y += 4;

    // Week summaries
    [1, 2, 3].forEach((week) => {
      const ws = buildWeekSummary(entries, week);
      if (ws && ws.count > 0) {
        if (y > 240) { doc.addPage(); y = 20; }
        y = addSection(doc, `Week ${week} Summary (${ws.count} check-ins)`, y);
        y = addRow(doc, 'Avg Score', `${ws.avgScore}/100`, 15, y);
        y = addRow(doc, 'Avg Stress', `${ws.avgStress}/10`, 15, y);
        y = addRow(doc, 'Avg Focus', `${ws.avgFocus}/10`, 15, y);
        y = addRow(doc, 'Routine Followed Days', `${ws.eatingRoutineFollowedDays} days`, 15, y);
        y = addRow(doc, 'Flexible Days', `${ws.eatingRoutineFlexibleDays} days`, 15, y);
        y = addRow(doc, 'Stress-Driven Eating', `${ws.stressDrivenEatingDays} days`, 15, y);
        y = addRow(doc, 'Shift Reason', ws.mostCommonChangedReason || 'Not logged', 15, y);
        y = addRow(doc, 'Best Day', ws.bestDay, 15, y);
        y = addRow(doc, 'Improvement Tip', generateImprovementSuggestion(ws), 15, y);
        y += 4;
      }
    });
  }

  // ── Pattern Story ──
  if (entries.length >= 3) {
    if (y > 230) { doc.addPage(); y = 20; }
    y = addSection(doc, 'Your Pattern Story', y);
    const story = generatePatternStory(entries);
    y = addText(doc, story, 15, y, { size: 10, maxWidth: 180 });
    y += 4;
  }

  // ── Badges ──
  if (badges && badges.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    y = addSection(doc, 'Badges Earned', y);
    const unique = getUniqueBadges(badges);
    unique.forEach((b) => {
      const def = getBadgeDef(b.id);
      if (y > 268) { doc.addPage(); y = 20; }
      // Bullet + badge title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(60, 100, 60);
      const titleLines = doc.splitTextToSize('* ' + (def.label || b.id), 178);
      doc.text(titleLines, 15, y);
      y += titleLines.length * 5;
      // Description indented
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      const descLines = doc.splitTextToSize(def.desc || '', 168);
      doc.text(descLines, 21, y);
      y += descLines.length * 4.5 + 2;
    });
    y += 4;
  }

  // ── Letter to Myself ──
  if (letter?.day1) {
    if (y > 240) { doc.addPage(); y = 20; }
    y = addSection(doc, 'Letter to Myself: Why I Started', y);
    y = addText(doc, letter.day1, 15, y, { size: 10, maxWidth: 180 });
    y += 4;
  }

  if (letter?.day21) {
    if (y > 240) { doc.addPage(); y = 20; }
    y = addSection(doc, 'What Changed: Day 21 Reflection', y);
    y = addText(doc, letter.day21, 15, y, { size: 10, maxWidth: 180 });
    y += 4;
  }

  // ── Final Recommendation ──
  if (entries.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    y = addSection(doc, 'Final Recommendation', y);
    const summary = buildWeekSummary(entries, 'all');
    const suggestion = generateImprovementSuggestion(summary);
    y = addText(doc, suggestion, 15, y, { size: 10, maxWidth: 180 });
    y += 4;
  }

  // ── Disclaimer ──
  if (y > 260) { doc.addPage(); y = 20; }
  doc.setFillColor(255, 248, 240);
  doc.rect(15, y, 180, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 100, 40);
  doc.text('! Important Disclaimer', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 80, 40);
  const disclaimerLines = doc.splitTextToSize(DISCLAIMER, 172);
  doc.text(disclaimerLines, 18, y + 11);

  doc.save(`BalanceBite_Report_${profile?.name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`);
};
