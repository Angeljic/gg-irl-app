import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  ShieldAlert, 
  Flame, 
  ArrowUpCircle,
  RefreshCw
} from 'lucide-react';

export const HeaderBanner: React.FC = () => {
  const { 
    currentRank, 
    level, 
    streak, 
    currentAffirmation, 
    nextAffirmation, 
    settings, 
    updateSettings, 
    isSpamCooldownActive, 
    cooldownRemainingSec 
  } = useGamification();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-background/85 border-b border-purple-500/20 px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex flex-col gap-2">
        {/* Top Motivational Star Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/30">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="absolute -bottom-1 -right-1 px-1 text-[9px] font-black bg-amber-400 text-black rounded font-mono">
                LVL {level}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                  YOU ARE THE STAR
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300">
                  LVL UP
                </span>
              </div>
              <h1 className="text-xs font-bold tracking-tight text-foreground/90">
                DONT GIVE UP LEVEL UP
              </h1>
            </div>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-1">
            {/* Streak indicator */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{streak}d</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title={settings.soundEnabled ? 'Sound stummschalten' : 'Sound aktivieren'}
              aria-label="Sound Toggle"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-500" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark/Light mode */}
            <button
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Theme wechseln"
              aria-label="Theme wechseln"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Motto & Daily Affirmation Pill */}
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/20 via-purple-500/10 to-indigo-950/20 border border-purple-500/20 text-xs shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-extrabold text-purple-600 dark:text-purple-400 text-[10px] tracking-wide uppercase shrink-0">
              RISE HIGHER
            </span>
            <span className="text-muted-foreground text-[10px]">|</span>
            <p className="truncate text-foreground/90 font-medium italic text-[11px]">
              "{currentAffirmation}"
            </p>
          </div>
          <button
            onClick={nextAffirmation}
            className="p-1 text-muted-foreground hover:text-purple-500 shrink-0 transition-transform active:rotate-180"
            title="Nächste Affirmation"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Anti-spam cooldown alert badge (appears only when spam clicking) */}
        {isSpamCooldownActive && (
          <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-500 text-[11px] font-semibold animate-pulse">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Anti-Spam Schutz aktiv (max. 35 XP)</span>
            </div>
            <span className="font-mono bg-rose-500 text-white px-1.5 py-0.2 rounded text-[10px]">
              {cooldownRemainingSec}s
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
