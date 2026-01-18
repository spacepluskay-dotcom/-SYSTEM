
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import { SectionHero } from '../components/SystemUI';

const ProtocolGate: React.FC<{ ctaLabel: string }> = ({ ctaLabel }) => {
    const [status, setStatus] = useState<'IDLE' | 'VERIFYING' | 'GRANTED'>('IDLE');
    const { playActivate, playClick } = useSound();

    const handleInitiate = () => {
        if (status !== 'IDLE') return;
        playClick();
        setStatus('VERIFYING');
        
        // Simulate verification delay
        setTimeout(() => {
            playActivate();
            setStatus('GRANTED');
        }, 2000);
    };

    return (
        <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
                {status === 'IDLE' && (
                    <motion.button
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleInitiate}
                        className="group flex items-center space-x-6 cursor-pointer outline-none text-left"
                    >
                        <div className="h-12 px-8 bg-text-0 text-bg-0 flex items-center justify-center font-bold tracking-wide group-hover:bg-signal-lime transition-colors">
                            {ctaLabel}
                        </div>
                        <span className="font-mono text-signal-lime opacity-0 group-hover:opacity-100 transition-opacity">
                            [ PRESS_ENTER ]
                        </span>
                    </motion.button>
                )}

                {status === 'VERIFYING' && (
                    <motion.div
                        key="verifying"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-12 flex items-center space-x-3"
                    >
                         <div className="w-4 h-4 border-2 border-signal-lime border-t-transparent rounded-full animate-spin"></div>
                         <span className="font-mono text-xs text-signal-lime animate-pulse">VERIFYING_PROTOCOL...</span>
                    </motion.div>
                )}

                {status === 'GRANTED' && (
                    <motion.div
                        key="granted"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-signal-lime/50 bg-signal-lime/5 p-6 rounded-sm w-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-xs text-signal-lime">ACCESS_GRANTED</span>
                            <div className="w-2 h-2 bg-signal-lime rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-4">
                             <p className="text-sm text-text-1">Secure channel open. Direct all encrypted inquiries to:</p>
                             <a 
                                href="mailto:osystem.ai@gmail.com" 
                                className="block text-lg md:text-xl font-mono text-text-0 hover:text-signal-lime transition-colors border-b border-line-1 pb-1 hover:border-signal-lime break-all md:break-normal"
                             >
                                osystem.ai@gmail.com
                             </a>
                             <div className="text-[10px] font-mono text-text-2 pt-2">
                                REF_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                             </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// New Diagnostic List Component
const DiagnosticList: React.FC<{ 
    label: string; 
    items: string[]; 
    type: 'positive' | 'negative' 
}> = ({ label, items, type }) => {
    const colorClass = type === 'positive' ? 'text-signal-lime' : 'text-signal-red';
    const borderClass = type === 'positive' ? 'border-signal-lime' : 'border-signal-red';
    
    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <div className={`w-2 h-2 ${type === 'positive' ? 'bg-signal-lime' : 'bg-signal-red'} rounded-full animate-pulse`}></div>
                <h2 className={`type-mono-xs ${colorClass} px-2 py-1 bg-white/[0.03] border ${borderClass}/30`}>
                    {label}
                </h2>
            </div>
            
            {/* Items */}
            <ul className="space-y-4 pl-1">
              {items.map((item, i) => (
                <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-start text-sm group cursor-default"
                >
                  <span className={`font-mono mr-4 opacity-70 ${colorClass}`}>
                      {type === 'positive' ? '[MATCH]' : '[ALERT]'}
                  </span>
                  <span className={`transition-colors ${type === 'positive' ? 'text-text-1 group-hover:text-text-0' : 'text-text-2 group-hover:text-text-1'}`}>
                      {item}
                  </span>
                </motion.li>
              ))}
            </ul>
        </div>
    );
};

export const WorkSection: React.FC = () => {
  const { t } = useLanguage();
  const { playHover } = useSound();

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <SectionHero 
            label={t.work.label} 
            title={t.work.title} 
            description={t.work.lede}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24 border-t border-b border-line-1/30 py-12 bg-bg-1/10">
          <DiagnosticList 
            label={t.work.targets.label} 
            items={t.work.targets.items} 
            type="positive"
          />
          <DiagnosticList 
            label={t.work.anti_targets.label} 
            items={t.work.anti_targets.items} 
            type="negative"
          />
        </div>

        {/* CTA Area */}
        <div className="flex flex-col items-start">
            <ProtocolGate ctaLabel={t.work.cta} />
          
            <div className="mt-8 flex flex-col space-y-4 pl-3 border-l-2 border-line-1">
                <div className="type-mono-xs text-text-2">
                    {t.work.meta}
                </div>
                
                <a 
                  href="https://www.instagram.com/osystemofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={playHover}
                  className="type-mono-xs text-text-1 hover:text-signal-lime transition-colors flex items-center space-x-2 group w-fit"
                >
                   <span className="text-signal-purple opacity-70 group-hover:opacity-100">●</span>
                   <span className="border-b border-transparent group-hover:border-signal-lime">OFFICIAL_INSTAGRAM_FEED</span>
                   <span className="opacity-50">↗</span>
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};
