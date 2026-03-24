'use client';

import { useEffect } from 'react';
import TaskDashboard from '@/components/TaskDashboard';
import { useConcurrentTimers } from '@/hooks/useConcurrentTimers';
import { useTimerStore } from '@/store/useTimerStore';
import { useTaskStore } from '@/store/useTaskStore';

// 1. We declare that this component expects 'initialFamilyData' (the Skywalker JSON) as a prop from the Server Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardClient({ initialFamilyData }: { initialFamilyData: any }) {
  const { timers, activeFocusSessionIds, setActiveFocusSessions, addTimer } = useTimerStore();
  const { start } = useConcurrentTimers();
  
  // 2. We grab our newly created Override Switch!
  const { setGroups } = useTaskStore(); 

// 3. Hydration (状态注水): Map Students AND their Tasks
  useEffect(() => {
    if (initialFamilyData && initialFamilyData.students) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hydratedGroups = initialFamilyData.students.map((student: any, index: number) => {
        const gradientColors = [
            'from-violet-400 to-purple-500',
            'from-cyan-400 to-teal-500',
            'from-rose-400 to-pink-500',
            'from-amber-400 to-orange-500',
            'from-emerald-400 to-green-500',
            'from-blue-400 to-indigo-500',
            'from-fuchsia-400 to-purple-500',
        ];
        const color = gradientColors[index % gradientColors.length];

        // 👇 NEW: We map the real tasks from the database!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedTasks = student.tasks ? student.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          date: 'Today', // Placeholder (we can add real dates to the DB later)
          status: task.status,
          targetDuration: task.targetDuration || '30m'
        })) : [];

        return {
          id: student.id,
          title: student.name,
          avatar: student.avatar,
          color: color,
          duration: "0h 0m",
          tasks: mappedTasks // 👈 Inject the real database tasks here!
        };
      });
      
      setGroups(hydratedGroups);
    }
  }, [initialFamilyData, setGroups]);

  // --- Your original timer logic remains untouched below ---

  const parseDurationToMs = (duration: string): number => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minsMatch = duration.match(/(\d+)m/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
    
    if (!hoursMatch && !minsMatch) {
      const rawVal = parseInt(duration);
      if (!isNaN(rawVal)) return rawVal * 60 * 1000; 
    }

    return (hours * 60 * 60 * 1000) + (mins * 60 * 1000);
  };

  const handleStartTasks = (tasksToStart: { id: string, title: string, subject: string, targetDuration: string }[]) => {
    const sessionIds: string[] = [];

    tasksToStart.forEach(task => {
      const sessionId = `session-${task.id}`;
      sessionIds.push(sessionId);

      if (!timers[sessionId]) {
        addTimer({
          id: sessionId,
          profileId: task.title,
          subjectId: task.subject,
          startTimestamp: null,
          accumulatedTime: 0,
          isRunning: false,
          totalDurationMs: parseDurationToMs(task.targetDuration) || 3600000,
        });
      }
      start(sessionId);
    });

    setActiveFocusSessions(sessionIds);
  };
  
  return (
    <TaskDashboard onStartTasks={handleStartTasks} />
  );
}