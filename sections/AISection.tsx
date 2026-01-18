import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHero } from '../components/SystemUI';
import { useSound } from '../contexts/SoundContext';

// --- 3D MATH ENGINE ---
interface Point3D { x: number; y: number; z: number; id: number; }
interface Point2D { x: number; y: number; }

const project = (p: Point3D, w: number, h: number, scale: number): Point2D => {
    const fov = 300;
    const factor = fov / (fov + p.z);
    return {
        x: p.x * factor * scale + w / 2,
        y: p.y * factor * scale + h / 2
    };
};

const rotateY = (p: Point3D, angle: number): Point3D => ({
    x: p.x * Math.cos(angle) + p.z * Math.sin(angle),
    y: p.y,
    z: -p.x * Math.sin(angle) + p.z * Math.cos(angle),
    id: p.id
});

const rotateX = (p: Point3D, angle: number): Point3D => ({
    x: p.x,
    y: p.y * Math.cos(angle) - p.z * Math.sin(angle),
    z: p.y * Math.sin(angle) + p.z * Math.cos(angle),
    id: p.id
});

// Fibonacci Sphere Algorithm
const generateSpherePoints = (n: number): Point3D[] => {
    const points: Point3D[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < n; i++) {
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / n);
        points.push({
            x: Math.cos(theta) * Math.sin(phi),
            y: Math.sin(theta) * Math.sin(phi),
            z: Math.cos(phi),
            id: i
        });
    }
    return points;
};

