export interface QuizAttempt {
  id: string;
  quizId: string;
  quizName: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number; // Number of correct answers
  date: string;
  timeTaken: number; // in seconds
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  totalQuizzesTaken: number;
  averageScore: number;
  quizHistory: QuizAttempt[];
  bestScores: {
    [category: string]: {
      score: number;
      quizName: string;
      date: string;
    };
  };
}

export interface ProfileStats {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  categoriesPlayed: string[];
  recentActivity: QuizAttempt[];
} 