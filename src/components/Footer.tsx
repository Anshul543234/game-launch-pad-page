
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-game-dark text-game-light py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">QuizMaster</h2>
            <p className="text-sm text-game-light/70">Challenge your mind with our quiz game</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-game-light hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="text-game-light hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-game-light hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-game-light hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-game-light/20 pt-4 text-center text-sm text-game-light/70">
          &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
