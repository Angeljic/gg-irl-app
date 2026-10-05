import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Badge, 
  Quest, 
  QuestCategory, 
  RankInfo, 
  UserProfile, 
  CategoryStats, 
  MatchLog, 
  AppSettings 
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

interface GamificationContextType {
  // Level & XP
  level: number;
  currentXp: number;
  xpRequired: number;
  totalXp: number;
  todayXp: number;
  streak: number;
  currentRank: RankInfo;
  
  // Quests
  quests: Quest[];
  completeQuest: (questId: string) => { success: boolean; message?: string; xpEarned?: number };
  uncompleteQuest: (questId: string) => { success: boolean; message?: string };
  postponeQuestToTomorrow: (questId: string) => void;
  deleteQuest: (questId: string) => void;
  addCustomQuest: (quest: Omit<Quest, 'id' | 'isCompletedToday'>) => void;

  // Anti-spam cooldown state
  cooldownRemainingSec: number;
  isSpamCooldownActive: boolean;

  // Matches & Gaming review
  matches: MatchLog[];
  logMatchReview: (match: Omit<MatchLog, 'id' | 'date'>) => void;

  // Badges
  badges: Badge[];
  recentlyUnlockedBadge: Badge | null;
  clearRecentBadge: () => void;

  // Profile & settings
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  categoryStats: CategoryStats;

  // Celebration state
  levelUpModalData: { newLevel: number; oldLevel: number; rank: RankInfo } | null;
  closeLevelUpModal: () => void;

  // Affirmation
  currentAffirmation: string;
  nextAffirmation: () => void;

  // Reset or seed
  resetProgress: () => void;
  seedSampleXP: () => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LEVEL: 'rise_level_v1',
  CURRENT_XP: 'rise_current_xp_v1',
  TOTAL_XP: 'rise_total_xp_v1',
  TODAY_XP: 'rise_today_xp_v1',
  LAST_XP_DATE: 'rise_last_xp_date_v1',
  LAST_ACTION_TIMESTAMP: 'rise_last_action_timestamp_v1',
  STREAK: 'rise_streak_v1',
  QUESTS: 'rise_quests_v1',
  MATCHES: 'rise_matches_v1',
  BADGES: 'rise_badges_v1',
  PROFILE: 'rise_profile_v1',
  SETTINGS: 'rise_settings_v1',
  CATEGORY_STATS: 'rise_category_stats_v1',
  ONBOARDING: 'rise_onboarding_v1'
};

