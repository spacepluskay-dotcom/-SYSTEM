import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHero, SignalBadge } from '../components/SystemUI';
import { 
    RhythmStrip, 
    PeakCurve, 
    FlowMeter, 
    RitualNodes, 
    ExperiencePipeline, 
    SocialGravityMap,
    VariableMonitor,
    ModeSelector,
    EngagementCard,
    ProjectTypeRow
} from '../components/EntertainmentUI';

// Mode Configuration Logic
// Returns global dashboard parameters based on active mode
const getModeConfig = (modeIdx: number) => {
    // Mode 0: Club (High Energy, High Density)
    // Mode 1: Festival (Mid Energy, High Density, High Ritual)
    // Mode 2: Launch (Low/Mid Energy, Controlled Density)
    
    if (modeIdx === 0) return { globalIntensity: 0.9, bpmRange: "128-132", densityLevel: 2 };
    if (modeIdx === 1) return { globalIntensity: 0.7, bpmRange: "124-128", densityLevel: 2 };
    return { globalIntensity: 0.4, bpmRange: "90-110", densityLevel: 1 };
};

// Variable specific tuning based on mode
const getVariableState = (modeIdx: number, varIdx: number) => {
    // Var 0: BPM, 1: Density, 2: Gravity, 3: Ritual
    let level = 1;
    let intensity = 0.5;

    if (modeIdx === 0) { // CLUB
        if (varIdx === 0) intensity = 0.9;
        if (varIdx === 1) level = 2; // High
        if (varIdx === 2) level = 2; // Strong
        if (varIdx === 3) level = 1; // Std
    } else if (modeIdx === 1) { // FESTIVAL
        if (varIdx === 0) intensity = 0.7;
        if (varIdx === 1) level = 2; // High
        if (varIdx === 2) level = 1; // Bal
        if (varIdx === 3) level = 2; // Ext
    } else { // LAUNCH
        if (varIdx === 0) intensity = 0.4;
        if (varIdx === 1) level = 1; // Mid
        if (varIdx === 2) level = 2; // Strong
        if (varIdx === 3) level = 0; // Soft
    }
    return { level, intensity };
};