const NeuralCloud3D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
    
    // Interactive Refs
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetRotRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    w: containerRef.current.clientWidth,
                    h: containerRef.current.clientHeight
                });
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if(rect) {
            mouseRef.current = {
                x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
                y: ((e.clientY - rect.top) / rect.height) * 2 - 1
            };
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.w === 0) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.w * dpr;
        canvas.height = dimensions.h * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${dimensions.w}px`;
        canvas.style.height = `${dimensions.h}px`;

        // Points
        const points = generateSpherePoints(90); // Slightly more points
        let angleY = 0;
        let angleX = 0;
        const baseScale = dimensions.w < 768 ? 100 : 140;

        // Connections
        const connectionDist = 0.55; 

        let animationFrameId: number;
        let pulseFrame = 0;

        const render = () => {
            ctx.clearRect(0, 0, dimensions.w, dimensions.h);
            pulseFrame += 0.05;
            
            // Interaction Physics
            targetRotRef.current.y += 0.002;
            angleY += (targetRotRef.current.y + mouseRef.current.x * 0.5 - angleY) * 0.1;
            angleX += (mouseRef.current.y * 0.5 - angleX) * 0.1;

            // Transform
            const transformedPoints = points.map(p => {
                let tp = rotateY(p, angleY);
                tp = rotateX(tp, angleX);
                return tp;
            });

            // Draw Connections
            ctx.lineWidth = 0.5;
            for(let i=0; i<transformedPoints.length; i++) {
                for(let j=i+1; j<transformedPoints.length; j++) {
                    const p1 = transformedPoints[i];
                    const p2 = transformedPoints[j];
                    
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dz = p1.z - p2.z;
                    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                    if (dist < connectionDist) {
                        const opacity = 1 - (dist / connectionDist);
                        if (p1.z > -0.5 && p2.z > -0.5) {
                            const proj1 = project(p1, dimensions.w, dimensions.h, baseScale);
                            const proj2 = project(p2, dimensions.w, dimensions.h, baseScale);
                            
                            // Pulse Effect on lines
                            const pulse = (Math.sin(pulseFrame + i) + 1) / 2;
                            
                            ctx.strokeStyle = `rgba(204, 255, 0, ${opacity * 0.2 + (pulse * 0.1)})`;
                            ctx.beginPath();
                            ctx.moveTo(proj1.x, proj1.y);
                            ctx.lineTo(proj2.x, proj2.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            // Draw Points
            transformedPoints.forEach((p, i) => {
                const proj = project(p, dimensions.w, dimensions.h, baseScale);
                const alpha = (p.z + 1) / 2;
                const size = Math.max(0.5, (p.z + 1.5) * 1.5);

                ctx.fillStyle = '#FFFFFF';
                
                // Random active neurons firing
                // Using a sine wave based on ID + global time to create "traveling" signals
                const signalWave = Math.sin(pulseFrame * 2 + p.id * 0.2);
                if (signalWave > 0.9) {
                     ctx.fillStyle = '#CCFF00';
                     // Add glow for active neurons
                     ctx.shadowBlur = 5;
                     ctx.shadowColor = '#CCFF00';
                } else {
                     ctx.shadowBlur = 0;
                }

                ctx.globalAlpha = Math.max(0.1, alpha);
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0; // Reset
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions]);

    return (
        <div 
            ref={containerRef} 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { mouseRef.current = {x: 0, y: 0} }}
            className="w-full h-64 md:h-96 relative bg-bg-1/20 border border-line-1/50 overflow-hidden mb-12 group cursor-crosshair"
        >
            <div className="absolute top-2 left-2 text-[10px] font-mono text-signal-lime z-20">FIG_3.0: NEURAL_CLOUD_3D</div>
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-spotlight opacity-30 group-hover:opacity-60 transition-opacity duration-1000"></div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <canvas ref={canvasRef} className="block w-full h-full relative z-10" />
            
            {/* Scanning Line Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-signal-lime/5 to-transparent -translate-y-full animate-[scanline_4s_linear_infinite] pointer-events-none"></div>
            
            {/* Data Stream Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-bg-0 to-transparent pointer-events-none z-20"></div>
        </div>
    );
};

const DataStreamLog: React.FC = () => {
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
        const vocab = ['INGEST', 'PARSE', 'TOKENIZE', 'VECTORIZE', 'OPTIMIZE', 'DEPLOY', 'SYNC'];
        const interval = setInterval(() => {
            const action = vocab[Math.floor(Math.random() * vocab.length)];
            const id = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            const latency = Math.floor(Math.random() * 50) + 'ms';
            const newLine = `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] SYS_CORE: ${action}_BATCH_${id} ... ${latency}`;
            
            setLines(prev => [newLine, ...prev].slice(0, 5));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono text-[9px] text-text-2 space-y-1 h-20 overflow-hidden border-l border-line-0 pl-3">
            {lines.map((line, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1 - i * 0.2, x: 0 }}
                >
                    {line}
                </motion.div>
            ))}
        </div>
    );
};

// New "Server Blade" Component for Modules
const AIModuleBlade: React.FC<{ item: any; index: number }> = ({ item, index }) => {
    const { playHover } = useSound();
    
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={playHover}
            className="group relative bg-bg-1/10 border border-line-0 overflow-hidden hover:bg-bg-1/30 transition-all duration-300 h-full p-8"
        >
            {/* Processing Bar (Top) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-line-1/30">
                <div className="h-full bg-signal-lime w-0 group-hover:w-full transition-all duration-[2s] ease-in-out"></div>
            </div>

            <div className="flex justify-between items-start mb-6">
               <h3 className="text-lg font-bold text-text-0 group-hover:text-signal-lime transition-colors">{item.name}</h3>
               <div className="flex flex-col items-end">
                  <span className="type-mono-xs text-line-1 group-hover:text-text-2">AI_MOD_0{index+1}</span>
                  <span className="type-mono-xs text-signal-lime opacity-0 group-hover:opacity-100 transition-opacity animate-pulse">ACTIVE</span>
               </div>
            </div>
            
            <p className="text-sm text-text-1 leading-relaxed relative z-10">{item.desc}</p>

            {/* Decorative Background Code */}
            <div className="absolute bottom-2 right-4 text-[8px] font-mono text-text-2/20 pointer-events-none group-hover:text-text-2/40 transition-colors">
                 {`{ id: "${item.name.substring(0,3).toUpperCase()}_${index}", status: "IDLE" }`}
            </div>
            
            {/* Corner Bracket */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-line-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>
    );
};

export const AISection: React.FC = () => {
  const { t } = useLanguage();

  // Duplicate items for infinite scroll effect
  const tickerItems = [...(t.ai.real_time_inputs?.items || []), ...(t.ai.real_time_inputs?.items || [])];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto flex flex-col items-center overflow-x-hidden">
      <SectionHero 
        label={t.ai.label} 
        title={t.ai.title} 
        description={t.ai.lede}
        align="center"
      />

      {/* Real-time Inputs Ticker (Animated) */}
      <div className="w-full max-w-4xl mb-12 border-y border-line-1/30 bg-bg-1/20 py-3 flex items-center overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg-0 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg-0 to-transparent z-10"></div>
          
          <div className="flex-shrink-0 mr-4 pl-4 z-20 bg-bg-0 md:bg-transparent">
              <span className="type-mono-xs text-signal-purple animate-pulse-slow whitespace-nowrap">● {t.ai.real_time_inputs?.label}:</span>
          </div>
          
          <div className="flex overflow-hidden w-full mask-linear">
             <motion.div 
                className="flex space-x-8 whitespace-nowrap"
                animate={{ x: [0, -500] }}
                transition={{ 
                    repeat: Infinity, 
                    duration: 20, 
                    ease: "linear" 
                }}
             >
                {tickerItems.map((item: string, i: number) => (
                  <span key={i} className="type-mono-xs text-text-2 font-mono uppercase tracking-widest">
                    {item} <span className="text-line-1 ml-4">///</span>
                  </span>
                ))}
             </motion.div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full max-w-5xl mb-24">
          {/* Left: Visualization */}
          <div className="md:col-span-7">
              <NeuralCloud3D />
              <div className="flex justify-between items-end">
                  <div className="flex space-x-4">
                     <div className="text-center">
                        <div className="text-xl font-medium text-text-0">1.2s</div>
                        <div className="type-mono-xs text-text-2">LATENCY</div>
                     </div>
                     <div className="text-center">
                        <div className="text-xl font-medium text-text-0">99.8%</div>
                        <div className="type-mono-xs text-text-2">UPTIME</div>
                     </div>
                  </div>
                  <DataStreamLog />
              </div>
          </div>

          {/* Right: Abstract Steps */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-6">
             {[t.ai.process.input, t.ai.process.core, t.ai.process.output].map((step: any, i: number) => (
               <div key={i} className="border-l border-line-1 pl-4 py-2 hover:border-signal-lime transition-colors group">
                  <h3 className="font-mono text-xs text-signal-lime mb-1 tracking-wider group-hover:text-white transition-colors">0{i+1}__{step.title}</h3>
                  <p className="text-xs text-text-2 leading-relaxed whitespace-pre-line">{step.desc}</p>
               </div>
             ))}
          </div>
      </div>

      {/* Modules Grid - Upgraded to Server Blades */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-px bg-line-0 border border-line-0">
        {t.ai.modules.map((item: any, i: number) => (
            <AIModuleBlade key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
};
