
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight } from 'lucide-react';

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
}

const QuestionCard = ({
  question,
  options,
  onAnswer,
  onNext,
  selectedAnswer,
}: QuestionCardProps) => {
  const handleValueChange = (value: string) => {
    onAnswer(value);
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader className="bg-purple-50 border-b">
        <CardTitle className="text-xl font-medium text-center">{question}</CardTitle>
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
              <RadioGroupItem value={option.id} id={option.id} />
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
      <CardFooter className="flex justify-end border-t py-4 mt-4">
        <Button
          onClick={onNext}
          disabled={!selectedAnswer}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Next Question <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
