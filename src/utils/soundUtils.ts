const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

let backgroundMusic: OscillatorNode | null = null;
let backgroundGain: GainNode | null = null;
let isMuted = false;

export const loadMuteState = (): boolean => {
  const saved = localStorage.getItem("tic-tac-toe-muted");
  return saved === "true";
};

export const saveMuteState = (muted: boolean) => {
  localStorage.setItem("tic-tac-toe-muted", muted.toString());
  isMuted = muted;
  if (muted && backgroundGain) {
    backgroundGain.gain.setValueAtTime(0, audioContext!.currentTime);
  } else if (!muted && backgroundGain) {
    backgroundGain.gain.setValueAtTime(0.05, audioContext!.currentTime);
  }
};

export const playClickSound = () => {
  if (!audioContext || isMuted) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const playHoverSound = () => {
  if (!audioContext || isMuted) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 600;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
};

export const playWinSound = () => {
  if (!audioContext || isMuted) return;
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
  
  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    const startTime = audioContext.currentTime + (index * 0.12);
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
};

export const playDrawSound = () => {
  if (!audioContext || isMuted) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 300;
  oscillator.type = 'triangle';
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

export const startBackgroundMusic = () => {
  if (!audioContext || isMuted || backgroundMusic) return;
  
  backgroundMusic = audioContext.createOscillator();
  backgroundGain = audioContext.createGain();
  
  backgroundMusic.connect(backgroundGain);
  backgroundGain.connect(audioContext.destination);
  
  backgroundMusic.frequency.value = 220; // A3
  backgroundMusic.type = 'sine';
  
  backgroundGain.gain.setValueAtTime(isMuted ? 0 : 0.05, audioContext.currentTime);
  
  backgroundMusic.start(audioContext.currentTime);
};

export const stopBackgroundMusic = () => {
  if (backgroundMusic && audioContext) {
    backgroundMusic.stop(audioContext.currentTime);
    backgroundMusic = null;
    backgroundGain = null;
  }
};

// Initialize mute state
if (typeof window !== 'undefined') {
  isMuted = loadMuteState();
}
