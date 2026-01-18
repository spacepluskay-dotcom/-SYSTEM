import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import { SectionHero, DividerLine } from '../components/SystemUI';

// --- INTERACTIVE LOGIC GATE COMPONENT ---
const LogicGate: React.FC<{ block: any; index: number }> = ({ block, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { playHover, playActivate } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => {
        setIsHovered(true);
        playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
          setIsHovered(!isHovered); // Toggle for mobile
          playActivate();
      }}
      className="group relative grid grid-cols-1 md:grid-cols-12 gap-6 p-6 border border-line-0 hover:border-signal-lime/50 bg-bg-1/20 transition-all duration-500 rounded-sm z-10"
    >
      {/* Bus Connector (Left) */}
      <div className="absolute top-8 -left-4 w-4 h-[1px] bg-line-1 md:block hidden"></div>
      <div className="absolute top-8 -left-[5px] w-1.5 h-1.5 rounded-full bg-bg-0 border border-line-1 z-20 md:block hidden group-hover:border-signal-lime group-hover:bg-signal-lime transition-colors"></div>

      {/* Active State Background Highlight */}
      <div className={`absolute inset-0 bg-signal-lime/[0.02] transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Left: Text Content */}
      <div className="md:col-span-7 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center space-x-3 mb-3">
             <span className="font-mono text-xs text-signal-lime px-1.5 py-0.5 border border-signal-lime/30 bg-signal-lime/10">
                0{index + 1}
             </span>
             <h3 className="text-xl font-medium text-text-0 group-hover:text-white transition-colors">
                {block.title}
             </h3>
          </div>
          <p className="text-sm text-text-1 leading-relaxed font-light mb-6 border-l border-line-1 pl-4 group-hover:border-signal-lime/50 transition-colors duration-500">
             {block.content}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line-1/50">
            <div>
                <span className="type-mono-xs text-text-2 block mb-1">USAGE_PROTOCOL</span>
                <span className="text-[10px] font-mono text-signal-lime block">✓ {block.usage.apply}</span>
                <span className="text-[10px] font-mono text-text-2 block opacity-60">× {block.usage.avoid}</span>
            </div>
            <div>
                <span className="type-mono-xs text-signal-red opacity-70 block mb-1">FAILURE_MODE</span>
                <span className="text-[10px] font-mono text-text-1">{block.failure}</span>
            </div>
        </div>
      </div>

      {/* Right: Logic Visualization (SVG) */}
      <div className="md:col-span-5 relative h-32 md:h-auto min-h-[140px] flex items-center justify-center bg-bg-0 border border-line-1/50 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:10px_10px]"></div>
        
        {/* The Circuit - Higher Precision 0.5px stroke */}
        <svg className="w-full h-full p-4" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
            {/* Input Traces */}
            <path d="M0,40 L40,40 L40,50 L60,50" stroke="var(--line-1)" strokeWidth="0.5" fill="none" />
            <path d="M0,60 L40,60 L40,50" stroke="var(--line-1)" strokeWidth="0.5" fill="none" />

            {/* The Gate Box */}
            <rect x="60" y="30" width="80" height="40" fill="var(--bg-1)" stroke={isHovered ? "var(--signal-lime)" : "var(--line-1)"} strokeWidth="0.5" className="transition-colors duration-300" />
            
            {/* Internal Circuitry within Gate */}
            <path d="M70,50 L80,50 L85,45 L105,45 L110,50 L130,50" stroke={isHovered ? "var(--signal-lime)" : "var(--line-1)"} strokeWidth="0.5" fill="none" opacity={0.5} />
            <circle cx="100" cy="50" r="15" stroke="var(--line-1)" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />

            <text x="100" y="78" textAnchor="middle" fontSize="6" fill={isHovered ? "var(--signal-lime)" : "var(--text-2)"} fontFamily="JetBrains Mono" className="transition-colors duration-300">
                LOGIC_GATE_0{index + 1}
            </text>

            {/* Output Line */}
            <line x1="140" y1="50" x2="200" y2="50" stroke="var(--line-1)" strokeWidth="0.5" />

            {/* Animated Particles */}
            <AnimatePresence>
                {isHovered && (
                    <>
                        {/* Input Particles */}
                        <motion.circle 
                            r="1" 
                            fill="var(--text-1)"
                            initial={{ cx: 0, cy: 40, opacity: 0 }}
                            animate={{ cx: 60, cy: 50, opacity: 1 }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                        />
                         <motion.circle 
                            r="1" 
                            fill="var(--text-1)"
                            initial={{ cx: 0, cy: 60, opacity: 0 }}
                            animate={{ cx: 60, cy: 50, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Processing Ring Spin */}
                        <motion.circle 
                            cx="100" cy="50" r="12"
                            stroke="var(--signal-lime)" strokeWidth="1"
                            fill="none"
                            strokeDasharray="10 20"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Output Particle (Success Color) */}
                        <motion.circle 
                            r="1.5" 
                            fill="var(--signal-lime)"
                            initial={{ cx: 140, cy: 50, opacity: 0 }}
                            animate={{ cx: 200, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2, repeat: Infinity, ease: "linear" }}
                        />
                    </>
                )}
            </AnimatePresence>
        </svg>

        {/* Status Label */}
        <div className="absolute top-2 right-2">
            <span className={`text-[8px] font-mono transition-colors border border-current px-1 rounded-sm ${isHovered ? 'text-signal-lime border-signal-lime' : 'text-text-2 border-line-1'}`}>
                {isHovered ? 'ACTIVE' : 'IDLE'}
            </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- MANIFESTO TERMINAL COMPONENT ---
const ManifestoTerminal: React.FC<{ label: string; items: string[] }> = ({ label, items }) => {
    return (
        <div className="mt-24 w-full max-w-2xl mx-auto">
            <div className="bg-[#080808] border border-line-1 rounded-sm overflow-hidden font-mono text-sm relative group">
                {/* Header Bar */}
                <div className="bg-bg-1 border-b border-line-1 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-line-1"></div>
                        <span className="text-[10px] text-text-2 uppercase tracking-wider">{label}</span>
                    </div>
                    <span className="text-[10px] text-text-2">SYS_LOG_V2.0</span>
                </div>
                
                {/* Content Area */}
                <div className="p-6 space-y-4 text-text-1">
                    {items.map((line, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="flex space-x-3"
                        >
                            <span className="text-line-1 select-none shrink-0">{`[00:0${i}:2${i*3}]`}</span>
                            <span className="text-text-0/90 hover:text-signal-lime transition-colors duration-300">
                                <span className="text-signal-lime mr-2">›</span>
                                {line.replace('> ', '')}
                            </span>
                        </motion.div>
                    ))}
                    
                    {/* Blinking Cursor */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex space-x-3"
                    >
                         <span className="text-line-1 select-none">{`[00:0${items.length}:45]`}</span>
                         <span className="animate-pulse text-signal-lime">_</span>
                    </motion.div>
                </div>
                
                {/* Decoration Corner */}
                <div className="absolute bottom-0 right-0 p-2 opacity-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 4V20H4" strokeWidth="1"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export const EngineeringSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <SectionHero 
          label={t.engineering.label} 
          title={t.engineering.title} 
          description={t.engineering.lede}
        />

        {/* Data Bus Line Container */}
        <div className="relative">
            {/* The Main Bus Line */}
            <div className="absolute top-0 bottom-0 left-[-24px] w-[1px] bg-line-1 hidden md:block"></div>
            {/* Bus Header */}
            <div className="absolute -top-6 left-[-32px] font-mono text-[9px] text-line-1 -rotate-90 origin-bottom-left hidden md:block">DATA_BUS_A</div>

            <div className="grid grid-cols-1 gap-6 md:gap-8">
            {t.engineering.blocks.map((block: any, i: number) => (
                <LogicGate key={i} block={block} index={i} />
            ))}
            </div>
        </div>

        <ManifestoTerminal 
            label={t.engineering.manifesto.label} 
            items={t.engineering.manifesto.items} 
        />
        
      </motion.div>
    </div>
  );
};
