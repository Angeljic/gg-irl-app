import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { QuestCategory, QuestDifficulty } from '../types/gamification';
import { CATEGORY_INFO } from '../constants/gamificationData';
import { X, Plus, Sparkles, ShieldCheck, Clock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CustomQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomQuestModal: React.FC<CustomQuestModalProps> = ({ isOpen, onClose }) => {
  const { addCustomQuest } = useGamification();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('health');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('medium');
  const [skillFocus, setSkillFocus] = useState('');
  const [repeatSchedule, setRepeatSchedule] = useState<'daily' | 'weekdays' | 'weekends' | 'once'>('daily');

  if (!isOpen) return null;

  // Max 35 XP cap for hard as strictly required by prompt
  const getXpForDifficulty = (diff: QuestDifficulty): number => {
    switch (diff) {
      case 'easy': return 15;
      case 'medium': return 25;
      case 'hard': return 35; // strictly capped at 35 XP
    }
  };

  const calculatedXp = getXpForDifficulty(difficulty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCustomQuest({
      title: title.trim(),
      description: description.trim() || 'Persönliche Quest für deine tägliche Progression.',
      category,
      difficulty,
      xpReward: calculatedXp,
      isDaily: repeatSchedule === 'daily',
      repeatSchedule,
      skillFocus: skillFocus.trim() || undefined,
      iconName: category === 'health' ? 'Dumbbell' : category === 'gaming' ? 'Gamepad2' : category === 'intelligence' ? 'Brain' : category === 'social' ? 'Users' : 'Sparkles'
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

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">Neue Quest erstellen</h2>
            <p className="text-xs text-muted-foreground">
              Mache deine realen Vorhaben zu motivierenden RPG-Quests
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <Label className="text-xs font-bold">Quest Name / Ziel</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B. 20 Min Joggen, Vokabeln lernen, Zimmer saugen..."
              className="rounded-xl text-sm"
              required
            />
          </div>

          {/* Category selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Kategorie</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_INFO) as QuestCategory[]).map(catKey => {
                const info = CATEGORY_INFO[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 ring-1 ring-purple-500'
                        : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span className="font-bold truncate">{info.name.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-80">{catKey.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & XP Reward */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold">Schwierigkeit</Label>
              <span className="text-xs font-mono font-black text-purple-400">
                +{calculatedXp} XP Belohnung
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as QuestDifficulty[]).map(diff => {
                const isSelected = difficulty === diff;
                const xp = getXpForDifficulty(diff);
                const label = diff === 'easy' ? 'Leicht' : diff === 'medium' ? 'Mittel' : 'Schwer (Max 35 XP)';
                return (
                  <button
                    type="button"
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 ring-1 ring-purple-500'
                        : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div>{label}</div>
                    <div className="text-[10px] text-purple-400 font-mono">+{xp} XP</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Anti-Spam Regel: Maximale Belohnung ist auf 35 XP begrenzt.</span>
            </p>
          </div>

          {/* Repeat Schedule */}
          <div className="space-y-1">
            <Label className="text-xs font-bold">Wiederholung</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'daily', label: 'Täglich' },
                { id: 'weekdays', label: 'Mo-Fr' },
                { id: 'weekends', label: 'Sa-So' },
                { id: 'once', label: 'Einmalig' }
              ].map(sched => (
                <button
                  type="button"
                  key={sched.id}
                  onClick={() => setRepeatSchedule(sched.id as typeof repeatSchedule)}
                  className={`py-1.5 text-[11px] rounded-lg border font-medium ${
                    repeatSchedule === sched.id
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300 font-bold'
                      : 'border-border bg-muted/20 text-muted-foreground'
                  }`}
                >
                  {sched.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description / Note */}
          <div className="space-y-1">
            <Label className="text-xs font-bold">Beschreibung / Tipps (optional)</Label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="z.B. Intensität hochhalten, 5 Min Pause dazwischen..."
              className="rounded-xl text-xs"
            />
          </div>

          {/* Skill Focus (especially for gaming or intelligence) */}
          <div className="space-y-1">
            <Label className="text-xs font-bold">Spezifischer Skill-Fokus (optional)</Label>
            <Input
              value={skillFocus}
              onChange={e => setSkillFocus(e.target.value)}
              placeholder="z.B. Wave Management, Vokabeln Kapitel 3..."
              className="rounded-xl text-xs"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/30"
          >
            Quest Hinzufügen & Progression starten
          </Button>
        </form>
      </div>
    </div>
  );
};
