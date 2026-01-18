
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHero } from '../components/SystemUI';
import { ArtifactBlade } from '../components/ProjectUI';

export const ProjectSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-32 pb-48">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Block */}
        <SectionHero 
          label={t.projects.label} 
          title={t.projects.title} 
          description={t.projects.lede}
        />

        {/* Artifact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {t.projects.items.map((item: any, i: number) => (
            <ArtifactBlade key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Technical Footer */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="mt-24 pt-12 border-t border-line-0 flex flex-col md:flex-row justify-between items-center font-mono text-[9px] text-text-2 space-y-4 md:space-y-0"
        >
            <div className="flex space-x-8">
                <span>LATENCY: OPTIMIZED</span>
                <span>AVAILABILITY: 99.9%</span>
                <span>ENCRYPTION: AES-256</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-signal-lime rounded-full animate-pulse"></span>
                <span>ALL_NODES_OPERATIONAL</span>
            </div>
        </motion.div>

      </div>
    </div>
  );
};
