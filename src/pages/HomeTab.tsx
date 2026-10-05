import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { CATEGORY_INFO } from '../constants/gamificationData';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Gamepad2, 
  Plus, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Droplets,
  Activity,
  BookOpen,
  Heart,
  Skull,
  Award,
  Undo2
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
    isSpamCooldownActive,
    cooldownRemainingSec
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

  const completedTodayCount = quests.filter(q => q.isCompletedToday).length;
  const recentBadges = badges.filter(b => b.unlocked).slice(0, 3);

  // Helper icon for quests
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
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      {/* Hero Level & XP Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/70 via-card to-background border-2 border-purple-500/30 p-5 shadow-xl glow-purple">
        {/* Ambient background decoration */}
        <div 
          className="absolute -right-16 -top-16 w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: currentRank.color }}
        />

        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                OVERALL LEVEL
              </span>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                {currentRank.tier} Rang
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-4xl font-black tracking-tight text-foreground font-mono">
                LEVEL {level}
              </h2>
              <span className="text-xs font-bold text-purple-400">
                {currentRank.title}
              </span>
            </div>
          </div>

          {/* Today's XP badge */}
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{todayXp} XP HEUTE</span>
            </span>
          </div>
        </div>

        {/* Circular / Horizontal XP Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Fortschritt zum nächsten Level</span>
            <span className="font-mono text-purple-400 font-bold">
              {currentXp.toLocaleString()} / {xpRequired.toLocaleString()} XP ({xpProgressPercent}%)
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="h-3.5 w-full rounded-full bg-muted/70 p-0.5 overflow-hidden border border-purple-500/20">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 transition-all duration-500 ease-out shadow-sm shadow-purple-500/50"
              style={{ width: `${Math.max(xpProgressPercent, 3)}%` }}
            />
          </div>
        </div>

        {/* Action strip: Gamer Tag & Continue Progress */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-purple-500/20">
          <button
            onClick={() => setIsMatchModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>LoL Match Review (+35 XP)</span>
          </button>

          <button
            onClick={() => onNavigateTab('levels')}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Rangbaum ansehen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LoL / GamerTag Quick Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-950/40 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-foreground font-mono">
                {profile.gamertag || 'GamerTag hinzufügen'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                LoL Tracker
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {matches.length > 0 
                ? `Zuletzt: ${matches[0].championOrRole} (${matches[0].focusSkill})`
                : 'Trage Matches ein: Deaths & Wave Management analysieren'}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setIsMatchModalOpen(true)}
          className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
        >
          Review
        </Button>
      </div>

      {/* Daily Quests Header & List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black tracking-tight text-foreground flex items-center gap-1.5">
              <span>TÄGLICHE QUESTS</span>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                ({activeDailyQuests.length} offen)
              </span>
            </h3>
          </div>
          <button
            onClick={() => setIsQuestModalOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300"
          >
            <Plus className="w-4 h-4" />
            <span>Quest erstellen</span>
          </button>
        </div>

        {activeDailyQuests.length === 0 ? (
          <div className="p-6 rounded-3xl bg-card border border-border text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Alle Tagesquests gemeistert!</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Starke Leistung! Erstelle eine eigene Quest oder trage ein Game Review ein, um weiter XP zu sammeln.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsQuestModalOpen(true)}
                className="rounded-xl text-xs"
              >
                + Neue Quest
              </Button>
              <Button
                size="sm"
                onClick={() => setIsMatchModalOpen(true)}
                className="rounded-xl bg-purple-600 text-white text-xs"
              >
                LoL Match Review
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeDailyQuests.slice(0, 4).map(quest => (
              <div
                key={quest.id}
                className="group relative rounded-2xl bg-card border border-border hover:border-purple-500/50 p-3.5 transition-all shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 border border-border">
                    {renderQuestIcon(quest.iconName)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-foreground truncate">
                        {quest.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-400 font-bold shrink-0">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {quest.description}
                    </p>
                  </div>
                </div>

                {/* Actions: Postpone or Complete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => postponeQuestToTomorrow(quest.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-[11px] font-medium"
                    title="Auf morgen verschieben"
                  >
                    Morgen
                  </button>
                  <Button
                    size="sm"
                    disabled={isSpamCooldownActive}
                    onClick={() => completeQuest(quest.id)}
                    className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 shadow-sm shadow-purple-600/30"
                  >
                    Fertig ✓
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeDailyQuests.length > 4 && (
          <Button
            variant="ghost"
            onClick={() => onNavigateTab('quests')}
            className="w-full text-xs font-bold text-purple-400 hover:text-purple-300"
          >
            Alle {activeDailyQuests.length} Quests ansehen →
          </Button>
        )}

        {/* Heute bereits erledigte Quests mit Rückgängig-Option */}
        {completedTodayCount > 0 && (
          <div className="p-3 rounded-2xl bg-muted/20 border border-emerald-500/20 space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Heute abgeschlossen ({completedTodayCount})</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Aus Versehen geklickt?</span>
            </div>
            <div className="space-y-1.5">
              {quests.filter(q => q.isCompletedToday).slice(0, 3).map(cq => (
                <div
                  key={cq.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-card/60 border border-border text-xs"
                >
                  <span className="text-muted-foreground truncate line-through pr-2">
                    {cq.title}
                  </span>
                  <button
                    onClick={() => uncompleteQuest(cq.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 shrink-0 px-2 py-0.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20"
                    title="Als nicht erledigt zurücksetzen"
                  >
                    <Undo2 className="w-3 h-3" />
                    <span>Rückgängig</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recently Earned Badges Strip */}
      <div className="p-4 rounded-3xl bg-muted/30 border border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-foreground">
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
          <div className="grid grid-cols-3 gap-2">
            {recentBadges.map(badge => (
              <div 
                key={badge.id}
                className="p-2.5 rounded-2xl bg-card border border-amber-500/30 text-center flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-foreground truncate w-full">
                  {badge.title}
                </span>
                <span className="text-[9px] text-amber-500 font-mono uppercase">
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

      {/* Motivational Bottom Anchor */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground font-semibold">
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
