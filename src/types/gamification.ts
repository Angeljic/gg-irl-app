export type QuestCategory = 'health' | 'intelligence' | 'social' | 'habits' | 'gaming';

export type QuestDifficulty = 'easy' | 'medium' | 'hard';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type RankTier = 
  | 'Eisen'
  | 'Bronze'
  | 'Silber'
  | 'Gold'
  | 'Platin'
  | 'Smaragd'
  | 'Diamant'
  | 'Meister'
  | 'Großmeister'
  | 'Herausforderer';

export interface RankInfo {
  tier: RankTier;
  minLevel: number;
  maxLevel: number;
  color: string;
  glowColor: string;
  badgeBg: string;
  unlockedBgImage?: string;
  description: string;
  title: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number; // Max 35 XP for hard as specified
  isDaily: boolean;
  isCompletedToday: boolean;
  completedAt?: string;
  postponedUntil?: string; // date string if moved to tomorrow
  iconName: string;
  custom?: boolean;
  repeatSchedule?: 'daily' | 'weekdays' | 'weekends' | 'once';
  skillFocus?: string; // For gaming e.g. "Wave Management in LoL"
  durationMinutes?: number;
  intensity?: 'low' | 'medium' | 'high'; // For workout
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: QuestCategory | 'general';
  rarity: BadgeRarity;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  requirement: string;
}

export interface MatchLog {
  id: string;
  date: string;
  game: string; // e.g. "League of Legends"
  championOrRole: string;
  result: 'win' | 'loss';
  kda: { kills: number; deaths: number; assists: number };
  focusSkill: string; // e.g. "Wave Management", "Trading", "Vision Control", "Map Awareness"
  reviewAnswers: {
    whatWentWell: string;
    whatToImprove: string; // e.g. "Zu viele Tode bei River-Ganks ohne Wards"
    deathAnalysis: string; // analysis of mistakes/deaths
    skillGrade: number; // 1 to 5 stars
  };
  xpEarned: number;
}

export interface UserProfile {
  gamertag: string;
  summonerName?: string;
  serverRegion?: string;
  avatarUrl: string;
  avatarFrame: string;
  activeBackground: string;
  unlockedBackgrounds: string[];
  motto: string;
  joinDate: string;
}

export interface CategoryStats {
  healthXP: number;
  intelligenceXP: number;
  socialXP: number;
  habitsXP: number;
  gamingXP: number;
  totalQuestsCompleted: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  xpEarned: number;
  questsCompletedCount: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  theme: 'dark' | 'light';
  autoPostponeUnfinished: boolean;
}
