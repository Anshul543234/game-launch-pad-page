
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import FeedbackModal, { FeedbackData } from './FeedbackModal';
import { feedbackService } from '@/lib/services/feedbackService';
import { Button } from '@/components/ui/button';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  isSaving: boolean;
}

const QuizResults = ({ score, totalQuestions, onRestart, isSaving }: QuizResultsProps) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const percentage = Math.floor((score / (totalQuestions * 10)) * 100);
  const correctAnswers = Math.floor(score / 10);
  const wrongAnswers = totalQuestions - correctAnswers;

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    feedbackService.saveFeedback(feedback);
    setShowFeedbackModal(false);
  };

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
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            onClick={onRestart}
            disabled={isSaving}
          >
            Try Again
          </Button>
          {wrongAnswers > 0 && (
            <Link to="/review">
              <Button variant="outline">
                Review Wrong Answers ({wrongAnswers})
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center gap-2"
          >
            Share Feedback
          </Button>
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
      
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        quizType="quiz"
        score={score}
      />
    </div>
  );
};

export default QuizResults;
