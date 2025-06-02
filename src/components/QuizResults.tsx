
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  isSaving: boolean;
}

const QuizResults = ({ score, totalQuestions, onRestart, isSaving }: QuizResultsProps) => {
  const percentage = Math.floor((score / (totalQuestions * 10)) * 100);
  const correctAnswers = Math.floor(score / 10);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-lg mb-6">
        Your score: <span className="font-bold text-purple-600">{percentage}%</span>
        <br />
        <span className="text-sm text-gray-600">
          ({correctAnswers} out of {totalQuestions} correct)
        </span>
      </p>
      <div className="space-y-4">
        <button
          onClick={onRestart}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors mr-4"
          disabled={isSaving}
        >
          Try Again
        </button>
        {isSaving ? (
          <div className="text-gray-600">
            Saving your results...
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Your results will be saved to your profile
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResults;
