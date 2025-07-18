import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { Level } from '@/lib/services/levelProgressionService';

interface LevelAdvancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: Level | null;
  newLevel: Level | null;
  message: string;
}

const LevelAdvancementModal = ({ 
  isOpen, 
  onClose, 
  currentLevel, 
  newLevel, 
  message 
}: LevelAdvancementModalProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          </div>
          <DialogTitle className="text-2xl">Level Up!</DialogTitle>
          <DialogDescription className="text-base">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        {currentLevel && newLevel && (
          <div className="space-y-6 py-4">
            {/* Level Progression Visual */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">{currentLevel.badge}</div>
                <div className="font-semibold">{currentLevel.name}</div>
                <Badge className={getDifficultyColor(currentLevel.difficulty)}>
                  {currentLevel.difficulty}
                </Badge>
              </div>
              
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              
              <div className="text-center">
                <div className="text-2xl mb-2 animate-bounce">{newLevel.badge}</div>
                <div className="font-semibold text-primary">{newLevel.name}</div>
                <Badge className={getDifficultyColor(newLevel.difficulty)}>
                  {newLevel.difficulty}
                </Badge>
              </div>
            </div>
            
            {/* New Level Benefits */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                New Level Benefits:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Points per question: {newLevel.pointsPerQuestion}</div>
                <div>Time per question: {newLevel.timePerQuestion}s</div>
                <div className="col-span-2">
                  Questions per quiz: {newLevel.questionsPerQuiz}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {newLevel.description}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button onClick={onClose} className="flex-1">
            Continue Playing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LevelAdvancementModal;