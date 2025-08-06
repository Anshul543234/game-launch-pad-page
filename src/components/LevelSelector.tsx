import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Star, Clock, Target } from 'lucide-react';
import { Level, LevelProgress, getLevelProgress, setCurrentLevel } from '@/lib/services/levelProgressionService';
import { getUserProfile } from '@/lib/services/userProfileService';

interface LevelSelectorProps {
  onSelectLevel: (level: Level) => void;
}

const LevelSelector = ({ onSelectLevel }: LevelSelectorProps) => {
  const [progress, setProgress] = useState<LevelProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const [levelProgress, userProfile] = await Promise.all([
          getLevelProgress(),
          getUserProfile('1')
        ]);
        setProgress(levelProgress);
        setUserStats(userProfile);
      } catch (error) {
        console.error('Failed to load level progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const handleLevelSelect = async (level: Level) => {
    try {
      await setCurrentLevel(level.id);
      onSelectLevel(level);
    } catch (error) {
      console.error('Failed to set current level:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyTextColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressForLevel = (level: Level) => {
    if (!userStats?.quizHistory) return 0;
    
    const levelQuizzes = userStats.quizHistory.filter((quiz: any) => 
      quiz.quizName.includes(level.name) ||
      (level.id === progress?.currentLevel && quiz.category === "General Knowledge")
    );
    
    return Math.min(100, (levelQuizzes.length / level.requiredQuizzes) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center">
        <p className="text-destructive">Failed to load level progress</p>
      </div>
    );
  }

  const currentLevel = progress.levels.find(l => l.id === progress.currentLevel);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with current progress */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Your Learning Journey</h2>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Level {progress.currentLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span>{progress.totalExperience} XP</span>
          </div>
        </div>
        {currentLevel && (
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Current: {currentLevel.name}</span>
              <span>{getProgressForLevel(currentLevel).toFixed(0)}%</span>
            </div>
            <Progress value={getProgressForLevel(currentLevel)} className="h-2" />
          </div>
        )}
      </div>

      {/* Level Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {progress.levels.map((level) => {
          const isUnlocked = level.unlocked;
          const isCurrent = level.id === progress.currentLevel;
          const levelProgress = getProgressForLevel(level);
          
          return (
            <Card 
              key={level.id} 
              className={`relative transition-all duration-200 ${
                isUnlocked 
                  ? 'hover:shadow-lg cursor-pointer hover:scale-[1.02]' 
                  : 'opacity-60 cursor-not-allowed'
              } ${
                isCurrent ? 'ring-2 ring-primary' : ''
              }`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              
              <CardHeader className="text-center pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={getDifficultyTextColor(level.difficulty)}>
                    {level.difficulty}
                  </Badge>
                  <span className="text-2xl">{level.badge}</span>
                </div>
                <CardTitle className="text-lg">{level.name}</CardTitle>
                <CardDescription className="text-sm">{level.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{level.requiredScore}% avg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{level.timePerQuestion}s</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{level.pointsPerQuestion} pts per question</span>
                  </div>
                </div>
                
                {isUnlocked && levelProgress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{levelProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={levelProgress} className="h-1" />
                  </div>
                )}
                
                <Button 
                  onClick={() => handleLevelSelect(level)}
                  disabled={!isUnlocked}
                  variant={isCurrent ? "default" : "outline"}
                  className="w-full"
                  size="sm"
                >
                  {isCurrent ? "Continue" : isUnlocked ? "Play" : "Locked"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Legend */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">How to Progress:</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>• Complete the required number of quizzes at each level</div>
          <div>• Maintain the minimum average score to advance</div>
          <div>• Earn experience points to track your overall progress</div>
          <div>• Unlock higher levels by mastering lower ones</div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;