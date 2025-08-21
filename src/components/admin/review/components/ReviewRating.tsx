
import React from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';

interface ReviewRatingProps {
  rating: number;
}

const ReviewRating: React.FC<ReviewRatingProps> = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOff key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="flex items-center">
      <div className="flex mr-1">
        {renderStars()}
      </div>
      <span className="text-xs text-muted-foreground">({rating})</span>
    </div>
  );
};

export default ReviewRating;
