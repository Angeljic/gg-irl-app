import React from 'react';
import { Home, Compass, Trophy, User } from 'lucide-react';

export type TabType = 'home' | 'quests' | 'levels' | 'profile';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingQuestsCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  pendingQuestsCount
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'HOME', icon: Home },
    { id: 'quests' as TabType, label: 'QUESTS', icon: Compass, badge: pendingQuestsCount },
    { id: 'levels' as TabType, label: 'LEVELS', icon: Trophy },
    { id: 'profile' as TabType, label: 'PROFILE', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-card/90 backdrop-blur-lg border-t border-purple-500/20 shadow-xl px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-purple-600 dark:text-purple-300 font-bold scale-105'
                  : 'text-muted-foreground hover:text-foreground font-medium'
              }`}
            >
              {/* Active glow pill background */}
              {isActive && (
                <span className="absolute inset-0 bg-purple-500/15 dark:bg-purple-500/25 rounded-2xl border border-purple-500/30 -z-10 animate-fade-in" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.75px]'}`} />
                
                {/* Pending quest badge count */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-emerald-300 shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-wider mt-1 uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
