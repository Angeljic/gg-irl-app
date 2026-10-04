import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  AppSettings, 
  Badge, 
  CategoryStats, 
  DailyLog, 
  MatchLog, 
  Quest, 
  QuestCategory, 
  RankInfo, 
  UserProfile 
} from '../types/gamification';
import { 
  DAILY_AFFIRMATIONS, 
  INITIAL_BADGES, 
  INITIAL_DAILY_QUESTS, 
  RANKS, 
  getRankByLevel, 
  getXpRequiredForLevel 
} from '../constants/gamificationData';
import { sounds } from '../services/soundEffects';

interface LevelUpInfo {
  oldLevel: number;
  newLevel: number;
  rank: RankInfo;
  isNewRank: boolean;
}

interface GamificationContextType {
  // Level & XP State
  level: number;
  currentLevelXp: number;
  xpRequired: number;
  totalXp: number;
  todayXp: number;
  streak: number;
  lastActiveDate: string;
  
  // Rank & Profile
  currentRank: RankInfo;
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Quests
  quests: Quest[];
  completeQuest: (questId: string) => { success: boolean; xpEarned?: number; reason?: string };
  postponeQuest: (questId: string) => void;
  addCustomQuest: (newQuest: Omit<Quest, 'id' | 'isCompletedToday'>) => void;
  deleteQuest: (questId: string) => void;
  
  // Gaming & GamerTag Match Tracker
  matchLogs: MatchLog[];
  addMatchLog: (match: Omit<MatchLog, 'id' | 'date' | 'xpEarned'>) => { xpEarned: number };
  
  // Badges
  badges: Badge[];
  recentlyUnlockedBadge: Badge | null;
  clearRecentBadge: () => void;
  
  // Stats & Progress
  categoryStats: CategoryStats;
  dailyLogs: DailyLog[];
  
  // Daily Affirmation
  currentAffirmation: string;
  nextAffirmation: () => void;
  
  // Level Up Modal
  levelUpData: LevelUpInfo | null;
  closeLevelUpModal: () => void;
  
  // Settings & App state
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  onboardingCompleted: boolean;
  completeOnboarding: (focusCategory?: QuestCategory) => void;
  resetAllProgress: () => void;
  
  // Anti-spam cooldown indicator
  isCooldownActive: boolean;
  cooldownRemaining: number;
}

const STORAGE_KEY = 'rise_rpg_state_v1';

const defaultSettings: AppSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  notificationsEnabled: false,
  dailyReminderTime: '19:00',
  theme: 'dark',
  autoPostponeUnfinished: false
};

