
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight, TimerIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
}: QuestionCardProps) => {
  const handleValueChange = (value: string) => {
    onAnswer(value);
    // Automatically submit the answer when an option is selected
    onSubmitAnswer();
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader className="bg-purple-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium">{question}</CardTitle>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            <TimerIcon className="h-3 w-3 mr-1" /> {possiblePoints} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup
          value={selectedAnswer}
          onValueChange={handleValueChange}
          className="space-y-3"
        >
          {options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-all hover:bg-muted/50 ${
                selectedAnswer === option.id ? 'bg-purple-50 border-purple-300' : ''
              }`}
            >
              <RadioGroupItem value={option.id} id={option.id} disabled={answerSubmitted} />
              <Label
                htmlFor={option.id}
                className="flex flex-1 items-center justify-between font-normal"
              >
                {option.text}
                {selectedAnswer === option.id && (
                  <Check className="h-4 w-4 text-purple-500" />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between border-t py-4 mt-4">
        {!answerSubmitted ? (
          <div className="text-sm font-medium text-gray-500">
            Select an option to submit
          </div>
        ) : (
          <div className="text-sm font-medium text-gray-500">
            Answer submitted
          </div>
        )}
        
        <Button
          onClick={onNext}
          disabled={!answerSubmitted}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Next Question <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
