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
      className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors relative selection:bg-purple-500/30"
      style={customBgStyle}
    >
      {/* Background ambient lighting - spacious and subtle */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 -right-48 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Persistent Sticky Top Header with GGIRL branding */}
      <HeaderBanner />

      {/* Main Container with generous breathing space */}
      <main className="flex-1 w-full max-w-xl md:max-w-2xl mx-auto px-4 sm:px-6 pt-5 pb-8 relative z-10">
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
