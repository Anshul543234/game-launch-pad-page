
export interface QuizQuestion {
  id: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizQuestions: QuizQuestion[] = [
  // Easy Questions
  {
    id: 'e1',
    question: 'What color do you get when you mix red and white?',
    options: [
      { id: 'a', text: 'Purple' },
      { id: 'b', text: 'Pink' },
      { id: 'c', text: 'Orange' },
      { id: 'd', text: 'Yellow' },
    ],
    correctAnswer: 'b',
    points: 5,
    difficulty: 'easy',
  },
  {
    id: 'e2',
    question: 'How many days are there in a week?',
    options: [
      { id: 'a', text: '5' },
      { id: 'b', text: '6' },
      { id: 'c', text: '7' },
      { id: 'd', text: '8' },
    ],
    correctAnswer: 'c',
    points: 5,
    difficulty: 'easy',
  },
  {
    id: 'e3',
    question: 'Which animal is known as "man\'s best friend"?',
    options: [
      { id: 'a', text: 'Cat' },
      { id: 'b', text: 'Dog' },
      { id: 'c', text: 'Bird' },
      { id: 'd', text: 'Fish' },
    ],
    correctAnswer: 'b',
    points: 5,
    difficulty: 'easy',
  },
  {
    id: 'e4',
    question: 'What do bees make?',
    options: [
      { id: 'a', text: 'Milk' },
      { id: 'b', text: 'Honey' },
      { id: 'c', text: 'Butter' },
      { id: 'd', text: 'Cheese' },
    ],
    correctAnswer: 'b',
    points: 5,
    difficulty: 'easy',
  },
  {
    id: 'e5',
    question: 'Which season comes after winter?',
    options: [
      { id: 'a', text: 'Summer' },
      { id: 'b', text: 'Fall' },
      { id: 'c', text: 'Spring' },
      { id: 'd', text: 'Autumn' },
    ],
    correctAnswer: 'c',
    points: 5,
    difficulty: 'easy',
  },

  // Medium Questions
  {
    id: 'm1',
    question: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'a', text: 'Venus' },
      { id: 'b', text: 'Mars' },
      { id: 'c', text: 'Jupiter' },
      { id: 'd', text: 'Saturn' },
    ],
    correctAnswer: 'b',
    points: 10,
    difficulty: 'medium',
  },
  {
    id: 'm2',
    question: 'Who wrote "Romeo and Juliet"?',
    options: [
      { id: 'a', text: 'Charles Dickens' },
      { id: 'b', text: 'William Shakespeare' },
      { id: 'c', text: 'Jane Austen' },
      { id: 'd', text: 'Mark Twain' },
    ],
    correctAnswer: 'b',
    points: 10,
    difficulty: 'medium',
  },
  {
    id: 'm3',
    question: 'What is the chemical symbol for gold?',
    options: [
      { id: 'a', text: 'Go' },
      { id: 'b', text: 'Gd' },
      { id: 'c', text: 'Au' },
      { id: 'd', text: 'Ag' },
    ],
    correctAnswer: 'c',
    points: 10,
    difficulty: 'medium',
  },
  {
    id: 'm4',
    question: 'Which country is known as the Land of the Rising Sun?',
    options: [
      { id: 'a', text: 'China' },
      { id: 'b', text: 'South Korea' },
      { id: 'c', text: 'Vietnam' },
      { id: 'd', text: 'Japan' },
    ],
    correctAnswer: 'd',
    points: 10,
    difficulty: 'medium',
  },
  {
    id: 'm5',
    question: 'In which year did World War II end?',
    options: [
      { id: 'a', text: '1943' },
      { id: 'b', text: '1945' },
      { id: 'c', text: '1947' },
      { id: 'd', text: '1950' },
    ],
    correctAnswer: 'b',
    points: 10,
    difficulty: 'medium',
  },

  // Hard Questions
  {
    id: 'h1',
    question: 'What is the smallest bone in the human body?',
    options: [
      { id: 'a', text: 'Stapes' },
      { id: 'b', text: 'Malleus' },
      { id: 'c', text: 'Incus' },
      { id: 'd', text: 'Hyoid' },
    ],
    correctAnswer: 'a',
    points: 15,
    difficulty: 'hard',
  },
  {
    id: 'h2',
    question: 'Which programming paradigm does Haskell primarily follow?',
    options: [
      { id: 'a', text: 'Object-oriented' },
      { id: 'b', text: 'Procedural' },
      { id: 'c', text: 'Functional' },
      { id: 'd', text: 'Logic' },
    ],
    correctAnswer: 'c',
    points: 15,
    difficulty: 'hard',
  },
  {
    id: 'h3',
    question: 'What is the time complexity of quick sort in the worst case?',
    options: [
      { id: 'a', text: 'O(n)' },
      { id: 'b', text: 'O(n log n)' },
      { id: 'c', text: 'O(n²)' },
      { id: 'd', text: 'O(log n)' },
    ],
    correctAnswer: 'c',
    points: 15,
    difficulty: 'hard',
  },
  {
    id: 'h4',
    question: 'Which economist wrote "The Wealth of Nations"?',
    options: [
      { id: 'a', text: 'Karl Marx' },
      { id: 'b', text: 'John Maynard Keynes' },
      { id: 'c', text: 'Adam Smith' },
      { id: 'd', text: 'Milton Friedman' },
    ],
    correctAnswer: 'c',
    points: 15,
    difficulty: 'hard',
  },
  {
    id: 'h5',
    question: 'What is the derivative of ln(x) with respect to x?',
    options: [
      { id: 'a', text: '1/x' },
      { id: 'b', text: 'x' },
      { id: 'c', text: 'ln(x)' },
      { id: 'd', text: 'e^x' },
    ],
    correctAnswer: 'a',
    points: 15,
    difficulty: 'hard',
  },
];

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

export const getTimerDuration = (difficulty: 'easy' | 'medium' | 'hard') => {
  switch (difficulty) {
    case 'easy': return 45;
    case 'medium': return 30;
    case 'hard': return 20;
    default: return 30;
  }
};
