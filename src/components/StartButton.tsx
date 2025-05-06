
import React from 'react';
import { Play } from 'lucide-react';

const StartButton = () => {
  return (
    <button 
      className="game-btn group flex items-center gap-2 animate-pulse-glow"
      onClick={() => console.log('Game started!')}
    >
      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Start Game</span>
    </button>
  );
};

export default StartButton;
