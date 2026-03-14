import { create } from 'zustand';

export interface TimerSession {
    id: string; // Session ID
    profileId: string; // Child ID
    subjectId: string;
    startTimestamp: number | null; // null if not active
    accumulatedTime: number; // in milliseconds
    isRunning: boolean;
    totalDurationMs?: number; // target duration for the ring
}

interface TimerStore {
    timers: Record<string, TimerSession>;
    addTimer: (timer: TimerSession) => void;
    updateTimer: (id: string, updates: Partial<TimerSession>) => void;
    removeTimer: (id: string) => void;
    startTimer: (id: string, timestamp?: number) => void;
    pauseTimer: (id: string, timestamp?: number) => void;
    resetTimer: (id: string) => void;
    activeFocusSessionIds: string[];
    setActiveFocusSessions: (ids: string[]) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
    timers: {},
    activeFocusSessionIds: [],
    setActiveFocusSessions: (ids) => set({ activeFocusSessionIds: ids }),
    addTimer: (timer) => set((state) => ({
        timers: { ...state.timers, [timer.id]: timer }
    })),
    updateTimer: (id, updates) => set((state) => {
        const timer = state.timers[id];
        if (!timer) return state;
        return {
            timers: {
                ...state.timers,
                [id]: { ...timer, ...updates }
            }
        };
    }),
    removeTimer: (id) => set((state) => {
        const newTimers = { ...state.timers };
        delete newTimers[id];
        return { ...state, timers: newTimers };
    }),
    startTimer: (id, timestamp = Date.now()) => set((state) => {
        const timer = state.timers[id];
        if (!timer || timer.isRunning) return state;
        return {
            timers: {
                ...state.timers,
                [id]: {
                    ...timer,
                    isRunning: true,
                    startTimestamp: timestamp
                }
            }
        };
    }),
    pauseTimer: (id, timestamp = Date.now()) => set((state) => {
        const timer = state.timers[id];
        if (!timer || !timer.isRunning || !timer.startTimestamp) return state;
        const elapsed = timestamp - timer.startTimestamp;
        return {
            timers: {
                ...state.timers,
                [id]: {
                    ...timer,
                    isRunning: false,
                    accumulatedTime: timer.accumulatedTime + elapsed,
                    startTimestamp: null
                }
            }
        };
    }),
    resetTimer: (id) => set((state) => {
        const timer = state.timers[id];
        if (!timer) return state;
        return {
            timers: {
                ...state.timers,
                [id]: {
                    ...timer,
                    isRunning: false,
                    accumulatedTime: 0,
                    startTimestamp: null
                }
            }
        };
    }),
}));
