export interface Level {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredScore: number; // Percentage score needed to advance
  requiredQuizzes: number; // Number of quizzes to complete at this level
  unlocked: boolean;
  questionsPerQuiz: number;
  timePerQuestion: number;
  pointsPerQuestion: number;
  badge?: string;
  description: string;
}

export interface LevelProgress {
  currentLevel: number;
  levels: Level[];
  totalExperience: number;
  unlockedLevels: Set<number>;
}

const STORAGE_KEY = 'quiz_app_level_progress';

// Define the level progression structure
const createLevelStructure = (): Level[] => [
  {
    id: 1,
    name: "Beginner",
    difficulty: 'easy',
    requiredScore: 60,
    requiredQuizzes: 2,
    unlocked: true,
    questionsPerQuiz: 5,
    timePerQuestion: 45,
    pointsPerQuestion: 5,
    badge: "🌱",
    description: "Start your quiz journey with simple questions"
  },
  {
    id: 2,
    name: "Explorer",
    difficulty: 'easy',
    requiredScore: 70,
    requiredQuizzes: 3,
    unlocked: true,
    questionsPerQuiz: 6,
    timePerQuestion: 40,
    pointsPerQuestion: 6,
    badge: "🔍",
    description: "Build confidence with slightly harder questions"
  },
  {
    id: 3,
    name: "Apprentice",
    difficulty: 'medium',
    requiredScore: 65,
    requiredQuizzes: 2,
    unlocked: true,
    questionsPerQuiz: 5,
    timePerQuestion: 35,
    pointsPerQuestion: 10,
    badge: "📚",
    description: "Enter the world of moderate challenges"
  },
  {
    id: 4,
    name: "Scholar",
    difficulty: 'medium',
    requiredScore: 75,
    requiredQuizzes: 3,
    unlocked: true,
    questionsPerQuiz: 7,
    timePerQuestion: 30,
    pointsPerQuestion: 12,
    badge: "🎓",
    description: "Demonstrate your growing knowledge"
  },
  {
    id: 5,
    name: "Expert",
    difficulty: 'hard',
    requiredScore: 70,
    requiredQuizzes: 2,
    unlocked: true,
    questionsPerQuiz: 5,
    timePerQuestion: 25,
    pointsPerQuestion: 15,
    badge: "⭐",
    description: "Face challenging questions head-on"
  },
  {
    id: 6,
    name: "Master",
    difficulty: 'hard',
    requiredScore: 80,
    requiredQuizzes: 3,
    unlocked: true,
    questionsPerQuiz: 8,
    timePerQuestion: 20,
    pointsPerQuestion: 18,
    badge: "🏆",
    description: "Prove your mastery of knowledge"
  },
  {
    id: 7,
    name: "Grandmaster",
    difficulty: 'hard',
    requiredScore: 85,
    requiredQuizzes: 5,
    unlocked: true,
    questionsPerQuiz: 10,
    timePerQuestion: 18,
    pointsPerQuestion: 20,
    badge: "👑",
    description: "The ultimate quiz challenge awaits"
  }
];

const getDefaultProgress = (): LevelProgress => ({
  currentLevel: 1,
  levels: createLevelStructure(),
  totalExperience: 0,
  unlockedLevels: new Set([1, 2, 3, 4, 5, 6, 7])
});

const getStoredProgress = (): LevelProgress => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultProgress = getDefaultProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...defaultProgress,
      unlockedLevels: Array.from(defaultProgress.unlockedLevels)
    }));
    return defaultProgress;
  }
  
  const parsed = JSON.parse(stored);
  return {
    ...parsed,
    unlockedLevels: new Set(parsed.unlockedLevels || [1, 2, 3, 4, 5, 6, 7])
  };
};

const saveProgress = (progress: LevelProgress): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...progress,
    unlockedLevels: Array.from(progress.unlockedLevels)
  }));
};

export const getLevelProgress = async (): Promise<LevelProgress> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProgress());
    }, 100);
  });
};

export const getCurrentLevel = async (): Promise<Level> => {
  const progress = await getLevelProgress();
  return progress.levels.find(level => level.id === progress.currentLevel) || progress.levels[0];
};

