
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
}

const QuizProgress = ({ currentQuestionIndex, totalQuestions, score }: QuizProgressProps) => {
  const progress = totalQuestions ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-purple-600">
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Score: {score}
          </Badge>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizProgress;
