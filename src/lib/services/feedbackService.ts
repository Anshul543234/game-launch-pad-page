import { FeedbackData } from '@/components/FeedbackModal';

const FEEDBACK_STORAGE_KEY = 'quiz_feedback_data';

export interface StoredFeedback extends FeedbackData {
  id: string;
}

export const feedbackService = {
  // Save feedback to localStorage
  saveFeedback: (feedback: FeedbackData): void => {
    try {
      const existingFeedback = feedbackService.getAllFeedback();
      const newFeedback: StoredFeedback = {
        ...feedback,
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      
      const updatedFeedback = [...existingFeedback, newFeedback];
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  },

  // Get all feedback
  getAllFeedback: (): StoredFeedback[] => {
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving feedback:', error);
      return [];
    }
  },

  // Get feedback statistics
  getFeedbackStats: () => {
    const feedback = feedbackService.getAllFeedback();
    
    if (feedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        positiveExperience: 0,
        negativeExperience: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRating / feedback.length;
    
    const positiveExperience = feedback.filter(f => f.experience === 'positive').length;
    const negativeExperience = feedback.filter(f => f.experience === 'negative').length;
    
    const ratingDistribution = feedback.reduce((dist, f) => {
      dist[f.rating as keyof typeof dist]++;
      return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return {
      totalFeedback: feedback.length,
      averageRating: Math.round(averageRating * 10) / 10,
      positiveExperience,
      negativeExperience,
      ratingDistribution,
    };
  },

  // Clear all feedback (for testing purposes)
  clearAllFeedback: (): void => {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  },
};