'use client';

import React, { useState, memo, useCallback } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  existingReview?: {
    id: string;
    rating: number;
    reviewText?: string | null;
  } | null;
  onReviewAdded?: () => void;
}

const MAX_REVIEW_LENGTH = 1000;

const ReviewFormComponent = ({ tmdbId, mediaType, existingReview, onReviewAdded }: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [review, setReview] = useState(existingReview?.reviewText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Please select a rating');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const trimmedReview = review.trim();
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId,
          mediaType,
          rating,
          reviewText: trimmedReview || undefined
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to submit review');
      }

      onReviewAdded?.();
      router.refresh();
      if (!existingReview) {
        setRating(0);
        setReview('');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit review';
      console.error('Failed to submit review:', message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [rating, review, tmdbId, mediaType, existingReview, onReviewAdded]);

  const handleStarClick = useCallback((star: number) => {
    setRating(star);
    setError(null);
  }, []);

  const handleReviewChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReview = e.target.value;
    if (newReview.length <= MAX_REVIEW_LENGTH) {
      setReview(newReview);
      setError(null);
    }
  }, []);

  return (
    <Card className="bg-surface border-white/10">
      <CardHeader>
        <CardTitle className="text-white">
          {existingReview ? 'Edit Your Review' : 'Write a Review'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Rating</label>
            <div className="flex items-center gap-1" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                  aria-label={`Rate ${star} stars`}
                  aria-pressed={rating === star}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-white/20 hover:text-yellow-500/50'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-white/60">You rated this {rating} star{rating !== 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label htmlFor="review" className="text-white/80 text-sm font-medium">
              Review (Optional)
            </label>
            <Textarea
              id="review"
              value={review}
              onChange={handleReviewChange}
              placeholder="Share your thoughts about this title..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px] resize-none"
              maxLength={MAX_REVIEW_LENGTH}
              aria-describedby="review-count"
            />
            <div id="review-count" className="text-right text-xs text-white/50">
              {review.length}/{MAX_REVIEW_LENGTH}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm" role="alert">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={rating < 1 || rating > 5 || isSubmitting}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                {existingReview ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              existingReview ? 'Update Review' : 'Submit Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

ReviewFormComponent.displayName = 'ReviewForm';

export const ReviewForm = memo(ReviewFormComponent);


