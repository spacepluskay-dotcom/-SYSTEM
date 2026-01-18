import React, { useEffect, useState } from 'react';
import { SystemShell } from './SystemUI';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import { motion, useScroll, useSpring } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

// Mobile Head-Up Display (Visible only on mobile/tablet)
const MobileHUD: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { toggleMute, isMuted, audioReady, playClick } = useSound();

  return (
    <div className="md:hidden fixed top-0 left-0 w-full z-[100] flex justify-between items-center px-6 py-4 bg-gradient-to-b from-bg-0 via-bg-0/90 to-transparent pointer-events-none">
       {/* Left: System ID */}
       <div className="pointer-events-auto flex items-center space-x-2 opacity-80">
          <span className="text-signal-lime font-bold">Ø</span>
          <span className="font-mono text-[9px] text-text-2">SYS_MOBILE</span>
       </div>

       {/* Right: Controls */}
       <div className="pointer-events-auto flex items-center space-x-3">
          {/* Audio */}
          <button 
             onClick={() => { playClick(); toggleMute(); }}
             className={`font-mono text-[9px] border px-2 py-1 rounded-sm bg-bg-panel backdrop-blur-md transition-colors ${!isMuted && audioReady ? 'border-signal-lime text-signal-lime shadow-[0_0_8px_rgba(204,255,0,0.2)]' : 'border-line-1 text-text-2'}`}
          >
             {isMuted || !audioReady ? 'MUTE' : 'SOUND'}
          </button>

          {/* Lang */}
          <button 
             onClick={() => { playClick(); setLanguage(language === 'en' ? 'cn' : 'en'); }}
             className="font-mono text-[9px] text-text-0 border border-line-1 px-2 py-1 rounded-sm bg-bg-panel backdrop-blur-md active:bg-signal-lime active:text-bg-0 transition-colors"
          >
             {language === 'en' ? 'EN' : 'CN'}
          </button>
       </div>
    </div>
  );
};

// System Locator: Vertical Progress Indicator (Desktop)
const SystemLocator: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 h-64 w-[1px] bg-line-1 hidden md:flex flex-col items-center justify-between z-40 mix-blend-difference pointer-events-none">
            <div className="w-2 h-[1px] bg-line-1"></div>
            
            {/* Track */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-line-1 overflow-hidden">
                <motion.div 
                    style={{ scaleY, transformOrigin: "top" }}
                    className="w-full h-full bg-signal-lime shadow-[0_0_10px_var(--signal-lime)]"
                />
            </div>

            {/* Current Position Marker */}
            {/* We use specific markers for visual rhythm */}
            <div className="absolute top-0 -right-2 text-[8px] font-mono text-text-2">00</div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-2 text-[8px] font-mono text-text-2">50</div>
            <div className="absolute bottom-0 -right-2 text-[8px] font-mono text-text-2">100</div>

            <div className="w-2 h-[1px] bg-line-1"></div>
        </div>
    );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SystemShell>
      <MobileHUD />
      <SystemLocator />
      
      {children}
      
      {/* Structural Decorators (Desktop Only) - Enhanced Precision */}
      <div className="fixed top-8 left-8 w-2 h-2 border-t border-l border-text-2/30 z-40 hidden md:block pointer-events-none"></div>
      <div className="fixed top-8 right-8 w-2 h-2 border-t border-r border-text-2/30 z-40 hidden md:block pointer-events-none"></div>
      <div className="fixed bottom-24 left-8 w-2 h-2 border-b border-l border-text-2/30 z-40 hidden md:block pointer-events-none"></div>
      <div className="fixed bottom-24 right-8 w-2 h-2 border-b border-r border-text-2/30 z-40 hidden md:block pointer-events-none"></div>
      
      {/* Version Stamp */}
      <div className="fixed bottom-24 right-12 text-[9px] font-mono text-text-2/40 -rotate-90 origin-bottom-right hidden md:block pointer-events-none">
          Ø_SYSTEM_OS_V2.4.1
      </div>
    </SystemShell>
  );
};
