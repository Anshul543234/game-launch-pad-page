import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
  quizType?: string;
  score?: number;
}

export interface FeedbackData {
  rating: number;
  experience: 'positive' | 'negative' | null;
  comments: string;
  timestamp: number;
  quizType?: string;
  score?: number;
}

const FeedbackModal = ({ isOpen, onClose, onSubmit, quizType, score }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [experience, setExperience] = useState<'positive' | 'negative' | null>(null);
  const [comments, setComments] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    const feedbackData: FeedbackData = {
      rating,
      experience,
      comments,
      timestamp: Date.now(),
      quizType,
      score,
    };

    onSubmit(feedbackData);
    
    // Reset form
    setRating(0);
    setHoveredRating(0);
    setExperience(null);
    setComments('');
    
    toast({
      title: "Thank you!",
      description: "Your feedback has been submitted successfully.",
    });
    
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setExperience(null);
    setComments('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Share Your Experience
          </DialogTitle>
          <DialogDescription>
            Help us improve by sharing your feedback about the quiz experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rate your experience</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Overall Experience */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Overall experience</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={experience === 'positive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExperience(experience === 'positive' ? null : 'positive')}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                Positive
              </Button>
              <Button
                type="button"
                variant={experience === 'negative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExperience(experience === 'negative' ? null : 'negative')}
                className="flex items-center gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                Negative
              </Button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Comments (optional)</label>
            <Textarea
              placeholder="Tell us what you liked or how we can improve..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            Skip
          </Button>
          <Button onClick={handleSubmit}>
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;