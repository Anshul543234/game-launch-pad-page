// Sound effect utilities for the quiz game using Web Audio API

// Create audio context
let audioContext: AudioContext | null = null;

// Function to get or create audio context
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Function to play a tone
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  
  gainNode.gain.setValueAtTime(0.3, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration);
};

// Function to play sound effects
export const playSound = (isCorrect: boolean) => {
  // Resume audio context if it was suspended (needed for Chrome)
  const context = getAudioContext();
  if (context.state === 'suspended') {
    context.resume();
  }

  if (isCorrect) {
    // Play a pleasant ascending tone for correct answers
    playTone(523.25, 0.3); // C5
    setTimeout(() => playTone(659.25, 0.3), 100); // E5
    setTimeout(() => playTone(783.99, 0.3), 200); // G5
  } else {
    // Play a descending tone for incorrect answers
    playTone(783.99, 0.2); // G5
    setTimeout(() => playTone(659.25, 0.2), 100); // E5
    setTimeout(() => playTone(523.25, 0.2), 200); // C5
  }
}; 