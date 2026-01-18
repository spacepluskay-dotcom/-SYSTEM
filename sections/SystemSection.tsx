import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { SectionHero, DocBlock } from '../components/SystemUI';

// --- NATIVE 3D VECTOR ENGINE ---

// 3D Math Helpers
interface Point3D { x: number; y: number; z: number; }
interface Point2D { x: number; y: number; }

const project = (p: Point3D, w: number, h: number, scale: number): Point2D => {
    // Simple Perspective Projection
    const fov = 300;
    const factor = fov / (fov + p.z);
    return {
        x: p.x * factor * scale + w / 2,
        y: p.y * factor * scale + h / 2
    };
};

const rotateX = (p: Point3D, angle: number): Point3D => ({
    x: p.x,
    y: p.y * Math.cos(angle) - p.z * Math.sin(angle),
    z: p.y * Math.sin(angle) + p.z * Math.cos(angle)
});

const rotateY = (p: Point3D, angle: number): Point3D => ({
    x: p.x * Math.cos(angle) + p.z * Math.sin(angle),
    y: p.y,
    z: -p.x * Math.sin(angle) + p.z * Math.cos(angle)
});

// Icosahedron Geometry Generator
const getIcosahedron = () => {
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const vertices: Point3D[] = [
        { x: -1, y: t, z: 0 }, { x: 1, y: t, z: 0 }, { x: -1, y: -t, z: 0 }, { x: 1, y: -t, z: 0 },
        { x: 0, y: -1, z: t }, { x: 0, y: 1, z: t }, { x: 0, y: -1, z: -t }, { x: 0, y: 1, z: -t },
        { x: t, y: 0, z: -1 }, { x: t, y: 0, z: 1 }, { x: -t, y: 0, z: -1 }, { x: -t, y: 0, z: 1 }
    ].map(v => {
        // Normalize to radius 1
        const len = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
        return { x: v.x/len, y: v.y/len, z: v.z/len };
    });

    // Edges (Indices)
    const edges: [number, number][] = [
        [0, 11], [0, 5], [0, 1], [0, 7], [0, 10], [1, 5], [1, 9], [1, 8], [1, 7], 
        [2, 11], [2, 10], [2, 6], [2, 3], [2, 4], [3, 4], [3, 9], [3, 8], [3, 6],
        [4, 11], [4, 5], [4, 9], [5, 11], [6, 10], [6, 7], [6, 8], [7, 10], [8, 9],
        [5, 9], [4, 9], [9, 8], [8, 7], [7, 6], [6, 2], [2, 3], [3, 4], [4, 5], // Connectors
        [10,11], [3,9] // Additional structure lines
    ];

    return { vertices, edges };
};

