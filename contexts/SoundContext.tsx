import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

interface SoundContextType {
  playHover: () => void;
  playClick: () => void;
  playActivate: () => void;
  playBoot: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  initAudio: () => void;
  audioReady: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);

  // Initialize Audio Context (Must be triggered by user interaction)
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Gain (Volume Control)
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.1; // Default low volume
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    startAmbientDrone(ctx, masterGain);
    setAudioReady(true);
  };

  const toggleMute = () => {
    if (!audioCtxRef.current) {
        initAudio();
        return;
    }
    
    if (isMuted) {
        audioCtxRef.current.resume();
        setIsMuted(false);
        // Fade in
        if (masterGainRef.current) {
            masterGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
            masterGainRef.current.gain.linearRampToValueAtTime(0.1, audioCtxRef.current.currentTime + 0.5);
        }
    } else {
        setIsMuted(true);
        // Fade out
        if (masterGainRef.current) {
            masterGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
        }
        setTimeout(() => {
             if(isMuted) audioCtxRef.current?.suspend();
        }, 500);
    }
  };

  // --- SYNTHESIZERS ---

  // 1. Ambient Drone (Low frequency hum + Pink Noise)
  const startAmbientDrone = (ctx: AudioContext, dest: AudioNode) => {
    // Low sine layer
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 50; // Deep hum
    
    const gain = ctx.createGain();
    gain.gain.value = 0.05;
    
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    droneOscRef.current = osc;

    // We could add noise here, but let's keep it minimal for performance
  };

  // 2. Hover Sound (Short, high tick)
  const playHover = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.02);
    
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(masterGainRef.current!);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  // 3. Click Sound (Percussive low blip)
  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(masterGainRef.current!);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  // 4. Activate/Module Switch (Digital Chime)
  const playActivate = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const now = ctx.currentTime;
    
    // Arpeggio
    [400, 600, 1000].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.05, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);
        
        osc.connect(gain);
        gain.connect(masterGainRef.current!);
        
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.25);
    });
  };

  // 5. Boot Sequence (Rise)
  const playBoot = () => {
      // Audio might not be ready during boot if user hasn't interacted.
      // We'll skip this logic for now as browsers block auto-play.
      // Instead, we will bind initAudio to the first click on the boot screen.
  };

  return (
    <SoundContext.Provider value={{ 
        playHover, 
        playClick, 
        playActivate, 
        playBoot, 
        isMuted, 
        toggleMute, 
        initAudio,
        audioReady 
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) throw new Error('useSound must be used within a SoundProvider');
  return context;
};
