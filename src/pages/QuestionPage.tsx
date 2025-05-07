
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuestionCard from '@/components/QuestionCard';

// Sample question data - in a real app, this would come from an API or props
const sampleQuestion = {
  id: '1',
  question: 'Which planet is known as the Red Planet?',
  options: [
    { id: 'a', text: 'Venus' },
    { id: 'b', text: 'Mars' },
    { id: 'c', text: 'Jupiter' },
    { id: 'd', text: 'Saturn' },
  ],
  correctAnswer: 'b',
};

const QuestionPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  
  const handleAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
  };
  
  const handleNext = () => {
    // In a real app, this would save the answer and move to the next question
    console.log(`Selected answer: ${selectedAnswer}`);
    // Reset selection for demo purposes
    setSelectedAnswer(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-purple-50 py-12 px-4">
        <div className="w-full max-w-3xl">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-purple-600">Question 1/10</span>
              <span className="text-sm font-medium">Time: 00:30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full w-1/10"></div>
            </div>
          </div>
          
          <QuestionCard
            question={sampleQuestion.question}
            options={sampleQuestion.options}
            onAnswer={handleAnswer}
            onNext={handleNext}
            selectedAnswer={selectedAnswer}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionPage;
