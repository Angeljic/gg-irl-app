import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { Trophy, Sparkles, X, ArrowUpRight, Award } from 'lucide-react';
import { Button } from './ui/button';

export const LevelUpModal: React.FC = () => {
  const { levelUpModalData, closeLevelUpModal, currentRank } = useGamification();

  if (!levelUpModalData) return null;

  const { newLevel, oldLevel, rank } = levelUpModalData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-3xl bg-card border-2 border-purple-500/50 p-6 text-center shadow-2xl glow-purple-lg overflow-hidden">
        {/* Ambient background glow */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: rank.color }}
        />
        <div 
          className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: rank.color }}
        />

        <button 
          onClick={closeLevelUpModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Level Up Crest */}
        <div className="mx-auto w-24 h-24 mb-4 rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white shadow-xl glow-purple animate-bounce">
          <Trophy className="w-12 h-12 text-amber-300" />
          <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-xs">
            +1
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
            LEVEL UP!
          </span>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            LEVEL {newLevel}
          </h2>
          <p className="text-sm font-semibold text-muted-foreground">
            Aufstieg von Level {oldLevel}
          </p>
        </div>

        {/* Rank Tier Card */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border mb-4 text-left space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Aktueller Rang</span>
            <span className="text-xs font-black px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">
              {rank.tier} Tier
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: rank.color }} />
            <span className="text-base font-bold text-foreground">{rank.title}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {rank.description}
          </p>
        </div>

        {/* Motivational Motto */}
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-5">
          <p className="text-xs font-bold text-purple-600 dark:text-purple-300 italic">
            "don´t give up, rise higher"
          </p>
          <p className="text-[11px] text-muted-foreground">
            Jede Disziplin im Alltag bringt dich deinem wahren Potenzial näher.
          </p>
        </div>

        <Button 
          onClick={closeLevelUpModal}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/30"
        >
          <span>Weiter aufsteigen</span>
          <ArrowUpRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
