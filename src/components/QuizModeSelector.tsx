import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, HelpCircle } from 'lucide-react';

interface QuizModeSelectorProps {
  onSelectMode: (mode: 'quiz' | 'flashcard') => void;
}

const QuizModeSelector = ({ onSelectMode }: QuizModeSelectorProps) => {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Learning Mode</h2>
        <p className="text-muted-foreground">
          Select how you'd like to learn and test your knowledge
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectMode('quiz')}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Quiz Mode</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Traditional multiple-choice questions with timer and scoring
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Multiple choice answers</li>
              <li>• Timed questions</li>
              <li>• Instant feedback</li>
              <li>• Score tracking</li>
            </ul>
            <Button className="w-full">Start Quiz</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectMode('flashcard')}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Flashcard Mode</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Study-friendly flashcards for self-paced learning
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Flip to reveal answers</li>
              <li>• Self-assessment</li>
              <li>• Study at your pace</li>
              <li>• Perfect for memorization</li>
            </ul>
            <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
              Start Flashcards
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizModeSelector;