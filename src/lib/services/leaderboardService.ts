import { UserProfile, QuizAttempt } from '../types/user';

export interface LeaderboardEntry {
  id: string;
  username: string;
  totalScore: number;
  totalQuizzes: number;
  averageScore: number;
  accuracy: number;
  bestScore: number;
  lastActivity: string;
  categories: string[];
}

export interface LeaderboardFilters {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

const LEADERBOARD_STORAGE_KEY = 'quiz_app_global_leaderboard';
const ALL_USERS_KEY = 'quiz_app_all_users';

// Get all registered users
const getAllUsers = (): UserProfile[] => {
  const stored = localStorage.getItem(ALL_USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save all users
const saveAllUsers = (users: UserProfile[]): void => {
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
};

// Add or update a user in the global users list
export const updateGlobalUserData = (userProfile: UserProfile): void => {
  const allUsers = getAllUsers();
  const existingIndex = allUsers.findIndex(user => user.id === userProfile.id);
  
  if (existingIndex >= 0) {
    allUsers[existingIndex] = userProfile;
  } else {
    allUsers.push(userProfile);
  }
  
  saveAllUsers(allUsers);
  generateLeaderboard();
};

// Calculate leaderboard entries from user profiles
const calculateLeaderboardEntry = (user: UserProfile, filters?: LeaderboardFilters): LeaderboardEntry => {
  let filteredHistory = user.quizHistory;
  
  // Apply filters if provided
  if (filters?.category) {
    filteredHistory = filteredHistory.filter(attempt => attempt.category === filters.category);
  }
  
  const totalScore = filteredHistory.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalQuestions = filteredHistory.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
  const correctAnswers = filteredHistory.reduce((sum, attempt) => sum + attempt.correctAnswers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const bestScore = Math.max(...filteredHistory.map(attempt => attempt.score), 0);
  const lastActivity = filteredHistory.length > 0 ? filteredHistory[0].date : user.joinDate;
  const categories = [...new Set(user.quizHistory.map(attempt => attempt.category))];

  return {
    id: user.id,
    username: user.username,
    totalScore,
    totalQuizzes: filteredHistory.length,
    averageScore: filteredHistory.length > 0 ? Math.round(totalScore / filteredHistory.length) : 0,
    accuracy,
    bestScore: bestScore > 0 ? bestScore : 0,
    lastActivity,
    categories
  };
};

// Generate and save leaderboard
const generateLeaderboard = (filters?: LeaderboardFilters): LeaderboardEntry[] => {
  const allUsers = getAllUsers();
  const leaderboard = allUsers
    .filter(user => user.totalQuizzesTaken > 0) // Only include users who have taken quizzes
    .map(user => calculateLeaderboardEntry(user, filters))
    .filter(entry => {
      // Filter out users with no quizzes after applying filters
      if (entry.totalQuizzes === 0) return false;
      
      // Filter by category if specified
      if (filters?.category && !entry.categories.includes(filters.category)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Primary sort: total score (descending)
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      // Secondary sort: average score (descending)
      if (b.averageScore !== a.averageScore) {
        return b.averageScore - a.averageScore;
      }
      // Tertiary sort: total quizzes (descending)
      return b.totalQuizzes - a.totalQuizzes;
    });

  if (!filters) {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
  }
  return leaderboard;
};

// Get current leaderboard
export const getLeaderboard = (filters?: LeaderboardFilters): LeaderboardEntry[] => {
  if (filters) {
    return generateLeaderboard(filters);
  }
  
  const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Generate leaderboard if it doesn't exist
  return generateLeaderboard();
};

// Get user's rank on leaderboard
export const getUserRank = (userId: string, filters?: LeaderboardFilters): number => {
  const leaderboard = getLeaderboard(filters);
  const userIndex = leaderboard.findIndex(entry => entry.id === userId);
  return userIndex >= 0 ? userIndex + 1 : -1;
};

// Get top N users
export const getTopUsers = (limit: number = 10, filters?: LeaderboardFilters): LeaderboardEntry[] => {
  const leaderboard = getLeaderboard(filters);
  return leaderboard.slice(0, limit);
};

// Get all available categories from quiz data
export const getAvailableCategories = (): string[] => {
  const allUsers = getAllUsers();
  const categories = new Set<string>();
  
  allUsers.forEach(user => {
    user.quizHistory.forEach(attempt => {
      categories.add(attempt.category);
    });
  });
  
  return Array.from(categories).sort();
};

// Initialize with some sample data if no users exist
export const initializeSampleData = (): void => {
  const existingUsers = getAllUsers();
  if (existingUsers.length === 0) {
    const sampleUsers: UserProfile[] = [
      {
        id: 'sample1',
        username: 'Alex Johnson',
        email: 'alex@example.com',
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalQuizzesTaken: 12,
        averageScore: 94,
        quizHistory: Array.from({ length: 12 }, (_, i) => ({
          id: `q${i + 1}`,
          quizId: 'gk-hard',
          quizName: 'General Knowledge Quiz (Hard)',
          category: 'General Knowledge',
          score: 90 + Math.floor(Math.random() * 10),
          totalQuestions: 10,
          correctAnswers: 9 + Math.floor(Math.random() * 2),
          date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
          timeTaken: 180 + Math.floor(Math.random() * 60)
        })),
        bestScores: {
          'General Knowledge': {
            score: 100,
            quizName: 'General Knowledge Quiz (Hard)',
            date: new Date().toISOString()
          }
        }
      },
      {
        id: 'sample2',
        username: 'Morgan Smith',
        email: 'morgan@example.com',
        joinDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        totalQuizzesTaken: 15,
        averageScore: 91,
        quizHistory: Array.from({ length: 15 }, (_, i) => ({
          id: `q${i + 1}`,
          quizId: 'gk-medium',
          quizName: 'General Knowledge Quiz (Medium)',
          category: 'General Knowledge',
          score: 85 + Math.floor(Math.random() * 15),
          totalQuestions: 10,
          correctAnswers: 8 + Math.floor(Math.random() * 3),
          date: new Date(Date.now() - i * 1.5 * 24 * 60 * 60 * 1000).toISOString(),
          timeTaken: 150 + Math.floor(Math.random() * 90)
        })),
        bestScores: {
          'General Knowledge': {
            score: 95,
            quizName: 'General Knowledge Quiz (Medium)',
            date: new Date().toISOString()
          }
        }
      }
    ];

    saveAllUsers(sampleUsers);
    generateLeaderboard();
  }
};