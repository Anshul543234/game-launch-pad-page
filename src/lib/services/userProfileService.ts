import { UserProfile, QuizAttempt } from '../types/user';

const STORAGE_KEY = 'quiz_app_user_profile';

// Initialize default profile if none exists
const getDefaultProfile = (): UserProfile => ({
  id: '1',
  username: 'QuizMaster',
  email: 'quizmaster@example.com',
  joinDate: new Date().toISOString(),
  totalQuizzesTaken: 0,
  averageScore: 0,
  quizHistory: [],
  bestScores: {}
});

// Helper functions for localStorage
const getStoredProfile = (): UserProfile => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultProfile = getDefaultProfile();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  return JSON.parse(stored);
};

const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // Simulate API call with localStorage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProfile());
    }, 500);
  });
};

const validateQuizAttempt = (attempt: QuizAttempt): QuizAttempt => {
  // Ensure score is between 0 and 100
  const validatedScore = Math.min(Math.max(attempt.score, 0), 100);
  
  // If all questions are correct, ensure score is 100
  if (attempt.correctAnswers === attempt.totalQuestions) {
    return {
      ...attempt,
      score: 100
    };
  }
  
  return {
    ...attempt,
    score: validatedScore
  };
};

export const saveQuizAttempt = async (userId: string, attempt: Omit<QuizAttempt, 'id'>): Promise<UserProfile> => {
  return new Promise((resolve) => {
    // Get current profile
    const currentProfile = getStoredProfile();

    // Generate a new ID for the attempt
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `q${currentProfile.quizHistory.length + 1}`
    };

    // Validate and normalize the attempt data
    const validatedAttempt = validateQuizAttempt(newAttempt);

    console.log('Saving Quiz Attempt:', {
      original: newAttempt,
      validated: validatedAttempt
    });

    // Create updated profile
    const updatedProfile: UserProfile = {
      ...currentProfile,
      quizHistory: [validatedAttempt, ...currentProfile.quizHistory],
      totalQuizzesTaken: currentProfile.quizHistory.length + 1,
      averageScore: calculateNewAverageScore([validatedAttempt, ...currentProfile.quizHistory]),
      bestScores: updateBestScores(currentProfile.bestScores, validatedAttempt)
    };

    console.log('Updated Profile:', {
      totalQuizzes: updatedProfile.totalQuizzesTaken,
      averageScore: updatedProfile.averageScore,
      bestScores: updatedProfile.bestScores
    });

    // Save to localStorage
    saveProfile(updatedProfile);

    // Simulate API delay
    setTimeout(() => resolve(updatedProfile), 500);
  });
};

// Helper function to calculate new average score
const calculateNewAverageScore = (history: QuizAttempt[]): number => {
  if (history.length === 0) return 0;
  const totalScore = history.reduce((sum, attempt) => sum + attempt.score, 0);
  return Math.round(totalScore / history.length);
};

// Helper function to update best scores
const updateBestScores = (
  currentBestScores: UserProfile['bestScores'],
  newAttempt: QuizAttempt
): UserProfile['bestScores'] => {
  const category = newAttempt.category;
  const newBestScores = { ...currentBestScores };

  // Always use the validated score for best scores
  const attemptScore = newAttempt.correctAnswers === newAttempt.totalQuestions ? 100 : newAttempt.score;

  if (!newBestScores[category] || attemptScore > newBestScores[category].score) {
    newBestScores[category] = {
      score: attemptScore,
      quizName: newAttempt.quizName,
      date: newAttempt.date
    };
  }

  return newBestScores;
};

export const getQuizHistory = async (userId: string): Promise<QuizAttempt[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProfile().quizHistory);
    }, 500);
  });
};

export const getBestScores = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProfile().bestScores);
    }, 500);
  });
};

// Additional utility functions for profile management
export const resetProfile = async (): Promise<UserProfile> => {
  const defaultProfile = getDefaultProfile();
  saveProfile(defaultProfile);
  return defaultProfile;
};

export const updateProfileInfo = async (
  userId: string,
  updates: Partial<Pick<UserProfile, 'username' | 'email'>>
): Promise<UserProfile> => {
  const currentProfile = getStoredProfile();
  const updatedProfile = {
    ...currentProfile,
    ...updates
  };
  saveProfile(updatedProfile);
  return updatedProfile;
}; 