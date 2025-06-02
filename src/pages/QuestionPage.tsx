
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizContainer from '@/components/QuizContainer';

const QuestionPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-purple-50 py-12 px-4">
        <QuizContainer />
      </main>
      <Footer />
    </div>
  );
};

export default QuestionPage;
