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
  RefreshCw,
  Zap
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
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-background/90 border-b border-purple-500/15 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-xl md:max-w-2xl mx-auto flex flex-col gap-2.5">
        {/* Main Brand & Action Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo & App Name GGIRL */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/25 shrink-0">
              <Zap className="w-5 h-5 fill-white text-white" />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 text-[9px] font-black bg-amber-400 text-black rounded-md font-mono shadow-sm">
                L{level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-foreground font-mono">
                  GGIRL
                </span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                  LVL UP
                </span>
                <span className="hidden sm:inline text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  • YOU ARE THE STAR
                </span>
              </div>
              <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 tracking-wide">
                DONT GIVE UP LEVEL UP
              </p>
            </div>
          </div>

          {/* Controls: Streak, Sound, Theme */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Streak Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{streak}d</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border/40"
              title={settings.soundEnabled ? 'Sound stummschalten' : 'Sound aktivieren'}
              aria-label="Sound Toggle"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-500" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border/40"
              title="Theme wechseln"
              aria-label="Theme wechseln"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Affirmation & Motto Bar - Clean & Roomy */}
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/15 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-extrabold text-purple-600 dark:text-purple-400 text-[10px] tracking-wider uppercase shrink-0">
              don´t give up, rise higher
            </span>
            <span className="text-muted-foreground text-xs opacity-40">|</span>
            <p className="truncate text-foreground/85 font-medium italic text-xs">
              "{currentAffirmation}"
            </p>
          </div>
          <button
            onClick={nextAffirmation}
            className="p-1 rounded-lg text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10 shrink-0 transition-transform active:rotate-180"
            title="Nächste Affirmation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Anti-spam cooldown alert badge (appears only when spam clicking) */}
        {isSpamCooldownActive && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-semibold animate-pulse">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Anti-Spam Schutz aktiv (max. 35 XP pro Quest)</span>
            </div>
            <span className="font-mono bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
              {cooldownRemainingSec}s
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
