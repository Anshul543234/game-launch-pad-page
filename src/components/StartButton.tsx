
import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StartButton = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/question');
  };

  return (
    <button 
      className="game-btn group flex items-center gap-2 animate-pulse-glow"
      onClick={handleStartGame}
    >
      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Start Game</span>
    </button>
  );
};

export default StartButton;
