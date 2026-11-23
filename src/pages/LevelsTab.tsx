import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { RANKS } from '../constants/gamificationData';
import { 
  Crown, 
  Sparkles, 
  Lock, 
  Check, 
  Shield, 
  Layers, 
  Flame 
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
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Levels Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/70 via-card to-background border border-purple-500/25 p-6 shadow-xl glow-purple text-center">
        {/* Rank Crest Emblems */}
        <div className="mx-auto w-24 h-24 mb-4 rounded-3xl flex items-center justify-center relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-900 text-white shadow-xl glow-purple">
          <Crown className="w-12 h-12 text-amber-300" />
          <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-amber-400 text-black font-black text-xs font-mono shadow-md">
            LVL {level}
          </span>
        </div>

        <div className="space-y-1.5 mb-5">
          <span className="text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25 inline-block">
            {currentRank.tier} TIER
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {currentRank.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed pt-1">
            {currentRank.description}
          </p>
        </div>

        {/* Detailed XP Progress Numbers */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 mb-5 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-semibold">Fortschritt zum nächsten Level</span>
            <span className="font-mono text-purple-400 font-bold text-sm">
              {currentXp} / {xpRequired} XP ({progressPercent}%)
            </span>
          </div>

          <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden border border-purple-500/20">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50 text-xs">
            <div>
              <span className="text-muted-foreground text-[11px]">Gesamt verdiente XP:</span>
              <div className="font-mono font-bold text-foreground text-sm">{totalXp.toLocaleString()} XP</div>
            </div>
            <div>
              <span className="text-muted-foreground text-[11px]">Aktuelle Serie:</span>
              <div className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
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
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black tracking-tight text-foreground flex items-center gap-2 uppercase">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Ränge (Eisen bis Herausforderer)</span>
          </h3>
        </div>

        <div className="space-y-3">
          {RANKS.map(rk => {
            const isCurrentRank = currentRank.tier === rk.tier;
            const isUnlocked = level >= rk.minLevel;
            const isSelectedBg = profile.activeBackground === rk.tier;

            return (
              <div
                key={rk.tier}
                className={`rounded-2xl border transition-all p-4 ${
                  isCurrentRank
                    ? 'bg-purple-950/30 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                    : isUnlocked
                    ? 'bg-card border-border hover:border-purple-500/30'
                    : 'bg-muted/20 border-border/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{ 
                        backgroundColor: `${rk.color}15`,
                        borderColor: `${rk.color}40`,
                        color: rk.color
                      }}
                    >
                      {rk.tier === 'Herausforderer' ? (
                        <Crown className="w-6 h-6 animate-pulse" />
                      ) : (
                        <Shield className="w-6 h-6" />
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
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {rk.title} • {rk.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {isUnlocked ? (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                          <Check className="w-3.5 h-3.5" />
                          <span>Freigeschaltet</span>
                        </span>
                        {rk.unlockedBgImage && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProfile({ activeBackground: rk.tier })}
                            className={`text-[10px] h-6 px-2.5 rounded-lg border-purple-500/40 ${
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
                  <div className="mt-3 pt-2.5 border-t border-border/40 text-xs text-purple-400 flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Belohnung: Exklusives {rk.tier}-Hintergrunddesign freigeschaltet!</span>
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
