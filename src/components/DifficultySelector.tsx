
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

const difficultyOptions = [
  {
    level: 'easy' as DifficultyLevel,
    title: 'Easy',
    description: 'Simple questions, 45 seconds per question',
    color: 'bg-green-500',
    points: '5 points per question'
  },
  {
    level: 'medium' as DifficultyLevel,
    title: 'Medium',
    description: 'Moderate questions, 30 seconds per question',
    color: 'bg-yellow-500',
    points: '10 points per question'
  },
  {
    level: 'hard' as DifficultyLevel,
    title: 'Hard',
    description: 'Challenging questions, 20 seconds per question',
    color: 'bg-red-500',
    points: '15 points per question'
  }
];

const DifficultySelector = ({ onSelectDifficulty }: DifficultySelectorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Difficulty</h2>
        <p className="text-gray-600">Select the challenge level that suits you best</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {difficultyOptions.map((option) => (
          <Card key={option.level} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full ${option.color} mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-white font-bold text-xl">
                  {option.title.charAt(0)}
                </span>
              </div>
              <CardTitle className="text-xl">{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="secondary" className="mb-4">
                {option.points}
              </Badge>
              <Button 
                onClick={() => onSelectDifficulty(option.level)}
                className="w-full"
                variant={option.level === 'medium' ? 'default' : 'outline'}
              >
                Start {option.title} Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
