import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use springs for smooth but tight movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target or parent is clickable
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer');

      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [isVisible, mouseX, mouseY]);

  // Mobile check - don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return null;
  }

  return (
    <>
      {/* Main Precision Crosshair */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* The Crosshair SVG */}
        <motion.div
            animate={{ 
                scale: isHovering ? 1.5 : 1,
                rotate: isHovering ? 45 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full h-full flex items-center justify-center"
        >
            {/* Horizontal Line */}
            <div className="absolute w-full h-[1px] bg-white"></div>
            {/* Vertical Line */}
            <div className="absolute h-full w-[1px] bg-white"></div>
            
            {/* Center Dot (Only visible when hovering) */}
            {isHovering && (
                <div className="absolute w-1 h-1 bg-white rounded-full"></div>
            )}
        </motion.div>
        
        {/* Outer Ring for Hover */}
        <motion.div 
            className="absolute border border-white rounded-full"
            animate={{ 
                width: isHovering ? 40 : 0,
                height: isHovering ? 40 : 0,
                opacity: isHovering ? 0.5 : 0
            }}
            transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
};
