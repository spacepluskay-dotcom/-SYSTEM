import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';

interface BootSectionProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
    "INITIALIZING_KERNEL...",
    "MOUNTING_VOLUMES [OK]",
    "LOADING_ASSETS... [DONE]",
    "CHECKING_PERMISSIONS... [ROOT]",
    "ESTABLISHING_SECURE_CONNECTION...",
    "SYNCING_CLOCKS... [0ms OFFSET]",
    "LOADING_NEURAL_ENGINE... [READY]",
    "SYSTEM_INTEGRITY_CHECK... [PASSED]",
    "BOOT_SEQUENCE_COMPLETE."
];

export const BootSection: React.FC<BootSectionProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { initAudio, playClick } = useSound();
  const [logs, setLogs] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [powerOn, setPowerOn] = useState(false);

  // Sequence Logic
  useEffect(() => {
    // 0. CRT Power On Effect
    setTimeout(() => setPowerOn(true), 200);

    let delay = 1000; // Wait for power on
    
    // 1. Process Logs
    BOOT_LOGS.forEach((log, i) => {
        delay += Math.random() * 200 + 50; // Faster, more realistic typing speed
        setTimeout(() => {
            setLogs(prev => [...prev, log]);
        }, delay);
    });

    // 2. Show Logo & Prompt
    setTimeout(() => {
        setIsBooted(true);
        setTimeout(() => {
             setShowPrompt(true);
        }, 800);
    }, delay + 600);

  }, []);

  const handleEnter = () => {
    initAudio();
    playClick();
    // Short delay for sound to register
    setTimeout(() => {
        onComplete();
    }, 300);
  };

  return (
    <div 
        onClick={handleEnter}
        className="h-screen w-full flex flex-col items-center justify-center relative bg-black cursor-pointer overflow-hidden"
    >
      {/* CRT Turn On Animation Wrapper */}
      <motion.div 
        initial={{ scaleY: 0.005, scaleX: 0, opacity: 0 }}
        animate={powerOn ? { scaleY: 1, scaleX: 1, opacity: 1 } : {}}
        transition={{ 
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1], // Cubic bezier for "snap" feel
            scaleX: { delay: 0.3, duration: 0.4 }
        }}
        className="w-full h-full relative flex flex-col items-center justify-center bg-bg-0"
      >
          {/* Background Matrix Rain (Simplified) */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

          <AnimatePresence mode="wait">
              {!isBooted ? (
                  // BIOS TERMINAL VIEW
                  <motion.div 
                     key="terminal"
                     exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                     transition={{ duration: 0.5 }}
                     className="w-full max-w-lg px-6 font-mono text-xs text-text-2 space-y-1 z-10"
                  >
                      {logs.map((log, i) => (
                          <div key={i} className="flex space-x-2">
                              <span className="text-line-1">{`[${(i * 0.042).toFixed(3)}]`}</span>
                              <span className={i === logs.length - 1 ? 'text-signal-lime' : 'text-text-1'}>{log}</span>
                          </div>
                      ))}
                      <div className="h-4 w-2 bg-signal-lime animate-pulse mt-2 shadow-[0_0_5px_var(--signal-lime)]"></div>
                  </motion.div>
              ) : (
                  // MAIN LOGO REVEAL
                  <motion.div 
                    key="logo"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center z-10"
                  >
                    <div className="relative group">
                        <motion.div 
                            className="text-8xl md:text-9xl font-bold tracking-tighter text-text-0 mb-6 relative z-10 mix-blend-difference"
                            animate={{ textShadow: ['0 0 0px #CCFF00', '0 0 15px #CCFF00', '0 0 0px #CCFF00'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Ø
                        </motion.div>
                        {/* Decorative Brackets */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-line-1 transition-all group-hover:border-signal-lime group-hover:-translate-x-1 group-hover:-translate-y-1"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-line-1 transition-all group-hover:border-signal-lime group-hover:translate-x-1 group-hover:translate-y-1"></div>
                        
                        {/* Subtle Glow Behind */}
                        <div className="absolute inset-0 bg-signal-lime opacity-5 blur-3xl rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] md:text-xs font-mono text-signal-lime tracking-[0.3em] uppercase opacity-80"
                      >
                        {t.boot.init}
                      </motion.div>
                      
                      {/* Interaction Prompt */}
                      <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: showPrompt ? 1 : 0 }}
                         className="mt-12"
                      >
                         <button className="relative overflow-hidden bg-signal-lime text-bg-0 font-mono text-xs font-bold px-8 py-3 group">
                            <span className="relative z-10">[ ENTER SYSTEM ]</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                         </button>
                      </motion.div>
                    </div>
                  </motion.div>
              )}
          </AnimatePresence>

          {/* Footer Version */}
          <div className="absolute bottom-8 text-[9px] font-mono text-line-1 opacity-50">
              SYS_VER_2.5.0_RC1
          </div>
      </motion.div>
    </div>
  );
};
