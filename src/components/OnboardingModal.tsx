import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { CATEGORY_INFO } from '../constants/gamificationData';
import { QuestCategory } from '../types/gamification';
import { 
  Sparkles, 
  ArrowRight, 
  Gamepad2, 
  Check, 
  ShieldCheck, 
  Crown,
  HeartPulse,
  Brain,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const OnboardingModal: React.FC = () => {
  const { 
    hasCompletedOnboarding, 
    setHasCompletedOnboarding, 
    profile, 
    updateProfile 
  } = useGamification();

  const [step, setStep] = useState<number>(0);
  const [selectedFocus, setSelectedFocus] = useState<QuestCategory[]>(['health', 'gaming']);
  const [gamertag, setGamertag] = useState(profile.gamertag || '');

  if (hasCompletedOnboarding) return null;

  const toggleFocus = (cat: QuestCategory) => {
    setSelectedFocus(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = () => {
    if (gamertag.trim()) {
      updateProfile({ gamertag: gamertag.trim(), summonerName: gamertag.split('#')[0] });
    }
    setHasCompletedOnboarding(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-3xl bg-card border-2 border-purple-500/50 p-6 shadow-2xl glow-purple text-foreground overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />

        {/* Step Indicator dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                step === i ? 'w-6 bg-purple-500' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 0: Welcome & The Star Mantra */}
        {step === 0 && (
          <div className="text-center space-y-4 animate-in slide-in-from-right duration-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 flex items-center justify-center text-white shadow-xl glow-purple animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-1">
                WILLKOMMEN BEI RISE
              </span>
              <h2 className="text-2xl font-black tracking-tight text-foreground leading-tight">
                YOU ARE THE STAR
              </h2>
              <p className="text-sm font-black text-purple-500 uppercase tracking-wide">
                DONT GIVE UP LEVEL UP
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-muted-foreground leading-relaxed">
              "Verwandle dein reales Leben in ein packendes RPG-System. Du startest bei <strong className="text-foreground">Level 0 mit 0 XP</strong> und wächst mit jeder realen Aktivität!"
            </div>

            <Button
              onClick={() => setStep(1)}
              className="w-full py-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30"
            >
              <span>Aufstieg beginnen</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        )}

        {/* Step 1: Quests & XP Concept */}
        {step === 1 && (
          <div className="text-center space-y-4 animate-in slide-in-from-right duration-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
                DAS SPIELPRINZIP
              </span>
              <h2 className="text-xl font-black text-foreground">
                Quests abschließen & XP verdienen
              </h2>
            </div>

            <div className="space-y-2 text-left text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-3">
                <span className="text-base">💧</span>
                <div>
                  <span className="font-bold text-foreground block">Tägliche Gewohnheiten</span>
                  <span className="text-muted-foreground">Wasser trinken, Dehnen, Haushalt & Lernen</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-3">
                <span className="text-base">🛡️</span>
                <div>
                  <span className="font-bold text-foreground block">Faires Anti-Spam System</span>
                  <span className="text-muted-foreground">Max. 35 XP pro Quest für echtes, ehrliches Wachstum</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full py-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm"
            >
              <span>Weiter zu den Rängen</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        )}

        {/* Step 2: Levels & League of Legends Ränge */}
        {step === 2 && (
          <div className="text-center space-y-4 animate-in slide-in-from-right duration-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Crown className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                PROGRESSION
              </span>
              <h2 className="text-xl font-black text-foreground">
                Eisen bis Herausforderer
              </h2>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Erreiche höhere Level und schalte exklusive Rang-Hintergründe, Meister-Rahmen und legendäre Abzeichen frei.
            </p>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 italic">
              "don´t give up, rise higher"
            </div>

            <Button
              onClick={() => setStep(3)}
              className="w-full py-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm"
            >
              <span>Fokus & Gamertag festlegen</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        )}

        {/* Step 3: Choose Focus Areas & Gamertag */}
        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-200">
            <div className="text-center">
              <h3 className="text-lg font-black text-foreground">
                Wähle deine Hauptbereiche
              </h3>
              <p className="text-xs text-muted-foreground">
                Wo möchtest du als erstes aufsteigen?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {(Object.keys(CATEGORY_INFO) as QuestCategory[]).map(catKey => {
                const info = CATEGORY_INFO[catKey];
                const isSelected = selectedFocus.includes(catKey);
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => toggleFocus(catKey)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 font-bold ring-1 ring-purple-500'
                        : 'border-border bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    <span>{info.name.split(' ')[0]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                );
              })}
            </div>

            {/* Optional Gamertag */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                <span>GamerTag / LoL Summoner (optional)</span>
              </label>
              <Input
                value={gamertag}
                onChange={e => setGamertag(e.target.value)}
                placeholder="z.B. Player#EUW"
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <Button
              onClick={handleFinish}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30"
            >
              Starte mit Level 0! 🚀
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
