'use client';

import TaskDashboard from '@/components/TaskDashboard';
import { useConcurrentTimers } from '@/hooks/useConcurrentTimers';
import { useTimerStore } from '@/store/useTimerStore';

export default function Dashboard() {
  const { timers, activeFocusSessionIds, setActiveFocusSessions, addTimer } = useTimerStore();
  const { start } = useConcurrentTimers();

  const handleStartTasks = (tasksToStart: { id: string, title: string, subject: string }[]) => {
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
          totalDurationMs: 3600000,
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
