import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { 
  Award, 
  Gamepad2, 
  Settings, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  RotateCcw, 
  Check, 
  Edit3, 
  Flame, 
  Skull, 
  BarChart3
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GamerTagMatchModal } from '../components/GamerTagMatchModal';

export const ProfileTab: React.FC = () => {
  const { 
    level, 
    totalXp, 
    streak, 
    currentRank, 
    badges, 
    categoryStats, 
    matches, 
    profile, 
    updateProfile, 
    settings, 
    updateSettings, 
    resetProgress, 
    setHasCompletedOnboarding 
  } = useGamification();

  const [isEditingGamertag, setIsEditingGamertag] = useState(false);
  const [gamertagInput, setGamertagInput] = useState(profile.gamertag);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const saveGamertag = () => {
    updateProfile({ gamertag: gamertagInput.trim() });
    setIsEditingGamertag(false);
  };

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/60 via-card to-background border border-purple-500/25 p-6 shadow-xl glow-purple">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-18 h-18 rounded-2xl object-cover ring-2 ring-purple-500/60 shadow-lg shadow-purple-500/25"
            />
            <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md bg-amber-400 text-black font-black text-[10px] font-mono shadow">
              LVL {level}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isEditingGamertag ? (
                <div className="flex items-center gap-1.5 w-full">
                  <Input
                    value={gamertagInput}
                    onChange={e => setGamertagInput(e.target.value)}
                    className="h-8 text-xs font-mono font-bold rounded-lg"
                  />
                  <Button size="sm" onClick={saveGamertag} className="h-8 text-xs rounded-lg bg-purple-600 px-3">
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-foreground font-mono truncate">
                    {profile.gamertag}
                  </h3>
                  <button
                    onClick={() => setIsEditingGamertag(true)}
                    className="p-1 rounded-md text-muted-foreground hover:text-purple-400 hover:bg-muted"
                    title="Gamertag bearbeiten"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-purple-400 font-bold mt-1">
              {currentRank.tier} • {currentRank.title}
            </p>
            <p className="text-xs text-muted-foreground italic mt-0.5 truncate">
              "{profile.motto}"
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-purple-500/15 text-center">
          <div className="p-3 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[10px] text-muted-foreground font-semibold">TOTAL XP</span>
            <div className="text-base font-black font-mono text-purple-400 mt-0.5">
              {totalXp.toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[10px] text-muted-foreground font-semibold">STREAK</span>
            <div className="text-base font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{streak}d</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[10px] text-muted-foreground font-semibold">BADGES</span>
            <div className="text-base font-black text-foreground font-mono mt-0.5">
              {unlockedBadgesCount} / {badges.length}
            </div>
          </div>
        </div>
      </div>

      {/* Category XP Distribution / Statistics */}
      <div className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Kategorie Progression (XP Verteilung)</span>
          </h3>
          <span className="text-[11px] text-muted-foreground font-mono">
            {categoryStats.totalQuestsCompleted} Quests fertig
          </span>
        </div>

        <div className="space-y-3">
          {[
            { key: 'health', name: 'Health & Fitness', xp: categoryStats.healthXP, color: 'bg-emerald-500' },
            { key: 'intelligence', name: 'Intelligence & Mind', xp: categoryStats.intelligenceXP, color: 'bg-cyan-500' },
            { key: 'social', name: 'Social & Family', xp: categoryStats.socialXP, color: 'bg-rose-500' },
            { key: 'habits', name: 'Habits & Living', xp: categoryStats.habitsXP, color: 'bg-amber-500' },
            { key: 'gaming', name: 'Gaming & Skills', xp: categoryStats.gamingXP, color: 'bg-purple-500' }
          ].map(cat => {
            const maxCategoryXp = Math.max(
              categoryStats.healthXP,
              categoryStats.intelligenceXP,
              categoryStats.socialXP,
              categoryStats.habitsXP,
              categoryStats.gamingXP,
              50
            );
            const percent = Math.round((cat.xp / maxCategoryXp) * 100);

            return (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{cat.name}</span>
                  <span className="font-mono text-muted-foreground text-xs font-bold">
                    {cat.xp} XP
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${Math.max(percent, cat.xp > 0 ? 5 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LoL & Gamer Match History & Deaths Review */}
      <div className="p-5 rounded-3xl bg-card border border-border space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-foreground">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span>Match Reviews ({matches.length})</span>
          </div>
          <Button
            size="sm"
            onClick={() => setIsMatchModalOpen(true)}
            className="text-xs rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold h-7.5 px-3"
          >
            + Review eintragen
          </Button>
        </div>

        {matches.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3">
            Noch keine Games eingetragen. Nutze das Review-System, um deine Tode in XP & Skill zu verwandeln!
          </p>
        ) : (
          <div className="space-y-2.5">
            {matches.slice(0, 3).map(m => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-foreground">
                    {m.championOrRole} • {m.result === 'win' ? '🏆 Sieg' : '⚔️ Niederlage'}
                  </span>
                  <span className="font-mono text-purple-400 font-bold">
                    +{m.xpEarned} XP
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground text-xs font-mono">
                  <span>KDA: {m.kda.kills}/{m.kda.deaths}/{m.kda.assists}</span>
                  <span>Fokus: {m.focusSkill}</span>
                </div>
                {m.reviewAnswers.deathAnalysis && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    <span className="font-bold flex items-center gap-1.5 mb-0.5">
                      <Skull className="w-3.5 h-3.5" /> Todes-Analyse:
                    </span>
                    <p className="italic">{m.reviewAnswers.deathAnalysis}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges Showcase */}
      <div className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Erfolge & Abzeichen ({unlockedBadgesCount}/{badges.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                b.unlocked
                  ? 'bg-card border-amber-500/40 shadow-sm'
                  : 'bg-muted/20 border-border/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500">
                  {b.rarity}
                </span>
                {b.unlocked && (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <h4 className="text-xs font-bold text-foreground truncate">
                {b.title}
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                {b.description}
              </p>
              <div className="mt-2.5 text-[11px] font-mono text-purple-400 font-semibold">
                Ziel: {b.requirement}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Settings & Controls */}
      <div className="p-5 rounded-3xl bg-card border border-border space-y-3.5 shadow-sm">
        <h3 className="text-xs font-black uppercase text-foreground flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span>Einstellungen & Präferenzen</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          {/* Sound */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
            <span className="font-semibold text-foreground">Sound-Effekte (XP & Fanfare)</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className="h-8 text-xs rounded-xl"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-500" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
            <span className="font-semibold text-foreground">Design Theme (Dark / Light)</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="h-8 text-xs rounded-xl"
            >
              {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </Button>
          </div>

          {/* Tutorial wiederholen */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
            <span className="font-semibold text-foreground">Tutorial / Onboarding erneut ansehen</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setHasCompletedOnboarding(false)}
              className="h-8 text-xs rounded-xl font-medium"
            >
              Tutorial öffnen
            </Button>
          </div>

          {/* Reset progress */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <div>
              <span className="font-bold text-rose-500 block">Fortschritt zurücksetzen</span>
              <span className="text-[11px] text-muted-foreground">Startet wieder bei Level 0 mit 0 XP</span>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (window.confirm('Möchtest du wirklich alle XP und Quests auf Level 0 zurücksetzen?')) {
                  resetProgress();
                }
              }}
              className="h-8 text-xs rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Lvl 0
            </Button>
          </div>
        </div>
      </div>

      <GamerTagMatchModal 
        isOpen={isMatchModalOpen} 
        onClose={() => setIsMatchModalOpen(false)} 
      />
    </div>
  );
};
