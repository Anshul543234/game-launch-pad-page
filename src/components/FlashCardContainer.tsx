import React, { useState, useEffect } from 'react';
import FlashCard from '@/components/FlashCard';
import QuestionTransition from '@/components/QuestionTransition';
import QuizProgress from '@/components/QuizProgress';
import QuizResults from '@/components/QuizResults';
import DifficultySelector, { DifficultyLevel } from '@/components/DifficultySelector';
import { toast } from "@/components/ui/sonner";
import { saveQuizAttempt } from '@/lib/services/userProfileService';
import { playSound } from '@/lib/sounds';
import { getQuestionsByDifficulty, QuizQuestion } from '@/data/quizQuestions';
import { Button } from '@/components/ui/button';

// Function to shuffle array using Fisher-Yates algorithm
const shuffleArray = (array: QuizQuestion[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface FlashCardContainerProps {
  onBackToModeSelector: () => void;
}

const FlashCardContainer = ({ onBackToModeSelector }: FlashCardContainerProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    const difficultyQuestions = getQuestionsByDifficulty(difficulty);
    setQuestions(shuffleArray(difficultyQuestions));
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  // Calculate multiplier based on consecutive correct answers
  const calculateMultiplier = (consecutiveCount: number): number => {
    if (consecutiveCount < 3) return 1;
    if (consecutiveCount < 5) return 1.5;
    if (consecutiveCount < 7) return 2;
    if (consecutiveCount < 10) return 2.5;
    return 3; // Max 3x multiplier for 10+ consecutive
  };

  const handleMarkCorrect = () => {
    setIsAnswered(true);
    playSound(true);
    
    const newConsecutive = consecutiveCorrect + 1;
    const multiplier = calculateMultiplier(newConsecutive);
    const pointsWithMultiplier = Math.floor(currentQuestion.points * multiplier);
    const newScore = score + pointsWithMultiplier;
    const newCorrectAnswers = correctAnswers + 1;
    
    setConsecutiveCorrect(newConsecutive);
    setCurrentMultiplier(multiplier);
    setScore(newScore);
    setCorrectAnswers(newCorrectAnswers);
    
    if (multiplier > 1) {
      toast.success(`${multiplier}x Streak Bonus!`, {
        description: `${newConsecutive} correct in a row! +${pointsWithMultiplier} points`,
      });
    }
    
    if (currentQuestionIndex === totalQuestions - 1) {
      setTimeout(() => {
        setShowResults(true);
        saveQuizResults(newScore, newCorrectAnswers);
      }, 1000);
    }
  };

  const handleMarkIncorrect = () => {
    setIsAnswered(true);
    playSound(false);
    
    // Reset streak on wrong answer
    setConsecutiveCorrect(0);
    setCurrentMultiplier(1);
    
    if (currentQuestionIndex === totalQuestions - 1) {
      setTimeout(() => {
        setShowResults(true);
        saveQuizResults(score, correctAnswers);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleRestart = () => {
    if (selectedDifficulty) {
      const difficultyQuestions = getQuestionsByDifficulty(selectedDifficulty);
      setQuestions(shuffleArray(difficultyQuestions));
    }
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setShowResults(false);
    setIsAnswered(false);
    setConsecutiveCorrect(0);
    setCurrentMultiplier(1);
  };

  const handleBackToDifficulty = () => {
    setSelectedDifficulty(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setShowResults(false);
    setIsAnswered(false);
    setConsecutiveCorrect(0);
    setCurrentMultiplier(1);
  };

  const saveQuizResults = async (finalScore: number, finalCorrectAnswers: number) => {
    if (!selectedDifficulty) return;
    
    const endTime = new Date();
    const timeTaken = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    const pointsPerQuestion = selectedDifficulty === 'easy' ? 5 : selectedDifficulty === 'medium' ? 10 : 15;
    const maxPossibleScore = totalQuestions * pointsPerQuestion;
    const percentageScore = (finalScore / maxPossibleScore) * 100;
    
    const quizAttempt = {
      quizId: `gk-flashcard-${selectedDifficulty}`,
      quizName: `Flashcard Study (${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)})`,
      category: "General Knowledge",
      score: Math.round(percentageScore),
      totalQuestions: totalQuestions,
      date: new Date().toISOString(),
      timeTaken: timeTaken,
      correctAnswers: finalCorrectAnswers
    };

    try {
      setIsSaving(true);
      await saveQuizAttempt('1', quizAttempt);
      
      toast.success("Study session saved!", {
        description: `You got ${finalCorrectAnswers} out of ${totalQuestions} correct (${quizAttempt.score}%)`,
      });
    } catch (error) {
      toast.error("Failed to save study results", {
        description: "Please try again later.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show difficulty selector if no difficulty is selected
  if (!selectedDifficulty) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <Button 
            variant="outline" 
            onClick={onBackToModeSelector}
            className="mb-4"
          >
            ← Back to Mode Selection
          </Button>
          <h2 className="text-2xl font-bold mb-2">Flashcard Study</h2>
          <p className="text-muted-foreground">Choose difficulty level to start studying</p>
        </div>
        <DifficultySelector onSelectDifficulty={handleDifficultySelect} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">Loading flashcards...</div>
    );
  }

  if (showResults) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={onBackToModeSelector}
            className="mb-4"
          >
            ← Back to Mode Selection
          </Button>
        </div>
        <QuizResults
          score={score}
          totalQuestions={totalQuestions}
          onRestart={handleRestart}
          isSaving={isSaving}
        />
      </div>
    );
  }

  // Don't render if no current question
  if (!currentQuestion) {
    return <div className="text-center">Loading flashcard...</div>;
  }

  // Get the correct answer text from options
  const correctAnswerOption = currentQuestion.options.find(
    option => option.id === currentQuestion.correctAnswer
  );
  const answerText = correctAnswerOption?.text || 'Answer not found';

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={onBackToModeSelector}
            size="sm"
          >
            ← Mode
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Difficulty:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              selectedDifficulty === 'easy' ? 'bg-green-100 text-green-800' :
              selectedDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
            </span>
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleBackToDifficulty}
              className="text-xs text-primary hover:text-primary/80"
            >
              Change
            </Button>
          </div>
        </div>
      </div>
      
      <QuizProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        score={score}
        consecutiveCorrect={consecutiveCorrect}
        currentMultiplier={currentMultiplier}
      />
      
      <QuestionTransition isTransitioning={isTransitioning}>
        <FlashCard
          question={currentQuestion.question}
          answer={answerText}
          onNext={handleNext}
          onMarkCorrect={handleMarkCorrect}
          onMarkIncorrect={handleMarkIncorrect}
          possiblePoints={currentQuestion.points}
          isAnswered={isAnswered}
        />
      </QuestionTransition>
    </div>
  );
};

export default FlashCardContainer;