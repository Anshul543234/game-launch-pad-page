
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight, TimerIcon, X, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnswerOption {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: string;
  options: AnswerOption[];
  onAnswer: (answerId: string) => void;
  onNext: () => void;
  selectedAnswer?: string;
  answerSubmitted?: boolean;
  onSubmitAnswer: () => void;
  possiblePoints: number;
  correctAnswer?: string;
  hint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

const QuestionCard = ({
  question,
  options,
  onAnswer,
  onNext,
  selectedAnswer,
  answerSubmitted = false,
  onSubmitAnswer,
  possiblePoints,
  correctAnswer,
  hint,
  difficulty,
}: QuestionCardProps) => {
  const [showHint, setShowHint] = useState(false);
  
  const handleValueChange = (value: string) => {
    onAnswer(value);
  };

  const isCorrect = answerSubmitted && selectedAnswer === correctAnswer;
  const isIncorrect = answerSubmitted && selectedAnswer !== correctAnswer;

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader className="bg-purple-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium">{question}</CardTitle>
          <div className="flex items-center gap-2">
            {hint && (difficulty === 'medium' || difficulty === 'hard') && !answerSubmitted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Hint
              </Button>
            )}
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
              <TimerIcon className="h-3 w-3 mr-1" /> {possiblePoints} pts
            </Badge>
          </div>
        </div>
        {showHint && hint && (
          <Alert className="mt-3 border-yellow-300 bg-yellow-50">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Hint:</strong> {hint}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup
          value={selectedAnswer}
          onValueChange={handleValueChange}
          className="space-y-3"
        >
          {options.map((option) => {
            let optionBorderClass = '';
            let optionBgClass = '';
            
            if (answerSubmitted) {
              if (option.id === correctAnswer) {
                optionBorderClass = 'border-green-500';
                optionBgClass = 'bg-green-50';
              } else if (option.id === selectedAnswer && option.id !== correctAnswer) {
                optionBorderClass = 'border-red-500';
                optionBgClass = 'bg-red-50';
              }
            } else if (selectedAnswer === option.id) {
              optionBorderClass = 'border-purple-300';
              optionBgClass = 'bg-purple-50';
            }

            return (
              <div
                key={option.id}
                className={`flex items-center space-x-2 rounded-lg border p-4 transition-all hover:bg-muted/50 ${optionBorderClass} ${optionBgClass}`}
              >
                <RadioGroupItem value={option.id} id={option.id} disabled={answerSubmitted} />
                <Label
                  htmlFor={option.id}
                  className="flex flex-1 items-center justify-between font-normal"
                >
                  {option.text}
                  <div className="flex items-center gap-2">
                    {selectedAnswer === option.id && !answerSubmitted && (
                      <Check className="h-4 w-4 text-purple-500" />
                    )}
                    {answerSubmitted && option.id === correctAnswer && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    {answerSubmitted && option.id === selectedAnswer && option.id !== correctAnswer && (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {answerSubmitted && (
          <Alert className={`mt-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <AlertDescription className={`${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Correct! You earned {possiblePoints} points.
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Incorrect. The correct answer was: {options.find(opt => opt.id === correctAnswer)?.text}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t py-4 mt-4">
        <div className="text-sm font-medium text-gray-500">
          {!answerSubmitted ? (
            "Select an option and click Next to submit"
          ) : (
            "Answer submitted"
          )}
        </div>
        
        <Button
          onClick={selectedAnswer && !answerSubmitted ? onSubmitAnswer : onNext}
          disabled={!selectedAnswer || (answerSubmitted && selectedAnswer === undefined)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {answerSubmitted ? "Continue" : "Next Question"} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
