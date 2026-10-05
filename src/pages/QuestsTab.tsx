import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { CATEGORY_INFO } from '../constants/gamificationData';
import { QuestCategory, QuestDifficulty } from '../types/gamification';
import { 
  Plus, 
  Sparkles, 
  Check, 
  Clock, 
  Calendar, 
  Trash2, 
  Filter, 
  Droplets, 
  Activity, 
  BookOpen, 
  Gamepad2, 
  Heart, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { CustomQuestModal } from '../components/CustomQuestModal';

export const QuestsTab: React.FC = () => {
  const { 
    quests, 
    completeQuest, 
    postponeQuestToTomorrow, 
    deleteQuest, 
    isSpamCooldownActive, 
    cooldownRemainingSec 
  } = useGamification();

  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');
  const [filterMode, setFilterMode] = useState<'active' | 'completed' | 'postponed'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredQuests = quests.filter(q => {
    // Category match
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;

    // Status filter
    if (filterMode === 'completed') return q.isCompletedToday;
    if (filterMode === 'postponed') return !q.isCompletedToday && q.postponedUntil && q.postponedUntil > todayStr;
    // Active
    return !q.isCompletedToday && (!q.postponedUntil || q.postponedUntil <= todayStr);
  });

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Top Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            QUESTS & AUFGABEN
          </h2>
          <p className="text-xs text-muted-foreground">
            Verdiene XP in allen 5 Lebensbereichen (Max. 35 XP)
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-600/30 gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Eigene Quest</span>
        </Button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-muted/40 text-muted-foreground hover:bg-muted'
          }`}
        >
          Alle
        </button>
        {(Object.keys(CATEGORY_INFO) as QuestCategory[]).map(catKey => {
          const cat = CATEGORY_INFO[catKey];
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Status Segment Control */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-muted/50 text-xs font-bold border border-border">
        <button
          onClick={() => setFilterMode('active')}
          className={`py-1.5 rounded-xl transition-all ${
            filterMode === 'active'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Aktiv ({quests.filter(q => !q.isCompletedToday && (!q.postponedUntil || q.postponedUntil <= todayStr)).length})
        </button>
        <button
          onClick={() => setFilterMode('completed')}
          className={`py-1.5 rounded-xl transition-all ${
            filterMode === 'completed'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Erledigt ({quests.filter(q => q.isCompletedToday).length})
        </button>
        <button
          onClick={() => setFilterMode('postponed')}
          className={`py-1.5 rounded-xl transition-all ${
            filterMode === 'postponed'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Morgen ({quests.filter(q => !q.isCompletedToday && q.postponedUntil && q.postponedUntil > todayStr).length})
        </button>
      </div>

      {/* Quest Cards List */}
      {filteredQuests.length === 0 ? (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-2">
          <Sparkles className="w-8 h-8 mx-auto text-purple-400" />
          <h4 className="text-sm font-bold text-foreground">Keine Quests in dieser Ansicht</h4>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {filterMode === 'active' 
              ? 'Du hast alle Quests abgeschlossen oder verschoben. Erstelle eine neue!' 
              : 'Aktuell keine Einträge in diesem Filter.'}
          </p>
          {filterMode === 'active' && (
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-purple-600 text-white text-xs mt-2"
            >
              + Neue Quest anlegen
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuests.map(quest => {
            const catInfo = CATEGORY_INFO[quest.category];
            return (
              <div
                key={quest.id}
                className={`rounded-2xl border transition-all p-4 ${
                  quest.isCompletedToday
                    ? 'bg-card/50 border-emerald-500/30 opacity-75'
                    : 'bg-card border-border hover:border-purple-500/40 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 border border-border">
                      {renderIcon(quest.iconName)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo.bgLight}`}>
                          {catInfo.name.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400">
                          +{quest.xpReward} XP
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">
                          {quest.difficulty}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-foreground mt-1">
                        {quest.title}
                      </h4>
                    </div>
                  </div>

                  {quest.custom && (
                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground pl-13 mb-3 leading-relaxed">
                  {quest.description}
                </p>

                {quest.skillFocus && (
                  <div className="mb-3 text-[11px] font-semibold text-purple-400 bg-purple-500/10 p-2 rounded-xl border border-purple-500/20">
                    🎯 Skill-Fokus: {quest.skillFocus}
                  </div>
                )}

                {/* Footer action buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-[10px] text-muted-foreground">
                    {quest.isDaily ? 'Tägliche Wiederholung' : 'Einmalige Quest'}
                  </span>

                  <div className="flex items-center gap-2">
                    {!quest.isCompletedToday && (
                      <button
                        onClick={() => postponeQuestToTomorrow(quest.id)}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg"
                      >
                        Auf morgen verschieben
                      </button>
                    )}

                    {quest.isCompletedToday ? (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Abgeschlossen</span>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        disabled={isSpamCooldownActive}
                        onClick={() => completeQuest(quest.id)}
                        className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 shadow-sm shadow-purple-600/30"
                      >
                        Abschließen ✓
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CustomQuestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
