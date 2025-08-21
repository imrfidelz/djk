
import React from 'react';
import ReviewTable from './components/ReviewTable';
import AddReviewButton from './components/AddReviewButton';

const ReviewManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#212121] font-['Inter',sans-serif]">Review Management</h1>
          <p className="text-[#9E9E9E] text-base mt-2">Manage and moderate product reviews</p>
        </div>
        <AddReviewButton />
      </div>
      
      <ReviewTable />
    </div>
  );
};

export default ReviewManagement;