const defaultProfile: UserProfile = {
  gamertag: 'RisingHero#EUW',
  summonerName: 'RisingHero',
  serverRegion: 'EUW',
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  avatarFrame: 'border-purple-500',
  activeBackground: 'linear-gradient(135deg, #1e1035 0%, #0d061c 100%)',
  unlockedBackgrounds: ['linear-gradient(135deg, #1e1035 0%, #0d061c 100%)'],
  motto: 'don´t give up, rise higher',
  joinDate: new Date().toISOString().split('T')[0]
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start at Level 0 with 0 XP
  const [level, setLevel] = useState<number>(0);
  const [currentLevelXp, setCurrentLevelXp] = useState<number>(0);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [todayXp, setTodayXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(1);
  const [lastActiveDate, setLastActiveDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const [quests, setQuests] = useState<Quest[]>(INITIAL_DAILY_QUESTS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([
    { date: new Date().toISOString().split('T')[0], xpEarned: 0, questsCompletedCount: 0 }
  ]);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);

  // UI state
  const [levelUpData, setLevelUpData] = useState<LevelUpInfo | null>(null);
  const [recentlyUnlockedBadge, setRecentlyUnlockedBadge] = useState<Badge | null>(null);
  const [affirmationIdx, setAffirmationIdx] = useState<number>(0);

  // Anti-spam cooldown: minimum 2.5s between rapid completions
  const [lastActionTime, setLastActionTime] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.level !== undefined) setLevel(data.level);
        if (data.currentLevelXp !== undefined) setCurrentLevelXp(data.currentLevelXp);
        if (data.totalXp !== undefined) setTotalXp(data.totalXp);
        if (data.todayXp !== undefined) setTodayXp(data.todayXp);
        if (data.streak !== undefined) setStreak(data.streak);
        if (data.lastActiveDate) setLastActiveDate(data.lastActiveDate);
        if (data.quests) setQuests(data.quests);
        if (data.badges) setBadges(data.badges);
        if (data.matchLogs) setMatchLogs(data.matchLogs);
        if (data.userProfile) setUserProfile(data.userProfile);
        if (data.settings) setSettings(data.settings);
        if (data.dailyLogs) setDailyLogs(data.dailyLogs);
        if (data.onboardingCompleted !== undefined) setOnboardingCompleted(data.onboardingCompleted);

        // Daily reset check
        const todayStr = new Date().toISOString().split('T')[0];
        if (data.lastActiveDate && data.lastActiveDate !== todayStr) {
          const lastDate = new Date(data.lastActiveDate);
          const currentDate = new Date(todayStr);
          const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays === 1) {
            setStreak(prev => prev + 1);
          } else if (diffDays > 2) {
            // Friendly soft reset: doesn't wipe progress, keeps at minimum 1
            setStreak(1);
          }
          setTodayXp(0);
          setLastActiveDate(todayStr);

          // Reset daily quests that aren't postponed
          setQuests(prev => prev.map(q => ({
            ...q,
            isCompletedToday: false,
            postponedUntil: q.postponedUntil === todayStr ? undefined : q.postponedUntil
          })));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      const stateToStore = {
        level,
        currentLevelXp,
        totalXp,
        todayXp,
        streak,
        lastActiveDate,
        quests,
        badges,
        matchLogs,
        userProfile,
        settings,
        dailyLogs,
        onboardingCompleted
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch {
      // ignore
    }
  }, [level, currentLevelXp, totalXp, todayXp, streak, lastActiveDate, quests, badges, matchLogs, userProfile, settings, dailyLogs, onboardingCompleted]);

  // Sync sounds mute
  useEffect(() => {
    sounds.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  const currentRank = useMemo(() => getRankByLevel(level), [level]);
  const xpRequired = useMemo(() => getXpRequiredForLevel(level), [level]);

  // Category stats calculation
  const categoryStats = useMemo<CategoryStats>(() => {
    let healthXP = 0;
    let intelligenceXP = 0;
    let socialXP = 0;
    let habitsXP = 0;
    let gamingXP = 0;
    let totalQuestsCompleted = 0;

    quests.forEach(q => {
      if (q.isCompletedToday || q.completedAt) {
        totalQuestsCompleted += 1;
        if (q.category === 'health') healthXP += q.xpReward;
        else if (q.category === 'intelligence') intelligenceXP += q.xpReward;
        else if (q.category === 'social') socialXP += q.xpReward;
        else if (q.category === 'habits') habitsXP += q.xpReward;
        else if (q.category === 'gaming') gamingXP += q.xpReward;
      }
    });

    matchLogs.forEach(m => {
      gamingXP += m.xpEarned;
    });

    return { healthXP, intelligenceXP, socialXP, habitsXP, gamingXP, totalQuestsCompleted };
  }, [quests, matchLogs]);

  // Check and unlock badges
  const checkBadgeProgress = useCallback((newLevel: number, allQuests: Quest[], logs: MatchLog[], newStreak: number) => {
    setBadges(prevBadges => {
      let newlyUnlocked: Badge | null = null;

      const updated = prevBadges.map(badge => {
        if (badge.unlocked) return badge;

        let curProgress = 0;
        if (badge.id === 'badge-first-step') {
          const completedCount = allQuests.filter(q => q.isCompletedToday || q.completedAt).length;
          curProgress = completedCount > 0 ? 1 : 0;
        } else if (badge.id === 'badge-streak-7') {
          curProgress = Math.min(newStreak, 7);
        } else if (badge.id === 'badge-bookworm') {
          curProgress = allQuests.filter(q => (q.isCompletedToday || q.completedAt) && q.category === 'intelligence').length;
        } else if (badge.id === 'badge-social-butterfly') {
          curProgress = allQuests.filter(q => (q.isCompletedToday || q.completedAt) && q.category === 'social').length;
        } else if (badge.id === 'badge-clean-space') {
          curProgress = allQuests.filter(q => (q.isCompletedToday || q.completedAt) && q.category === 'habits').length;
        } else if (badge.id === 'badge-gym-rat') {
          curProgress = allQuests.filter(q => (q.isCompletedToday || q.completedAt) && q.category === 'health').length;
        } else if (badge.id === 'badge-lol-pro') {
          curProgress = logs.length;
        } else if (badge.id === 'badge-challenger-soul') {
          curProgress = Math.min(newLevel, 25);
        }

        const isNowUnlocked = curProgress >= badge.maxProgress;
        if (isNowUnlocked && !badge.unlocked) {
          const unlockedBadge = {
            ...badge,
            progress: curProgress,
            unlocked: true,
            unlockedAt: new Date().toISOString()
          };
          newlyUnlocked = unlockedBadge;
          return unlockedBadge;
        }

        return { ...badge, progress: curProgress };
      });

      if (newlyUnlocked) {
        setRecentlyUnlockedBadge(newlyUnlocked);
        sounds.playBadgeUnlock();
      }

      return updated;
    });
  }, []);

  // Award XP with Level Up calculation
  const awardXp = useCallback((amount: number) => {
    // Hard cap per single quest is 35 XP
    const safeAmount = Math.min(35, Math.max(5, amount));
    
    setTotalXp(prev => prev + safeAmount);
    setTodayXp(prev => prev + safeAmount);
    sounds.playXpGain();

    // Trigger soft confetti burst for XP
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#a855f7', '#10b981', '#06b6d4', '#ec4899']
    });

    setCurrentLevelXp(prevXp => {
      let currentXp = prevXp + safeAmount;
      let currentLvl = level;
      let required = getXpRequiredForLevel(currentLvl);
      let didLevelUp = false;

      while (currentXp >= required) {
        currentXp -= required;
        currentLvl += 1;
        didLevelUp = true;
        required = getXpRequiredForLevel(currentLvl);
      }

      if (didLevelUp) {
        const oldRank = getRankByLevel(level);
        const newRank = getRankByLevel(currentLvl);
        setLevel(currentLvl);
        setLevelUpData({
          oldLevel: level,
          newLevel: currentLvl,
          rank: newRank,
          isNewRank: oldRank.tier !== newRank.tier
        });
        sounds.playLevelUp();

        // Big celebratory confetti for level up
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#9333ea', '#eab308', '#06b6d4', '#ec4899', '#10b981']
        });

        // Unlock backgrounds if reaching high rank
        if (newRank.unlockedBgImage) {
          setUserProfile(prof => {
            if (!prof.unlockedBackgrounds.includes(newRank.unlockedBgImage!)) {
              return {
                ...prof,
                unlockedBackgrounds: [...prof.unlockedBackgrounds, newRank.unlockedBgImage!]
              };
            }
            return prof;
          });
        }
      }

      return currentXp;
    });

    // Update Daily Log
    const todayStr = new Date().toISOString().split('T')[0];
    setDailyLogs(prev => {
      const existing = prev.find(l => l.date === todayStr);
      if (existing) {
        return prev.map(l => l.date === todayStr ? { ...l, xpEarned: l.xpEarned + safeAmount, questsCompletedCount: l.questsCompletedCount + 1 } : l);
      }
      return [...prev, { date: todayStr, xpEarned: safeAmount, questsCompletedCount: 1 }];
    });
  }, [level]);

  // Complete a quest with anti-spam cooldown protection
  const completeQuest = useCallback((questId: string) => {
    const now = Date.now();
    const cooldownMs = 2500; // 2.5s anti-spam protection
    if (now - lastActionTime < cooldownMs) {
      const remainingSec = Math.ceil((cooldownMs - (now - lastActionTime)) / 1000);
      setCooldownRemaining(remainingSec);
      return { 
        success: false, 
        reason: `Anti-Spam Schutz aktiv! Bitte warte noch ${remainingSec}s.` 
      };
    }

    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, reason: 'Quest nicht gefunden.' };
    if (quest.isCompletedToday) return { success: false, reason: 'Bereits heute abgeschlossen.' };

    setLastActionTime(now);

    const updatedQuests = quests.map(q => {
      if (q.id === questId) {
        return { ...q, isCompletedToday: true, completedAt: new Date().toISOString() };
      }
      return q;
    });

    setQuests(updatedQuests);
    awardXp(quest.xpReward);
    checkBadgeProgress(level, updatedQuests, matchLogs, streak);

    return { success: true, xpEarned: Math.min(35, quest.xpReward) };
  }, [quests, lastActionTime, awardXp, checkBadgeProgress, level, matchLogs, streak]);

  // Postpone quest to tomorrow
  const postponeQuest = useCallback((questId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return { ...q, postponedUntil: tomorrowStr };
      }
      return q;
    }));
  }, []);

  // Add custom quest
  const addCustomQuest = useCallback((newQuestData: Omit<Quest, 'id' | 'isCompletedToday'>) => {
    const newQuest: Quest = {
      ...newQuestData,
      id: `custom-${Date.now()}`,
      isCompletedToday: false,
      custom: true,
      xpReward: Math.min(35, Math.max(10, newQuestData.xpReward)) // Max 35 XP cap
    };
    setQuests(prev => [newQuest, ...prev]);
  }, []);

  // Delete quest
  const deleteQuest = useCallback((questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  }, []);

  // Add GamerTag match log & review
  const addMatchLog = useCallback((matchData: Omit<MatchLog, 'id' | 'date' | 'xpEarned'>) => {
    // XP reward calculated based on review quality (max 35 XP)
    let calculatedXp = 20;
    if (matchData.reviewAnswers.deathAnalysis.length > 20) calculatedXp += 5;
    if (matchData.reviewAnswers.whatToImprove.length > 20) calculatedXp += 5;
    if (matchData.result === 'win') calculatedXp += 5;
    const finalXp = Math.min(35, calculatedXp);

    const newLog: MatchLog = {
      ...matchData,
      id: `match-${Date.now()}`,
      date: new Date().toISOString(),
      xpEarned: finalXp
    };

    const newLogs = [newLog, ...matchLogs];
    setMatchLogs(newLogs);
    awardXp(finalXp);
    checkBadgeProgress(level, quests, newLogs, streak);

    return { xpEarned: finalXp };
  }, [matchLogs, awardXp, checkBadgeProgress, level, quests, streak]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const clearRecentBadge = useCallback(() => {
    setRecentlyUnlockedBadge(null);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setLevelUpData(null);
  }, []);

  const nextAffirmation = useCallback(() => {
    setAffirmationIdx(prev => (prev + 1) % DAILY_AFFIRMATIONS.length);
  }, []);

  const completeOnboarding = useCallback((focusCategory?: QuestCategory) => {
    setOnboardingCompleted(true);
    if (focusCategory) {
      // Promote quests matching focus
      setQuests(prev => {
        const sorted = [...prev].sort((a, b) => (a.category === focusCategory ? -1 : 1));
        return sorted;
      });
    }
  }, []);

  const resetAllProgress = useCallback(() => {
    setLevel(0);
    setCurrentLevelXp(0);
    setTotalXp(0);
    setTodayXp(0);
    setStreak(1);
    setQuests(INITIAL_DAILY_QUESTS);
    setBadges(INITIAL_BADGES);
    setMatchLogs([]);
    setUserProfile(defaultProfile);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const currentAffirmation = DAILY_AFFIRMATIONS[affirmationIdx];

  return (
    <GamificationContext.Provider
      value={{
        level,
        currentLevelXp,
        xpRequired,
        totalXp,
        todayXp,
        streak,
        lastActiveDate,
        currentRank,
        userProfile,
        updateProfile,
        quests,
        completeQuest,
        postponeQuest,
        addCustomQuest,
        deleteQuest,
        matchLogs,
        addMatchLog,
        badges,
        recentlyUnlockedBadge,
        clearRecentBadge,
        categoryStats,
        dailyLogs,
        currentAffirmation,
        nextAffirmation,
        levelUpData,
        closeLevelUpModal,
        settings,
        updateSettings,
        onboardingCompleted,
        completeOnboarding,
        resetAllProgress,
        isCooldownActive: cooldownRemaining > 0,
        cooldownRemaining
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
