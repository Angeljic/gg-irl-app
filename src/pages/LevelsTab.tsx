import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { RANKS, getRankByLevel, getXpRequiredForLevel } from '../constants/gamificationData';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Lock, 
  Check, 
  ChevronRight, 
  ArrowUpCircle,
  Shield,
  Layers,
  Flame,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/button';

export const LevelsTab: React.FC = () => {
  const { 
    level, 
    currentXp, 
    xpRequired, 
    totalXp, 
    currentRank, 
    streak, 
    profile, 
    updateProfile 
  } = useGamification();

  const progressPercent = Math.min(Math.round((currentXp / xpRequired) * 100), 100);

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      {/* Levels Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/80 via-card to-background border-2 border-purple-500/40 p-6 shadow-xl glow-purple text-center">
        {/* Rank Crest Emblems */}
        <div className="mx-auto w-20 h-20 mb-3 rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-900 text-white shadow-xl glow-purple">
          <Crown className="w-10 h-10 text-amber-300" />
          <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-black text-xs font-mono">
            LVL {level}
          </span>
        </div>

        <div className="space-y-1 mb-4">
          <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {currentRank.tier} TIER
          </span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            {currentRank.title}
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {currentRank.description}
          </p>
        </div>

        {/* Detailed XP Progress Numbers */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border mb-4 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-semibold">Fortschritt zum nächsten Level</span>
            <span className="font-mono text-purple-400 font-bold">
              {currentXp} / {xpRequired} XP ({progressPercent}%)
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-muted overflow-hidden border border-purple-500/20">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
            <div>
              <span className="text-muted-foreground">Gesamt verdiente XP:</span>
              <div className="font-mono font-bold text-foreground">{totalXp.toLocaleString()} XP</div>
            </div>
            <div>
              <span className="text-muted-foreground">Aktuelle Streak:</span>
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{streak} Tage aktiv</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs italic font-bold text-purple-400">
          "don´t give up, rise higher"
        </p>
      </div>

      {/* LoL Rank Ladder Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black tracking-tight text-foreground flex items-center gap-1.5 uppercase">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>League of Legends Ränge (Eisen bis Herausforderer)</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {RANKS.map((rk, idx) => {
            const isCurrentRank = currentRank.tier === rk.tier;
            const isUnlocked = level >= rk.minLevel;
            const isSelectedBg = profile.activeBackground === rk.tier;

            return (
              <div
                key={rk.tier}
                className={`rounded-2xl border transition-all p-3.5 ${
                  isCurrentRank
                    ? 'bg-purple-950/30 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                    : isUnlocked
                    ? 'bg-card border-border hover:border-purple-500/30'
                    : 'bg-muted/20 border-border/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ 
                        backgroundColor: `${rk.color}15`,
                        borderColor: `${rk.color}40`,
                        color: rk.color
                      }}
                    >
                      {rk.tier === 'Herausforderer' ? (
                        <Crown className="w-5 h-5 animate-pulse" />
                      ) : (
                        <Shield className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-foreground">
                          {rk.tier}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted font-bold text-muted-foreground">
                          Lvl {rk.minLevel} - {rk.maxLevel === 999 ? '∞' : rk.maxLevel}
                        </span>
                        {isCurrentRank && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-500 text-white font-mono">
                            DEIN RANG
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {rk.title} • {rk.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {isUnlocked ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                          <Check className="w-3.5 h-3.5" />
                          <span>Freigeschaltet</span>
                        </span>
                        {rk.unlockedBgImage && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProfile({ activeBackground: rk.tier })}
                            className={`text-[10px] h-6 px-2 rounded-lg border-purple-500/40 ${
                              isSelectedBg ? 'bg-purple-600 text-white' : 'text-purple-400'
                            }`}
                          >
                            {isSelectedBg ? 'Aktiviert ✓' : 'Design wählen'}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-mono font-bold text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Ab Lvl {rk.minLevel}</span>
                      </span>
                    )}
                  </div>
                </div>

                {rk.unlockedBgImage && (
                  <div className="mt-2.5 pt-2 border-t border-border/40 text-[11px] text-purple-400 flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Belohnung: Exklusives {rk.tier}-Hintergrunddesign & Badge-Rahmen</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
