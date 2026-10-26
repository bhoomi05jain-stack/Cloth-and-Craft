// Web Audio API Synthesizer for Magical Sound FX
let audioCtx = null;
let soundEnabled = true;

export function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  localStorage.setItem('closet_craft_sound', enabled ? 'true' : 'false');
}

export function isSoundEnabled() {
  const saved = localStorage.getItem('closet_craft_sound');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
  return soundEnabled;
}

export function playSparkle() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  
  freqs.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.06);
    
    gain.gain.setValueAtTime(0, now + index * 0.06);
    gain.gain.linearRampToValueAtTime(0.08, now + index * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.35);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now + index * 0.06);
    osc.stop(now + index * 0.06 + 0.4);
  });
}

export function playPop() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
  
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(now);
  osc.stop(now + 0.09);
}

export function playDoorOpen() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  
  // Harmonic chime
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.1);
    
    gain.gain.setValueAtTime(0, now + idx * 0.1);
    gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.8);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now + idx * 0.1);
    osc.stop(now + idx * 0.1 + 0.9);
  });
}

export function playSuccess() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
    
    gain.gain.setValueAtTime(0, now + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.5);
  });
}
