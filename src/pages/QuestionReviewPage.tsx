
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion } from '@/data/quizQuestions';

interface WrongAnswer {
  question: QuizQuestion;
  selectedAnswer: string;
  correctAnswer: string;
}

const QuestionReviewPage = () => {
  const location = useLocation();
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  useEffect(() => {
    // Get wrong answers from location state or localStorage
    const stateWrongAnswers = location.state?.wrongAnswers;
    if (stateWrongAnswers) {
      setWrongAnswers(stateWrongAnswers);
    } else {
      // Try to get from localStorage as fallback
      const stored = localStorage.getItem('last_quiz_wrong_answers');
      if (stored) {
        setWrongAnswers(JSON.parse(stored));
      }
    }
  }, [location.state]);

  const getSelectedAnswerText = (question: QuizQuestion, answerId: string) => {
    return question.options.find(opt => opt.id === answerId)?.text || 'No answer selected';
  };

  const getCorrectAnswerText = (question: QuizQuestion) => {
    return question.options.find(opt => opt.id === question.correctAnswer)?.text || '';
  };

  if (wrongAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <Card className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Perfect Score!</h1>
            <p className="text-gray-600 mb-6">
              You didn't get any questions wrong. Well done!
            </p>
            <Link to="/question">
              <Button>Take Another Quiz</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Question Review</h1>
          <p className="text-gray-600">
            Review the {wrongAnswers.length} question{wrongAnswers.length !== 1 ? 's' : ''} you got wrong
          </p>
        </div>

        <div className="space-y-6">
          {wrongAnswers.map((wrongAnswer, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader className="bg-red-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Question {index + 1}
                  </CardTitle>
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                    {wrongAnswer.question.points} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className="text-xl font-medium mb-6">
                  {wrongAnswer.question.question}
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-red-800">Your Answer:</span>
                    </div>
                    <p className="text-red-700">
                      {getSelectedAnswerText(wrongAnswer.question, wrongAnswer.selectedAnswer)}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">Correct Answer:</span>
                    </div>
                    <p className="text-green-700">
                      {getCorrectAnswerText(wrongAnswer.question)}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-700 mb-2">All Options:</h4>
                    <div className="grid gap-2">
                      {wrongAnswer.question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-2 rounded border text-sm ${
                            option.id === wrongAnswer.question.correctAnswer
                              ? 'bg-green-100 border-green-300 text-green-800'
                              : option.id === wrongAnswer.selectedAnswer
                              ? 'bg-red-100 border-red-300 text-red-800'
                              : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          {option.text}
                          {option.id === wrongAnswer.question.correctAnswer && (
                            <CheckCircle className="inline h-4 w-4 ml-2 text-green-600" />
                          )}
                          {option.id === wrongAnswer.selectedAnswer && option.id !== wrongAnswer.question.correctAnswer && (
                            <XCircle className="inline h-4 w-4 ml-2 text-red-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/question">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Take Another Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionReviewPage;
