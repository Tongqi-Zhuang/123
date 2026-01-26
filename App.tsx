import React, { useState, useEffect, useCallback } from 'react';
import type { MeritPopup } from './types';
import { WOOD_TEXTURE_URL, COLORS, POPUP_TEXTS, FUFU_IMAGE_URL } from './constants';
import { FloatingText } from './components/FloatingText';
import { playWoodSound, initAudio } from './sound';

const IconSpeakerOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const IconSpeakerOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

export default function App() {
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('merit_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [popups, setPopups] = useState<MeritPopup[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    localStorage.setItem('merit_count', count.toString());
  }, [count]);

  useEffect(() => {
    initAudio();
  }, []);

  const triggerSound = useCallback(() => {
    if (!isMuted) {
      playWoodSound();
    }
  }, [isMuted]);

  const triggerVibration = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, []);

  const handleTap = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    triggerSound();
    triggerVibration();
    setCount(prev => prev + 1);

    const randomText = POPUP_TEXTS[Math.floor(Math.random() * POPUP_TEXTS.length)];
    const newPopup: MeritPopup = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY - 60,
      text: randomText,
    };
    setPopups(prev => [...prev, newPopup]);

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

  }, [triggerSound, triggerVibration]);

  const removePopup = useCallback((id: number) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-between py-12 ${COLORS.bgBase}`}
    >
      <div className="absolute inset-0 bg-[#E6DCC3] z-0" />
      <div 
        className="absolute inset-0 z-0 opacity-80 mix-blend-multiply"
        style={{
          backgroundImage: `url(${WOOD_TEXTURE_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(1.1) brightness(1.05)',
        }}
      />
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(62,39,35,0.1) 80%, rgba(62,39,35,0.3) 100%)'
        }}
      />
      
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={toggleMute}
          className={`p-3 rounded-full bg-[#EFEBE9]/80 backdrop-blur-md border border-[#D7CCC8] shadow-sm ${COLORS.icon} active:scale-95 transition-all hover:bg-white`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <IconSpeakerOff /> : <IconSpeakerOn />}
        </button>
      </div>

      <div className="relative flex flex-col items-center z-10 select-none mt-8">
        <h2 className={`text-xl font-serif font-bold opacity-80 mb-2 ${COLORS.text} drop-shadow-sm`}>当前功德</h2>
        <div className={`text-6xl font-serif font-black tracking-widest ${COLORS.text} transition-all duration-300 drop-shadow-md`}>
          {count.toLocaleString()}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full z-10">
        <div
          onPointerDown={handleTap}
          className={`
            relative cursor-pointer select-none touch-none
            transition-transform duration-100 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
            ${isPressed ? 'scale-95' : 'scale-100 active:scale-95'}
          `}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-[#3E2723]/30 rounded-full blur-2xl transform translate-y-8 scale-90 transition-transform duration-300"></div>
            
            <img 
              src={FUFU_IMAGE_URL} 
              alt="Fufu Wooden Fish" 
              className="w-64 h-64 object-cover object-center rounded-3xl shadow-2xl bg-[#EFEBE9] border-[6px] border-[#D7CCC8] relative z-10"
              draggable="false"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      <div className={`relative text-sm opacity-80 mb-10 ${COLORS.text} font-serif font-bold z-10 tracking-[0.2em] drop-shadow-sm`}>
        — 敲Fu头，积功德，净心灵 —
      </div>

      {popups.map(popup => (
        <FloatingText 
          key={popup.id} 
          x={popup.x} 
          y={popup.y} 
          text={popup.text}
          onComplete={() => removePopup(popup.id)} 
        />
      ))}

    </div>
  );
}
