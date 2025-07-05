
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  isSaving: boolean;
}

const QuizResults = ({ score, totalQuestions, onRestart, isSaving }: QuizResultsProps) => {
  const percentage = Math.floor((score / (totalQuestions * 10)) * 100);
  const correctAnswers = Math.floor(score / 10);
  const wrongAnswers = totalQuestions - correctAnswers;

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
        <div className="flex justify-center gap-4">
          <button
            onClick={onRestart}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
            disabled={isSaving}
          >
            Try Again
          </button>
          {wrongAnswers > 0 && (
            <Link to="/review">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors">
                Review Wrong Answers ({wrongAnswers})
              </button>
            </Link>
          )}
        </div>
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
