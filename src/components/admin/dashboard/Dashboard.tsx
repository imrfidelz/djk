
import React from 'react';
import DashboardOverview from './DashboardOverview';
import RecentUpdates from './RecentUpdates';

const Dashboard = () => {
  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#212121] font-['Inter',sans-serif]">Dashboard</h1>
          <p className="text-[#9E9E9E] text-base mt-1">{formattedDate}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content Area - Stats and Recent Orders */}
        <div className="xl:col-span-3 space-y-6">
          <DashboardOverview />
        </div>
        
        {/* Sidebar - Recent Updates */}
        <div className="xl:col-span-1">
          <RecentUpdates />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
