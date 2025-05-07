
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 1,
    name: 'Science',
    description: 'Test your knowledge about physics, chemistry, biology, and more.',
    icon: '🔬',
    questions: 25
  },
  {
    id: 2,
    name: 'History',
    description: 'Explore events from ancient times to modern day milestones.',
    icon: '📜',
    questions: 30
  },
  {
    id: 3,
    name: 'Geography',
    description: 'Navigate through countries, capitals, landforms, and cultures.',
    icon: '🌍',
    questions: 20
  },
  {
    id: 4,
    name: 'Entertainment',
    description: 'Challenge yourself on movies, music, TV shows, and celebrities.',
    icon: '🎬',
    questions: 35
  },
  {
    id: 5,
    name: 'Sports',
    description: 'Put your sports trivia to the test across various competitions.',
    icon: '⚽',
    questions: 28
  },
  {
    id: 6,
    name: 'Literature',
    description: 'Examine your knowledge of books, authors, and literary works.',
    icon: '📚',
    questions: 22
  }
];

const CategoriesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4 md:px-8 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">Quiz Categories</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a category that interests you and put your knowledge to the test. Each category offers a unique set of challenging questions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-purple-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{category.questions} questions</span>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                      Start Quiz
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
