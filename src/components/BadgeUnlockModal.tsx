import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Award, Sparkles, Check } from 'lucide-react';

export const BadgeUnlockModal: React.FC = () => {
  const { recentlyUnlockedBadge, clearRecentBadge } = useGamification();

  if (!recentlyUnlockedBadge) return null;

  return (
    <Dialog open={!!recentlyUnlockedBadge} onOpenChange={(open) => !open && clearRecentBadge()}>
      <DialogContent className="max-w-xs sm:max-w-sm p-6 bg-slate-950 text-white border-2 border-amber-500/40 shadow-2xl rounded-3xl text-center overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Abzeichen Freigeschaltet!
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-purple-600 p-1 shadow-lg shadow-amber-500/30 my-2 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Award className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-amber-100 mt-2">
            {recentlyUnlockedBadge.title}
          </h3>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-1">
            {recentlyUnlockedBadge.rarity}
          </span>

          <p className="text-xs text-slate-300 mt-2">
            {recentlyUnlockedBadge.description}
          </p>

          <Button
            onClick={clearRecentBadge}
            className="w-full mt-5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold rounded-2xl py-4 shadow-md text-xs flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            GROSSARTIG!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
