
import React from 'react';
import { ModuleType, NavItem } from '../types';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';

interface SystemNavProps {
  currentModule: ModuleType;
  onNavigate: (module: ModuleType) => void;
}

export const SystemNav: React.FC<SystemNavProps> = ({ currentModule, onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { playHover, playClick, playActivate, toggleMute, isMuted, audioReady } = useSound();

  const handleNavigate = (id: ModuleType) => {
    if (currentModule !== id) {
        playActivate();
        onNavigate(id);
    }
  };

  const NAV_ITEMS: NavItem[] = [
    { id: ModuleType.SYSTEM, label: t.nav.items.system, code: '01' },
    { id: ModuleType.ENGINEERING, label: t.nav.items.engineering, code: '02' },
    { id: ModuleType.ENTERTAINMENT, label: t.nav.items.entertainment, code: '03' },
    { id: ModuleType.AI, label: t.nav.items.ai, code: '04' },
    { id: ModuleType.PROJECTS, label: t.nav.items.projects, code: '05' },
    { id: ModuleType.FOUNDER, label: t.nav.items.founder, code: '06' },
    { id: ModuleType.WORK, label: t.nav.items.work, code: '07' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-bg-panel border-t border-line-0 backdrop-blur-xl pb-safe">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-dock flex items-center justify-between">
        
        {/* Left: System Status / Logo */}
        <div className="hidden md:flex items-center space-x-6">
          <div 
            onClick={() => handleNavigate(ModuleType.BOOT)}
            onMouseEnter={playHover}
            className="cursor-pointer group flex items-center space-x-2"
          >
             <span className="font-bold tracking-tighter text-xl text-signal-lime group-hover:text-white transition-colors">Ø</span>
             <span className="font-mono text-[10px] text-text-2 group-hover:text-text-1">SYSTEM_V2.0</span>
          </div>
          <div className="h-4 w-px bg-line-1"></div>
          <div className="font-mono text-[10px] text-text-2 flex items-center space-x-2">
            <span>{t.nav.status}:</span>
            <span className="text-signal-lime">{t.nav.online}</span>
          </div>
        </div>

        {/* Center: Navigation Items */}
        <div className="flex-1 md:flex-none flex items-center justify-start md:justify-center space-x-1 md:space-x-2 overflow-x-auto no-scrollbar scroll-smooth pl-2 md:pl-0">
          {NAV_ITEMS.map((item) => {
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                onMouseEnter={playHover}
                className={`relative px-4 md:px-3 py-2 flex flex-col items-center justify-center group outline-none min-w-[70px] md:min-w-[80px] shrink-0 rounded-sm overflow-hidden transition-all duration-300 ${isActive ? 'bg-signal-lime/5' : 'hover:bg-bg-1'}`}
              >
                {/* Active Noise Background */}
                {isActive && (
                    <div className="absolute inset-0 opacity-10 bg-noise mix-blend-overlay pointer-events-none"></div>
                )}
                
                <span className={`font-mono text-[9px] mb-1 transition-colors relative z-10 ${isActive ? 'text-signal-lime' : 'text-text-2 group-hover:text-text-1'}`}>
                  {item.code}
                </span>
                <span className={`text-[10px] md:text-xs font-medium tracking-wide transition-colors whitespace-nowrap relative z-10 ${isActive ? 'text-text-0' : 'text-text-1 group-hover:text-text-0'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="dock-active"
                    className="absolute bottom-0 w-full h-[2px] bg-signal-lime shadow-[0_0_6px_var(--signal-lime)]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Controls (Audio + Lang) */}
        <div className="hidden md:flex items-center space-x-4 font-mono text-[10px] ml-6 border-l border-line-1 pl-6">
           {/* Audio Toggle */}
           <button 
              onClick={() => { playClick(); toggleMute(); }}
              onMouseEnter={playHover}
              className={`transition-colors flex items-center space-x-1 ${!isMuted && audioReady ? 'text-signal-lime' : 'text-text-2 hover:text-text-0'}`}
           >
             <span>{isMuted || !audioReady ? 'AUDIO:OFF' : 'AUDIO:ON'}</span>
             {!isMuted && audioReady && (
                 <span className="flex space-x-[1px] items-end h-2">
                     <span className="w-[1px] h-1 bg-current animate-pulse"></span>
                     <span className="w-[1px] h-2 bg-current animate-pulse"></span>
                     <span className="w-[1px] h-1.5 bg-current animate-pulse"></span>
                 </span>
             )}
           </button>

           <span className="text-line-1">/</span>

           {/* Language Toggle */}
           <div className="flex space-x-2">
               <button 
                  onClick={() => { playClick(); setLanguage('en'); }}
                  onMouseEnter={playHover}
                  className={`transition-colors ${language === 'en' ? 'text-text-0' : 'text-text-2 hover:text-text-0'}`}
               >
                 EN
               </button>
               <button 
                  onClick={() => { playClick(); setLanguage('cn'); }}
                  onMouseEnter={playHover}
                  className={`transition-colors ${language === 'cn' ? 'text-text-0' : 'text-text-2 hover:text-text-0'}`}
               >
                 CN
               </button>
           </div>
        </div>
      </div>
    </nav>
  );
};
