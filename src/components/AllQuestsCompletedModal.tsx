import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { 
  Trophy, 
  Sparkles, 
  X, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight,
  Zap,
  Star
} from 'lucide-react';
import { Button } from './ui/button';

export const AllQuestsCompletedModal: React.FC = () => {
  const { 
    showAllQuestsCompletedModal, 
    closeAllQuestsCompletedModal, 
    todayXp, 
    streak,
    level,
    currentRank
  } = useGamification();

  if (!showAllQuestsCompletedModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-3xl bg-card border-2 border-purple-500/50 p-6 text-center shadow-2xl glow-purple-lg overflow-hidden">
        {/* Ambient neon radial glows */}
        <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 rounded-full bg-emerald-500/25 blur-3xl pointer-events-none" />

        <button 
          onClick={closeAllQuestsCompletedModal}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Celebratory Star Badge */}
        <div className="mx-auto w-24 h-24 mb-4 rounded-3xl flex items-center justify-center relative bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 text-white shadow-2xl glow-purple animate-bounce">
          <Trophy className="w-12 h-12 text-amber-200" />
          <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-amber-400 text-black shadow-md">
            <Star className="w-4 h-4 fill-black" />
          </div>
        </div>

        {/* Motivational Header */}
        <div className="space-y-1.5 mb-5">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            TAGESZIEL ERREICHT! 🌟
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight pt-1">
            DU BIST SCHON BESSER ALS GESTERN!
          </h2>
          <p className="text-xs text-muted-foreground font-medium pt-1">
            Alle heutigen Quests wurden erfolgreich abgeschlossen.
          </p>
        </div>

        {/* Stats card */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 mb-5 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-semibold">Tages-Ertrag:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              +{todayXp} XP gesammelt
            </span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-border/40 pt-2">
            <span className="text-muted-foreground font-semibold">Aktive Serie:</span>
            <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{streak} Tage Streak</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-border/40 pt-2">
            <span className="text-muted-foreground font-semibold">Aktueller Rang:</span>
            <span className="font-bold text-purple-400 font-mono">
              {currentRank.tier} (Lvl {level})
            </span>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6">
          <p className="text-xs font-bold text-purple-400 italic">
            "don´t give up, rise higher"
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Konsistenz schlägt Intensität. Jeder einzelne Tag bringt dich weiter an die Spitze.
          </p>
        </div>

        <Button 
          onClick={closeAllQuestsCompletedModal}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/30"
        >
          <span>Weiter so! 💪</span>
          <ArrowUpRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
