import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { CATEGORY_INFO } from '../constants/gamificationData';
import { QuestCategory, QuestDifficulty } from '../types/gamification';
import { 
  Plus, 
  Sparkles, 
  Check, 
  Trash2, 
  Droplets, 
  Activity, 
  BookOpen, 
  Gamepad2, 
  Heart, 
  Undo2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { CustomQuestModal } from '../components/CustomQuestModal';

export const QuestsTab: React.FC = () => {
  const { 
    quests, 
    completeQuest, 
    uncompleteQuest,
    postponeQuestToTomorrow, 
    deleteQuest, 
    isSpamCooldownActive
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
    <div className="space-y-5 pb-28 animate-in fade-in duration-300">
      {/* Top Title & Add Button */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            QUESTS & AUFGABEN
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verdiene XP in allen 5 Lebensbereichen (Max. 35 XP pro Quest)
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-600/25 gap-1.5 px-3.5 py-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Eigene Quest</span>
        </Button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          Alle Bereiche
        </button>
        {(Object.keys(CATEGORY_INFO) as QuestCategory[]).map(catKey => {
          const cat = CATEGORY_INFO[catKey];
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Status Segment Control */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-muted/50 text-xs font-bold border border-border/80">
        <button
          onClick={() => setFilterMode('active')}
          className={`py-2 rounded-xl transition-all ${
            filterMode === 'active'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Aktiv ({quests.filter(q => !q.isCompletedToday && (!q.postponedUntil || q.postponedUntil <= todayStr)).length})
        </button>
        <button
          onClick={() => setFilterMode('completed')}
          className={`py-2 rounded-xl transition-all ${
            filterMode === 'completed'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Erledigt ({quests.filter(q => q.isCompletedToday).length})
        </button>
        <button
          onClick={() => setFilterMode('postponed')}
          className={`py-2 rounded-xl transition-all ${
            filterMode === 'postponed'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Morgen ({quests.filter(q => !q.isCompletedToday && q.postponedUntil && q.postponedUntil > todayStr).length})
        </button>
      </div>

      {/* Quest Cards List */}
      {filteredQuests.length === 0 ? (
        <div className="p-10 rounded-3xl bg-card border border-border text-center space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-purple-400" />
          <h4 className="text-sm font-bold text-foreground">Keine Quests in dieser Ansicht</h4>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            {filterMode === 'active' 
              ? 'Du hast alle Aufgaben dieser Kategorie gemeistert! Erstelle eine neue Quest.' 
              : 'Aktuell keine Einträge in diesem Filter.'}
          </p>
          {filterMode === 'active' && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl bg-purple-600 text-white text-xs mt-2 px-4"
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
                className={`rounded-2xl border transition-all p-4.5 ${
                  quest.isCompletedToday
                    ? 'bg-card/60 border-emerald-500/30 opacity-80'
                    : 'bg-card border-border hover:border-purple-500/40 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-muted/60 flex items-center justify-center shrink-0 border border-border">
                      {renderIcon(quest.iconName)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo.bgLight}`}>
                          {catInfo.name.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400">
                          +{quest.xpReward} XP
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">
                          {quest.difficulty}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-foreground mt-1.5">
                        {quest.title}
                      </h4>
                    </div>
                  </div>

                  {quest.custom && (
                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="p-1.5 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {quest.description}
                </p>

                {quest.skillFocus && (
                  <div className="mb-3 text-[11px] font-semibold text-purple-400 bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
                    🎯 Skill-Fokus: {quest.skillFocus}
                  </div>
                )}

                {/* Footer action buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="text-[11px] text-muted-foreground">
                    {quest.isDaily ? 'Tägliche Wiederholung' : 'Einmalige Quest'}
                  </span>

                  <div className="flex items-center gap-2">
                    {!quest.isCompletedToday && (
                      <button
                        onClick={() => postponeQuestToTomorrow(quest.id)}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-xl hover:bg-muted transition-colors"
                      >
                        Auf morgen
                      </button>
                    )}

                    {quest.isCompletedToday ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>Erledigt</span>
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => uncompleteQuest(quest.id)}
                          className="h-7 text-[11px] font-semibold text-muted-foreground hover:text-foreground border-border hover:bg-muted rounded-xl flex items-center gap-1 px-2.5"
                          title="Als nicht erledigt markieren (XP rückgängig)"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Rückgängig</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        disabled={isSpamCooldownActive}
                        onClick={() => completeQuest(quest.id)}
                        className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-1.5 shadow-sm shadow-purple-600/30"
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
