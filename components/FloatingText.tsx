import React, { useEffect } from 'react';

interface FloatingTextProps {
  x: number;
  y: number;
  text: string;
  onComplete: () => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ x, y, text, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute pointer-events-none font-black text-4xl animate-float-up z-50 whitespace-nowrap"
      style={{
        left: x,
        top: y,
        // 统一使用柔和米白色，整体更禅意
        color: '#FFF8E1',
        textShadow: `
          0px 0px 6px rgba(0,0,0,0.7),
          0px 2px 4px rgba(0,0,0,0.8),
          0px 4px 10px rgba(0,0,0,0.6)
        `,
        transform: 'translate(-50%, -100%)',
        fontFamily: '"Songti SC", "SimSun", serif',
        WebkitTextStroke: '1px rgba(0,0,0,0.35)', // 柔和描边，增强可读性
        filter: 'brightness(1.05)',
      }}
    >
      {text}
    </div>
  );
};