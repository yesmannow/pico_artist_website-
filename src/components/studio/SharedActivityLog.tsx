'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Activity from 'lucide-react/dist/esm/icons/activity';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import { supabase, getProjects, getTracks } from '@/lib/supabase';

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

// Types for Supabase integration (used in commented code)
type SupabaseEventType = 'INSERT' | 'UPDATE' | 'DELETE';

interface SupabaseProjectRow {
  id: string;
  name?: string;
  project_data?: string | { name?: string };
  updated_at?: string;
  created_at?: string;
}

interface SupabaseTrackRow {
  id: string;
  title?: string;
  updated_at?: string;
  created_at?: string;
}

interface SupabaseChangePayload<T> {
  eventType: SupabaseEventType;
  new?: T;
  old?: T;
}

function resolveProjectName(project: SupabaseProjectRow): string {
  let projectName = project.name || 'Untitled Project';
  if (project.project_data) {
    try {
      const projectData =
        typeof project.project_data === 'string'
          ? (JSON.parse(project.project_data) as { name?: string })
          : project.project_data;
      if (projectData?.name) {
        projectName = projectData.name;
      }
    } catch {
      // Fall back to the provided name if JSON parsing fails
    }
  }
  return projectName;
}

export default function SharedActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const activitiesEndRef = useRef<HTMLDivElement>(null);

  const supabaseEnabled = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Fetch initial activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!supabaseEnabled) {
          // Use localStorage helpers when Supabase is disabled
          const projects = await getProjects();
          const tracks = await getTracks();

          const projectActivities: ActivityItem[] = projects
            .slice(0, 10)
            .map((project) => {
              const projectName = project.name || 'Untitled Project';
              const created = project.created_at ? new Date(project.created_at).getTime() : 0;
              const updated = project.updated_at ? new Date(project.updated_at).getTime() : 0;
              const isNew = created && created === updated;

              return {
                id: `project-${project.id}`,
                type: isNew ? 'project_saved' : 'project_updated',
                message: isNew
                  ? `New project "${projectName}" saved`
                  : `Project "${projectName}" updated`,
                timestamp: project.updated_at || project.created_at || new Date().toISOString(),
                projectName,
              };
            });

          const trackActivities: ActivityItem[] = tracks
            .slice(0, 5)
            .map((track) => ({
              id: `track-${track.id}`,
              type: 'track_updated' as const,
              message: `Track "${track.title}" updated`,
              timestamp: track.created_at,
              trackTitle: track.title,
            }));

          setActivities([...projectActivities, ...trackActivities].slice(0, 20));
          return;
        }

        // Supabase mode - use wildcard select to avoid column-specific errors
        // Type assertion needed because stub supabase doesn't have proper types
        const supabaseClient = supabase as any;
        const { data } = await supabaseClient
          .from('projects')
          .select('*') // Ensure wildcard is used if specific columns fail
          .order('updated_at', { ascending: false })
          .limit(10);

        if (data) {
          const projectRows = (data || []) as SupabaseProjectRow[];
          const initialActivities: ActivityItem[] = projectRows.map((project) => {
            const projectName = resolveProjectName(project);
            const created = project.created_at ? new Date(project.created_at).getTime() : 0;
            const updated = project.updated_at ? new Date(project.updated_at).getTime() : 0;
            const isNew = created && created === updated;

            return {
              id: `project-${project.id}`,
              type: isNew ? 'project_saved' : 'project_updated',
              message: isNew
                ? `New project "${projectName}" saved`
                : `Project "${projectName}" updated`,
              timestamp: project.updated_at || new Date().toISOString(),
              projectName,
            };
          });

          setActivities(initialActivities);
        }
      } catch (error) {
        console.error('Error fetching initial activities:', error);
      }
    };

    fetchActivities();
  }, [supabaseEnabled]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!supabaseEnabled) {
      // Local fallback: poll localStorage periodically for changes
      const interval = setInterval(async () => {
        const projects = await getProjects();
        const tracks = await getTracks();

        const projectActivities: ActivityItem[] = projects
          .slice(0, 10)
          .map((project) => {
            const projectName = project.name || 'Untitled Project';
            const created = project.created_at ? new Date(project.created_at).getTime() : 0;
            const updated = project.updated_at ? new Date(project.updated_at).getTime() : 0;
            const isNew = created && created === updated;

            return {
              id: `project-${project.id}`,
              type: isNew ? 'project_saved' : 'project_updated',
              message: isNew
                ? `New project "${projectName}" saved`
                : `Project "${projectName}" updated`,
              timestamp: project.updated_at || project.created_at || new Date().toISOString(),
              projectName,
            };
          });

        const trackActivities: ActivityItem[] = tracks
          .slice(0, 5)
          .map((track) => ({
            id: `track-${track.id}`,
            type: 'track_updated' as const,
            message: `Track "${track.title}" updated`,
            timestamp: track.created_at,
            trackTitle: track.title,
          }));

        setActivities([...projectActivities, ...trackActivities].slice(0, 20));
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval);
    }

    // Supabase mode - Realtime Subscription
    const fetchActivities = async () => {
      // Type assertion needed because stub supabase doesn't have proper types
      const supabaseClient = supabase as any;
      const { data } = await supabaseClient
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (data) {
        const projectRows = (data || []) as SupabaseProjectRow[];
        const initialActivities: ActivityItem[] = projectRows.map((project) => {
          const projectName = resolveProjectName(project);
          const created = project.created_at ? new Date(project.created_at).getTime() : 0;
          const updated = project.updated_at ? new Date(project.updated_at).getTime() : 0;
          const isNew = created && created === updated;

          return {
            id: `project-${project.id}`,
            type: isNew ? 'project_saved' : 'project_updated',
            message: isNew
              ? `New project "${projectName}" saved`
              : `Project "${projectName}" updated`,
            timestamp: project.updated_at || new Date().toISOString(),
            projectName,
          };
        });

        setActivities(initialActivities);
      }
    };

    // Initial fetch
    fetchActivities();

    // Realtime Subscription
    // Type assertion needed because stub supabase doesn't have proper types
    const supabaseClient = supabase as any;
    const channel = supabaseClient
      .channel('public:projects')
      .on(
        'postgres_changes' as any, // Cast to 'any' to fix the argument error
        { event: '*', schema: 'public', table: 'projects' },
        (payload: any) => {
          console.log('Change received!', payload);
          fetchActivities(); // Refresh list on change
        }
      )
      .subscribe();

    return () => {
      const supabaseClient = supabase as any;
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseEnabled]);

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
