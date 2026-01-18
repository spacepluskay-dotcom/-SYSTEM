import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHero } from '../components/SystemUI';
import { useSound } from '../contexts/SoundContext';

const FounderIDCard = () => {
    // 3D Tilt Logic
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div 
            ref={cardRef}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ 
                perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full md:w-64 cursor-default"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="border border-line-1 bg-bg-1/80 backdrop-blur-md p-4 relative overflow-hidden group shadow-2xl shadow-black"
            >
                {/* Holographic Scan Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-signal-lime/50 shadow-[0_0_10px_var(--signal-lime)] animate-scanline pointer-events-none opacity-50 z-20"></div>
                
                {/* Glint Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-start border-b border-line-1 pb-3 mb-3 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-text-2">PERSONNEL_ID</span>
                        <span className="text-sm font-mono text-text-0 tracking-wider">ARCHITECT_KAY</span>
                    </div>
                    <div className="w-8 h-8 bg-bg-0 border border-line-1 flex items-center justify-center">
                        <span className="text-xs font-bold text-signal-lime">Ø</span>
                    </div>
                </div>

                {/* Data Fields */}
                <div className="space-y-3 font-mono text-[10px] relative z-10">
                    <div className="flex justify-between">
                        <span className="text-text-2">CLEARANCE</span>
                        <span className="text-signal-lime">LEVEL_5 (ROOT)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-2">STATUS</span>
                        <span className="text-text-0 animate-pulse">BUILDING...</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-2">DOMAIN</span>
                        <span className="text-text-0">SYSTEMS_ENG</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-2">LOCATION</span>
                        <span className="text-text-0">NETWORKED</span>
                    </div>
                </div>

                {/* Barcode Visual */}
                <div className="mt-4 pt-2 border-t border-line-1 opacity-60 relative z-10">
                    <div className="h-4 w-full flex items-end space-x-[1px]">
                        {Array.from({length: 40}).map((_, i) => (
                            <div key={i} className="bg-text-2" style={{ width: '2px', height: `${Math.random() * 100}%`}}></div>
                        ))}
                    </div>
                    <div className="text-[8px] text-center text-text-2 mt-1 tracking-[0.3em]">8804-9921-SYS</div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const DigitalSignature = () => (
    <div className="relative h-24 w-48 opacity-80">
        <svg viewBox="0 0 200 100" className="w-full h-full">
            <motion.path
                d="M20,80 C50,80 40,30 80,30 C100,30 90,60 120,60 C150,60 180,20 190,40"
                fill="none"
                stroke="var(--signal-lime)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
                d="M40,40 L160,40"
                fill="none"
                stroke="var(--line-1)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
            />
        </svg>
        <div className="absolute bottom-0 right-0 text-[8px] font-mono text-text-2">AUTHENTICATED</div>
    </div>
);

// Manifesto Block with Reading Guide
const ManifestoBlock: React.FC<{ block: any; index: number }> = ({ block, index }) => {
    const { playHover } = useSound();
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={playHover}
            className="relative group pl-8 md:pl-12"
        >
            {/* Timeline Line (Inactive) */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-line-0"></div>
            
            {/* Timeline Active (On Hover/View) */}
            <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                transition={{ duration: 0.8 }}
                className="absolute left-0 top-0 w-[1px] bg-signal-lime origin-top"
            />
            
            {/* Node */}
            <div className="absolute left-[-2px] top-3 w-[5px] h-[5px] bg-bg-0 border border-signal-lime rounded-full group-hover:bg-signal-lime transition-colors duration-300 z-10"></div>
            
            <p className="text-lg md:text-xl font-light leading-relaxed text-text-1 group-hover:text-text-0 transition-colors duration-500">
                <strong className="text-text-0 font-medium">{block.bold}</strong>
                {block.text}
            </p>
        </motion.div>
    );
};

export const FounderSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Right Column: ID Card - Shown first on Mobile but statically */}
        <div className="md:col-span-4 md:sticky md:top-32 flex flex-col items-center md:items-end order-1 md:order-2">
            <FounderIDCard />
            
            {/* Additional Meta Data */}
            <div className="mt-8 text-right hidden md:block">
                 <div className="type-mono-xs text-text-2 mb-2">LAST_LOGIN</div>
                 <div className="font-mono text-sm text-text-1">TODAY, 09:41 AM</div>
            </div>
        </div>

        {/* Left Column: Manifesto Content */}
        <div className="md:col-span-8 order-2 md:order-1">
            <SectionHero 
                label={t.founder.label} 
                title={t.founder.title} 
            />

            <div className="space-y-12 relative">
                {t.founder.content.map((block: any, i: number) => (
                    <ManifestoBlock key={i} block={block} index={i} />
                ))}
            </div>
            
            <div className="py-12 my-8 border-y border-line-0/50 backdrop-blur-sm bg-bg-1/10 -mx-6 px-6 md:mx-0 md:px-8 rounded-sm">
                <p className="text-2xl md:text-3xl text-text-0 italic font-serif leading-tight">
                    {t.founder.quote}
                </p>
            </div>

            {/* Signature Area */}
            <div className="mt-12 flex flex-col items-start">
                <DigitalSignature />
                <div className="mt-2 text-sm font-medium text-text-0">KAY</div>
                <div className="type-mono-xs text-text-2">{t.founder.role}</div>
            </div>
        </div>
      </div>
    </div>
  );
};
