import { useCallback } from 'react';
import { useTimerStore } from '../store/useTimerStore';

export function useConcurrentTimers() {
    const { timers, startTimer, pauseTimer, resetTimer, removeTimer } = useTimerStore();

    const getTimerList = useCallback(() => {
        return Object.values(timers);
    }, [timers]);

    const start = useCallback((id: string) => {
        startTimer(id, Date.now());
    }, [startTimer]);

    const pause = useCallback((id: string) => {
        pauseTimer(id, Date.now());
    }, [pauseTimer]);

    const reset = useCallback((id: string) => {
        resetTimer(id);
    }, [resetTimer]);

    // Pure function calculates current elapsed time from reference timestamp, eliminating drift.
    // Can be used inside requestAnimationFrame loops in UI components.
    const getElapsedMs = useCallback((id: string) => {
        const t = useTimerStore.getState().timers[id];
        if (!t) return 0;

        if (t.isRunning && t.startTimestamp) {
            return t.accumulatedTime + (Date.now() - t.startTimestamp);
        }
        return t.accumulatedTime;
    }, []);

    const remove = useCallback((id: string) => {
        removeTimer(id);
    }, [removeTimer]);

    return {
        timers,
        getTimerList,
        start,
        pause,
        reset,
        remove,
        getElapsedMs
    };
}
