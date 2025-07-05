import React, { useState, useCallback, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import QuestionTransition from '@/components/QuestionTransition';
import Timer from '@/components/Timer';
import QuizProgress from '@/components/QuizProgress';
import QuizResults from '@/components/QuizResults';
import DifficultySelector, { DifficultyLevel } from '@/components/DifficultySelector';
import { toast } from "@/components/ui/sonner";
import { saveQuizAttempt } from '@/lib/services/userProfileService';
import { useNavigate } from 'react-router-dom';
import { playSound } from '@/lib/sounds';
import { getQuestionsByDifficulty, getTimerDuration, QuizQuestion } from '@/data/quizQuestions';

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
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
  
  // Effect to handle saving results when shouldSaveResults becomes true
  useEffect(() => {
    if (shouldSaveResults) {
      saveQuizResults();
      setShouldSaveResults(false);
    }
  }, [shouldSaveResults, score]);

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    const difficultyQuestions = getQuestionsByDifficulty(difficulty);
    setQuestions(shuffleArray(difficultyQuestions));
  };
  
  const currentQuestion = questions[currentQuestionIndex] || { question: '', options: [], correctAnswer: '', points: 0 };
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
    if (selectedDifficulty) {
      const difficultyQuestions = getQuestionsByDifficulty(selectedDifficulty);
      setQuestions(shuffleArray(difficultyQuestions));
    }
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setScore(0);
    setShowResults(false);
    setAnswerSubmitted(false);
  };

  const handleBackToDifficulty = () => {
    setSelectedDifficulty(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setScore(0);
    setShowResults(false);
    setAnswerSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    setAnswerSubmitted(true);
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    playSound(isCorrect);
    
    if (isCorrect) {
      const newScore = score + currentQuestion.points;
      setScore(newScore);
      
      if (currentQuestionIndex === totalQuestions - 1) {
        setShowResults(true);
        setShouldSaveResults(true);
      }
    } else {
      // Track wrong answer
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
    if (!selectedDifficulty) return;
    
    const endTime = new Date();
    const timeTaken = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    const pointsPerQuestion = selectedDifficulty === 'easy' ? 5 : selectedDifficulty === 'medium' ? 10 : 15;
    const correctAnswers = Math.floor(score / pointsPerQuestion);
    const maxPossibleScore = totalQuestions * pointsPerQuestion;
    const percentageScore = (score / maxPossibleScore) * 100;
    
    const quizAttempt = {
      quizId: `gk-${selectedDifficulty}`,
      quizName: `General Knowledge Quiz (${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)})`,
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
      
      // Store wrong answers in localStorage for review
      localStorage.setItem('last_quiz_wrong_answers', JSON.stringify(wrongAnswers));
      
      toast.success("Quiz results saved!", {
        description: `You got ${correctAnswers} out of ${totalQuestions} correct (${quizAttempt.score}%)`,
      });
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      toast.error("Failed to save quiz results", {
        description: "Please try again later.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show difficulty selector if no difficulty is selected
  if (!selectedDifficulty) {
    return <DifficultySelector onSelectDifficulty={handleDifficultySelect} />;
  }

  const questionTime = getTimerDuration(selectedDifficulty);

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

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm text-gray-600">Difficulty:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            selectedDifficulty === 'easy' ? 'bg-green-100 text-green-800' :
            selectedDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
          </span>
          <button 
            onClick={handleBackToDifficulty}
            className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
          >
            Change Difficulty
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
          possiblePoints={currentQuestion.points}
          correctAnswer={currentQuestion.correctAnswer}
        />
      </QuestionTransition>
    </div>
  );
};

export default QuizContainer;
