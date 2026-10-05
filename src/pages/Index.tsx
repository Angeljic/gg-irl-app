import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { HeaderBanner } from '../components/HeaderBanner';
import { BottomNav, TabKey } from '../components/BottomNav';
import { HomeTab } from './HomeTab';
import { QuestsTab } from './QuestsTab';
import { LevelsTab } from './LevelsTab';
import { ProfileTab } from './ProfileTab';
import { LevelUpModal } from '../components/LevelUpModal';
import { BadgeUnlockedModal } from '../components/BadgeUnlockedModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { RANKS } from '../constants/gamificationData';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const { profile } = useGamification();

  // Check if an unlocked special background is active
  const selectedRank = RANKS.find(r => r.tier === profile.activeBackground);
  const customBgStyle = selectedRank?.unlockedBgImage 
    ? { background: selectedRank.unlockedBgImage } 
    : undefined;

  return (
    <div 
      className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors relative"
      style={customBgStyle}
    >
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Persistent Sticky Top Header */}
      <HeaderBanner />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 relative z-10">
        {activeTab === 'home' && <HomeTab onNavigateTab={setActiveTab} />}
        {activeTab === 'quests' && <QuestsTab />}
        {activeTab === 'levels' && <LevelsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Sticky Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Modals & Celebrations */}
      <LevelUpModal />
      <BadgeUnlockedModal />
      <OnboardingModal />
    </div>
  );
};

export default Index;
