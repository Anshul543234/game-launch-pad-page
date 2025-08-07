
export interface QuizQuestion {
  id: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hint?: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Easy Questions - Science
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
    category: 'Science',
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
    category: 'General',
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
    category: 'General',
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
    category: 'Science',
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
    category: 'General',
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
    category: 'Science',
    hint: 'This planet appears reddish due to iron oxide (rust) on its surface.',
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
    category: 'Literature',
    hint: 'This famous playwright lived in England during the Elizabethan era.',
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
    category: 'Science',
    hint: 'The symbol comes from the Latin word "aurum" meaning gold.',
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
    category: 'Geography',
    hint: 'This country\'s flag features a red circle representing the sun.',
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
    category: 'History',
    hint: 'The war ended the same year atomic bombs were dropped on Japan.',
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
    category: 'Science',
    hint: 'This bone is found in the middle ear and is shaped like a stirrup.',
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
    category: 'Science',
    hint: 'This paradigm treats computation as the evaluation of mathematical functions.',
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
    category: 'Science',
    hint: 'This occurs when the pivot is always the smallest or largest element.',
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
    category: 'History',
    hint: 'This 18th-century Scottish philosopher is often called the father of modern economics.',
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
    category: 'Science',
    hint: 'Think about the inverse relationship between natural log and exponential functions.',
  },

  // Additional categorized questions
  // Entertainment Easy
  {
    id: 'ent1',
    question: 'Which movie features the song "Let It Go"?',
    options: [
      { id: 'a', text: 'Moana' },
      { id: 'b', text: 'Frozen' },
      { id: 'c', text: 'Tangled' },
      { id: 'd', text: 'The Little Mermaid' },
    ],
    correctAnswer: 'b',
    points: 5,
    difficulty: 'easy',
    category: 'Entertainment',
  },
  {
    id: 'ent2',
    question: 'What instrument does Sherlock Holmes play?',
    options: [
      { id: 'a', text: 'Piano' },
      { id: 'b', text: 'Guitar' },
      { id: 'c', text: 'Violin' },
      { id: 'd', text: 'Flute' },
    ],
    correctAnswer: 'c',
    points: 10,
    difficulty: 'medium',
    category: 'Entertainment',
    hint: 'This string instrument is often associated with classical music.',
  },

  // Sports Questions
  {
    id: 'spt1',
    question: 'How many players are on a basketball team on the court at one time?',
    options: [
      { id: 'a', text: '4' },
      { id: 'b', text: '5' },
      { id: 'c', text: '6' },
      { id: 'd', text: '7' },
    ],
    correctAnswer: 'b',
    points: 5,
    difficulty: 'easy',
    category: 'Sports',
  },
  {
    id: 'spt2',
    question: 'Which country hosted the 2016 Summer Olympics?',
    options: [
      { id: 'a', text: 'China' },
      { id: 'b', text: 'United Kingdom' },
      { id: 'c', text: 'Brazil' },
      { id: 'd', text: 'Russia' },
    ],
    correctAnswer: 'c',
    points: 10,
    difficulty: 'medium',
    category: 'Sports',
    hint: 'This South American country is famous for soccer and carnival.',
  },

  // More History Questions
  {
    id: 'hist1',
    question: 'Who was the first President of the United States?',
    options: [
      { id: 'a', text: 'Thomas Jefferson' },
      { id: 'b', text: 'John Adams' },
      { id: 'c', text: 'George Washington' },
      { id: 'd', text: 'Benjamin Franklin' },
    ],
    correctAnswer: 'c',
    points: 5,
    difficulty: 'easy',
    category: 'History',
  },
  {
    id: 'hist2',
    question: 'In which year did the Berlin Wall fall?',
    options: [
      { id: 'a', text: '1987' },
      { id: 'b', text: '1989' },
      { id: 'c', text: '1991' },
      { id: 'd', text: '1993' },
    ],
    correctAnswer: 'b',
    points: 15,
    difficulty: 'hard',
    category: 'History',
    hint: 'This event happened shortly before the end of the Cold War.',
  },

  // More Geography Questions
  {
    id: 'geo1',
    question: 'What is the capital of Australia?',
    options: [
      { id: 'a', text: 'Sydney' },
      { id: 'b', text: 'Melbourne' },
      { id: 'c', text: 'Canberra' },
      { id: 'd', text: 'Perth' },
    ],
    correctAnswer: 'c',
    points: 10,
    difficulty: 'medium',
    category: 'Geography',
    hint: 'It\'s not the largest city, but was purpose-built to be the capital.',
  },
  {
    id: 'geo2',
    question: 'Which river is the longest in the world?',
    options: [
      { id: 'a', text: 'Amazon' },
      { id: 'b', text: 'Nile' },
      { id: 'c', text: 'Mississippi' },
      { id: 'd', text: 'Yangtze' },
    ],
    correctAnswer: 'b',
    points: 15,
    difficulty: 'hard',
    category: 'Geography',
    hint: 'This river flows through northeastern Africa.',
  },
];

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByCategory = (category: string) => {
  return quizQuestions.filter(q => q.category === category);
};

export const getQuestionsByCategoryAndDifficulty = (category: string, difficulty: 'easy' | 'medium' | 'hard') => {
  return quizQuestions.filter(q => q.category === category && q.difficulty === difficulty);
};

export const getAllCategories = () => {
  const categories = [...new Set(quizQuestions.map(q => q.category))];
  return categories.sort();
};

export const getTimerDuration = (difficulty: 'easy' | 'medium' | 'hard') => {
  switch (difficulty) {
    case 'easy': return 45;
    case 'medium': return 30;
    case 'hard': return 20;
    default: return 30;
  }
};

// Get questions for a specific level with custom count
export const getQuestionsForLevel = (difficulty: 'easy' | 'medium' | 'hard', count: number) => {
  const questions = getQuestionsByDifficulty(difficulty);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
