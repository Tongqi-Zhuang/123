// AudioContext singleton to prevent garbage collection issues
let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playWoodSound = (volume: number = 1.0) => {
  const ctx = initAudio();
  if (!ctx) return;

  const t = ctx.currentTime;

  // Oscillator for the "tok" sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Sound Shaping: High pitched sine wave with short decay
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.1); // Slight pitch drop

  // Envelope: Sharp attack, quick decay
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

  osc.start(t);
  osc.stop(t + 0.15);
};