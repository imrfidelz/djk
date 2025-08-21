
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ReviewStatusBadgeProps {
  isApproved: boolean;
}

const ReviewStatusBadge: React.FC<ReviewStatusBadgeProps> = ({ isApproved }) => {
  return (
    <Badge variant={isApproved ? "default" : "outline"}>
      {isApproved ? 'Approved' : 'Pending'}
    </Badge>
  );
};

export default ReviewStatusBadge;
