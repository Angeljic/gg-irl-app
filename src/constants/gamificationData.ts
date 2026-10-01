import { Badge, Quest, RankInfo, RankTier } from '../types/gamification';

// Level 0 start: Each level requires progressively more XP
// Level 0 -> 1: 50 XP
// Level 1 -> 2: 75 XP
// Level 2 -> 3: 100 XP
// Formula: Math.round(50 * Math.pow(1.15, level)) or curated curve
export function getXpRequiredForLevel(level: number): number {
  if (level === 0) return 60;
  if (level === 1) return 80;
  if (level === 2) return 100;
  if (level === 3) return 130;
  if (level === 4) return 160;
  if (level === 5) return 200;
  return Math.round(50 + level * 35 + Math.pow(level, 1.6) * 12);
}

export const RANKS: RankInfo[] = [
  {
    tier: 'Eisen',
    minLevel: 0,
    maxLevel: 3,
    color: '#94A3B8',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    badgeBg: 'from-slate-700 to-slate-900',
    description: 'Aller Anfang ist schwer. Die Basis deines Aufstiegs beginnt hier!',
    title: 'Aufstrebender Rekrut'
  },
  {
    tier: 'Bronze',
    minLevel: 4,
    maxLevel: 7,
    color: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    badgeBg: 'from-amber-800 to-amber-950',
    description: 'Erste Gewohnheiten festigen sich. Dein Wille wird spürbar stärker!',
    title: 'Disziplinierter Lehrling'
  },
  {
    tier: 'Silber',
    minLevel: 8,
    maxLevel: 12,
    color: '#CBD5E1',
    glowColor: 'rgba(203, 213, 225, 0.5)',
    badgeBg: 'from-slate-400 to-slate-700',
    description: 'Konstanz zahlt sich aus. Du meisterst den Alltag mit Klarheit.',
    title: 'Fokus-Stratege'
  },
  {
    tier: 'Gold',
    minLevel: 13,
    maxLevel: 17,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    badgeBg: 'from-yellow-500 to-amber-700',
    description: 'Goldener Glanz! Du gehörst zu den Top-Performern deines Alltags.',
    title: 'Goldener Gladiator'
  },
  {
    tier: 'Platin',
    minLevel: 18,
    maxLevel: 22,
    color: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    badgeBg: 'from-cyan-500 to-teal-800',
    description: 'Präzision & Fokus in allen 5 Lebensbereichen.',
    title: 'Platin-Pionier'
  },
  {
    tier: 'Smaragd',
    minLevel: 23,
    maxLevel: 27,
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    badgeBg: 'from-emerald-500 to-emerald-900',
    description: 'Lebendige Energie und unerschütterliche Selbstdisziplin.',
    title: 'Smaragd-Champion'
  },
  {
    tier: 'Diamant',
    minLevel: 28,
    maxLevel: 34,
    color: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.7)',
    badgeBg: 'from-indigo-500 to-blue-900',
    description: 'Unzerbrechliche Gewohnheiten und analytische Exzellenz.',
    title: 'Diamant-Elite'
  },
  {
    tier: 'Meister',
    minLevel: 35,
    maxLevel: 41,
    color: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.75)',
    badgeBg: 'from-purple-600 to-violet-950',
    unlockedBgImage: 'linear-gradient(135deg, #2e0854 0%, #4c1d95 50%, #1e1b4b 100%)',
    description: 'Du inspirierst dein Umfeld und dominierst dein Leben wie ein Pro.',
    title: 'Großmeister des Alltags'
  },
  {
    tier: 'Großmeister',
    minLevel: 42,
    maxLevel: 49,
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.8)',
    badgeBg: 'from-rose-600 to-red-950',
    unlockedBgImage: 'linear-gradient(135deg, #4c0519 0%, #881337 50%, #31103f 100%)',
    description: 'Die absolute Spitze. Fast unantastbare Disziplin und Mindset.',
    title: 'Apex Legende'
  },
  {
    tier: 'Herausforderer',
    minLevel: 50,
    maxLevel: 999,
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    badgeBg: 'from-cyan-400 via-purple-600 to-amber-400',
    unlockedBgImage: 'linear-gradient(135deg, #0369a1 0%, #6b21a8 50%, #0f172a 100%)',
    description: 'Herausforderer-Rang! Du hast das reale Leben durchgespielt. Wahrer Gott-Modus!',
    title: 'Unsterblicher Herausforderer'
  }
];

export function getRankByLevel(level: number): RankInfo {
  const found = RANKS.find(r => level >= r.minLevel && level <= r.maxLevel);
  return found || RANKS[RANKS.length - 1];
}

export const DAILY_AFFIRMATIONS = [
  "YOU ARE THE STAR — DONT GIVE UP, LEVEL UP! 🌟",
  "Don´t give up, rise higher! Jeder Tag ist ein neues Spiel.",
  "Sieh das Leben wie ein RPG: Aus Fehlern lernen und XP sammeln!",
  "Disziplin ist dein stärkster Buff im realen Leben. 🛡️",
  "Kleine tägliche Siege schalten die größten Meilensteine frei. ⚔️",
  "Ein verlorenes Match ist kein Ende — es ist Zeit fürs Review & Next Game! 🎮",
  "Hydriere dich, halte deinen Geist scharf und fokussiere dein Ziel. 💧",
  "Dein Level definiert nicht deine Vergangenheit, sondern deine Zukunft! 🚀"
];

