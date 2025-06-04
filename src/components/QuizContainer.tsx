import React, { useState, useCallback, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import QuestionTransition from '@/components/QuestionTransition';
import Timer from '@/components/Timer';
import QuizProgress from '@/components/QuizProgress';
import QuizResults from '@/components/QuizResults';
import { toast } from "@/components/ui/sonner";
import { saveQuizAttempt } from '@/lib/services/userProfileService';
import { useNavigate } from 'react-router-dom';
import { playSound } from '@/lib/sounds';

// Extended question data with multiple questions
const quizQuestions = [
  {
    id: '1',
    question: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'a', text: 'Venus' },
      { id: 'b', text: 'Mars' },
      { id: 'c', text: 'Jupiter' },
      { id: 'd', text: 'Saturn' },
    ],
    correctAnswer: 'b',
    points: 10,
  },
  {
    id: '2',
    question: 'Who wrote "Romeo and Juliet"?',
    options: [
      { id: 'a', text: 'Charles Dickens' },
      { id: 'b', text: 'William Shakespeare' },
      { id: 'c', text: 'Jane Austen' },
      { id: 'd', text: 'Mark Twain' },
    ],
    correctAnswer: 'b',
    points: 10,
  },
  {
    id: '3',
    question: 'What is the chemical symbol for gold?',
    options: [
      { id: 'a', text: 'Go' },
      { id: 'b', text: 'Gd' },
      { id: 'c', text: 'Au' },
      { id: 'd', text: 'Ag' },
    ],
    correctAnswer: 'c',
    points: 10,
  },
  {
    id: '4',
    question: 'Which country is known as the Land of the Rising Sun?',
    options: [
      { id: 'a', text: 'China' },
      { id: 'b', text: 'South Korea' },
      { id: 'c', text: 'Vietnam' },
      { id: 'd', text: 'Japan' },
    ],
    correctAnswer: 'd',
    points: 10,
  },
  {
    id: '5',
    question: 'In which year did World War II end?',
    options: [
      { id: 'a', text: '1943' },
      { id: 'b', text: '1945' },
      { id: 'c', text: '1947' },
      { id: 'd', text: '1950' },
    ],
    correctAnswer: 'b',
    points: 10,
  },
];

// Function to shuffle array using Fisher-Yates algorithm
const shuffleArray = (array: typeof quizQuestions) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizContainer = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<typeof quizQuestions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [startTime] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [shouldSaveResults, setShouldSaveResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Effect to handle saving results when shouldSaveResults becomes true
  useEffect(() => {
    if (shouldSaveResults) {
      saveQuizResults();
      setShouldSaveResults(false);
    }
  }, [shouldSaveResults, score]);

  // Initialize with shuffled questions
  useEffect(() => {
    setQuestions(shuffleArray(quizQuestions));
  }, []);
  
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
    setQuestions(shuffleArray(quizQuestions));
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
    const endTime = new Date();
    const timeTaken = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    const correctAnswers = Math.floor(score / 10);
    const percentageScore = (correctAnswers / totalQuestions) * 100;
    const actualTotalQuestions = quizQuestions.length;
    
    const quizAttempt = {
      quizId: 'gk1',
      quizName: "General Knowledge Quiz",
      category: "General Knowledge",
      score: score === actualTotalQuestions * 10 ? 100 : percentageScore,
      totalQuestions: actualTotalQuestions,
      date: new Date().toISOString(),
      timeTaken: timeTaken,
      correctAnswers: correctAnswers
    };

    try {
      setIsSaving(true);
      const savedProfile = await saveQuizAttempt('1', quizAttempt);
      
      toast.success("Quiz results saved!", {
        description: `You got ${correctAnswers} out of ${actualTotalQuestions} correct (${quizAttempt.score}%)`,
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

  const questionTime = 30;

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
