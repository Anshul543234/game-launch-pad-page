
import React from 'react';

interface QuestionTransitionProps {
  children: React.ReactNode;
  isTransitioning: boolean;
}

const QuestionTransition = ({ children, isTransitioning }: QuestionTransitionProps) => {
  return (
    <div className={`transform transition-all duration-300 ease-in-out ${
      isTransitioning 
        ? 'opacity-0 translate-x-4 scale-95' 
        : 'opacity-100 translate-x-0 scale-100'
    }`}>
      {children}
    </div>
  );
};

export default QuestionTransition;
