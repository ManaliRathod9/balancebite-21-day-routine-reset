# BalanceBite - 21-Day Stress, Meal & Routine Reset Tracker

BalanceBite is a frontend-only React app that helps people understand how their daily routine affects stress, meals, sleep, mood, focus, and energy.

I built this project around a real situation many people go through. During stressful phases like job searching, studying, or working under pressure, routine can slowly break. Some days we skip meals. Some days we overeat. Some days we sleep late, wake up tired, and cannot focus properly.

BalanceBite helps users track these patterns for 21 days and rebuild their routine one small step at a time.

## Live Demo

You can view the published app here:

https://balancebite-21-day-routine-reset.vercel.app/

The app is responsive and works on desktop, tablet, and mobile screens.

## What BalanceBite Helps With

BalanceBite helps users notice patterns like:

- whether stress is connected to overeating
- whether skipped meals affect focus
- whether poor sleep affects energy
- whether late-night eating affects the next morning
- whether job search, study, or work pressure is changing their routine
- whether they are following their eating routine or having more flexible days

The app is not about having a perfect day every day. It is about noticing what is happening and slowly coming back to a better routine.

## Main Features

### Profile and Lifestyle Setup

The app starts with simple questions about the user’s routine, including:

- age
- gender category
- weight and height
- wake-up time
- sleep time
- meal habits
- water intake
- activity level
- study, work, or job-search hours
- main wellness goal

This gives the app a starting point before the 21-day reset begins.

### Symptom and Struggle Check-In

Users can select what they have been experiencing recently, such as:

- low concentration
- tiredness
- stress
- poor sleep
- cravings
- skipping meals
- overeating
- low energy
- no motivation
- job-search burnout
- too much screen time

Based on the selected options, the app shows simple lifestyle-based insights.

### 21-Day Daily Check-In

Each day, users can log:

- wake-up time
- sleep time
- sleep duration
- sleep quality
- whether they woke up during sleep
- breakfast, lunch, and dinner
- meal timing
- late-night eating
- stress level
- focus level
- mood
- water intake
- activity minutes
- study, work, or job-search hours
- emotional triggers
- one small promise for tomorrow

The app saves progress in the browser using LocalStorage.

### Eating Routine and Flexible Days

BalanceBite supports different eating routines, including:

- intermittent fasting
- fixed eating window
- regular meal times
- no fixed eating schedule
- still figuring out a routine

It also allows users to log flexible days. For example, someone may usually follow intermittent fasting, but one day they may not because of a cheat day, work, travel, stress, period discomfort, or simply because the day did not go as planned.

The app does not treat this as failure. It helps the user notice why the routine shifted.

### Smart Habit Warnings

The app uses rule-based logic to show gentle warnings when certain patterns appear.

Examples:

- high stress and overeating
- skipped breakfast and low focus
- low sleep and low energy
- late-night eating
- stress and late-night eating together
- skipped or delayed lunch
- disturbed sleep even when total sleep hours look okay

Each warning explains what happened, why it may matter, what the possible effect could be, and one small thing the user can try next.

### Guilt-Free Recovery Mode

If the routine score is very low, the app does not use harsh language.

Instead, it shows:

> Today is a recovery day, not a failed day.

Then it suggests only a few small actions:

- drink water
- eat one proper meal
- sleep 30 minutes earlier

This makes the app feel more supportive and realistic.

### Emotional Check-In

Users can select multiple feelings for the day, such as:

- heavy
- guilty
- tired
- hopeful
- lost
- restless
- calm
- proud
- unmotivated
- emotionally drained
- okay but not focused

They can also choose “Other” and write how they feel in their own words.

### Dashboard

The dashboard shows visual patterns from saved check-ins, including:

- routine score trend
- stress level trend
- focus level trend
- sleep hours trend
- water intake trend
- activity trend
- meal timing trend
- mood and trigger patterns

This helps users understand their routine across multiple days, not just one day at a time.

### Reports

The Reports page summarizes progress across:

- Week 1
- Week 2
- Week 3
- the full 21-day reset

Reports include:

- average routine score
- average stress level
- average focus level
- skipped meal count
- overeating count
- late-night eating count
- sleep quality summary
- most common triggers
- flexible eating days
- eating routine consistency
- simple pattern-based insights

### PDF Report and JSON Backup

Users can download a PDF report of their progress.

The report includes:

- profile summary
- 21-day challenge summary
- routine score
- stress and focus patterns
- meal and sleep patterns
- eating routine insights
- badges earned
- final recommendation
- safety note

Users can also download a JSON backup and upload it later to restore their saved data.

## Tech Stack

- React
- React Router
- Tailwind CSS
- Recharts
- LocalStorage
- jsPDF / html2canvas
- Vite
- Vercel

## Why I Built This

I wanted to build something that connects with real daily life.

A lot of people do not lose routine all at once. It happens slowly. One late night becomes another. One skipped meal becomes a habit. Stress starts affecting food, sleep, and focus.

BalanceBite is built around that idea. The app helps users slow down, notice their patterns, and restart with small steps instead of feeling judged.

## Current Status

BalanceBite is currently a frontend-only MVP.

It includes:

- profile setup
- symptom onboarding
- 21-day daily check-ins
- routine score
- smart habit warnings
- sleep quality tracking
- meal timing tracking
- eating routine tracking
- flexible day tracking
- emotional check-ins
- dashboard charts
- reports
- PDF export
- JSON backup and restore
- responsive design for desktop, tablet, and mobile

## Future Improvements

Possible future improvements:

- backend with MongoDB
- user accounts
- real reminders
- more accessibility improvements
- mobile app version
- calendar-based habit view
- better PDF report design
- optional cloud backup
- dark mode

## Safety Note

BalanceBite provides lifestyle awareness only. It is not medical advice and does not diagnose or treat medical conditions. If symptoms are severe, unusual, or continue, users should consult a healthcare professional.

## How to Use the App

1. Open the app from the live demo link.

2. Start with the profile setup.
   Add your basic details, routine, sleep time, meal habits, and main goal.

3. Select what you have been experiencing.
   Choose symptoms or struggles like stress, poor sleep, low focus, cravings, or skipped meals.

4. Review your 21-day reset plan.
   The app creates a simple routine plan based on your profile and selected struggles.

5. Complete the daily check-in.
   Log your sleep, meals, eating time, stress, focus, mood, water intake, activity, and emotional triggers.

6. Read the gentle warnings and insights.
   The app shows small observations based on your entries, such as skipped meals, late-night eating, disturbed sleep, or stress-driven eating.

7. Check the dashboard.
   Use the charts to see how your routine, sleep, stress, meals, and focus change across days.

8. Visit the reports page.
   Review weekly summaries and the full 21-day progress report.

9. Download your PDF report.
   Save a copy of your progress and insights.

10. Download a JSON backup.
   Your data is saved in the browser, so downloading a backup helps you restore your progress later if needed.

## Run Locally

Clone the repository:

```bash
git clone https://github.com/ManaliRathod9/balancebite-21-day-routine-reset.git
```

Open the project folder:

```bash
cd balancebite-21-day-routine-reset
```

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

After running the command, the terminal will show a local link. Open that link in your browser to use the app.

## Author

Built by Manali Rathod
