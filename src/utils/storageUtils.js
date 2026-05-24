// ─── Storage Keys ───────────────────────────────────────────────────────────
export const KEYS = {
  PROFILE: 'balanceBiteProfile',
  ENTRIES: 'balanceBiteEntries',
  CHALLENGE: 'balanceBiteChallenge',
  REPORTS: 'balanceBiteReports',
  BACKUP: 'balanceBiteBackup',
  LETTER: 'balanceBiteLetterToSelf',
  BADGES: 'balanceBiteBadges',
};

// ─── Generic Helpers ─────────────────────────────────────────────────────────
export const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error('Storage save error', e); }
};

export const load = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) { return fallback; }
};

export const remove = (key) => localStorage.removeItem(key);

// ─── Profile ─────────────────────────────────────────────────────────────────
export const saveProfile = (profile) => save(KEYS.PROFILE, profile);
export const loadProfile = () => load(KEYS.PROFILE);

// ─── Entries ─────────────────────────────────────────────────────────────────
export const loadEntries = () => load(KEYS.ENTRIES, []);

export const saveEntry = (entry) => {
  const entries = loadEntries();
  const idx = entries.findIndex((e) => e.date === entry.date);
  if (idx >= 0) { entries[idx] = entry; } else { entries.push(entry); }
  entries.sort((a, b) => a.date.localeCompare(b.date));
  save(KEYS.ENTRIES, entries);
  return entries;
};

export const getEntryByDate = (date) => {
  return loadEntries().find((e) => e.date === date) || null;
};

// ─── Challenge ───────────────────────────────────────────────────────────────
export const loadChallenge = () => load(KEYS.CHALLENGE);

export const saveChallenge = (data) => save(KEYS.CHALLENGE, data);

export const startChallenge = () => {
  const existing = loadChallenge();
  if (existing) return existing;
  const challenge = { startDate: new Date().toISOString().split('T')[0], currentDay: 1, completed: false };
  saveChallenge(challenge);
  return challenge;
};

export const getChallengeDay = () => {
  const c = loadChallenge();
  if (!c) return null;
  const start = new Date(c.startDate);
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(diff, 21);
};

// ─── Letter to Self ──────────────────────────────────────────────────────────
export const saveLetter = (letter) => save(KEYS.LETTER, letter);
export const loadLetter = () => load(KEYS.LETTER, { day1: '', day21: '' });

// ─── Badges ──────────────────────────────────────────────────────────────────
export const loadBadges = () => load(KEYS.BADGES, []);
export const saveBadges = (badges) => save(KEYS.BADGES, badges);

export const addBadge = (badge) => {
  const badges = loadBadges();
  if (!badges.find((b) => b.id === badge.id && b.date === badge.date)) {
    badges.push(badge);
    saveBadges(badges);
  }
  return badges;
};

// ─── Full Backup ─────────────────────────────────────────────────────────────
export const exportBackup = () => ({
  exportedAt: new Date().toISOString(),
  version: '1.0',
  profile: load(KEYS.PROFILE),
  entries: load(KEYS.ENTRIES, []),
  challenge: load(KEYS.CHALLENGE),
  letter: load(KEYS.LETTER, { day1: '', day21: '' }),
  badges: load(KEYS.BADGES, []),
  reports: load(KEYS.REPORTS, []),
});

export const importBackup = (data) => {
  if (data.profile) save(KEYS.PROFILE, data.profile);
  if (data.entries) save(KEYS.ENTRIES, data.entries);
  if (data.challenge) save(KEYS.CHALLENGE, data.challenge);
  if (data.letter) save(KEYS.LETTER, data.letter);
  if (data.badges) save(KEYS.BADGES, data.badges);
  if (data.reports) save(KEYS.REPORTS, data.reports);
};

export const clearAll = () => Object.values(KEYS).forEach(remove);
