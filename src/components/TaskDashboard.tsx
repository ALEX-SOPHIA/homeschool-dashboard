'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, PlayCircle, Plus, Image as ImageIcon, Circle, Trash2, UserPlus, X } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';

interface TaskDashboardProps {
    onStartTasks: (tasks: { id: string, title: string, subject: string, targetDuration: string }[]) => void;
}

export default function TaskDashboard({ onStartTasks }: TaskDashboardProps) {
    const { groups, addTask, removeTask, updateTask, updateGroup, addGroup, removeGroup } = useTaskStore();
    
    // Map: taskId → { title, subject, targetDuration }
    const [selected, setSelected] = useState<Map<string, { title: string; subject: string; targetDuration: string }>>(new Map());

    // Hydration fix for persistent state
    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // State for tracking which cell is being edited
    const [editing, setEditing] = useState<{ id: string; field: 'title' | 'targetDuration' } | null>(null);
    const [groupEditing, setGroupEditing] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingGroupIdx, setUploadingGroupIdx] = useState<number | null>(null);

    const handleAvatarClick = (idx: number) => {
        setUploadingGroupIdx(idx);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadingGroupIdx !== null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateGroup(uploadingGroupIdx, { avatar: reader.result as string });
                setUploadingGroupIdx(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggle = (taskId: string, title: string, subject: string, targetDuration: string) => {
        setSelected(prev => {
            const next = new Map(prev);
            if (next.has(taskId)) next.delete(taskId);
            else next.set(taskId, { title, subject, targetDuration });
            return next;
        });
    };

    const startSelected = () => {
        const tasks = Array.from(selected.entries()).map(([id, { title, subject, targetDuration }]) => ({ id, title, subject, targetDuration }));
        onStartTasks(tasks);
        setSelected(new Map());
    };

    const startSingle = (id: string, title: string, subject: string, targetDuration: string) => {
        onStartTasks([{ id, title, subject, targetDuration }]);
        setSelected(new Map());
    };

    if (!isHydrated) return null; // or a skeleton loader

    return (
        <div className="flex-1 bg-[#f7f8fa] flex flex-col overflow-hidden h-[calc(100vh-64px)]">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
            
            {/* Constrained top section */}
            <div className="shrink-0 px-8 pt-8 pb-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Today&apos;s Dashboard</h2>
                        <p className="text-sm text-slate-400 mt-0.5">Saturday, March 14 · {groups.length} children active</p>
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
                        <div className="text-2xl font-bold text-slate-800">
                            {groups.reduce((acc, g) => acc + g.tasks.length, 0)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Courses Today</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <div className="text-2xl font-bold text-slate-800">0<span className="text-base font-normal text-slate-400">m</span></div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Elapsed</div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <div className="text-2xl font-bold text-emerald-500">
                            {groups.reduce((acc, g) => acc + g.tasks.filter(t => t.status === 'completed').length, 0)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Completed</div>
                    </div>
                </div>

                {/* Add Task Input Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 flex items-center gap-3 opacity-50 cursor-not-allowed">
                    <Plus className="text-slate-300 shrink-0" size={18} />
                    <input
                        type="text"
                        disabled
                        placeholder="Select a child below to add courses"
                        className="flex-1 outline-none text-slate-600 placeholder:text-slate-300 bg-transparent text-sm cursor-not-allowed"
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
                                className="w-[300px] shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden group/column"
                            >
                                {/* Gradient header */}
                                <div className={`relative bg-gradient-to-r ${group.color} p-4 text-white`}>
                                    {/* Delete column button */}
                                    <button 
                                        onClick={() => removeGroup(groupIdx)}
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center opacity-0 group-hover/column:opacity-100 transition-all border border-white/20"
                                    >
                                        <X size={12} />
                                    </button>

                                    <div className="flex items-center gap-3 mb-3">
                                        <button 
                                            onClick={() => handleAvatarClick(groupIdx)}
                                            className="relative w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold border border-white/30 overflow-hidden group/avatar"
                                        >
                                            {group.avatar ? (
                                                <img src={group.avatar} alt={group.title} className="w-full h-full object-cover" />
                                            ) : (
                                                group.title.charAt(0)
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                                <ImageIcon size={12} />
                                            </div>
                                        </button>
                                        
                                        <div className="flex-1 min-w-0">
                                            {groupEditing === groupIdx ? (
                                                <input
                                                    autoFocus
                                                    className="w-full bg-white/20 border border-white/30 rounded px-1 outline-none text-base font-bold text-white placeholder:text-white/50"
                                                    defaultValue={group.title}
                                                    onBlur={(e) => {
                                                        updateGroup(groupIdx, { title: e.target.value });
                                                        setGroupEditing(null);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            updateGroup(groupIdx, { title: e.currentTarget.value });
                                                            setGroupEditing(null);
                                                        }
                                                        if (e.key === 'Escape') setGroupEditing(null);
                                                    }}
                                                />
                                            ) : (
                                                <div 
                                                    onClick={() => setGroupEditing(groupIdx)}
                                                    className="font-bold text-base leading-tight truncate cursor-text hover:bg-white/10 rounded px-1 -ml-1 transition-colors"
                                                >
                                                    {group.title}
                                                </div>
                                            )}
                                            <div className="text-white/70 text-xs">{group.duration} scheduled</div>
                                        </div>
                                        
                                        <div className="shrink-0 text-right">
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
                                                        onClick={() => canSelect && toggle(task.id, task.title, group.title, task.targetDuration)}
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
                                                        <div className="flex justify-between items-start">
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
                                                            </div>

                                                            {/* Overdue pill */}
                                                            {task.isOverdue && task.status !== 'completed' && (
                                                                <div className="shrink-0 ml-2 text-[8px] uppercase tracking-widest font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md leading-none">
                                                                    Late
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div className="flex-1">
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
                                                            </div>
                                                            
                                                            {task.status !== 'completed' && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        startSingle(task.id, task.title, group.title, task.targetDuration);
                                                                    }}
                                                                    className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                                                                >
                                                                    <PlayCircle size={10} />
                                                                    {task.status === 'in_progress' ? 'Resume' : 'Start'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
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

                    {/* Add Child Column */}
                    <div className="w-[300px] shrink-0 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-100/50 transition-all cursor-pointer group/add-child" onClick={addGroup}>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover/add-child:text-blue-500 group-hover/add-child:scale-110 shadow-sm transition-all">
                            <UserPlus size={24} />
                        </div>
                        <div className="mt-4 text-sm font-bold text-slate-400 group-hover/add-child:text-slate-500 transition-colors">Add Child</div>
                        <div className="mt-1 text-xs text-slate-400/70">Create a new schedule</div>
                    </div>
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
