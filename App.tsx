
import React, { useState } from 'react';
import { ModuleType } from './types';
import { Layout } from './components/Layout';
import { SystemNav } from './components/SystemNav';
import { BootSection } from './sections/BootSection';
import { SystemSection } from './sections/SystemSection';
import { EngineeringSection } from './sections/EngineeringSection';
import { EntertainmentSection } from './sections/EntertainmentSection';
import { AISection } from './sections/AISection';
import { ProjectSection } from './sections/ProjectSection';
import { FounderSection } from './sections/FounderSection';
import { WorkSection } from './sections/WorkSection';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { SoundProvider } from './contexts/SoundContext';
import { CustomCursor } from './components/CustomCursor';

const AppContent: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.BOOT);

  const handleBootComplete = () => {
    setCurrentModule(ModuleType.SYSTEM);
  };

  const renderModule = () => {
    switch (currentModule) {
      case ModuleType.BOOT:
        return <BootSection onComplete={handleBootComplete} />;
      case ModuleType.SYSTEM:
        return <SystemSection />;
      case ModuleType.ENGINEERING:
        return <EngineeringSection />;
      case ModuleType.ENTERTAINMENT:
        return <EntertainmentSection />;
      case ModuleType.AI:
        return <AISection />;
      case ModuleType.PROJECTS:
        return <ProjectSection />;
      case ModuleType.FOUNDER:
        return <FounderSection />;
      case ModuleType.WORK:
        return <WorkSection />;
      default:
        return <SystemSection />;
    }
  };

  return (
    <Layout>
      <CustomCursor />
      
      {currentModule !== ModuleType.BOOT && (
        <SystemNav currentModule={currentModule} onNavigate={setCurrentModule} />
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentModule}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(2px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(2px)' }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="w-full min-h-screen"
        >
          {renderModule()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SoundProvider>
        <AppContent />
      </SoundProvider>
    </LanguageProvider>
  );
};

export default App;
