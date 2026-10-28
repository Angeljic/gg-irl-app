import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Gamepad2, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Droplets,
  Activity,
  BookOpen,
  Heart,
  Award,
  Undo2,
  CalendarDays
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { GamerTagMatchModal } from '../components/GamerTagMatchModal';
import { CustomQuestModal } from '../components/CustomQuestModal';

interface HomeTabProps {
  onNavigateTab: (tab: 'home' | 'quests' | 'levels' | 'profile') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateTab }) => {
  const {
    level,
    currentXp,
    xpRequired,
    todayXp,
    streak,
    currentRank,
    quests,
    completeQuest,
    uncompleteQuest,
    postponeQuestToTomorrow,
    badges,
    profile,
    matches,
    isSpamCooldownActive
  } = useGamification();

  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);

  const xpProgressPercent = Math.min(Math.round((currentXp / xpRequired) * 100), 100);

  // Today's active daily quests (not completed yet, not postponed)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const activeDailyQuests = quests.filter(q => 
    q.isDaily && 
    !q.isCompletedToday && 
    (!q.postponedUntil || q.postponedUntil <= todayDateStr)
  );

  const completedTodayQuests = quests.filter(q => q.isCompletedToday);
  const completedTodayCount = completedTodayQuests.length;
  const recentBadges = badges.filter(b => b.unlocked).slice(0, 3);

  const renderQuestIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Hero Level & XP Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/60 via-card to-background border border-purple-500/25 p-6 shadow-xl glow-purple">
        {/* Ambient glow in background */}
        <div 
          className="absolute -right-20 -top-20 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentRank.color }}
        />

        {/* Top Header Row with Level & Today's XP badge */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-widest uppercase px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/25">
                OVERALL LEVEL
              </span>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                {currentRank.tier} Rang
              </span>
            </div>
            
            <div className="flex items-baseline gap-3 pt-1">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground font-mono">
                LEVEL {level}
              </h2>
              <span className="text-sm font-bold text-purple-400">
                {currentRank.title}
              </span>
            </div>
          </div>

          <div className="shrink-0 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-black shadow-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+{todayXp} XP HEUTE</span>
            </span>
          </div>
        </div>

        {/* Progress Bar & Numerical Breakdown */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Fortschritt zum nächsten Level</span>
            <span className="font-mono text-purple-400 font-bold text-sm">
              {currentXp.toLocaleString()} / {xpRequired.toLocaleString()} XP ({xpProgressPercent}%)
            </span>
          </div>

          <div className="h-4 w-full rounded-full bg-muted/80 p-0.5 overflow-hidden border border-purple-500/20">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 transition-all duration-500 ease-out shadow-sm shadow-purple-500/40"
              style={{ width: `${Math.max(xpProgressPercent, 3)}%` }}
            />
          </div>
        </div>

        {/* Action Strip: Quick LoL Match Review & Rank Progression */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-500/15">
          <button
            onClick={() => setIsMatchModalOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors py-1"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>LoL Match Review (+35 XP)</span>
          </button>

          <button
            onClick={() => onNavigateTab('levels')}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <span>Rangbaum ansehen</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LoL / GamerTag Quick Match Feature Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-card to-indigo-950/30 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-foreground font-mono">
                {profile.gamertag || 'GamerTag verknüpfen'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/25">
                LoL Tracker
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {matches.length > 0 
                ? `Zuletzt: ${matches[0].championOrRole} (${matches[0].focusSkill})`
                : 'Trage Matches ein: Deaths, Wave Management & Trading analysieren'}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsMatchModalOpen(true)}
          className="rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 shadow-md shadow-purple-600/25 self-start sm:self-auto shrink-0"
        >
          Match Review
        </Button>
      </div>

      {/* Daily Quests Section with clean spacious cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black tracking-tight text-foreground">
              TÄGLICHE QUESTS
            </h3>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              ({activeDailyQuests.length} offen)
            </span>
          </div>

          <button
            onClick={() => setIsQuestModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-400 transition-colors py-1 px-2 rounded-xl hover:bg-purple-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Quest erstellen</span>
          </button>
        </div>

        {activeDailyQuests.length === 0 ? (
          <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-foreground">Alle Tagesquests gemeistert!</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Klasse Arbeit! Du hast alle Tagesaufgaben abgeschlossen. Erstelle eine persönliche Quest oder mache ein Match-Review.
            </p>
            <div className="pt-2 flex justify-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => setIsQuestModalOpen(true)}
                className="rounded-2xl text-xs font-semibold px-4"
              >
                + Neue Quest
              </Button>
              <Button
                onClick={() => setIsMatchModalOpen(true)}
                className="rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 shadow-md shadow-purple-600/25"
              >
                LoL Match Review
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDailyQuests.slice(0, 4).map(quest => (
              <div
                key={quest.id}
                className="rounded-2xl bg-card border border-border/80 hover:border-purple-500/40 p-4 transition-all shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="w-11 h-11 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0 border border-border/60">
                    {renderQuestIcon(quest.iconName)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-foreground truncate">
                        {quest.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-bold shrink-0">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => postponeQuestToTomorrow(quest.id)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-medium transition-colors"
                    title="Auf morgen verschieben"
                  >
                    Morgen
                  </button>
                  <Button
                    size="sm"
                    disabled={isSpamCooldownActive}
                    onClick={() => completeQuest(quest.id)}
                    className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 shadow-sm shadow-purple-600/25"
                  >
                    Fertig ✓
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Heute bereits erledigte Quests mit Rückgängig-Option */}
        {completedTodayCount > 0 && (
          <div className="p-4 rounded-3xl bg-muted/20 border border-emerald-500/20 space-y-3 mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Heute abgeschlossen ({completedTodayCount})</span>
              </span>
              <span className="text-[11px] text-muted-foreground">Aus Versehen geklickt?</span>
            </div>

            <div className="space-y-2">
              {completedTodayQuests.slice(0, 3).map(cq => (
                <div 
                  key={cq.id} 
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-card border border-border text-xs gap-2"
                >
                  <span className="text-muted-foreground truncate line-through">
                    {cq.title}
                  </span>
                  <button
                    onClick={() => uncompleteQuest(cq.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 shrink-0 px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-colors"
                    title="Als nicht erledigt zurücksetzen"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Rückgängig</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDailyQuests.length > 4 && (
          <Button
            variant="ghost"
            onClick={() => onNavigateTab('quests')}
            className="w-full text-xs font-bold text-purple-400 hover:text-purple-300 py-3"
          >
            Alle {activeDailyQuests.length} Quests ansehen →
          </Button>
        )}
      </div>

      {/* Recently Earned Badges Strip */}
      <div className="p-5 rounded-3xl bg-card border border-border space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-foreground">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Kürzlich verdiente Abzeichen</span>
          </div>
          <button
            onClick={() => onNavigateTab('profile')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300"
          >
            Alle Abzeichen ({badges.length})
          </button>
        </div>

        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5">
            {recentBadges.map(badge => (
              <div 
                key={badge.id}
                className="p-3 rounded-2xl bg-muted/30 border border-amber-500/30 text-center flex flex-col items-center"
              >
                <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1.5">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground truncate w-full">
                  {badge.title}
                </span>
                <span className="text-[10px] text-amber-500 font-mono uppercase mt-0.5">
                  {badge.rarity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic text-center py-2">
            Schließe deine erste Quest ab, um dein erstes Abzeichen freizuschalten!
          </p>
        )}
      </div>

      {/* Motto & Clean Footer Space */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground font-semibold tracking-wider">
          don´t give up, rise higher
        </p>
      </div>

      {/* Modals */}
      <GamerTagMatchModal 
        isOpen={isMatchModalOpen} 
        onClose={() => setIsMatchModalOpen(false)} 
      />
      <CustomQuestModal 
        isOpen={isQuestModalOpen} 
        onClose={() => setIsQuestModalOpen(false)} 
      />
    </div>
  );
};