export const checkLevelAdvancement = async (
  quizScore: number, 
  currentLevelId: number,
  quizHistory: any[]
): Promise<{ 
  shouldAdvance: boolean; 
  newLevel?: Level; 
  progress: LevelProgress;
  message?: string;
}> => {
  const progress = getStoredProgress();
  const currentLevel = progress.levels.find(l => l.id === currentLevelId);
  
  if (!currentLevel) {
    return { shouldAdvance: false, progress };
  }

  // Count quizzes completed at current level
  const currentLevelQuizzes = quizHistory.filter(quiz => 
    quiz.quizName.includes(currentLevel.name) || 
    quiz.category === "General Knowledge" // For backward compatibility
  );

  const recentQuizzes = currentLevelQuizzes.slice(0, currentLevel.requiredQuizzes);
  const averageScore = recentQuizzes.length > 0 
    ? recentQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / recentQuizzes.length 
    : 0;

  // Check if requirements are met
  const hasEnoughQuizzes = recentQuizzes.length >= currentLevel.requiredQuizzes;
  const hasRequiredScore = averageScore >= currentLevel.requiredScore;
  
  if (hasEnoughQuizzes && hasRequiredScore) {
    const nextLevelId = currentLevelId + 1;
    const nextLevel = progress.levels.find(l => l.id === nextLevelId);
    
    if (nextLevel) {
      // Unlock next level and advance
      const updatedProgress: LevelProgress = {
        ...progress,
        currentLevel: nextLevelId,
        totalExperience: progress.totalExperience + (quizScore * currentLevel.pointsPerQuestion),
        unlockedLevels: new Set([...Array.from(progress.unlockedLevels), nextLevelId])
      };
      
      // Update level unlock status
      updatedProgress.levels = progress.levels.map(level => ({
        ...level,
        unlocked: updatedProgress.unlockedLevels.has(level.id)
      }));
      
      saveProgress(updatedProgress);
      
      return {
        shouldAdvance: true,
        newLevel: nextLevel,
        progress: updatedProgress,
        message: `Congratulations! You've advanced to ${nextLevel.name} level!`
      };
    }
  }

  // Update experience even if not advancing
  const updatedProgress: LevelProgress = {
    ...progress,
    totalExperience: progress.totalExperience + (quizScore * currentLevel.pointsPerQuestion / 100)
  };
  
  saveProgress(updatedProgress);

  const quizzesLeft = Math.max(0, currentLevel.requiredQuizzes - recentQuizzes.length);
  const scoreNeeded = Math.max(0, currentLevel.requiredScore - averageScore);
  
  let message = '';
  if (quizzesLeft > 0) {
    message = `Complete ${quizzesLeft} more quiz${quizzesLeft === 1 ? '' : 'es'} to advance.`;
  } else if (scoreNeeded > 0) {
    message = `Improve your average by ${scoreNeeded.toFixed(1)}% to advance.`;
  }

  return {
    shouldAdvance: false,
    progress: updatedProgress,
    message
  };
};

export const unlockLevel = async (levelId: number): Promise<LevelProgress> => {
  const progress = getStoredProgress();
  const updatedProgress: LevelProgress = {
    ...progress,
    unlockedLevels: new Set([...Array.from(progress.unlockedLevels), levelId])
  };
  
  updatedProgress.levels = progress.levels.map(level => ({
    ...level,
    unlocked: updatedProgress.unlockedLevels.has(level.id)
  }));
  
  saveProgress(updatedProgress);
  return updatedProgress;
};

export const setCurrentLevel = async (levelId: number): Promise<LevelProgress> => {
  const progress = getStoredProgress();
  
  const updatedProgress: LevelProgress = {
    ...progress,
    currentLevel: levelId
  };
  
  saveProgress(updatedProgress);
  return updatedProgress;
};

export const resetLevelProgress = async (): Promise<LevelProgress> => {
  const defaultProgress = getDefaultProgress();
  saveProgress(defaultProgress);
  return defaultProgress;
};