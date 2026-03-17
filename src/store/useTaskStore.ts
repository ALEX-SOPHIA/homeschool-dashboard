import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface TaskItem {
    id: string;
    title: string;
    date: string;
    isOverdue?: boolean;
    status: TaskStatus;
    targetDuration: string;
}

export interface TaskGroup {
    title: string;
    duration: string;
    color: string;
    avatar?: string; // data-URL for uploaded avatar image
    tasks: TaskItem[];
}

const GRADIENT_COLORS = [
    'from-violet-400 to-purple-500',
    'from-cyan-400 to-teal-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-green-500',
    'from-blue-400 to-indigo-500',
    'from-fuchsia-400 to-purple-500',
];

interface TaskState {
    groups: TaskGroup[];
    addTask: (groupIdx: number) => void;
    removeTask: (groupIdx: number, taskId: string) => void;
    updateTask: (groupIdx: number, taskId: string, updates: Partial<TaskItem>) => void;
    updateGroup: (groupIdx: number, updates: Partial<Omit<TaskGroup, 'tasks'>>) => void;
    addGroup: () => void;
    removeGroup: (groupIdx: number) => void;
}

const INITIAL_TASK_GROUPS: TaskGroup[] = [
    {
        title: 'Jessy',
        duration: '3h',
        color: 'from-violet-400 to-purple-500',
        tasks: [
            { id: '1', title: 'Mathematics', date: 'Today', status: 'pending', targetDuration: '45m' },
            { id: '1b', title: 'Science Lab', date: 'Today', status: 'pending', targetDuration: '1h' },
            { id: '2', title: 'English Reading', date: 'Today', status: 'pending', targetDuration: '30m' }
        ]
    },
    {
        title: 'Joanna',
        duration: '1h 30m',
        color: 'from-cyan-400 to-teal-500',
        tasks: [
            { id: '3', title: 'Finnish Dictation', date: 'Today', status: 'pending', targetDuration: '30m' },
            { id: '4', title: 'Art & Craft', date: '15 Mar', status: 'pending', targetDuration: '1h' }
        ]
    },
    {
        title: 'Josephine',
        duration: '1h',
        color: 'from-rose-400 to-pink-500',
        tasks: [
            { id: '5', title: 'WordDive', date: '13 Mar', status: 'pending', targetDuration: '30m' },
            { id: '6', title: 'Music Practice', date: 'Today', status: 'pending', targetDuration: '30m' }
        ]
    },
];

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            groups: INITIAL_TASK_GROUPS,
            addTask: (groupIdx) => set((state) => {
                const next = [...state.groups];
                const newTask: TaskItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    title: 'New Course',
                    date: 'Today',
                    status: 'pending',
                    targetDuration: '30m'
                };
                next[groupIdx] = {
                    ...next[groupIdx],
                    tasks: [...next[groupIdx].tasks, newTask]
                };
                return { groups: next };
            }),
            removeTask: (groupIdx, taskId) => set((state) => {
                const next = [...state.groups];
                next[groupIdx] = {
                    ...next[groupIdx],
                    tasks: next[groupIdx].tasks.filter(t => t.id !== taskId)
                };
                return { groups: next };
            }),
            updateTask: (groupIdx, taskId, updates) => set((state) => {
                const next = [...state.groups];
                next[groupIdx] = {
                    ...next[groupIdx],
                    tasks: next[groupIdx].tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
                };
                return { groups: next };
            }),
            updateGroup: (groupIdx, updates) => set((state) => {
                const next = [...state.groups];
                next[groupIdx] = { ...next[groupIdx], ...updates };
                return { groups: next };
            }),
            addGroup: () => set((state) => {
                const colorIdx = state.groups.length % GRADIENT_COLORS.length;
                const newGroup: TaskGroup = {
                    title: 'New Child',
                    duration: '0m',
                    color: GRADIENT_COLORS[colorIdx],
                    tasks: []
                };
                return { groups: [...state.groups, newGroup] };
            }),
            removeGroup: (groupIdx) => set((state) => ({
                groups: state.groups.filter((_, i) => i !== groupIdx)
            })),
        }),
        {
            name: 'homeschool-tasks-storage',
        }
    )
);