export const EntertainmentSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState(0);
  
  // Calculate derived values for visualizations
  const { globalIntensity } = getModeConfig(activeMode);

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Layer 1: Definition */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16">
           <div className="md:flex-1">
             <SectionHero 
                label={t.entertainment.label} 
                title={t.entertainment.title} 
                description={t.entertainment.lede}
             />
           </div>
           {/* Formula Block - Positioned relative to hero on desktop */}
           <div className="mb-12 md:mb-24 w-full md:w-auto md:ml-12">
              <div className="glass-panel px-6 py-4 border-l-2 border-signal-purple bg-signal-purple/[0.02]">
                 <span className="font-mono text-xs text-signal-purple tracking-widest block mb-2">{t.entertainment.formula}</span>
                 {t.entertainment.formula_annotation && (
                    <span className="font-mono text-[9px] text-text-2 tracking-wide block border-t border-line-1/30 pt-2 mt-2">
                        {t.entertainment.formula_annotation}
                    </span>
                 )}
              </div>
           </div>
        </div>

        {/* Layer 2: Console (Variables & Modes) */}
        <div className="mb-24 border-y border-line-0 bg-bg-1/30">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 p-6 md:p-8 items-start md:items-center">
                <div className="md:col-span-3 flex flex-col space-y-4 mb-8 md:mb-0 w-full">
                    <span className="type-mono-xs text-text-2">{t.entertainment.console.label}</span>
                    <ModeSelector 
                        modes={t.entertainment.console.modes} 
                        activeMode={activeMode}
                        onSelect={setActiveMode}
                    />
                </div>
                
                {/* Variable Monitors */}
                <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {/* Map through variables from context */}
                    {t.entertainment.console.variables.map((v: any, i: number) => {
                         const { level, intensity } = getVariableState(activeMode, i);

                        return (
                            <VariableMonitor 
                                key={i}
                                label={v.name}
                                levels={v.levels}
                                value={v.min ? `${v.min}-${v.max}` : undefined}
                                activeLevelIndex={level}
                                intensity={intensity}
                            />
                        )
                    })}
                </div>
            </div>
        </div>

        {/* Layer 3: Experience Stack (Reactive to Mode) */}
        <div className="mb-24 space-y-8">
           <div className="flex items-center space-x-4 mb-4">
              <span className="type-mono-xs text-text-2">{t.entertainment.pipeline_label}</span>
              <div className="h-px flex-1 bg-line-0"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-8 overflow-x-auto no-scrollbar pb-2">
                 {/* Experience Pipeline - Static structure */}
                 <div className="min-w-[300px]">
                    <ExperiencePipeline />
                 </div>
                 {/* Ritual Nodes - Reactive speed */}
                 <div className="min-w-[300px]">
                    <RitualNodes intensity={globalIntensity} />
                 </div>
              </div>
              <div className="md:col-span-4 h-full flex flex-col justify-end">
                 <div className="bg-bg-1/50 border border-line-1 p-4 rounded-sm hover:border-signal-purple/30 transition-colors duration-500">
                    <div className="type-mono-xs text-text-2 mb-4 flex justify-between">
                       <span>ENERGY_CURVE</span>
                       <span className="text-signal-purple">OPTIMAL</span>
                    </div>
                    {/* Peak Curve - Reactive shape */}
                    <PeakCurve intensity={globalIntensity} />
                 </div>
              </div>
           </div>
        </div>

        {/* Layer 4: Modules */}
        <div className="w-full mb-24">
          {t.entertainment.sections.map((section: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="border-t border-transparent relative group transition-all duration-300 py-12"
            >
              {/* Top Border Line (Default) */}
              <div className="absolute top-0 left-0 w-full h-px bg-line-0 group-hover:bg-signal-purple/50 transition-colors duration-500"></div>
              
              {/* Hover Background & Outline Effect */}
              <div className="absolute inset-0 -mx-4 px-4 sm:-mx-6 sm:px-6 -my-2 py-2 border border-transparent group-hover:border-signal-purple/20 group-hover:bg-white/[0.02] transition-all duration-300 pointer-events-none rounded-sm"></div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
                
                {/* Left: ID + Title + Objective */}
                <div className="md:col-span-4 flex flex-col items-start space-y-3">
                   <SignalBadge text={section.code} />
                   <h2 className="text-2xl font-medium text-text-0 group-hover:text-signal-purple transition-colors duration-300">{section.title}</h2>
                   <div className="mt-2 text-sm text-text-1 font-mono pl-2 border-l border-line-1">
                      <span className="text-[10px] text-text-2 block uppercase mb-1">OBJECTIVE:</span>
                      {section.objective}
                   </div>
                </div>

                {/* Middle: Controlled Variables List */}
                <div className="md:col-span-4 flex flex-col space-y-4 pr-8">
                   <span className="type-mono-xs text-text-2 mb-2">CONTROL_VARS:</span>
                   <div className="space-y-2">
                     {section.controlled_variables.map((v: string, i: number) => (
                       <div key={i} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-signal-purple rounded-full"></div>
                          <span className="text-xs font-mono text-text-1">{v}</span>
                       </div>
                     ))}
                   </div>

                   {/* Stack Mapping */}
                   {section.stack_map && (
                       <div className="mt-4 pt-4 border-t border-line-0 border-dashed">
                           <span className="type-mono-xs text-text-2 block mb-1">STACK_MAP:</span>
                           <span className="text-[10px] font-mono text-signal-purple">{section.stack_map}</span>
                       </div>
                   )}
                </div>

                {/* Right: Description & Primitive Metric */}
                <div className="md:col-span-4 flex flex-col justify-between h-full">
                  <p className="type-body text-text-1 leading-relaxed group-hover:text-text-0 transition-colors duration-500 mb-8">
                    {section.desc}
                  </p>
                  
                  {/* Visual Primitive */}
                  <div className="bg-bg-0 border border-line-0 p-4">
                     {section.metrics && section.metrics.slice(0, 1).map((metric: any, mIdx: number) => (
                        <div key={mIdx} className="flex flex-col space-y-2">
                           <span className="type-mono-xs text-text-2">{metric.label}</span>
                           {metric.type === 'rhythm' && <RhythmStrip density={metric.value === 'high' ? 'high' : 'low'} intensity={globalIntensity} />}
                           {metric.type === 'flow' && <FlowMeter level={metric.value} />}
                           {metric.type === 'gravity' && <SocialGravityMap strength={metric.value === 'high' ? 'strong' : 'weak'} />}
                        </div>
                     ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
          <div className="w-full h-px bg-line-0"></div>
        </div>

        {/* Layer 5: Commercial Binding Layer */}
        <div className="mb-24 pt-12">
            <div className="flex flex-col items-center mb-16">
                <span className="font-mono text-[10px] text-text-2 border border-text-2/30 px-2 py-1 mb-4">
                    {t.entertainment.commercial.label}
                </span>
                <h2 className="text-3xl md:text-4xl font-medium text-text-0 text-center mb-6">
                    {t.entertainment.commercial.title}
                </h2>
                <p className="text-text-1 text-center max-w-xl text-lg font-light">
                    {t.entertainment.commercial.lede}
                </p>
            </div>

            {/* Matrix Grid - Optimized for Mobile */}
            <div className="mb-24">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-line-0 mb-4 opacity-50">
                    <div className="col-span-3 text-[10px] font-mono text-text-2">{t.entertainment.commercial.matrix_header.module}</div>
                    <div className="col-span-5 text-[10px] font-mono text-text-2">{t.entertainment.commercial.matrix_header.types}</div>
                    <div className="col-span-4 text-[10px] font-mono text-text-2 text-right">{t.entertainment.commercial.matrix_header.output}</div>
                </div>
                <div className="flex flex-col space-y-6 md:space-y-0">
                    {t.entertainment.commercial.matrix.map((item: any, i: number) => (
                        <ProjectTypeRow 
                            key={i}
                            moduleCode={item.id}
                            title={item.title}
                            types={item.types}
                            output={item.output}
                        />
                    ))}
                </div>
            </div>

            {/* Engagement Models */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.entertainment.commercial.models.map((model: any, i: number) => (
                    <EngagementCard 
                        key={i}
                        type={model.type}
                        title={model.title}
                        desc={model.desc}
                        fit={model.fit}
                    />
                ))}
            </div>
        </div>
        
        {/* Footer Note */}
        <div className="pb-12 text-center opacity-70">
            <p className="type-mono-xs text-text-2 whitespace-pre-line tracking-wider leading-relaxed">
                {t.entertainment.footer_note}
            </p>
        </div>

      </div>
    </div>
  );
};
