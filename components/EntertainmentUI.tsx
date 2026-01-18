import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../contexts/SoundContext';

// --- ENT PRIMITIVES ---

// 1. RhythmStrip: Real-time Audio Visualizer Simulation
// NOW REACTIVE: Accepts `intensity` (0-1) to change animation speed and height
export const RhythmStrip: React.FC<{ density?: 'low' | 'high'; intensity?: number }> = ({ density = 'high', intensity = 0.8 }) => {
  // Convert intensity to duration (higher intensity = faster)
  const durationBase = 1.0 - (intensity * 0.6); // 0.4s to 1.0s

  return (
    <div className="flex items-end space-x-[2px] h-6 opacity-80 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i} 
          className="w-[3px] bg-signal-purple"
          style={{
            height: '20%',
            animation: `equalizer ${durationBase + Math.random() * 0.2}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
      <style>{`
        @keyframes equalizer {
          0% { height: 10%; opacity: 0.3; }
          100% { height: ${density === 'high' ? '100%' : '50%'}; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// 2. PeakCurve: Visualizes Warmup -> Peak -> Afterglow
// NOW REACTIVE: Shape changes based on mode intensity
export const PeakCurve: React.FC<{ intensity?: number }> = ({ intensity = 0.5 }) => {
  // intensity 0.0 -> Flat curve
  // intensity 1.0 -> Sharp peak
  
  // Control point calculations based on intensity
  const peakY = 90 - (intensity * 80); // 10 to 90 (High intensity = low Y value = high peak)
  
  return (
    <div className="relative h-20 w-full border-b border-line-0 overflow-hidden bg-bg-0">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:10px_10px]"></div>

      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--signal-purple)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--signal-purple)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--signal-purple)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path 
          // Dynamic path based on intensity
          // M0,90 -> Start
          // C20,90 35,{peakY+20} 50,{peakY} -> Control points to Peak
          // C65,{peakY+20} 80,90 100,90 -> Control points to End
          animate={{ d: `M0,90 C20,90 35,${peakY+20} 50,${peakY} C65,${peakY+20} 80,90 100,90` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          fill="none" 
          stroke="url(#purpleGradient)" 
          strokeWidth="1.5"
        />
        {/* Area Fill */}
        <motion.path 
          animate={{ d: `M0,90 C20,90 35,${peakY+20} 50,${peakY} C65,${peakY+20} 80,90 100,90 L100,100 L0,100 Z` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          fill="var(--signal-purple)" 
          fillOpacity="0.1"
        />
      </svg>
      
      {/* Scanning Line - Speed depends on intensity */}
      <div 
        className="absolute top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_white] animate-[scanline_3s_linear_infinite]"
        style={{ animationDuration: `${4 - intensity * 2}s` }}
      ></div>

      {/* Labels */}
      <div className="absolute bottom-1 left-1 text-[8px] font-mono text-text-2 bg-bg-0 px-1">T_00:00</div>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-signal-purple bg-bg-0 px-1 border border-signal-purple/30 rounded-sm">
        INTENSITY: {(intensity * 100).toFixed(0)}%
      </div>
      <div className="absolute bottom-1 right-1 text-[8px] font-mono text-text-2 bg-bg-0 px-1">T_END</div>
    </div>
  );
};

// 3. FlowMeter: Density indicator (dots)
export const FlowMeter: React.FC<{ level: number }> = ({ level }) => (
  <div className="flex items-center space-x-1.5">
    {[1, 2, 3].map((step) => (
      <div 
        key={step} 
        className={`w-2 h-2 rounded-sm border border-line-1 transition-all duration-300 ${step <= level ? 'bg-signal-purple border-signal-purple shadow-[0_0_5px_var(--signal-purple)]' : 'bg-transparent'}`} 
      />
    ))}
  </div>
);

// 4. RitualNodes: Timeline nodes
export const RitualNodes: React.FC<{ intensity?: number }> = ({ intensity = 0.5 }) => {
  const nodes = ['TRIGGER', 'RITUAL', 'RELEASE'];
  const speed = 2.5 - (intensity * 1.5); // Faster when intense

  return (
    <div className="flex items-center justify-between w-full relative py-6">
      {/* Connector Line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-line-1 -z-10"></div>
      
      {nodes.map((node, i) => (
        <div key={i} className="flex flex-col items-center bg-bg-0 px-3 z-10">
          <motion.div 
            className="w-3 h-3 border border-signal-purple bg-bg-0 mb-2 rotate-45"
            animate={{ 
                borderColor: ['rgba(189,0,255,0.4)', 'rgba(189,0,255,1)', 'rgba(189,0,255,0.4)'],
                boxShadow: ['0 0 0px var(--signal-purple)', '0 0 8px var(--signal-purple)', '0 0 0px var(--signal-purple)'],
                scale: [1, 1.2, 1]
            }}
            transition={{ duration: speed, repeat: Infinity, delay: i * (speed/3) }}
          />
          <span className="text-[9px] font-mono text-text-1 tracking-wider bg-bg-1 px-1 border border-line-0">{node}</span>
        </div>
      ))}
    </div>
  );
};

// 5. SocialGravityMap: Simple concentric field
export const SocialGravityMap: React.FC<{ strength?: 'weak' | 'strong' }> = ({ strength = 'strong' }) => {
    const duration = strength === 'strong' ? '1.5s' : '4s';
    
    return (
      <div className="relative w-16 h-16 flex items-center justify-center border border-line-0 rounded-full bg-bg-1/50">
        <div className="absolute inset-2 border border-line-1 rounded-full opacity-50"></div>
        <div className="absolute inset-5 bg-signal-purple/10 border border-signal-purple/30 rounded-full animate-pulse-slow"></div>
        <div className="w-1.5 h-1.5 bg-signal-purple rounded-full shadow-[0_0_5px_var(--signal-purple)]"></div>
        
        {/* Orbiting particle */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: duration }}>
            <div className="w-1 h-1 bg-text-2 rounded-full absolute top-1 left-1/2"></div>
        </div>
      </div>
    );
};

// 6. ExperiencePipeline: Box-flow diagram
export const ExperiencePipeline: React.FC = () => (
  <div className="grid grid-cols-4 gap-2 w-full font-mono text-[9px] text-center min-w-[300px]">
    {['INGRESS', 'IMMERSION', 'CLIMAX', 'EGRESS'].map((stage, i) => (
      <div key={i} className="relative border border-line-1 py-3 text-text-1 bg-bg-1/50 hover:bg-signal-purple/10 hover:border-signal-purple/50 transition-colors cursor-default">
        {stage}
        {i < 3 && (
           <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-line-1 text-[8px] z-10">►</div>
        )}
      </div>
    ))}
  </div>
);

// --- CONSOLE PRIMITIVES ---

// 7. VariableMonitor: Display-only system variable slider/toggle with "Jitter" effect
export const VariableMonitor: React.FC<{ 
    label: string; 
    value?: string; 
    levels?: string[];
    activeLevelIndex?: number;
    intensity?: number; // 0 to 1
}> = ({ label, value, levels, activeLevelIndex = 1, intensity = 0.6 }) => {
    
    // Simulate live data jitter for the bar width
    const [jitterIntensity, setJitterIntensity] = useState(intensity);

    useEffect(() => {
        if (levels) return; // Don't jitter categorical data
        const interval = setInterval(() => {
            const noise = (Math.random() - 0.5) * 0.1; // +/- 5%
            setJitterIntensity(Math.max(0, Math.min(1, intensity + noise)));
        }, 200);
        return () => clearInterval(interval);
    }, [intensity, levels]);

    return (
        <div className="flex flex-col space-y-2 group">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-mono text-text-2 uppercase tracking-wider group-hover:text-text-1 transition-colors">{label}</span>
                {value && <span className="text-[10px] font-mono text-signal-purple tabular-nums">{value}</span>}
            </div>
            
            {/* Toggle/Segmented Display */}
            {levels ? (
                <div className="flex w-full bg-bg-0 border border-line-1 h-5 rounded-sm overflow-hidden">
                    {levels.map((lvl, i) => (
                        <div 
                            key={i} 
                            className={`flex-1 flex items-center justify-center text-[8px] font-mono border-r last:border-r-0 border-line-1 transition-all duration-300
                            ${i === activeLevelIndex ? 'bg-signal-purple text-bg-0 font-bold' : 'text-text-2 bg-bg-1/50'}`}
                        >
                            {lvl}
                        </div>
                    ))}
                </div>
            ) : (
                // Live Range Bar
                <div className="w-full h-1.5 bg-bg-1 border border-line-0 relative overflow-hidden rounded-sm">
                     <div 
                        className="absolute left-0 top-0 h-full bg-signal-purple transition-all duration-200 ease-linear shadow-[0_0_5px_var(--signal-purple)]" 
                        style={{ width: `${jitterIntensity * 100}%` }}
                     ></div>
                </div>
            )}
        </div>
    );
};

// 8. ModeSelector: Visual Tab Switch
export const ModeSelector: React.FC<{
    modes: string[];
    activeMode: number;
    onSelect: (index: number) => void;
}> = ({ modes, activeMode, onSelect }) => {
    const { playClick, playHover } = useSound();
    
    return (
        <div className="flex flex-col space-y-1 w-full">
            {modes.map((mode, i) => (
                <button
                    key={i}
                    onClick={() => { playClick(); onSelect(i); }}
                    onMouseEnter={playHover}
                    className={`relative w-full text-left px-4 py-3 text-[10px] font-mono tracking-wider transition-all duration-300 border
                    ${i === activeMode 
                        ? 'bg-signal-purple/[0.05] border-signal-purple text-signal-purple' 
                        : 'bg-bg-0 border-line-1 text-text-2 hover:border-text-2'}`}
                >
                    <div className="flex justify-between items-center">
                        <span>{mode}</span>
                        {i === activeMode && <span className="animate-pulse">●</span>}
                    </div>
                    {/* Progress Bar visual for active state */}
                    {i === activeMode && (
                        <motion.div 
                            layoutId="mode-active-bar"
                            className="absolute bottom-0 left-0 h-[2px] bg-signal-purple"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
};

// --- COMMERCIAL PRIMITIVES ---

// 9. EngagementCard: Engagement Model Block
export const EngagementCard: React.FC<{
  type: string;
  title: string;
  desc: string;
  fit: string;
}> = ({ type, title, desc, fit }) => {
    const { playHover } = useSound();
    
    return (
      <div 
        onMouseEnter={playHover}
        className="border border-line-1 p-6 hover:border-signal-lime/50 transition-all duration-300 group bg-bg-1/20 flex flex-col h-full hover:bg-bg-1/40 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-signal-lime rounded-full"></div>
        </div>

        <div className="flex justify-between items-start mb-4">
          <span className={`font-mono text-[9px] px-2 py-0.5 border ${
            type === 'BUILD' ? 'border-signal-lime text-signal-lime bg-signal-lime/5' : 
            type === 'RUN' ? 'border-signal-purple text-signal-purple bg-signal-purple/5' : 
            'border-text-1 text-text-1'
          } rounded-sm`}>{type}</span>
        </div>
        <h3 className="text-lg font-medium text-text-0 mb-2 group-hover:text-white">{title}</h3>
        <p className="text-xs text-text-2 font-mono mb-6 flex-grow leading-relaxed">{desc}</p>
        <div className="pt-4 border-t border-line-1/50">
          <span className="text-[9px] text-text-1 uppercase tracking-wider block mb-1">BEST_FOR:</span>
          <span className="text-[10px] text-text-0 bg-bg-0 px-2 py-1 inline-block border border-line-0">{fit}</span>
        </div>
      </div>
    );
};

// 10. ProjectTypeRow: Commercial Application Grid Row
export const ProjectTypeRow: React.FC<{
    moduleCode: string;
    title: string;
    types: string[];
    output: string;
}> = ({ moduleCode, title, types, output }) => {
    const { playHover } = useSound();
    
    return (
        <div 
            onMouseEnter={playHover}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 md:py-6 border-b border-line-0 hover:bg-white/[0.02] transition-colors items-start md:items-center group"
        >
            <div className="md:col-span-3 flex items-center space-x-3 mb-2 md:mb-0">
                <span className="font-mono text-xs text-signal-purple bg-signal-purple/10 px-1">{moduleCode}</span>
                <span className="text-sm font-medium text-text-1 group-hover:text-text-0 transition-colors">{title}</span>
            </div>
            
            {/* Mobile: Wrap types nicely */}
            <div className="md:col-span-5 flex flex-wrap gap-2 mb-2 md:mb-0 pl-8 md:pl-0">
                {types.map((t, i) => (
                    <span key={i} className="text-[10px] font-mono border border-line-1 px-2 py-1 text-text-2 rounded-sm bg-bg-0 opacity-80 group-hover:opacity-100">
                        {t}
                    </span>
                ))}
            </div>
            
            {/* Mobile: Align output to bottom/right logic */}
            <div className="md:col-span-4 flex items-center justify-start md:justify-end pl-8 md:pl-0">
                 <div className="flex items-center space-x-2">
                    <span className="md:hidden text-[9px] text-text-2 uppercase">OUT:</span>
                    <span className="text-xs text-text-2 font-mono text-right md:border-l border-line-1 md:pl-4">{output}</span>
                 </div>
            </div>
        </div>
    );
};
