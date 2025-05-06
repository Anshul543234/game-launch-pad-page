
import React from 'react';
import { Button } from '@/components/ui/button';
import StartButton from './StartButton';

const HeroSection = () => {
  return (
    <section className="bg-hero-pattern min-h-[80vh] flex items-center justify-center text-white px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 py-12">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Challenge Your <span className="text-game-accent">Mind</span>
          </h1>
          <p className="text-xl md:text-2xl text-game-light/90">
            Test your knowledge, learn new facts, and compete with friends in this 
            addictive quiz game experience.
          </p>
          <div className="pt-6">
            <StartButton />
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute top-0 left-0 w-72 h-72 bg-game-accent/20 rounded-full animate-float"></div>
            <div className="absolute bottom-16 right-10 w-40 h-40 bg-game-light/30 rounded-full animate-float" 
                 style={{animationDelay: "1s"}}></div>
            <div className="absolute top-10 right-10 w-56 h-56 bg-game-secondary/20 rounded-full animate-float"
                 style={{animationDelay: "2s"}}></div>
                 
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="game-card w-64 h-64 flex items-center justify-center animate-bounce-subtle">
                <span className="text-6xl font-bold text-game-primary">?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
