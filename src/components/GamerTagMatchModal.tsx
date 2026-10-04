import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { 
  Gamepad2, 
  X, 
  Trophy, 
  Skull, 
  Target, 
  Sparkles, 
  HelpCircle,
  ShieldAlert,
  Flame,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface GamerTagMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamerTagMatchModal: React.FC<GamerTagMatchModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, logMatchReview, isSpamCooldownActive, cooldownRemainingSec } = useGamification();

  const [gamertag, setGamertag] = useState(profile.gamertag || '');
  const [championOrRole, setChampionOrRole] = useState('Ahri (Mid)');
  const [result, setResult] = useState<'win' | 'loss'>('win');
  const [kills, setKills] = useState<number>(6);
  const [deaths, setDeaths] = useState<number>(3);
  const [assists, setAssists] = useState<number>(8);
  const [focusSkill, setFocusSkill] = useState<string>('Wave Management & Slow-Push');

  // Guided review questions as requested by prompt
  const [whatWentWell, setWhatWentWell] = useState('Minion-Wellen gut vor Drachenkampf gecrasht.');
  const [whatToImprove, setWhatToImprove] = useState('Nach dem ersten Kill zu gierig für Plating gewesen.');
  const [deathAnalysis, setDeathAnalysis] = useState('2 Tode durch fehlende Wards im River. River-Bush vor Aggression immer warden!');
  const [skillGrade, setSkillGrade] = useState<number>(4);

  if (!isOpen) return null;

  // Smart advice generation based on stats
  const getReviewTip = () => {
    if (deaths >= 5) {
      return {
        tag: 'DEATHS ANALYSE',
        text: 'Hohe Anzahl an Toden! Konzentriere dich auf Positionsfehler und River-Vision vor Objective-Kämpfen.',
        color: 'text-rose-500'
      };
    }
    if (focusSkill.toLowerCase().includes('wave')) {
      return {
        tag: 'WAVE TIP',
        text: 'Freeze die Welle wenn der Jungler in deiner Nähe ist, oder slow-pushe bevor du zur Base gehst.',
        color: 'text-purple-400'
      };
    }
    return {
      tag: 'TRADING TIP',
      text: 'Nutze gegnerische Cooldowns aus: Trade nur, wenn der Gegner eine Schlüssel-Fähigkeit verschwendet hat.',
      color: 'text-cyan-400'
    };
  };

  const currentTip = getReviewTip();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (gamertag && gamertag !== profile.gamertag) {
      updateProfile({ gamertag, summonerName: gamertag.split('#')[0] });
    }

    logMatchReview({
      game: 'League of Legends',
      championOrRole,
      result,
      kda: { kills, deaths, assists },
      focusSkill,
      reviewAnswers: {
        whatWentWell,
        whatToImprove,
        deathAnalysis,
        skillGrade
      },
      xpEarned: 35 // Max 35 XP cap for hard/deep review
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-6 rounded-3xl bg-card border-2 border-purple-500/40 p-5 shadow-2xl glow-purple text-foreground">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight flex items-center gap-1.5">
              <span>Match Review & Skill Tracker</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                +35 XP (Max)
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              LoL / Esports Mindset: Aus Fehlern lernen und gezielt aufsteigen
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* GamerTag / Riot ID */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Dein Gamertag / Riot ID (z.B. Star#EUW)</span>
            </Label>
            <Input
              value={gamertag}
              onChange={e => setGamertag(e.target.value)}
              placeholder="GamerTag#Tag"
              className="rounded-xl border-purple-500/30 font-mono text-sm"
              required
            />
          </div>

          {/* Champion & Win/Loss */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Champion / Rolle</Label>
              <Input
                value={championOrRole}
                onChange={e => setChampionOrRole(e.target.value)}
                placeholder="z.B. Ahri (Mid)"
                className="rounded-xl text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Match Ausgang</Label>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setResult('win')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    result === 'win'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-muted/40 border-border text-muted-foreground'
                  }`}
                >
                  Sieg 🏆
                </button>
                <button
                  type="button"
                  onClick={() => setResult('loss')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    result === 'loss'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-muted/40 border-border text-muted-foreground'
                  }`}
                >
                  Niederlage ⚔️
                </button>
              </div>
            </div>
          </div>

          {/* KDA & Deaths Tracker */}
          <div className="p-3 rounded-2xl bg-muted/40 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold flex items-center gap-1">
                <Skull className="w-3.5 h-3.5 text-rose-400" />
                <span>KDA & Tode Tracken</span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                KDA: {deaths === 0 ? 'Perfekt' : ((kills + assists) / Math.max(deaths, 1)).toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Kills</Label>
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={kills}
                  onChange={e => setKills(parseInt(e.target.value, 10) || 0)}
                  className="rounded-lg text-center font-mono font-bold"
                />
              </div>
              <div>
                <Label className="text-[10px] text-rose-400 font-bold">Deaths (Fokus!)</Label>
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={deaths}
                  onChange={e => setDeaths(parseInt(e.target.value, 10) || 0)}
                  className="rounded-lg text-center font-mono font-bold border-rose-500/40 text-rose-500"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Assists</Label>
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={assists}
                  onChange={e => setAssists(parseInt(e.target.value, 10) || 0)}
                  className="rounded-lg text-center font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Focus Skill Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span>Trainierter Fokus-Skill</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Wave Management & Freeze',
                'Trading & Cooldown-Punches',
                'Deaths vermeiden & Safety',
                'Vision & River Control'
              ].map(skill => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => setFocusSkill(skill)}
                  className={`p-2 text-[11px] rounded-xl text-left border transition-all ${
                    focusSkill === skill
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300 font-bold'
                      : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* AI Coach Suggestion based on Deaths */}
          <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-purple-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentTip.tag}</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed">
              {currentTip.text}
            </p>
          </div>

          {/* Guided Reflection Questions */}
          <div className="space-y-2">
            <div>
              <Label className="text-xs font-semibold text-foreground">
                1. Was hast du heute verbessert?
              </Label>
              <Input
                value={whatWentWell}
                onChange={e => setWhatWentWell(e.target.value)}
                placeholder="z.B. Wellen besser getimet..."
                className="rounded-xl text-xs mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-rose-400">
                2. Warum bist du gestorben? (Todes-Analyse)
              </Label>
              <Input
                value={deathAnalysis}
                onChange={e => setDeathAnalysis(e.target.value)}
                placeholder="z.B. Overextendet ohne Flash..."
                className="rounded-xl text-xs mt-1 border-rose-500/30"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-purple-300">
                3. Was könntest du nächstes Mal besser machen?
              </Label>
              <Input
                value={whatToImprove}
                onChange={e => setWhatToImprove(e.target.value)}
                placeholder="z.B. Mehr Control Wards kaufen..."
                className="rounded-xl text-xs mt-1"
                required
              />
            </div>
          </div>

          {/* Anti-spam note */}
          {isSpamCooldownActive && (
            <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Anti-Spam aktiv. Bitte warte noch {cooldownRemainingSec}s.</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSpamCooldownActive}
            className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/30"
          >
            Match Review speichern & +35 XP erhalten
          </Button>
        </form>
      </div>
    </div>
  );
};
