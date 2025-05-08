
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Timer as TimerIcon } from "lucide-react";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressPercentage = (timeLeft / initialTime) * 100;
  
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp && onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [initialTime, onTimeUp, isPaused]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-purple-700">
          <TimerIcon className="h-5 w-5" />
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="text-sm text-purple-600 hover:text-purple-800"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      <Progress 
        value={progressPercentage} 
        className={`h-2 ${
          progressPercentage > 50 ? 'bg-gray-200' : 
          progressPercentage > 20 ? 'bg-orange-100' : 'bg-red-100'
        }`} 
      />
    </div>
  );
};

export default Timer;
