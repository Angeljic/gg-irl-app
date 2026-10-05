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
      badge: `Lvl ${level}`
    },
    {
      key: 'profile',
      label: 'PROFILE',
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-purple-500/20 px-3 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-black scale-105'
                  : 'text-muted-foreground hover:text-foreground font-semibold'
              }`}
            >
              {/* Active glow dot */}
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-purple-500 glow-purple" />
              )}

              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className={`absolute -top-1 -right-3 px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono leading-tight ${
                    isActive 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-wider mt-1">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
