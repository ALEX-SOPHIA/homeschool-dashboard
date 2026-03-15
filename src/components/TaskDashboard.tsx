'use client';

import { useState } from 'react';
import { Clock, CheckCircle2, PlayCircle, Plus, Image as ImageIcon, Circle, Trash2 } from 'lucide-react';

type TaskStatus = 'pending' | 'in_progress' | 'completed';
type TaskItem = { id: string; title: string; date: string; isOverdue?: boolean; status: TaskStatus; targetDuration: string; };

type TaskGroup = {
    title: string;
    duration: string;
    color: string;
    tasks: TaskItem[];
};

const INITIAL_TASK_GROUPS: TaskGroup[] = [
    {
        title: 'Jessy',
        duration: '3h',
        color: 'from-violet-400 to-purple-500',
        tasks: [
            { id: '1', title: 'Mathematics', date: 'Today', status: 'completed', targetDuration: '45m' },
            { id: '1b', title: 'Science Lab', date: 'Today', status: 'pending', targetDuration: '1h' },
            { id: '2', title: 'English Reading', date: 'Yesterday', isOverdue: true, status: 'pending', targetDuration: '30m' }
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
            { id: '5', title: 'WordDive', date: '13 Mar', isOverdue: true, status: 'pending', targetDuration: '30m' },
            { id: '6', title: 'Music Practice', date: 'Today', status: 'pending', targetDuration: '30m' }
        ]
    },
];

interface TaskDashboardProps {
    onStartTasks: (tasks: { id: string, title: string, subject: string }[]) => void;
}

