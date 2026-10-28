import React from 'react';
import { Home, CheckSquare, Layers, User } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export type TabKey = 'home' | 'quests' | 'levels' | 'profile';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { quests, level } = useGamification();

  // Active uncompleted quests count
  const activeQuestsCount = quests.filter(q => !q.isCompletedToday).length;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      key: 'home',
      label: 'HOME',
      icon: <Home className="w-5 h-5" />
    },
    {
      key: 'quests',
      label: 'QUESTS',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: activeQuestsCount > 0 ? activeQuestsCount : undefined
    },
    {
      key: 'levels',
      label: 'LEVELS',
      icon: <Layers className="w-5 h-5" />,
      badge: `L${level}`
    },
    {
      key: 'profile',
      label: 'PROFILE',
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-purple-500/15 px-4 py-2.5 transition-all">
      <div className="max-w-xl md:max-w-2xl mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-black scale-105 bg-purple-500/10'
                  : 'text-muted-foreground hover:text-foreground font-semibold hover:bg-muted/40'
              }`}
            >
              {/* Active subtle pill dot */}
              {isActive && (
                <span className="absolute -top-1 w-2 h-1 rounded-full bg-purple-500 glow-purple" />
              )}

              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && (
                  <span className={`absolute -top-1 -right-3.5 px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono leading-tight ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-wider mt-1 font-mono">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
