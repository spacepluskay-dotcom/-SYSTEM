
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useSound } from '../contexts/SoundContext';

export const ArtifactBlade: React.FC<{ item: any; index: number }> = ({ item, index }) => {
  const { playHover, playActivate } = useSound();
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <motion.a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => { setIsHovered(true); playHover(); }}
        onClick={playActivate}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="block relative bg-bg-1/40 border border-line-1 hover:border-signal-lime/50 transition-all duration-500 overflow-hidden"
      >
        {/* Project Type Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-line-0 bg-bg-1/60">
           <span className="font-mono text-[9px] text-text-2 uppercase tracking-widest">{item.id} // {item.type}</span>
           <div className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-signal-lime shadow-[0_0_8px_var(--signal-lime)]' : 'bg-line-1'} transition-all`}></div>
        </div>

        {/* Preview Area / Monitor Look */}
        <div className="relative aspect-video bg-black overflow-hidden transition-colors">
            {/* Project Snapshot with System Overlays */}
            <div className={`absolute inset-0 transition-all duration-700 ${isHovered ? 'scale-105 saturate-100 grayscale-0 opacity-100' : 'scale-100 saturate-50 grayscale opacity-40'}`}>
                {item.screenshot ? (
                  <img 
                    src={item.screenshot} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--signal-lime)_0%,transparent_70%)] opacity-20"></div>
                )}
            </div>

            {/* Scanning Overlay (Always visible) */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="scanlines absolute inset-0 opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
            {/* Tech Tags Overlay */}
            <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                {item.tech.map((t: string, i: number) => (
                    <span key={i} className="text-[8px] font-mono border border-line-1 bg-bg-0/90 px-1.5 py-0.5 text-text-2 group-hover:text-signal-lime group-hover:border-signal-lime/30 transition-colors">
                        {t}
                    </span>
                ))}
            </div>

            {/* Visual Center Decoration (Only shows when not hovered) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                 <div className="w-12 h-12 border border-line-1 rounded-full flex items-center justify-center opacity-40">
                    <span className="text-xl font-bold text-text-0">Ø</span>
                 </div>
            </div>
        </div>

        {/* Info Area */}
        <div className="p-6 relative">
            <h3 className="text-xl font-medium text-text-0 mb-2 group-hover:text-signal-lime transition-colors">{item.name}</h3>
            <p className="text-xs text-text-2 font-mono leading-relaxed mb-6 h-12 line-clamp-3">
                {item.desc}
            </p>
            
            <div className="flex justify-between items-center pt-4 border-t border-line-0">
                <span className="text-[9px] font-mono text-line-1 group-hover:text-text-1">PROTOCOL: SECURE_H5</span>
                <span className="text-[10px] font-mono text-signal-lime opacity-0 group-hover:opacity-100 transition-opacity">
                    LINK_START_↗
                </span>
            </div>
        </div>

        {/* Glitch Overlay (Active only on hover) */}
        {isHovered && (
            <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-noise mix-blend-overlay"></div>
        )}
      </motion.a>
    </motion.div>
  );
};
