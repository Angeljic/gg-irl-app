import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Trophy, Zap, Star, ArrowUpRight } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { levelUpData, closeLevelUpModal } = useGamification();

  if (!levelUpData) return null;

  return (
    <Dialog open={!!levelUpData} onOpenChange={(open) => !open && closeLevelUpModal()}>
      <DialogContent className="max-w-xs sm:max-w-sm p-6 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 text-white border-2 border-purple-500/50 shadow-2xl rounded-3xl text-center overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Top LVL UP Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-black text-xs tracking-widest uppercase shadow-lg shadow-yellow-500/30 mb-4 animate-bounce">
            <Zap className="w-3.5 h-3.5 fill-current" />
            LVL UP!
          </div>

          {/* Level Number Orb */}
          <div className="relative my-2">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-violet-500 to-cyan-400 p-1 shadow-xl shadow-purple-500/40 animate-pulse">
              <div className="w-full h-full bg-slate-950/90 rounded-[22px] flex flex-col items-center justify-center">
                <span className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-cyan-200">
                  {levelUpData.newLevel}
                </span>
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">LEVEL</span>
              </div>
            </div>
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 absolute -top-2 -right-2 animate-spin-slow" />
          </div>

          <h2 className="text-xl font-extrabold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300">
            HERZLICHEN GLÜCKWUNSCH!
          </h2>

          <p className="text-xs text-purple-200/80 mt-1 max-w-[240px]">
            Du bist auf <span className="text-yellow-400 font-bold">Level {levelUpData.newLevel}</span> aufgestiegen! Dein Einsatz zahlt sich aus.
          </p>

          {/* Rank Tier Card */}
          <div className="w-full mt-4 p-3 rounded-2xl bg-purple-950/60 border border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Aktueller Rang:</span>
              <span className="font-extrabold text-cyan-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {levelUpData.rank.tier} ({levelUpData.rank.title})
              </span>
            </div>
            {levelUpData.isNewRank && (
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                ✨ NEUER RANG FREIGESCHALTET! ✨
              </p>
            )}
          </div>

          <div className="mt-6 w-full flex flex-col gap-2">
            <Button
              onClick={closeLevelUpModal}
              className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl py-5 shadow-lg shadow-purple-600/40 text-sm flex items-center justify-center gap-2"
            >
              <span>WEITER AUFSTEIGEN</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
            <p className="text-[10px] text-muted-foreground italic">
              &quot;don&apos;t give up, rise higher&quot;
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
