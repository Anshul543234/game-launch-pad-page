
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getAllCategories, getQuestionsByCategory } from '@/data/quizQuestions';

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    'Science': '🔬',
    'History': '📜',
    'Geography': '🌍',
    'Entertainment': '🎬',
    'Sports': '⚽',
    'Literature': '📚',
    'General': '🧠'
  };
  return icons[category] || '❓';
};

const getCategoryDescription = (category: string) => {
  const descriptions: { [key: string]: string } = {
    'Science': 'Test your knowledge about physics, chemistry, biology, and more.',
    'History': 'Explore events from ancient times to modern day milestones.',
    'Geography': 'Navigate through countries, capitals, landforms, and cultures.',
    'Entertainment': 'Challenge yourself on movies, music, TV shows, and celebrities.',
    'Sports': 'Put your sports trivia to the test across various competitions.',
    'Literature': 'Examine your knowledge of books, authors, and literary works.',
    'General': 'Test your general knowledge across various topics.'
  };
  return descriptions[category] || 'Test your knowledge in this category.';
};

const CategoriesPage = () => {
  const navigate = useNavigate();
  const availableCategories = getAllCategories();

  const handleStartQuiz = (category: string) => {
    // Store selected category in sessionStorage and navigate to quiz
    sessionStorage.setItem('selectedCategory', category);
    navigate('/question');
  };
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
            {availableCategories.map((category) => {
              const questionsCount = getQuestionsByCategory(category).length;
              return (
                <Card key={category} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-purple-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">{category}</CardTitle>
                      <span className="text-3xl">{getCategoryIcon(category)}</span>
                    </div>
                    <CardDescription>{getCategoryDescription(category)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{questionsCount} questions</span>
                      <button 
                        onClick={() => handleStartQuiz(category)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Start Quiz
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