export const INITIAL_DAILY_QUESTS: Quest[] = [
  {
    id: 'daily-water',
    title: '💧 2 Liter Wasser trinken',
    description: 'Optimal für Geist und Körper. Halte deinen Energielevel hoch.',
    category: 'health',
    difficulty: 'easy',
    xpReward: 15, // max 35 cap
    isDaily: true,
    isCompletedToday: false,
    iconName: 'Droplets'
  },
  {
    id: 'daily-stretch',
    title: '🧘 5 Minuten Stretching',
    description: 'Nacken, Schultern & Beine dehnen für bessere Haltung & Fokus.',
    category: 'health',
    difficulty: 'easy',
    xpReward: 18,
    isDaily: true,
    isCompletedToday: false,
    iconName: 'Activity'
  },
  {
    id: 'daily-read',
    title: '📖 15 Min Buch / Fachartikel lesen',
    description: 'Wissen aneignen & Geist schärfen. Je länger du lernst, desto stärker wirst du.',
    category: 'intelligence',
    difficulty: 'medium',
    xpReward: 25,
    isDaily: true,
    isCompletedToday: false,
    iconName: 'BookOpen'
  },
  {
    id: 'daily-lol-review',
    title: '🎮 Review 1 Game & Fehler analysieren',
    description: 'Analysiere deine Tode, Wave Management & Trading im Match.',
    category: 'gaming',
    difficulty: 'hard',
    xpReward: 35, // Max 35 XP for hard as requested
    isDaily: true,
    isCompletedToday: false,
    skillFocus: 'Wave Management & Deaths vermeiden',
    iconName: 'Gamepad2'
  },
  {
    id: 'daily-gratitude',
    title: '🙏 3 Dinge aufschreiben, für die du dankbar bist',
    description: 'Stärkt dein positives Mindset und mentale Resilienz.',
    category: 'social',
    difficulty: 'easy',
    xpReward: 15,
    isDaily: true,
    isCompletedToday: false,
    iconName: 'Heart'
  },
  {
    id: 'daily-habits-clean',
    title: '🧹 10 Min Zimmer aufräumen / Spülmaschine',
    description: 'Ordnung im Raum schafft Klarheit und Fokus im Kopf.',
    category: 'habits',
    difficulty: 'medium',
    xpReward: 22,
    isDaily: true,
    isCompletedToday: false,
    iconName: 'Sparkles'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'Erster Schritt',
    description: 'Schließe deine allererste Quest in RISE ab.',
    category: 'general',
    rarity: 'common',
    icon: 'Footprints',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    requirement: '1 Quest abgeschlossen'
  },
  {
    id: 'badge-streak-7',
    title: '7-Tage Serie',
    description: 'Bleibe 7 Tage in Folge am Ball und sammle täglich XP.',
    category: 'general',
    rarity: 'rare',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    requirement: '7 Tage Streak'
  },
  {
    id: 'badge-bookworm',
    title: 'Bücherwurm',
    description: 'Absolviere 10 Lese- oder Lerneinheiten für Intelligence.',
    category: 'intelligence',
    rarity: 'rare',
    icon: 'BookOpen',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    requirement: '10 Intelligence Quests'
  },
  {
    id: 'badge-social-butterfly',
    title: 'Social Butterfly',
    description: 'Triff Freunde, telefoniere mit Familie oder gehe raus.',
    category: 'social',
    rarity: 'epic',
    icon: 'Users',
    unlocked: false,
    progress: 0,
    maxProgress: 15,
    requirement: '15 Social Quests'
  },
  {
    id: 'badge-clean-space',
    title: 'Reines Reich',
    description: 'Erledige 20 Haushalts- & Organisations-Quests.',
    category: 'habits',
    rarity: 'rare',
    icon: 'Sparkles',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    requirement: '20 Habits Quests'
  },
  {
    id: 'badge-gym-rat',
    title: 'Eisen-Disziplin',
    description: 'Absolviere 20 Workouts, Gym-Sessions oder Runs.',
    category: 'health',
    rarity: 'epic',
    icon: 'Dumbbell',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    requirement: '20 Health Quests'
  },
  {
    id: 'badge-lol-pro',
    title: 'Esport Analyst',
    description: 'Trage 10 Game-Reviews mit detaillierter Fehleranalyse ein.',
    category: 'gaming',
    rarity: 'legendary',
    icon: 'Trophy',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    requirement: '10 Gaming Reviews'
  },
  {
    id: 'badge-challenger-soul',
    title: 'Challenger Mindset',
    description: 'Erreiche Level 25 und schalte exklusive Rang-Designs frei.',
    category: 'general',
    rarity: 'mythic',
    icon: 'Crown',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    requirement: 'Erreiche Level 25'
  }
];

export const CATEGORY_INFO = {
  health: {
    name: 'Health & Fitness',
    color: '#10B981',
    bgLight: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    description: 'Training, Gym, Spaziergang, 5 Min Stretching, Wasser trinken',
    icon: 'HeartPulse'
  },
  intelligence: {
    name: 'Intelligence & Mind',
    color: '#06B6D4',
    bgLight: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    description: 'Bücher lesen, Lernen, Informationssteigernde Aktivitäten',
    icon: 'Brain'
  },
  social: {
    name: 'Social & Family',
    color: '#F43F5E',
    bgLight: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    description: 'Mit Freunden rausgehen, Eltern anrufen, Kontakte pflegen',
    icon: 'Users'
  },
  habits: {
    name: 'Habits & Living',
    color: '#F59E0B',
    bgLight: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    description: 'Waschmaschine, Spülmaschine, Papierkram/Dokumente, Putzen',
    icon: 'CheckCircle2'
  },
  gaming: {
    name: 'Gaming & Skills',
    color: '#A855F7',
    bgLight: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    description: 'LoL Match Reviews, Deaths vermeiden, Wave Management, Trading',
    icon: 'Gamepad2'
  }
};