const COOLDOWN_SECONDS = 3; // Anti-spam cooldown between quest completions

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start at Level 0 with 0 XP as specified
  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEVEL);
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [currentXp, setCurrentXp] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_XP);
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOTAL_XP);
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [todayXp, setTodayXp] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TODAY_XP);
    const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_XP_DATE);
    const today = new Date().toISOString().split('T')[0];
    if (lastDate === today && saved !== null) {
      return parseInt(saved, 10);
    }
    return 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  // Anti-spam cooldown
  const [cooldownRemainingSec, setCooldownRemainingSec] = useState<number>(0);

  // Level Up Modal
  const [levelUpModalData, setLevelUpModalData] = useState<{ newLevel: number; oldLevel: number; rank: RankInfo } | null>(null);

  // Recently unlocked badge modal
  const [recentlyUnlockedBadge, setRecentlyUnlockedBadge] = useState<Badge | null>(null);

  // Affirmation
  const [affirmationIdx, setAffirmationIdx] = useState<number>(0);

  // Onboarding
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      soundEnabled: true,
      hapticEnabled: true,
      notificationsEnabled: true,
      dailyReminderTime: '20:00',
      theme: 'dark',
      autoPostponeUnfinished: true
    };
  });

  // Profile with gamer tag for League of Legends match tracking
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      gamertag: 'StarPlayer#EUW',
      summonerName: 'StarPlayer',
      serverRegion: 'EUW',
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      avatarFrame: 'neon-purple',
      activeBackground: 'default',
      unlockedBackgrounds: ['default'],
      motto: 'don´t give up, rise higher',
      joinDate: new Date().toLocaleDateString('de-DE')
    };
  });

  // Category stats
  const [categoryStats, setCategoryStats] = useState<CategoryStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORY_STATS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      healthXP: 0,
      intelligenceXP: 0,
      socialXP: 0,
      habitsXP: 0,
      gamingXP: 0,
      totalQuestsCompleted: 0
    };
  });

  // Quests
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_DAILY_QUESTS;
  });

  // Matches
  const [matches, setMatches] = useState<MatchLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'sample-match-1',
        date: new Date(Date.now() - 86400000).toISOString(),
        game: 'League of Legends',
        championOrRole: 'Ahri (Mid)',
        result: 'win',
        kda: { kills: 8, deaths: 3, assists: 11 },
        focusSkill: 'Wave Management & Roaming',
        reviewAnswers: {
          whatWentWell: 'Slow-Push genutzt um Botlane zu ganken.',
          whatToImprove: '2 Tode durch fehlende Wards im River. Mehr Control Wards kaufen!',
          deathAnalysis: 'Min 14 und 22: Überaggressiv ohne Flash overextendet.',
          skillGrade: 4
        },
        xpEarned: 30
      }
    ];
  });

  // Badges
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_BADGES;
  });

  // Sync settings theme to document
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    sounds.setMuted(!settings.soundEnabled);
  }, [settings.theme, settings.soundEnabled]);

  // Anti-spam cooldown timer
  useEffect(() => {
    if (cooldownRemainingSec <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemainingSec(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemainingSec]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEVEL, level.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_XP, currentXp.toString());
    localStorage.setItem(STORAGE_KEYS.TOTAL_XP, totalXp.toString());
    localStorage.setItem(STORAGE_KEYS.TODAY_XP, todayXp.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_XP_DATE, new Date().toISOString().split('T')[0]);
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEYS.CATEGORY_STATS, JSON.stringify(categoryStats));
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, hasCompletedOnboarding ? 'true' : 'false');
  }, [level, currentXp, totalXp, todayXp, streak, quests, matches, badges, profile, settings, categoryStats, hasCompletedOnboarding]);

  const currentRank = useMemo(() => getRankByLevel(level), [level]);
  const xpRequired = useMemo(() => getXpRequiredForLevel(level), [level]);

  // Handle Level Up detection & celebration
  const applyXpGain = (amount: number, category: QuestCategory) => {
    // Hard cap XP per activity max 35 XP to prevent spam
    const actualXp = Math.min(amount, 35);

    sounds.playXpGain();

    setTodayXp(prev => prev + actualXp);
    setTotalXp(prev => prev + actualXp);

    // Update category stats
    setCategoryStats(prev => {
      const field = `${category}XP` as keyof CategoryStats;
      return {
        ...prev,
        [field]: ((prev[field] as number) || 0) + actualXp,
        totalQuestsCompleted: prev.totalQuestsCompleted + 1
      };
    });

    // Check level up
    let newCurrentXp = currentXp + actualXp;
    let newLevel = level;
    let needed = getXpRequiredForLevel(newLevel);

    while (newCurrentXp >= needed) {
      newCurrentXp -= needed;
      newLevel += 1;
      needed = getXpRequiredForLevel(newLevel);
    }

    if (newLevel > level) {
      const newRank = getRankByLevel(newLevel);
      setLevel(newLevel);
      setCurrentXp(newCurrentXp);

      // Trigger celebration
      sounds.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#38BDF8', '#10B981', '#F59E0B']
      });

      // Check if unlocked background
      if (newRank.unlockedBgImage && !profile.unlockedBackgrounds.includes(newRank.tier)) {
        setProfile(p => ({
          ...p,
          unlockedBackgrounds: [...p.unlockedBackgrounds, newRank.tier]
        }));
      }

      setLevelUpModalData({
        newLevel,
        oldLevel: level,
        rank: newRank
      });
    } else {
      setCurrentXp(newCurrentXp);
    }

    // Check badge criteria
    checkBadgeUnlocks(newLevel, categoryStats.totalQuestsCompleted + 1, category);
  };

  const checkBadgeUnlocks = (currentLvl: number, totalDone: number, category: QuestCategory) => {
    setBadges(prevBadges =>
      prevBadges.map(b => {
        if (b.unlocked) return b;
        let shouldUnlock = false;
        let newProgress = b.progress;

        if (b.id === 'badge-first-step' && totalDone >= 1) {
          shouldUnlock = true;
          newProgress = 1;
        } else if (b.id === 'badge-bookworm' && category === 'intelligence') {
          newProgress = Math.min(b.progress + 1, b.maxProgress);
          shouldUnlock = newProgress >= b.maxProgress;
        } else if (b.id === 'badge-social-butterfly' && category === 'social') {
          newProgress = Math.min(b.progress + 1, b.maxProgress);
          shouldUnlock = newProgress >= b.maxProgress;
        } else if (b.id === 'badge-clean-space' && category === 'habits') {
          newProgress = Math.min(b.progress + 1, b.maxProgress);
          shouldUnlock = newProgress >= b.maxProgress;
        } else if (b.id === 'badge-gym-rat' && category === 'health') {
          newProgress = Math.min(b.progress + 1, b.maxProgress);
          shouldUnlock = newProgress >= b.maxProgress;
        } else if (b.id === 'badge-challenger-soul' && currentLvl >= 25) {
          shouldUnlock = true;
          newProgress = 25;
        }

        if (shouldUnlock) {
          sounds.playBadgeUnlock();
          setRecentlyUnlockedBadge({
            ...b,
            unlocked: true,
            unlockedAt: new Date().toLocaleDateString('de-DE'),
            progress: newProgress
          });
          return {
            ...b,
            unlocked: true,
            unlockedAt: new Date().toLocaleDateString('de-DE'),
            progress: newProgress
          };
        }

        return { ...b, progress: newProgress };
      })
    );
  };

  // Complete Quest with Anti-Spam Cooldown & Max 35 XP Cap
  const completeQuest = (questId: string): { success: boolean; message?: string; xpEarned?: number } => {
    if (cooldownRemainingSec > 0) {
      return {
        success: false,
        message: `Anti-Spam Schutz aktiv! Bitte warte noch ${cooldownRemainingSec}s bevor du die nächste Quest abschließt.`
      };
    }

    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.isCompletedToday) {
      return { success: false, message: 'Quest bereits abgeschlossen oder nicht gefunden.' };
    }

    // Activate cooldown
    setCooldownRemainingSec(COOLDOWN_SECONDS);

    // Mark completed
    setQuests(prev =>
      prev.map(q =>
        q.id === questId
          ? { ...q, isCompletedToday: true, completedAt: new Date().toISOString() }
          : q
      )
    );

    // Apply capped XP (max 35 XP as requested)
    const earned = Math.min(quest.xpReward, 35);
    applyXpGain(earned, quest.category);

    return {
      success: true,
      xpEarned: earned
    };
  };

  // Revert / Undo completed quest if clicked by accident
  const uncompleteQuest = (questId: string): { success: boolean; message?: string } => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.isCompletedToday) {
      return { success: false, message: 'Quest ist nicht als erledigt markiert.' };
    }

    const xpToDeduct = Math.min(quest.xpReward, 35);

    // Update quest status
    setQuests(prev =>
      prev.map(q =>
        q.id === questId
          ? { ...q, isCompletedToday: false, completedAt: undefined }
          : q
      )
    );

    // Deduct today XP and total XP
    setTodayXp(prev => Math.max(0, prev - xpToDeduct));
    setTotalXp(prev => Math.max(0, prev - xpToDeduct));

    // Deduct category XP
    setCategoryStats(prev => {
      const field = `${quest.category}XP` as keyof CategoryStats;
      return {
        ...prev,
        [field]: Math.max(0, ((prev[field] as number) || 0) - xpToDeduct),
        totalQuestsCompleted: Math.max(0, prev.totalQuestsCompleted - 1)
      };
    });

    // Adjust current XP (and level if needed, minimum level 0)
    let newCurrentXp = currentXp - xpToDeduct;
    let newLevel = level;

    while (newCurrentXp < 0 && newLevel > 0) {
      newLevel -= 1;
      newCurrentXp += getXpRequiredForLevel(newLevel);
    }

    setLevel(Math.max(0, newLevel));
    setCurrentXp(Math.max(0, newCurrentXp));

    return { success: true };
  };

  // Postpone daily quest to tomorrow
  const postponeQuestToTomorrow = (questId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setQuests(prev =>
      prev.map(q =>
        q.id === questId
          ? { ...q, postponedUntil: tomorrowStr }
          : q
      )
    );
  };

  const deleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  };

  const addCustomQuest = (newQuestData: Omit<Quest, 'id' | 'isCompletedToday'>) => {
    const newQuest: Quest = {
      ...newQuestData,
      id: `custom-${Date.now()}`,
      // Enforce max 35 XP for custom quests too
      xpReward: Math.min(newQuestData.xpReward, 35),
      isCompletedToday: false,
      custom: true
    };
    setQuests(prev => [newQuest, ...prev]);
  };

  // Log Match Review with gamer tag
  const logMatchReview = (matchData: Omit<MatchLog, 'id' | 'date'>) => {
    if (cooldownRemainingSec > 0) {
      return;
    }
    setCooldownRemainingSec(COOLDOWN_SECONDS);

    const earned = Math.min(matchData.xpEarned || 30, 35);
    const newMatch: MatchLog = {
      ...matchData,
      id: `match-${Date.now()}`,
      date: new Date().toISOString(),
      xpEarned: earned
    };

    setMatches(prev => [newMatch, ...prev]);
    applyXpGain(earned, 'gaming');

    // Also update esports analyst badge
    setBadges(prev =>
      prev.map(b => {
        if (b.id === 'badge-lol-pro') {
          const prog = Math.min(b.progress + 1, b.maxProgress);
          const unlocked = prog >= b.maxProgress;
          if (unlocked && !b.unlocked) {
            sounds.playBadgeUnlock();
            setRecentlyUnlockedBadge({ ...b, unlocked: true, progress: prog });
          }
          return { ...b, progress: prog, unlocked: b.unlocked || unlocked };
        }
        return b;
      })
    );
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...partial }));
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const currentAffirmation = DAILY_AFFIRMATIONS[affirmationIdx % DAILY_AFFIRMATIONS.length];

  const nextAffirmation = () => {
    setAffirmationIdx(prev => (prev + 1) % DAILY_AFFIRMATIONS.length);
  };

  const resetProgress = () => {
    setLevel(0);
    setCurrentXp(0);
    setTotalXp(0);
    setTodayXp(0);
    setStreak(1);
    setQuests(INITIAL_DAILY_QUESTS);
    setBadges(INITIAL_BADGES);
    setCategoryStats({
      healthXP: 0,
      intelligenceXP: 0,
      socialXP: 0,
      habitsXP: 0,
      gamingXP: 0,
      totalQuestsCompleted: 0
    });
  };

  const seedSampleXP = () => {
    applyXpGain(35, 'gaming');
  };

  return (
    <GamificationContext.Provider
      value={{
        level,
        currentXp,
        xpRequired,
        totalXp,
        todayXp,
        streak,
        currentRank,
        quests,
        completeQuest,
        uncompleteQuest,
        postponeQuestToTomorrow,
        deleteQuest,
        addCustomQuest,
        cooldownRemainingSec,
        isSpamCooldownActive: cooldownRemainingSec > 0,
        matches,
        logMatchReview,
        badges,
        recentlyUnlockedBadge,
        clearRecentBadge: () => setRecentlyUnlockedBadge(null),
        profile,
        updateProfile,
        settings,
        updateSettings,
        categoryStats,
        levelUpModalData,
        closeLevelUpModal: () => setLevelUpModalData(null),
        currentAffirmation,
        nextAffirmation,
        resetProgress,
        seedSampleXP,
        hasCompletedOnboarding,
        setHasCompletedOnboarding
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
