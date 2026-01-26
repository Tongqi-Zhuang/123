let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playWoodSound = (volume: number = 1.0) => {
  const ctx = initAudio();
  if (!ctx) return;

  const t = ctx.currentTime;

  // Layer 1: Body Resonance
  const oscBody = ctx.createOscillator();
  const gainBody = ctx.createGain();
  
  oscBody.connect(gainBody);
  gainBody.connect(ctx.destination);

  oscBody.type = 'sine';
  oscBody.frequency.setValueAtTime(420, t); 
  oscBody.frequency.exponentialRampToValueAtTime(380, t + 0.1); 

  gainBody.gain.setValueAtTime(0, t);
  gainBody.gain.linearRampToValueAtTime(volume * 0.9, t + 0.005);
  gainBody.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

  oscBody.start(t);
  oscBody.stop(t + 0.2);

  // Layer 2: Click Transient
  const oscClick = ctx.createOscillator();
  const gainClick = ctx.createGain();

  oscClick.connect(gainClick);
  gainClick.connect(ctx.destination);

  oscClick.type = 'sine';
  oscClick.frequency.setValueAtTime(1200, t); 

  gainClick.gain.setValueAtTime(0, t);
  gainClick.gain.linearRampToValueAtTime(volume * 0.3, t + 0.002);
  gainClick.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

  oscClick.start(t);
  oscClick.stop(t + 0.03);
};