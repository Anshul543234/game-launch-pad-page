import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuestionCard from '@/components/QuestionCard';
import Timer from '@/components/Timer';
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
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

const QuestionPage = () => {
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
  
  // Effect to handle saving results when shouldSaveResults becomes true
  useEffect(() => {
    if (shouldSaveResults) {
      saveQuizResults();
      setShouldSaveResults(false);
    }
  }, [shouldSaveResults, score]); // Re-run when score changes

  // Initialize with shuffled questions
  useEffect(() => {
    setQuestions(shuffleArray(quizQuestions));
  }, []);
  
  const currentQuestion = questions[currentQuestionIndex] || { question: '', options: [], correctAnswer: '', points: 0 };
  const totalQuestions = questions.length;
  const progress = totalQuestions ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  
  const handleAnswer = (answerId: string) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answerId);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(undefined);
      setAnswerSubmitted(false);
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
        // For the last question, wait for score update then save
        setShowResults(true);
        setShouldSaveResults(true);
      }
    } else {
      if (currentQuestionIndex === totalQuestions - 1) {
        // Even for incorrect answer on last question, show results
        setShowResults(true);
        setShouldSaveResults(true);
      }
    }
    
    // Don't automatically proceed to next question - user will click Continue
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
    
    // Calculate correct answers and percentage
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

  // 30 seconds per question
  const questionTime = 30;

  // Don't render until questions are loaded
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-purple-50 py-12 px-4">
          <div className="text-center">Loading questions...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-purple-50 py-12 px-4">
        <div className="w-full max-w-3xl">
          {!showResults ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-600">
                    Question {currentQuestionIndex + 1}/{totalQuestions}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      Score: {score}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <Timer 
                  initialTime={questionTime} 
                  onTimeUp={handleTimeUp} 
                />
              </div>
              
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
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-lg mb-6">
                Your score: <span className="font-bold text-purple-600">
                  {Math.floor((score / (totalQuestions * 10)) * 100)}%
                </span>
                <br />
                <span className="text-sm text-gray-600">
                  ({Math.floor(score / 10)} out of {totalQuestions} correct)
                </span>
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleRestart}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors mr-4"
                  disabled={isSaving}
                >
                  Try Again
                </button>
                {isSaving ? (
                  <div className="text-gray-600">
                    Saving your results...
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Your results will be saved to your profile
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionPage;
