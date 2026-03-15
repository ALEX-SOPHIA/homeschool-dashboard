'use client';

import TaskDashboard from '@/components/TaskDashboard';
import { useConcurrentTimers } from '@/hooks/useConcurrentTimers';
import { useTimerStore } from '@/store/useTimerStore';

export default function Dashboard() {
  const { timers, activeFocusSessionIds, setActiveFocusSessions, addTimer } = useTimerStore();
  const { start } = useConcurrentTimers();

  const parseDurationToMs = (duration: string): number => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minsMatch = duration.match(/(\d+)m/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
    
    // Handle case where it's just a number (e.g. from user input)
    if (!hoursMatch && !minsMatch) {
      const rawVal = parseInt(duration);
      if (!isNaN(rawVal)) return rawVal * 60 * 1000; // assume minutes
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
