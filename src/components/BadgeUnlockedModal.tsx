import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { Award, Sparkles, X, Check } from 'lucide-react';
import { Button } from './ui/button';

export const BadgeUnlockedModal: React.FC = () => {
  const { recentlyUnlockedBadge, clearRecentBadge } = useGamification();

  if (!recentlyUnlockedBadge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xs rounded-3xl bg-card border-2 border-amber-500/50 p-6 text-center shadow-2xl glow-gold">
        <button 
          onClick={clearRecentBadge}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-20 h-20 mb-3 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/40 animate-pulse">
          <Award className="w-10 h-10" />
        </div>

        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-500 border border-amber-500/30 mb-2">
          Abzeichen Freigeschaltet!
        </span>

        <h3 className="text-xl font-black text-foreground mb-1">
          {recentlyUnlockedBadge.title}
        </h3>

        <p className="text-xs text-muted-foreground mb-4">
          {recentlyUnlockedBadge.description}
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-500 font-bold mb-5 bg-amber-500/10 py-1.5 px-3 rounded-xl border border-amber-500/20">
          <Check className="w-4 h-4" />
          <span>Bedingung: {recentlyUnlockedBadge.requirement}</span>
        </div>

        <Button
          onClick={clearRecentBadge}
          className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold"
        >
          Ausgezeichnet!
        </Button>
      </div>
    </div>
  );
};
