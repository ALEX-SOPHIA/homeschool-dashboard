'use client';

import { useEffect } from 'react';
import TaskDashboard from '@/components/TaskDashboard';
import { useConcurrentTimers } from '@/hooks/useConcurrentTimers';
import { useTimerStore } from '@/store/useTimerStore';
import { useTaskStore } from '@/store/useTaskStore';

// 1. We declare that this component expects 'initialFamilyData' (the Skywalker JSON) as a prop from the Server Component
export default function DashboardClient({ initialFamilyData }: { initialFamilyData: any }) {
  const { timers, activeFocusSessionIds, setActiveFocusSessions, addTimer } = useTimerStore();
  const { start } = useConcurrentTimers();
  
  // 2. We grab our newly created Override Switch!
  const { setGroups } = useTaskStore(); 

  // 3. Hydration (状态注水): The moment the page loads, we format the data and inject it.
  useEffect(() => {
    // Check if the server actually gave us data
    if (initialFamilyData && initialFamilyData.students) {
      
      // We map the raw Database fields to match the exact fields your UI expects
      const hydratedGroups = initialFamilyData.students.map((student: any, index: number) => {
        // Grab a gradient color based on the index (matching your original logic)
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

        return {
          id: student.id,
          title: student.name,    // Database 'name' becomes UI 'title'
          avatar: student.avatar, // The emoji (👨‍🚀 or 👸)
          color: color,           // The dynamic gradient
          duration: "0h 0m",      // Default placeholder
          tasks: []               // Empty courses for now
        };
      });
      
      // Pull the lever! Overwrite the Local Storage!
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