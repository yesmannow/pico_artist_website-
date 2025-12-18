'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Activity from 'lucide-react/dist/esm/icons/activity';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import { useStudioLocalStore } from '@/store/studioLocalStore';

interface ActivityItem {
  id: string;
  type: 'project_saved' | 'project_updated' | 'track_updated';
  message: string;
  timestamp: string;
  projectName?: string;
  trackTitle?: string;
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function SharedActivityLogLocal() {
  const [, setRefreshTick] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const activitiesEndRef = useRef<HTMLDivElement>(null);
  const { projects } = useStudioLocalStore();

  const activities = useMemo<ActivityItem[]>(() => {
    return projects
      .slice()
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10)
      .map((project) => {
        const created = new Date(project.created_at).getTime();
        const updated = new Date(project.updated_at).getTime();
        const isNew = created && created === updated;

        return {
          id: `project-${project.id}`,
          type: isNew ? 'project_saved' : 'project_updated',
          message: isNew
            ? `New project "${project.name}" saved`
            : `Project "${project.name}" updated`,
          timestamp: project.updated_at,
          projectName: project.name,
        };
      });
  }, [projects]);

  // Auto-scroll to bottom when new activities arrive
  useEffect(() => {
    if (isExpanded && activitiesEndRef.current) {
      activitiesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activities, isExpanded]);

  // Update timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTick((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 border-b border-zinc-800/50 bg-zinc-950/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Collapsed View - Marquee */}
        {!isExpanded && (
          <div className="py-2 overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-piko-teal">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider">Activity Log</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <motion.div
                  className="flex gap-6 whitespace-nowrap"
                  animate={{
                    x: [0, -1000],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  {activities.slice(0, 5).map((activity) => (
                    <span key={activity.id} className="text-xs text-zinc-400">
                      {activity.message} • {formatTimeAgo(activity.timestamp)}
                    </span>
                  ))}
                  {activities.length === 0 && (
                    <span className="text-xs text-zinc-500">No recent activity</span>
                  )}
                </motion.div>
              </div>
              <button
                onClick={() => setIsExpanded(true)}
                className="text-piko-teal hover:text-piko-teal/80 transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Expanded View - Full Log */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-3 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-piko-teal">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-semibold">Activity Log</span>
                    <span className="text-xs text-zinc-500 ml-2">
                      {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-zinc-400 hover:text-piko-teal transition-colors"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {activities.length === 0 ? (
                      <div className="text-sm text-zinc-500 text-center py-4">
                        No activity yet. Start creating to see updates!
                      </div>
                    ) : (
                      activities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-start gap-3 p-2 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-piko-teal mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-300">{activity.message}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {formatTimeAgo(activity.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                  <div ref={activitiesEndRef} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

