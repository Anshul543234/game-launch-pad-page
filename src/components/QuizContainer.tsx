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
import { getQuestionsForLevel, QuizQuestion } from '@/data/quizQuestions';
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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
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
  
  // Effect to handle saving results when shouldSaveResults becomes true
  useEffect(() => {
    if (shouldSaveResults) {
      saveQuizResults();
      setShouldSaveResults(false);
    }
  }, [shouldSaveResults, score]);

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    const levelQuestions = getQuestionsForLevel(level.difficulty, level.questionsPerQuiz);
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
      const levelQuestions = getQuestionsForLevel(selectedLevel.difficulty, selectedLevel.questionsPerQuiz);
      setQuestions(shuffleArray(levelQuestions));
    }
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setScore(0);
    setShowResults(false);
    setAnswerSubmitted(false);
    setWrongAnswers([]);
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
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    
    setAnswerSubmitted(true);
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    playSound(isCorrect);
    
    if (isCorrect) {
      const newScore = score + selectedLevel!.pointsPerQuestion;
      setScore(newScore);
      
      if (currentQuestionIndex === totalQuestions - 1) {
        setShowResults(true);
        setShouldSaveResults(true);
      }
    } else {
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
      quizId: `level-${selectedLevel.id}`,
      quizName: `${selectedLevel.name} Level Quiz`,
      category: "General Knowledge",
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
          </div>
        </div>
      
      <QuizProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        score={score}
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
