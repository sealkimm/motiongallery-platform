'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

import { cn } from '@/lib/utils';

interface VisitorStatsData {
  total_visits: number;
  today_visits: number;
}

interface VisitorStatsProps {
  className?: string;
}

const VisitorStats = ({ className }: VisitorStatsProps) => {
  const [stats, setStats] = useState<VisitorStatsData | null>(null);

  useEffect(() => {
    fetch('/api/visitor', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5',
        className,
      )}
    >
      <Users size={14} className="text-gray-400" />
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">Today: </span>
        <span className="text-xs font-medium text-gray-300">
          {stats.today_visits}
        </span>
      </div>
      <div className="h-3 w-px bg-white/10"></div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">Total: </span>
        <span className="text-xs font-medium text-gray-300">
          {stats.total_visits}
        </span>
      </div>
    </div>
  );
};

export default VisitorStats;
