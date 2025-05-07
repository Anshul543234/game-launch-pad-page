
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuestionCard from '@/components/QuestionCard';

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
  },
];

const QuestionPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const handleAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
  };
  
  const handleNext = () => {
    // Check if answer is correct and update score
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    // Move to next question or show results
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(undefined);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setScore(0);
    setShowResults(false);
  };

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
                  <span className="text-sm font-medium">Score: {score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <QuestionCard
                question={currentQuestion.question}
                options={currentQuestion.options}
                onAnswer={handleAnswer}
                onNext={handleNext}
                selectedAnswer={selectedAnswer}
              />
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-lg mb-6">
                Your score: <span className="font-bold text-purple-600">{score}</span> out of {totalQuestions}
              </p>
              <button
                onClick={handleRestart}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionPage;
