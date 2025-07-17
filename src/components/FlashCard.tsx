import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ChevronRight, TimerIcon } from 'lucide-react';

interface FlashCardProps {
  question: string;
  answer: string;
  onNext: () => void;
  onMarkCorrect: () => void;
  onMarkIncorrect: () => void;
  possiblePoints: number;
  showAnswer?: boolean;
  isAnswered?: boolean;
}

const FlashCard = ({
  question,
  answer,
  onNext,
  onMarkCorrect,
  onMarkIncorrect,
  possiblePoints,
  showAnswer = false,
  isAnswered = false,
}: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  const handleFlip = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleMarkCorrect = () => {
    onMarkCorrect();
  };

  const handleMarkIncorrect = () => {
    onMarkIncorrect();
  };

  return (
    <div className="w-full max-w-3xl">
      <Card className="shadow-lg min-h-[400px] relative overflow-hidden">
        <div 
          className={`absolute inset-0 transition-transform duration-500 preserve-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Front Side - Question */}
          <div className="absolute inset-0 backface-hidden">
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary">Question</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <TimerIcon className="h-3 w-3 mr-1" /> {possiblePoints} pts
                  </Badge>
                </div>
              </div>
              
              <CardContent className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                  <p className="text-xl font-medium leading-relaxed">{question}</p>
                  {!isFlipped && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <RotateCcw className="h-4 w-4" />
                      <span className="text-sm">Click to reveal answer</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </div>

          {/* Back Side - Answer */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-green-100 to-green-50 border-b p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-800">Answer</h3>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    <TimerIcon className="h-3 w-3 mr-1" /> {possiblePoints} pts
                  </Badge>
                </div>
              </div>
              
              <CardContent className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                  <p className="text-xl font-medium leading-relaxed text-green-800">{answer}</p>
                  {isFlipped && !isAnswered && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <RotateCcw className="h-4 w-4" />
                      <span className="text-sm">Click to see question again</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      {isFlipped && !isAnswered && (
        <div className="mt-6 flex justify-center gap-4">
          <Button
            onClick={handleMarkIncorrect}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            I got it wrong
          </Button>
          <Button
            onClick={handleMarkCorrect}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            I got it right
          </Button>
        </div>
      )}

      {isAnswered && (
        <div className="mt-6 flex justify-center">
          <Button onClick={onNext} className="bg-primary hover:bg-primary/90">
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashCard;