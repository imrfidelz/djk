
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService, RecentUpdate } from '@/services/dashboardService';
import { formatDistanceToNow } from 'date-fns';

const RecentUpdates: React.FC = () => {
  const { data: updates, isLoading, error } = useQuery<RecentUpdate[]>({
    queryKey: ['dashboard-recent-updates'],
    queryFn: dashboardService.getRecentUpdates,
    retry: 1,
  });

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-[#212121] font-['Inter',sans-serif]">
          Recent Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <>
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </>
        )}

        {error && (
          <p className="text-[#F44336] text-sm">Failed to load updates.</p>
        )}

        {!isLoading && !error && (updates?.length ? (
          updates.map((update) => {
            const initials = update.user
              ? update.user.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase()
              : 'CU';
            const timeText = update.time
              ? formatDistanceToNow(new Date(update.time), { addSuffix: true })
              : '';
            return (
              <div key={update.id} className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                  style={{ backgroundColor: update.color || '#7C4DFF' }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#424242] leading-relaxed">
                    <span className="font-medium">{update.user}</span>{' '}
                    <span className="text-[#757575]">{update.action}</span>{' '}
                    <span className="font-medium">{update.item}</span>
                  </p>
                  <p className="text-xs text-[#9E9E9E] mt-1">{timeText}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-[#9E9E9E]">No recent updates.</p>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentUpdates;