const SystemTopology3D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
    
    // Interactive State
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetRotationRef = useRef({ x: 0, y: 0 });

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
            // Normalize mouse from -1 to 1
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

        // High DPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.w * dpr;
        canvas.height = dimensions.h * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${dimensions.w}px`;
        canvas.style.height = `${dimensions.h}px`;

        // Geometry
        const { vertices: initialVertices, edges } = getIcosahedron();
        
        // Config
        const isMobile = dimensions.w < 768;
        const baseScale = isMobile ? 80 : 120;
        let angleX = 0;
        let angleY = 0;
        
        // Colors
        const COLOR_NODE = '#FFFFFF';
        const COLOR_EDGE = 'rgba(255, 255, 255, 0.15)';
        const COLOR_CORE = '#CCFF00'; // Lime

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, dimensions.w, dimensions.h);
            
            // Interaction Physics (Lerp towards target)
            // Base rotation + Mouse influence
            targetRotationRef.current.y += 0.003; // Constant spin
            
            // Lerp current angle towards mouse position for parallax feel
            // We mix the automatic rotation with the mouse offset
            angleY += (targetRotationRef.current.y + mouseRef.current.x * 0.5 - angleY) * 0.1;
            angleX += (mouseRef.current.y * 0.5 - angleX) * 0.1;

            // Transform & Project
            // Logic: Create a copy of vertices, transform them
            const projectedPoints: Point2D[] = initialVertices.map(v => {
                let p = rotateY(v, angleY);
                p = rotateX(p, angleX);
                return project(p, dimensions.w, dimensions.h, baseScale);
            });

            // Calculate transformed Z for depth sorting later (simple painter's algo approximation)
            const transformedVertices = initialVertices.map(v => {
                let p = rotateY(v, angleY);
                p = rotateX(p, angleX);
                return p;
            });

            // Draw Core Glow (Center)
            const center = { x: dimensions.w / 2, y: dimensions.h / 2 };
            const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, baseScale * 1.5);
            gradient.addColorStop(0, 'rgba(204, 255, 0, 0.08)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(center.x, center.y, baseScale * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Draw Edges
            ctx.strokeStyle = COLOR_EDGE;
            ctx.lineWidth = 1;
            edges.forEach(([i, j]) => {
                const p1 = projectedPoints[i];
                const p2 = projectedPoints[j];
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            });

            // Draw Nodes
            projectedPoints.forEach((p, i) => {
                // Depth cueing
                const v = transformedVertices[i];
                const alpha = (v.z + 1.5) / 3; // Normalize z approx -1 to 1
                const size = Math.max(1, (v.z + 2) * (isMobile ? 1.5 : 2));

                ctx.fillStyle = i % 5 === 0 ? COLOR_CORE : COLOR_NODE;
                ctx.globalAlpha = Math.max(0.2, Math.min(1, alpha));
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();

                // Special Core Nodes with Rings
                if (i % 5 === 0) {
                    ctx.strokeStyle = COLOR_CORE;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, size + 4, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });
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
            className="w-full h-full absolute inset-0 group cursor-crosshair"
        >
            <canvas ref={canvasRef} className="block w-full h-full relative z-10" />
            
            {/* Metric overlay */}
            <div className="absolute bottom-4 right-4 text-right pointer-events-none z-20 hidden md:block opacity-60">
                 <div className="type-mono-xs text-text-2">GEOMETRY: ICOSAHEDRON</div>
                 <div className="type-mono-xs text-text-2">VERTICES: 12 / EDGES: 30</div>
            </div>
        </div>
    );
};

export const SystemSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <SectionHero 
          label={t.system.label} 
          title={t.system.title} 
          description={t.system.lede}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Right Column (Visual) - Appears first on Mobile for impact */}
        <div className="md:col-span-7 relative h-[300px] md:h-[500px] order-1 md:order-2 bg-bg-1/20 border border-line-0 rounded-sm overflow-hidden mb-8 md:mb-0">
             {/* Header */}
            <div className="absolute top-0 left-0 p-4 border-b border-r border-line-1/30 z-10 bg-bg-0/50 backdrop-blur-sm">
                <span className="type-mono-xs text-signal-lime">SYS_STRUCTURE_V3.0</span>
            </div>
            {/* Spotlight Backglow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-spotlight opacity-50 pointer-events-none"></div>
            {/* Grid Background Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

             <SystemTopology3D />
        </div>

        {/* Left Column: Index */}
        <div className="md:col-span-5 space-y-4 relative order-2 md:order-1">
          <div className="type-mono-xs text-signal-lime mb-4 pl-6">{t.system.index_title}</div>
          
          {/* Vertical Guide Line */}
          <div className="absolute left-[3px] top-8 bottom-0 w-[1px] bg-gradient-to-b from-signal-lime/50 to-transparent"></div>

          <div className="space-y-4">
            {t.system.modules.map((mod: any, idx: number) => (
                <div key={mod.id} className="relative">
                    <DocBlock 
                        number={mod.id} 
                        title={mod.name} 
                        content={mod.desc} 
                        delay={idx * 0.1}
                    />
                    {/* ENT Signal Strip Injection */}
                    {mod.signal && (
                        <div className="absolute top-4 right-2 pointer-events-none hidden md:block">
                            <span className="font-mono text-[9px] text-signal-purple bg-signal-purple/10 px-2 py-0.5 rounded-sm opacity-60 border border-signal-purple/20">
                                {mod.signal}
                            </span>
                        </div>
                    )}
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
