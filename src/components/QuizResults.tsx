
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import FeedbackModal, { FeedbackData } from './FeedbackModal';
import { feedbackService } from '@/lib/services/feedbackService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Target, TrendingUp, Clock } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  isSaving: boolean;
  timeTaken?: number; // in seconds
  category?: string;
}

const QuizResults = ({ score, totalQuestions, onRestart, isSaving, timeTaken, category }: QuizResultsProps) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const percentage = Math.floor((score / (totalQuestions * 10)) * 100);
  const correctAnswers = Math.floor(score / 10);
  const wrongAnswers = totalQuestions - correctAnswers;
  
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-game-success', bgColor: 'bg-game-success' };
    if (percentage >= 75) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-600' };
    if (percentage >= 60) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-600' };
    return { level: 'Needs Improvement', color: 'text-game-error', bgColor: 'bg-game-error' };
  };
  
  const performance = getPerformanceLevel(percentage);
  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    feedbackService.saveFeedback(feedback);
    setShowFeedbackModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-game-primary to-game-secondary text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Quiz Completed!</CardTitle>
          {category && (
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              {category}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold mb-2">{percentage}%</div>
          <div className={`text-xl font-semibold mb-4 ${performance.color.replace('text-', 'text-white/')}`}>
            {performance.level}
          </div>
          <div className="text-white/90">
            {correctAnswers} out of {totalQuestions} questions correct
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-game-success" />
            <div className="text-2xl font-bold text-game-success">{correctAnswers}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-game-error" />
            <div className="text-2xl font-bold text-game-error">{wrongAnswers}</div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-game-primary" />
            <div className="text-2xl font-bold text-game-primary">{percentage}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{formatTime(timeTaken)}</div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Answer Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Correct Answers Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-game-success">Correct Answers</span>
                <span className="text-sm text-muted-foreground">{correctAnswers}/{totalQuestions}</span>
              </div>
              <Progress 
                value={(correctAnswers / totalQuestions) * 100} 
                className="h-3"
                style={{'--progress-background': '#4CAF50'} as React.CSSProperties}
              />
            </div>
            
            {/* Incorrect Answers Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-game-error">Incorrect Answers</span>
                <span className="text-sm text-muted-foreground">{wrongAnswers}/{totalQuestions}</span>
              </div>
              <Progress 
                value={(wrongAnswers / totalQuestions) * 100} 
                className="h-3"
                style={{'--progress-background': '#F44336'} as React.CSSProperties}
              />
            </div>

            {/* Visual Chart */}
            <div className="mt-6">
              <div className="flex rounded-lg overflow-hidden h-8 bg-muted">
                {correctAnswers > 0 && (
                  <div 
                    className="bg-game-success flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
                  >
                    {correctAnswers > 0 && `${correctAnswers}`}
                  </div>
                )}
                {wrongAnswers > 0 && (
                  <div 
                    className="bg-game-error flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${(wrongAnswers / totalQuestions) * 100}%` }}
                  >
                    {wrongAnswers > 0 && `${wrongAnswers}`}
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={onRestart}
              disabled={isSaving}
              className="bg-game-primary hover:bg-game-secondary"
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
            <div className="text-center mt-4 text-muted-foreground">
              Saving your results...
            </div>
          ) : (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Your results will be saved to your profile
            </div>
          )}
        </CardContent>
      </Card>
      
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
