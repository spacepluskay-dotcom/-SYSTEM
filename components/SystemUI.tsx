import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../contexts/SoundContext';

/**
 * Ø SYSTEM DIAGRAM STANDARDS (V2.0)
 * ---------------------------------
 * All engineering diagrams must adhere to the following checklist:
 * 
 * [ ] BASE: Monochrome only (Line-0, Line-1, Text-1).
 * [ ] SIGNAL: Single color highlight (Lime or Purple) for active states only.
 * [ ] LINES: Hairline (1px) stroke width. No variable widths.
 * [ ] SHAPES: Rectangles (sharp or sm-rounded) or Dots. No complex polygons.
 * [ ] CONNECTORS: Orthogonal or simple curves. No decorative arrowheads.
 * [ ] TYPE: Monospace (JetBrains Mono) for all labels.
 * [ ] NOISE: Zero decorative illustrations or metaphors.
 */

// --- Atomic UI Components ---

export const SystemShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen w-full bg-bg-0 text-text-0 font-sans overflow-x-hidden">
    {/* Background Layers */}
    <div className="fixed inset-0 bg-system-grid opacity-40 pointer-events-none z-0"></div>
    <div className="fixed inset-0 bg-gradient-to-b from-transparent via-bg-0/50 to-bg-0 pointer-events-none z-0"></div>
    <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0 bg-noise mix-blend-overlay"></div>
    {/* Vignette for focus */}
    <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-0"></div>
    <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
    
    {/* Content - Removed h-full constraint to allow scrolling */}
    <main className="relative z-10 w-full flex flex-col pb-dock-safe">
      {children}
    </main>
  </div>
);

// --- SCRAMBLE TEXT EFFECT ---
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!<>[]{}—=+*^?#";

export const ScrambleText: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let interval: any;
    let timeout: any;
    let iteration = 0;
    
    const startScramble = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 2; // Speed of decoding
      }, 30);
    };

    timeout = setTimeout(startScramble, delay * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text, delay]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
};

// --- RGB GLITCH HEADER ---
export const GlitchHeader: React.FC<{ text: string; size?: 'lg' | 'xl' }> = ({ text, size = 'xl' }) => {
    const { playHover } = useSound();
    
    return (
        <div 
            className={`relative group inline-block font-bold leading-[0.9] text-text-0 cursor-default select-none ${size === 'xl' ? 'type-h1' : 'text-3xl md:text-5xl'}`}
            onMouseEnter={playHover}
        >
            <span className="relative z-10">{text}</span>
            {/* Red Channel Shift */}
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-signal-red opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 mix-blend-screen animate-flicker">
                {text}
            </span>
            {/* Blue/Cyan Channel Shift */}
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-400 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 mix-blend-screen" style={{ animationDelay: '0.05s' }}>
                {text}
            </span>
        </div>
    );
};

export const SectionHero: React.FC<{ 
  label: string; 
  title: string; 
  description?: string;
  align?: 'left' | 'center';
}> = ({ label, title, description, align = 'left' }) => (
  <div className={`mb-12 md:mb-24 ${align === 'center' ? 'text-center flex flex-col items-center' : 'border-l-2 border-signal-lime pl-6'}`}>
    <div className="inline-block px-2 py-0.5 mb-4 border border-signal-purple/30 bg-signal-purple/10">
      <span className="font-mono text-[10px] text-signal-purple tracking-widest uppercase">
          <ScrambleText text={label} delay={0.2} />
      </span>
    </div>
    <div className="mb-6">
        <GlitchHeader text={title} />
    </div>
    {description && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className={`type-body max-w-2xl ${align === 'center' ? 'mx-auto' : ''} whitespace-pre-line`}
      >
        {description}
      </motion.p>
    )}
  </div>
);

export const SignalBadge: React.FC<{ text: string }> = ({ text }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-sm border border-signal-purple/40 text-signal-purple font-mono text-[10px] tracking-wider uppercase bg-signal-purple/5 space-x-2">
    <span>{text}</span>
    <span className="w-1.5 h-1.5 bg-signal-purple rounded-full animate-pulse shadow-[0_0_4px_var(--signal-purple)]"></span>
  </span>
);

export const DocBlock: React.FC<{ 
  number?: string; 
  title: string; 
  content: string; 
  delay?: number 
}> = ({ number, title, content, delay = 0 }) => {
  const { playHover } = useSound();
  
  return (
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
        onMouseEnter={playHover}
        className="group relative pl-6 border-l border-line-0 hover:border-signal-lime transition-colors duration-300 py-3 cursor-default"
      >
        {/* Animated Line Reveal */}
        <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-signal-lime scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-out"></div>
        
        <div className="flex items-baseline space-x-3 mb-2">
          {number && <span className="font-mono text-xs text-signal-lime opacity-50 group-hover:opacity-100 transition-opacity">{number}</span>}
          <h3 className="text-lg font-medium text-text-0 group-hover:text-white transition-colors">{title}</h3>
        </div>
        <p className="text-sm text-text-1 leading-relaxed font-light">{content}</p>
      </motion.div>
  );
};

export const SystemIndexList: React.FC<{
    items: { id: string; name: string; desc: string }[]
}> = ({ items }) => (
    <div className="space-y-4">
        {items.map((mod, idx) => (
            <DocBlock 
                key={mod.id} 
                number={mod.id} 
                title={mod.name} 
                content={mod.desc} 
                delay={idx * 0.1}
            />
        ))}
    </div>
);

export const DividerLine: React.FC = () => (
  <div className="w-full h-px bg-line-0 my-8"></div>
);
