
import React from 'react';

const features = [
  {
    title: "Thousands of Questions",
    description: "Access a vast library of quizzes across various categories and difficulty levels.",
    icon: "📚"
  },
  {
    title: "Compete with Friends",
    description: "Challenge your friends and see who can get the highest score.",
    icon: "🏆"
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed statistics.",
    icon: "📈"
  },
  {
    title: "Learn While Playing",
    description: "Expand your knowledge and learn new facts while having fun.",
    icon: "🧠"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-feature-gradient">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-game-dark">
          Why Play Our Quiz Game?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card hover:-translate-y-2">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-game-primary">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
