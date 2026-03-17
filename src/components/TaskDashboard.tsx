'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, PlayCircle, Plus, Image as ImageIcon, Circle, Trash2, UserPlus, X } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';

interface TaskDashboardProps {
    onStartTasks: (tasks: { id: string, title: string, subject: string, targetDuration: string }[]) => void;
}

export default function TaskDashboard({ onStartTasks }: TaskDashboardProps) {
    const { groups, addTask, removeTask, updateTask, updateGroup, addGroup, removeGroup, undoTask } = useTaskStore();
    
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

    const completeSelected = () => {
        const ids = Array.from(selected.keys());
        ids.forEach(id => {
            // we use the existing completeTask action from the store
            useTaskStore.getState().completeTask(id);
        });
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
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 border-r border-slate-200 pr-5 mr-1 text-slate-400">
                            <button className="hover:text-slate-600 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </button>
                            <button className="hover:text-slate-600 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                            </button>
                            <button className="hover:text-slate-600 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path></svg>
                            </button>
                        </div>
                        <button className="p-2 border border-border rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>
                        </button>
                    </div>
                </div>

                {/* Rocket Launchpad Gamification */}
                {(() => {
                    const totalTasks = groups.reduce((acc, g) => acc + g.tasks.length, 0);
                    const completedTasks = groups.reduce((acc, g) => acc + g.tasks.filter(t => t.status === 'completed').length, 0);
                    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    const isLaunched = percentage === 100 && totalTasks > 0;

                    return (
                        <div className="bg-[#0f172a] p-6 rounded-3xl shadow-2xl mb-8 relative overflow-hidden min-h-[160px] flex items-center justify-between border border-slate-800">
                            {/* Starry Background Effect */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                {[...Array(20)].map((_, i) => (
                                    <div 
                                        key={i}
                                        className="absolute bg-white rounded-full animate-pulse"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            width: `${Math.random() * 3}px`,
                                            height: `${Math.random() * 3}px`,
                                            animationDelay: `${Math.random() * 3}s`
                                        }}
                                    />
                                ))}
                            </div>

                            {isLaunched ? (
                                <div className="flex-1 flex flex-col items-center justify-center relative z-10 animate-in fade-in zoom-in duration-700">
                                    <div className="text-6xl mb-4 animate-bounce">🌕</div>
                                    <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 tracking-tighter uppercase italic">
                                        LIFTOFF! 🚀✨
                                    </h3>
                                    <p className="text-slate-400 font-bold text-lg mt-2 tracking-wide uppercase">
                                        Mission accomplished! Everything is finished!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Left: Energy Bank */}
                                    <div className="flex flex-col gap-3 relative z-10 w-1/2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Energy Bank</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                                            {[...Array(totalTasks)].map((_, i) => (
                                                <div 
                                                    key={i}
                                                    className={`w-3 h-5 rounded-[4px] transition-all duration-500 ${
                                                        i < completedTasks 
                                                            ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' 
                                                            : 'bg-slate-800 border border-slate-700 opacity-60'
                                                    }`}
                                                />
                                            ))}
                                            {totalTasks === 0 && (
                                                <div className="text-slate-600 text-[10px] italic">Awaiting missions...</div>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-emerald-400 font-black text-xs tabular-nums">
                                                {completedTasks}/{totalTasks}
                                            </span>
                                            <span className="text-slate-500 font-bold text-[10px] ml-2 uppercase">Core charged</span>
                                        </div>
                                    </div>

                                    {/* Right: Rocket & Fuel */}
                                    <div className="flex items-center gap-10 relative z-10 pr-10">
                                        <div className="flex flex-col items-center">
                                            {/* Master Fuel Bar */}
                                            <div className="h-28 w-4 bg-slate-900 rounded-full border border-slate-800 p-[2px] mb-3 overflow-hidden flex flex-col justify-end">
                                                <div 
                                                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                                    style={{ height: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-black text-slate-500 uppercase">Fuel</span>
                                        </div>

                                        <div className="relative group">
                                            {/* Thrust Glow */}
                                            <div 
                                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-500 rounded-full blur-2xl opacity-20 animate-pulse transition-all duration-1000"
                                                style={{ opacity: (percentage / 100) * 0.4 }}
                                            />
                                            
                                            <div className="relative text-6xl group-hover:scale-110 transition-transform cursor-pointer select-none">
                                                🚀
                                            </div>

                                            {/* Percentage Label */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                                <span className="text-[10px] font-black text-white">{Math.round(percentage)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* Kanban board — responsive grid with wrapping */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 scroll-smooth">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 items-start">
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
                                                        disabled={!canSelect && task.status !== 'completed'}
                                                        onClick={(e) => {
                                                            if (task.status === 'completed') {
                                                                e.stopPropagation();
                                                                undoTask(task.id);
                                                            } else if (canSelect) {
                                                                toggle(task.id, task.title, group.title, task.targetDuration);
                                                            }
                                                        }}
                                                        className={`shrink-0 ${task.status === 'completed' ? 'cursor-pointer hover:scale-110 active:scale-95 transition-transform hover:opacity-80' : 'disabled:cursor-default'}`}
                                                        title={task.status === 'completed' ? 'Undo completion' : canSelect ? (isSelected ? 'Deselect' : 'Select to start with others') : ''}
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
                    <div 
                        className="h-[200px] flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-100/50 transition-all cursor-pointer group/add-child" 
                        onClick={addGroup}
                    >
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
                                onClick={completeSelected}
                                className="bg-green-500 hover:bg-green-600 text-white px-5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
                            >
                                <CheckCircle2 size={15} />
                                Mark as Done
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
