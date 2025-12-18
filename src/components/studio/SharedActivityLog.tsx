'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Activity from 'lucide-react/dist/esm/icons/activity';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import { supabase } from '@/lib/supabase';

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

export default function SharedActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const activitiesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial activities
  useEffect(() => {
    async function fetchInitialActivities() {
      try {
        // Fetch last 10 projects ordered by updated_at
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id, name, project_data, updated_at, created_at')
          .order('updated_at', { ascending: false })
          .limit(10);

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          return;
        }

        const initialActivities: ActivityItem[] = (projects || []).map((project: any) => {
          const isNew = new Date(project.created_at).getTime() === new Date(project.updated_at).getTime();

          // Extract project name from project_data JSON or use name field
          let projectName = project.name || 'Untitled Project';
          if (project.project_data) {
            try {
              const projectData = typeof project.project_data === 'string'
                ? JSON.parse(project.project_data)
                : project.project_data;
              projectName = projectData.name || projectName;
            } catch (e) {
              // If parsing fails, use the name field
            }
          }

          return {
            id: `project-${project.id}`,
            type: isNew ? 'project_saved' : 'project_updated',
            message: isNew
              ? `New project "${projectName}" saved`
              : `Project "${projectName}" updated`,
            timestamp: project.updated_at,
            projectName,
          };
        });

        setActivities(initialActivities);
      } catch (error) {
        console.error('Error fetching initial activities:', error);
      }
    }

    fetchInitialActivities();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to projects table
    const projectsChannel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const project = payload.new as any;

            // Extract project name from project_data JSON or use name field
            let projectName = project.name || 'Untitled Project';
            if (project.project_data) {
              try {
                const projectData = typeof project.project_data === 'string'
                  ? JSON.parse(project.project_data)
                  : project.project_data;
                projectName = projectData.name || projectName;
              } catch (e) {
                // If parsing fails, use the name field
              }
            }

            const newActivity: ActivityItem = {
              id: `activity-${Date.now()}-${Math.random()}`,
              type: payload.eventType === 'INSERT' ? 'project_saved' : 'project_updated',
              message: payload.eventType === 'INSERT'
                ? `New project "${projectName}" saved`
                : `Project "${projectName}" updated`,
              timestamp: project.updated_at || new Date().toISOString(),
              projectName,
            };

            setActivities((prev) => {
              // Avoid duplicates and keep max 20 items
              const filtered = prev.filter((a) => a.id !== newActivity.id);
              return [newActivity, ...filtered].slice(0, 20);
            });
          }
        }
      )
      .subscribe();

    // Subscribe to tracks table
    const tracksChannel = supabase
      .channel('tracks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tracks',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const track = payload.new as any;
            const trackTitle = track.title || 'Untitled Track';

            const newActivity: ActivityItem = {
              id: `activity-${Date.now()}-${Math.random()}`,
              type: 'track_updated',
              message: `Track "${trackTitle}" updated`,
              timestamp: track.updated_at || track.created_at || new Date().toISOString(),
              trackTitle,
            };

            setActivities((prev) => {
              const filtered = prev.filter((a) => a.id !== newActivity.id);
              return [newActivity, ...filtered].slice(0, 20);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(tracksChannel);
    };
  }, []);

  // Auto-scroll to bottom when new activities arrive
  useEffect(() => {
    if (isExpanded && activitiesEndRef.current) {
      activitiesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activities, isExpanded]);

  // Update timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 border-b border-zinc-800/50 bg-zinc-950/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Collapsed View - Marquee */}
        {!isExpanded && (
          <div className="py-2 overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-piko-teal">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider">Shared Activity</span>
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
                    <span className="text-sm font-semibold">Shared Activity Log</span>
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
                        No activity yet. Start creating to see shared updates!
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
