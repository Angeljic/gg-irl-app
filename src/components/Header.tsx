import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { Sparkles, Flame, Volume2, VolumeX, Moon, Sun, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';

export const Header: React.FC = () => {
  const { 
    level, 
    streak, 
    currentRank, 
    settings, 
    updateSettings, 
    currentAffirmation, 
    nextAffirmation,
    isCooldownActive,
    cooldownRemaining 
  } = useGamification();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-500/20 backdrop-blur-md transition-all duration-300">
      {/* Top Banner: Motivational Affirmation */}
      <div 
        onClick={nextAffirmation}
        className="cursor-pointer bg-gradient-to-r from-purple-900/90 via-violet-900/90 to-purple-950/90 text-purple-100 text-xs py-1.5 px-3 text-center flex items-center justify-center gap-1.5 font-medium tracking-wide hover:brightness-110 transition-all border-b border-purple-500/30 select-none shadow-sm"
        title="Klicken für nächste Affirmation"
      >
        <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow shrink-0" />
        <span className="truncate">{currentAffirmation}</span>
        <span className="text-[10px] bg-purple-500/30 px-1.5 py-0.5 rounded text-purple-200 border border-purple-400/20 shrink-0 ml-1">
          Tippen ↻
        </span>
      </div>

      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* App Title & Level Info */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-purple-400/30">
              <span className="text-white font-black tracking-tighter text-sm">RISE</span>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.2 rounded-full shadow border border-emerald-300/50">
              LVL {level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 dark:from-purple-400 dark:via-violet-300 dark:to-cyan-400 bg-clip-text text-transparent">
                RISE
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                {currentRank.tier}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium italic truncate max-w-[170px]">
              &quot;don&apos;t give up, rise higher&quot;
            </p>
          </div>
        </div>

        {/* Right side Actions: Streak & Controls */}
        <div className="flex items-center gap-1.5">
          {/* Streak indicator */}
          <div 
            className="flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm"
            title={`Deine aktuelle Serie: ${streak} Tage`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streak}d</span>
          </div>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
            title={settings.soundEnabled ? 'Sound stummschalten' : 'Sound aktivieren'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-500" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </Button>

          {/* Dark / Light Mode */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
            title={settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </Button>
        </div>
      </div>

      {/* Anti-spam cooldown banner if triggered */}
      {isCooldownActive && (
        <div className="bg-amber-500/20 text-amber-400 text-[11px] font-semibold py-1 px-4 text-center border-t border-amber-500/30 flex items-center justify-center gap-1.5 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Anti-Spam aktiv: Warte {cooldownRemaining}s vor dem nächsten Quest-Abschluss.</span>
        </div>
      )}
    </header>
  );
};
