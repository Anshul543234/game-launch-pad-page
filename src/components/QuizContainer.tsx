import React, { useState, useCallback, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import QuestionTransition from '@/components/QuestionTransition';
import Timer from '@/components/Timer';
import QuizProgress from '@/components/QuizProgress';
import QuizResults from '@/components/QuizResults';
import LevelSelector from '@/components/LevelSelector';
import LevelAdvancementModal from '@/components/LevelAdvancementModal';
import QuizModeSelector from '@/components/QuizModeSelector';
import FlashCardContainer from '@/components/FlashCardContainer';
import { toast } from "@/components/ui/sonner";
import { saveQuizAttempt, getUserProfile } from '@/lib/services/userProfileService';
import { useNavigate } from 'react-router-dom';
import { playSound } from '@/lib/sounds';
import { getQuestionsForLevel, getQuestionsByCategoryAndDifficulty, QuizQuestion } from '@/data/quizQuestions';
import { Level, checkLevelAdvancement, getCurrentLevel } from '@/lib/services/levelProgressionService';

// Function to shuffle array using Fisher-Yates algorithm
const shuffleArray = (array: QuizQuestion[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizContainer = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'quiz' | 'flashcard' | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [startTime] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [shouldSaveResults, setShouldSaveResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{
    question: QuizQuestion;
    selectedAnswer: string;
    correctAnswer: string;
  }>>([]);
  const [showLevelAdvancement, setShowLevelAdvancement] = useState(false);
  const [levelAdvancementData, setLevelAdvancementData] = useState<{
    currentLevel: Level | null;
    newLevel: Level | null;
    message: string;
  }>({ currentLevel: null, newLevel: null, message: '' });
  
  // Effect to check for selected category from session storage
  useEffect(() => {
    const storedCategory = sessionStorage.getItem('selectedCategory');
    if (storedCategory) {
      setSelectedCategory(storedCategory);
      setSelectedMode('quiz'); // Auto-select quiz mode when coming from categories
      sessionStorage.removeItem('selectedCategory'); // Clear after use
    }
  }, []);

  // Effect to handle saving results when shouldSaveResults becomes true
  useEffect(() => {
    if (shouldSaveResults) {
      saveQuizResults();
      setShouldSaveResults(false);
    }
  }, [shouldSaveResults, score]);

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    let levelQuestions: QuizQuestion[];
    
    if (selectedCategory) {
      // Get questions filtered by category and difficulty
      levelQuestions = getQuestionsByCategoryAndDifficulty(selectedCategory, level.difficulty);
      // If not enough questions in category, fall back to all questions of that difficulty
      if (levelQuestions.length < level.questionsPerQuiz) {
        levelQuestions = getQuestionsForLevel(level.difficulty, level.questionsPerQuiz);
      } else {
        // Slice to get the required number of questions
        levelQuestions = levelQuestions.slice(0, level.questionsPerQuiz);
      }
    } else {
      levelQuestions = getQuestionsForLevel(level.difficulty, level.questionsPerQuiz);
    }
    
    setQuestions(shuffleArray(levelQuestions));
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  const handleAnswer = (answerId: string) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answerId);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(undefined);
        setAnswerSubmitted(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleRestart = () => {
    if (selectedLevel) {
      let levelQuestions: QuizQuestion[];
      
      if (selectedCategory) {
        levelQuestions = getQuestionsByCategoryAndDifficulty(selectedCategory, selectedLevel.difficulty);
        if (levelQuestions.length < selectedLevel.questionsPerQuiz) {
          levelQuestions = getQuestionsForLevel(selectedLevel.difficulty, selectedLevel.questionsPerQuiz);
        } else {
          levelQuestions = levelQuestions.slice(0, selectedLevel.questionsPerQuiz);
        }
      } else {
        levelQuestions = getQuestionsForLevel(selectedLevel.difficulty, selectedLevel.questionsPerQuiz);
      }
      
      setQuestions(shuffleArray(levelQuestions));
    }
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setScore(0);
    setShowResults(false);
    setAnswerSubmitted(false);
    setWrongAnswers([]);
    setConsecutiveCorrect(0);
    setCurrentMultiplier(1);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setScore(0);
    setShowResults(false);
    setAnswerSubmitted(false);
    setWrongAnswers([]);
    setConsecutiveCorrect(0);
    setCurrentMultiplier(1);
  };

  const handleBackToCategories = () => {
    navigate('/categories');
  };

  // Calculate multiplier based on consecutive correct answers
  const calculateMultiplier = (consecutiveCount: number): number => {
    if (consecutiveCount < 3) return 1;
    if (consecutiveCount < 5) return 1.5;
    if (consecutiveCount < 7) return 2;
    if (consecutiveCount < 10) return 2.5;
    return 3; // Max 3x multiplier for 10+ consecutive
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    
    setAnswerSubmitted(true);
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    playSound(isCorrect);
    
    if (isCorrect) {
      const newConsecutive = consecutiveCorrect + 1;
      const multiplier = calculateMultiplier(newConsecutive);
      const pointsWithMultiplier = Math.floor(selectedLevel!.pointsPerQuestion * multiplier);
      const newScore = score + pointsWithMultiplier;
      
      setConsecutiveCorrect(newConsecutive);
      setCurrentMultiplier(multiplier);
      setScore(newScore);
      
      if (multiplier > 1) {
        toast.success(`${multiplier}x Streak Bonus!`, {
          description: `${newConsecutive} correct in a row! +${pointsWithMultiplier} points`,
        });
      }
      
      if (currentQuestionIndex === totalQuestions - 1) {
        setShowResults(true);
        setShouldSaveResults(true);
      }
    } else {
      // Reset streak on wrong answer
      setConsecutiveCorrect(0);
      setCurrentMultiplier(1);
      
      // Track wrong answer - now we're sure currentQuestion is a valid QuizQuestion
      if (selectedAnswer) {
        const wrongAnswer = {
          question: currentQuestion,
          selectedAnswer: selectedAnswer,
          correctAnswer: currentQuestion.correctAnswer
        };
        setWrongAnswers(prev => [...prev, wrongAnswer]);
      }
      
      if (currentQuestionIndex === totalQuestions - 1) {
        setShowResults(true);
        setShouldSaveResults(true);
      }
    }
  };

  const handleTimeUp = useCallback(() => {
    if (selectedAnswer) {
      handleSubmitAnswer();
    } else {
      if (currentQuestionIndex === totalQuestions - 1) {
        setShowResults(true);
        setShouldSaveResults(true);
      } else {
        handleNext();
      }
    }
  }, [currentQuestionIndex, selectedAnswer, handleSubmitAnswer, handleNext]);

  const saveQuizResults = async () => {
    if (!selectedLevel) return;
    
    const endTime = new Date();
    const timeTaken = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    const correctAnswers = Math.floor(score / selectedLevel.pointsPerQuestion);
    const maxPossibleScore = totalQuestions * selectedLevel.pointsPerQuestion;
    const percentageScore = (score / maxPossibleScore) * 100;
    
    const quizAttempt = {
      quizId: `level-${selectedLevel.id}${selectedCategory ? `-${selectedCategory}` : ''}`,
      quizName: `${selectedLevel.name} Level Quiz${selectedCategory ? ` - ${selectedCategory}` : ''}`,
      category: selectedCategory || "General Knowledge",
      score: Math.round(percentageScore),
      totalQuestions: totalQuestions,
      date: new Date().toISOString(),
      timeTaken: timeTaken,
      correctAnswers: correctAnswers
    };

    try {
      setIsSaving(true);
      const savedProfile = await saveQuizAttempt('1', quizAttempt);
      
      // Check for level advancement
      const advancementResult = await checkLevelAdvancement(
        Math.round(percentageScore),
        selectedLevel.id,
        savedProfile.quizHistory
      );
      
      if (advancementResult.shouldAdvance && advancementResult.newLevel) {
        setLevelAdvancementData({
          currentLevel: selectedLevel,
          newLevel: advancementResult.newLevel,
          message: advancementResult.message || ''
        });
        setShowLevelAdvancement(true);
        
        toast.success("Level Up!", {
          description: `You've advanced to ${advancementResult.newLevel.name} level!`,
        });
      } else if (advancementResult.message) {
        toast.info("Keep Going!", {
          description: advancementResult.message,
        });
      }
      
      // Store wrong answers in localStorage for review
      localStorage.setItem('last_quiz_wrong_answers', JSON.stringify(wrongAnswers));
      
      toast.success("Quiz results saved!", {
        description: `You got ${correctAnswers} out of ${totalQuestions} correct (${quizAttempt.score}%)`,
      });
    } catch (error) {
      console.error('Save quiz error:', error);
      toast.error("Failed to save quiz results", {
        description: "Please try again later.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show mode selector if no mode is selected
  if (!selectedMode) {
    return <QuizModeSelector onSelectMode={setSelectedMode} />;
  }

  // Show flashcard container if flashcard mode is selected
  if (selectedMode === 'flashcard') {
    return <FlashCardContainer onBackToModeSelector={() => setSelectedMode(null)} />;
  }

  // Show level selector if no level is selected
  if (!selectedLevel) {
    return <LevelSelector onSelectLevel={handleLevelSelect} />;
  }

  const questionTime = selectedLevel.timePerQuestion;

  if (questions.length === 0) {
    return (
      <div className="text-center">Loading questions...</div>
    );
  }

  if (showResults) {
    return (
      <QuizResults
        score={score}
        totalQuestions={totalQuestions}
        onRestart={handleRestart}
        isSaving={isSaving}
      />
    );
  }

  // Don't render if no current question
  if (!currentQuestion) {
    return <div className="text-center">Loading question...</div>;
  }

  return (
    <>
      <div className="w-full max-w-3xl">
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {selectedCategory && (
              <>
                <span className="text-sm text-muted-foreground">Category:</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                  {selectedCategory}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
              </>
            )}
            <span className="text-sm text-muted-foreground">Level:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedLevel.badge}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                selectedLevel.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                selectedLevel.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedLevel.name}
              </span>
            </div>
            <button 
              onClick={handleBackToLevels}
              className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
            >
              Change Level
            </button>
            {selectedCategory && (
              <button 
                onClick={handleBackToCategories}
                className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
              >
                Change Category
              </button>
            )}
          </div>
        </div>
      
        <QuizProgress
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          score={score}
          consecutiveCorrect={consecutiveCorrect}
          currentMultiplier={currentMultiplier}
        />
      
      <div className="mb-4">
        <Timer 
          initialTime={questionTime} 
          onTimeUp={handleTimeUp} 
        />
      </div>
      
      <QuestionTransition isTransitioning={isTransitioning}>
        <QuestionCard
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={handleAnswer}
          onNext={handleNext}
          selectedAnswer={selectedAnswer}
          answerSubmitted={answerSubmitted}
          onSubmitAnswer={handleSubmitAnswer}
          possiblePoints={selectedLevel.pointsPerQuestion}
          correctAnswer={currentQuestion.correctAnswer}
          hint={currentQuestion.hint}
          difficulty={currentQuestion.difficulty}
        />
      </QuestionTransition>
      </div>
      
      <LevelAdvancementModal
        isOpen={showLevelAdvancement}
        onClose={() => setShowLevelAdvancement(false)}
        currentLevel={levelAdvancementData.currentLevel}
        newLevel={levelAdvancementData.newLevel}
        message={levelAdvancementData.message}
      />
    </>
  );
};

export default QuizContainer;