export default function TaskDashboard({ onStartTasks }: TaskDashboardProps) {
    const [groups, setGroups] = useState<TaskGroup[]>(INITIAL_TASK_GROUPS);
    // Map: taskId → { title, subject }
    const [selected, setSelected] = useState<Map<string, { title: string; subject: string }>>(new Map());

    const addTask = (groupIdx: number) => {
        setGroups(prev => {
            const next = [...prev];
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
            return next;
        });
    };

    const removeTask = (groupIdx: number, taskId: string) => {
        setGroups(prev => {
            const next = [...prev];
            next[groupIdx] = {
                ...next[groupIdx],
                tasks: next[groupIdx].tasks.filter(t => t.id !== taskId)
            };
            return next;
        });
        setSelected(prev => {
            const next = new Map(prev);
            next.delete(taskId);
            return next;
        });
    };

    const updateTask = (groupIdx: number, taskId: string, updates: Partial<TaskItem>) => {
        setGroups(prev => {
            const next = [...prev];
            next[groupIdx] = {
                ...next[groupIdx],
                tasks: next[groupIdx].tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
            };
            return next;
        });
    };

    // State for tracking which cell is being edited
    const [editing, setEditing] = useState<{ id: string; field: 'title' | 'targetDuration' } | null>(null);

    const toggle = (taskId: string, title: string, subject: string) => {
        setSelected(prev => {
            const next = new Map(prev);
            if (next.has(taskId)) next.delete(taskId);
            else next.set(taskId, { title, subject });
            return next;
        });
    };

    const startSelected = () => {
        const tasks = Array.from(selected.entries()).map(([id, { title, subject }]) => ({ id, title, subject }));
        onStartTasks(tasks);
        setSelected(new Map());
    };

    const startSingle = (id: string, title: string, subject: string) => {
        onStartTasks([{ id, title, subject }]);
        setSelected(new Map());
    };

    return (
        <div className="flex-1 bg-[#f7f8fa] flex flex-col overflow-hidden h-[calc(100vh-64px)]">
            {/* Constrained top section */}
            <div className="shrink-0 px-8 pt-8 pb-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Today&apos;s Dashboard</h2>
                        <p className="text-sm text-slate-400 mt-0.5">Saturday, March 14 · 3 children active</p>
                    </div>
                    <button className="p-2 border border-border rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-5">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">6<span className="text-base font-normal text-slate-400">h</span> 30<span className="text-base font-normal text-slate-400">m</span></div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Estimated</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <div className="text-2xl font-bold text-slate-800">7</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Courses Today</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <div className="text-2xl font-bold text-slate-800">0<span className="text-base font-normal text-slate-400">m</span></div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Elapsed</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <div className="text-2xl font-bold text-emerald-500">1</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Completed</div>
                    </div>
                </div>

                {/* Add Task Input */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 flex items-center gap-3">
                    <Plus className="text-slate-300 shrink-0" size={18} />
                    <input
                        type="text"
                        placeholder="Add a course... press Enter to save"
                        className="flex-1 outline-none text-slate-600 placeholder:text-slate-300 bg-transparent text-sm"
                    />
                    <div className="flex gap-2 text-slate-200">
                        <Clock size={15} />
                        <ImageIcon size={15} className="text-blue-400" />
                    </div>
                </div>
            </div>

            {/* Kanban board — full-width with horizontal scroll */}
            <div
                className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}
            >
                <div className="flex flex-row gap-5 h-full" style={{ width: 'max-content', minWidth: '100%' }}>
                    {groups.map((group, groupIdx) => {
                        const totalCourses = group.tasks.length;
                        const completedCourses = group.tasks.filter(t => t.status === 'completed').length;
                        const progressPercent = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
                        const allDone = completedCourses === totalCourses && totalCourses > 0;

                        return (
                            <div
                                key={groupIdx}
                                className="w-[300px] shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden"
                            >
                                {/* Gradient header */}
                                <div className={`bg-gradient-to-r ${group.color} p-4 text-white`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold border border-white/30">
                                            {group.title.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-base leading-tight">{group.title}</div>
                                            <div className="text-white/70 text-xs">{group.duration} scheduled</div>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <div className="text-xl font-bold">{completedCourses}<span className="text-white/60 text-sm font-normal">/{totalCourses}</span></div>
                                            <div className="text-white/70 text-[10px] uppercase tracking-wide">Done</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    {allDone && <div className="text-white/90 text-[10px] font-semibold mt-1.5 text-right">✓ All done!</div>}
                                </div>

                                {/* Course list */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    {group.tasks.map((task) => {
                                        const isSelected = selected.has(task.id);
                                        const canSelect = task.status !== 'completed';

                                        return (
                                            <div
                                                key={task.id}
                                                className={`group relative rounded-xl px-3.5 py-3 border transition-all cursor-default ${
                                                    isSelected
                                                        ? 'bg-blue-50 border-blue-300 shadow-sm shadow-blue-100'
                                                        : task.status === 'in_progress'
                                                        ? 'bg-amber-50 border-amber-200'
                                                        : task.status === 'completed'
                                                        ? 'bg-slate-50 border-slate-100 opacity-60'
                                                        : 'bg-white border-slate-100 hover:border-slate-200'
                                                }`}
                                            >
                                                {/* Delete icon - appears on hover */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeTask(groupIdx, task.id);
                                                    }}
                                                    className="absolute -right-2 -top-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                                                >
                                                    <Trash2 size={12} />
                                                </button>

                                                <div className="flex items-center gap-3">
                                                    {/* Checkbox / Status icon — clicking toggles selection */}
                                                    <button
                                                        disabled={!canSelect}
                                                        onClick={() => canSelect && toggle(task.id, task.title, group.title)}
                                                        className="shrink-0 disabled:cursor-default"
                                                        title={canSelect ? (isSelected ? 'Deselect' : 'Select to start with others') : ''}
                                                    >
                                                        {task.status === 'completed'
                                                            ? <CheckCircle2 size={18} className="text-emerald-500" />
                                                            : isSelected
                                                            ? <div className="w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center">
                                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                              </div>
                                                            : task.status === 'in_progress'
                                                            ? <div className="w-[18px] h-[18px] rounded-full bg-amber-400 border-2 border-amber-300 hover:ring-2 hover:ring-blue-300" />
                                                            : <Circle size={18} className="text-slate-200 hover:text-blue-300 transition-colors" strokeWidth={2} />
                                                        }
                                                    </button>

                                                    {/* Task name + actions */}
                                                    <div className="flex-1 min-w-0">
                                                        {editing?.id === task.id && editing?.field === 'title' ? (
                                                            <input
                                                                autoFocus
                                                                className="w-full text-sm font-semibold text-slate-700 bg-white border border-blue-300 rounded px-1 outline-none"
                                                                defaultValue={task.title}
                                                                onBlur={(e) => {
                                                                    updateTask(groupIdx, task.id, { title: e.target.value });
                                                                    setEditing(null);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        updateTask(groupIdx, task.id, { title: e.currentTarget.value });
                                                                        setEditing(null);
                                                                    }
                                                                    if (e.key === 'Escape') setEditing(null);
                                                                }}
                                                            />
                                                        ) : (
                                                            <div 
                                                                onClick={() => task.status !== 'completed' && setEditing({ id: task.id, field: 'title' })}
                                                                className={`text-sm font-semibold truncate cursor-text hover:text-blue-600 transition-colors ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                                                            >
                                                                {task.title}
                                                            </div>
                                                        )}
                                                        
                                                        <div className="flex items-center justify-between mt-1">
                                                            {editing?.id === task.id && editing?.field === 'targetDuration' ? (
                                                                <input
                                                                    autoFocus
                                                                    className="w-20 text-[11px] font-medium text-slate-400 bg-white border border-blue-300 rounded px-1 outline-none"
                                                                    defaultValue={task.targetDuration}
                                                                    onBlur={(e) => {
                                                                        updateTask(groupIdx, task.id, { targetDuration: e.target.value });
                                                                        setEditing(null);
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            updateTask(groupIdx, task.id, { targetDuration: e.currentTarget.value });
                                                                            setEditing(null);
                                                                        }
                                                                        if (e.key === 'Escape') setEditing(null);
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span 
                                                                    onClick={() => task.status !== 'completed' && setEditing({ id: task.id, field: 'targetDuration' })}
                                                                    className="text-[11px] text-slate-400 font-medium cursor-text hover:text-blue-600 transition-colors"
                                                                >
                                                                    {task.targetDuration}
                                                                </span>
                                                            )}
                                                            
                                                            {task.status !== 'completed' && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        startSingle(task.id, task.title, group.title);
                                                                    }}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                                                                >
                                                                    <PlayCircle size={10} />
                                                                    {task.status === 'in_progress' ? 'Resume' : 'Start'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Overdue pill */}
                                                    {task.isOverdue && task.status !== 'completed' && (
                                                        <div className="shrink-0 text-[9px] uppercase tracking-widest font-bold text-red-400 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md">
                                                            Late
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Column Footer */}
                                <div className="p-3 border-t border-slate-50">
                                    <button 
                                        onClick={() => addTask(groupIdx)}
                                        className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all border border-dashed border-slate-200 hover:border-blue-200"
                                    >
                                        <Plus size={14} />
                                        Add course
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Floating multi-start bar — appears when ≥2 tasks selected */}
            {selected.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-3.5 flex items-center gap-5 border border-slate-700/50">
                        <div>
                            <span className="font-bold">{selected.size}</span>
                            <span className="text-slate-400 text-sm ml-1">{selected.size === 1 ? 'course' : 'courses'} selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelected(new Map())}
                                className="text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={startSelected}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
                            >
                                <PlayCircle size={15} />
                                Start {selected.size > 1 ? `${selected.size} Timers` : 'Timer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
