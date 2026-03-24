'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, PlayCircle, Plus, Circle, UserPlus, Trash2 } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { ColdRocket } from './ColdRocket';
import { createCourse } from '@/app/actions';

/* ── 🎨 CSS Keyframe Engine ── */
const AnimationEngine = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes battery-sweep {
            0% { transform: translateX(-200%) skewX(-15deg); }
            100% { transform: translateX(400%) skewX(-15deg); }
        }
        @keyframes flame-outer {
            0% { transform: scale(0.95) translate(2px, -2px); opacity: 0.7; }
            100% { transform: scale(1.1) translate(-2px, 2px); opacity: 0.95; }
        }
        @keyframes flame-inner {
            0% { transform: scale(0.9); opacity: 0.9; }
            100% { transform: scale(1.1); opacity: 1; }
        }
    `}} />
);

/* ── 🏆 子组件：纯 CSS 璀璨星云星球 ── */
const ProceduralPlanet = () => (
    <div className="relative w-32 h-32 md:w-40 md:h-40 group/planet">
        <div className="absolute inset-0 rounded-full bg-black border-4 border-slate-900 shadow-[0_0_50px_10px_rgba(16,185,129,0.3)] animate-pulse overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-emerald-800 to-indigo-950 opacity-90" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full bg-radial-gradient(ellipse at center, rgba(16,185,129,0.7)_0%,_rgba(59,130,246,0.2)_40%,_transparent_70%) opacity-60" />
            <div className="absolute inset-0 rounded-full z-10" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)' }} />
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-white/20 rounded-full filter blur-xl z-20" />
        </div>
    </div>
);

interface StarData { size: number; top: number; left: number; delay: number; duration: number; }

/* ── 子组件：电影级火箭发射台 ── */
function RocketLaunchpad({ totalTasks, completedTasks, percentage }: {
    totalTasks: number; completedTasks: number; percentage: number;
}) {
    const [launchStatus, setLaunchStatus] = useState<'idle' | 'shaking' | 'liftoff' | 'completed'>('idle');
    const [stars, setStars] = useState<StarData[]>([]);

    useEffect(() => {
        const generatedStars = Array.from({ length: 50 }).map(() => ({
            size: Math.random() < 0.7 ? 1 : 2,
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4
        }));
        const starTimer = setTimeout(() => setStars(generatedStars), 0);
        return () => clearTimeout(starTimer);
    }, []);

    useEffect(() => {
        if (percentage === 100 && totalTasks > 0) {
            const timer0 = setTimeout(() => setLaunchStatus('shaking'), 0);
            const timer1 = setTimeout(() => setLaunchStatus('liftoff'), 1000);
            const timer2 = setTimeout(() => setLaunchStatus('completed'), 3500);
            return () => { clearTimeout(timer0); clearTimeout(timer1); clearTimeout(timer2); };
        } else if (percentage < 100) {
            const resetTimer = setTimeout(() => setLaunchStatus('idle'), 0);
            return () => clearTimeout(resetTimer);
        }
    }, [percentage, totalTasks]);

    if (launchStatus === 'completed') {
        return (
            <div className="bg-black p-8 rounded-xl shadow-2xl mb-8 flex flex-col items-center justify-center min-h-[260px] border border-slate-900 animate-in fade-in zoom-in duration-700 relative overflow-hidden">
                <AnimationEngine />
                <div className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center scale-110">
                    <ProceduralPlanet />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center mt-4">
                    <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 tracking-tighter uppercase italic">
                        MISSION COMPLETE 🚀
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black p-8 rounded-xl shadow-2xl mb-8 relative overflow-hidden min-h-[220px] border border-slate-900 flex items-center justify-center">
            <AnimationEngine />

            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-black to-black pointer-events-none" />
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-twinkle opacity-30"
                        style={{
                            width: `${star.size}px`, height: `${star.size}px`,
                            top: `${star.top}%`, left: `${star.left}%`,
                            animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-4xl mx-auto flex items-center justify-between gap-12 relative z-10 w-full h-full">
                {launchStatus === 'idle' || launchStatus === 'shaking' ? (
                    <div className="flex items-center flex-1 gap-12 animate-in fade-in duration-500">
                        <div className="flex flex-col gap-5 shrink-0">

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    <span className="text-xs font-black tracking-[0.25em] text-emerald-800 uppercase">Energy Core</span>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex gap-1.5 relative overflow-hidden p-1 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <div
                                            className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"
                                            style={{ animation: 'battery-sweep 2.5s ease-in-out infinite' }}
                                        />

                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-8 h-6 rounded-[4px] transition-all duration-700 z-10 ${percentage > (i * 20) ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]' : 'bg-slate-800/80 border border-slate-700'}`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-black text-white italic tracking-tighter leading-none">{Math.round(percentage)}%</span>
                                        <span className="text-slate-500 text-sm uppercase tracking-wider pb-0.5">/ 100% Complete</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex justify-start items-center animate-in zoom-in slide-in-from-left-10 duration-1000">
                        <ProceduralPlanet />
                    </div>
                )}

                <div className={`shrink-0 z-10 ${launchStatus === 'liftoff' ? 'animate-epic-flight' : launchStatus === 'shaking' ? 'animate-rocket-shake rotate-[-45deg]' : 'rotate-[-45deg] transition-all duration-300'}`}>
                    <div className="relative w-32 h-32 flex items-center justify-center">

                        {/* 🔥 FIX: Translated flame coordinates up and right towards the center nozzle */}
                        <div className="absolute inset-0 z-0">
                            {/* Outer Core */}
                            <div
                                className="absolute -bottom-10 left-11 w-10 h-14 bg-orange-600 rounded-full blur-[10px] mix-blend-screen origin-center"
                                style={{ animation: 'flame-outer 0.12s infinite alternate' }}
                            />
                            {/* Inner Core */}
                            <div
                                className="absolute -bottom-2 left-13 w-6 h-10 bg-yellow-200 rounded-full blur-[4px] mix-blend-screen origin-center"
                                style={{ animation: 'flame-inner 0.06s infinite alternate' }}
                            />
                        </div>

                        <ColdRocket className="absolute inset-0 w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,1)] z-10 relative" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── 主看板组件：TaskDashboard ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TaskDashboard({ onStartTasks }: { onStartTasks?: (tasks: any[]) => void }) {
    const { groups, addGroup, completeTask, updateGroup, updateTask, removeTask, undoTask } = useTaskStore();
    const [isHydrated, setIsHydrated] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selected, setSelected] = useState<Map<string, any>>(new Map());

    const [editing, setEditing] = useState<{ id: string; field: 'title' | 'targetDuration' } | null>(null);
    const [groupEditing, setGroupEditing] = useState<number | null>(null);

    useEffect(() => {
        const hydrationTimer = setTimeout(() => setIsHydrated(true), 0);
        return () => clearTimeout(hydrationTimer);
    }, []);

    if (!isHydrated) return null;

    const totalTasks = groups.reduce((acc, g) => acc + g.tasks.length, 0);
    const completedTasks = groups.reduce((acc, g) => acc + g.tasks.filter(t => t.status === 'completed').length, 0);
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const toggle = (taskId: string, title: string, subject: string, targetDuration: string) => {
        setSelected(prev => {
            const next = new Map(prev);
            if (next.has(taskId)) next.delete(taskId);
            else next.set(taskId, { title, subject, targetDuration });
            return next;
        });
    };

    const startSelected = () => {
        if (onStartTasks) {
            const tasks = Array.from(selected.entries()).map(([id, val]) => ({ id, ...val }));
            onStartTasks(tasks);
        }
        setSelected(new Map());
    };

    const completeSelected = () => {
        Array.from(selected.keys()).forEach(taskId => completeTask(taskId));
        setSelected(new Map());
    };

    return (
        <div className="flex-1 bg-[#f7f8fa] flex flex-col overflow-hidden h-[calc(100vh-64px)] relative">
            <div className="shrink-0 px-8 pt-8 pb-5">
                <RocketLaunchpad totalTasks={totalTasks} completedTasks={completedTasks} percentage={percentage} />
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 scroll-smooth">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 items-start">
                    {groups.map((group, groupIdx) => {
                        const totalCourses = group.tasks.length;
                        const completedCourses = group.tasks.filter(t => t.status === 'completed').length;
                        const progressPercent = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

                        return (
                            <div key={groupIdx} className="w-[300px] shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden group/column">
                                <div className={`relative bg-gradient-to-r ${group.color} p-4 text-white`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 border border-white/30 shadow-inner">
                                            {group.avatar ? (
                                                <span className="text-xl">{group.avatar}</span>
                                            ) : (
                                                <span className="text-white/80">{group.title.charAt(0)}</span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {groupEditing === groupIdx ? (
                                                <input
                                                    autoFocus
                                                    className="w-full bg-black/20 text-white placeholder-white/50 border-none outline-none rounded px-1 -ml-1 font-bold text-base"
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
                                            <div className="text-xs text-white/80 mt-0.5">{group.duration} scheduled</div>
                                        </div>

                                        <div className="text-xl font-black opacity-90 tracking-tighter shrink-0 pl-2">
                                            {completedCourses}/{totalCourses}
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    {group.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`group relative rounded-xl p-4 border transition-all ${task.status === 'completed' ? 'bg-slate-50 border-slate-200/60' :
                                                    selected.has(task.id) ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-100 hover:border-blue-200/50 hover:shadow-md hover:shadow-blue-500/5'
                                                }`}
                                        >
                                            {/* 🗑️ FIX: Absolute Positioned Trash Button in the top-right corner */}
                                            <button
                                                onClick={() => removeTask(groupIdx, task.id)}
                                                className="absolute top-0 right-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1.5 hover:bg-red-50 rounded-md z-10"
                                            >
                                                <Trash2 size={15} />
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        if (task.status === 'completed') {
                                                            undoTask(task.id);
                                                        } else {
                                                            toggle(task.id, task.title, group.title, task.targetDuration);
                                                        }
                                                    }}
                                                    className={`shrink-0 transition-colors ${task.status === 'completed' ? 'text-emerald-500' :
                                                            selected.has(task.id) ? 'text-blue-500' : 'text-slate-200 hover:text-blue-400'
                                                        }`}
                                                >
                                                    {task.status === 'completed' || selected.has(task.id) ?
                                                        <CheckCircle2 size={22} className={task.status === 'completed' ? '' : 'fill-blue-50'} /> :
                                                        <Circle size={22} />
                                                    }
                                                </button>

                                                {/* FIX: Ensure min-w-0 and truncate so text doesn't push the button out */}
                                                <div className="flex-1 min-w-0">
                                                    {editing?.id === task.id && editing.field === 'title' ? (
                                                        <input
                                                            autoFocus
                                                            className={`w-full ${task.title.length > 16 ? 'text-sm' : 'text-base'} font-semibold text-slate-700 outline-none border-b border-blue-500 bg-transparent`}
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
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            onClick={() => task.status !== 'completed' && setEditing({ id: task.id, field: 'title' })}
                                                            /* 👇 2. Dynamic font size, Line Clamping (max 2 lines), and Break Words */
                                                            className={`${task.title.length > 16 ? 'text-sm' : 'text-sm'} font-semibold line-clamp-2 break-words transition-colors cursor-text hover:text-blue-600 ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'
                                                                }`}
                                                        >
                                                            {task.title}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-slate-400 mt-1 font-medium">{task.targetDuration}</div>
                                                </div>

                                                {/* Start Button stays perfectly right-aligned */}
                                                {task.status !== 'completed' && (
                                                    <button
                                                        onClick={() => {
                                                            if (onStartTasks) onStartTasks([{ id: task.id, title: task.title, subject: group.title, targetDuration: task.targetDuration }]);
                                                        }}
                                                        className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-1 py-1 rounded-md shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1 relative z-10"
                                                    >
                                                        <PlayCircle size={10} />Start
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 border-t border-slate-50">
                                    <button
                                        onClick={async () => {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const studentId = (group as any).id;

                                            if (!studentId) {
                                                alert("Please sync this child to the cloud first!");
                                                return;
                                            }

                                            const result = await createCourse(studentId);
                                            if (!result.success) {
                                                alert("Failed to save course to database!");
                                            }
                                        }}
                                        className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-500 rounded-xl transition-all border border-dashed border-slate-200"
                                    >
                                        <Plus size={14} />Add course
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div className="h-[200px] flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:bg-slate-100/50 transition-all cursor-pointer group/add-child" onClick={addGroup}>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover/add-child:text-blue-500 transition-all">
                            <UserPlus size={24} />
                        </div>
                        <div className="mt-4 text-sm font-bold text-slate-400">Add Child</div>
                    </div>
                </div>
            </div>

            {selected.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-3.5 flex items-center gap-5 border border-slate-700/50">
                        <span className="text-sm font-bold text-slate-400">{selected.size} courses selected</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(new Map())} className="text-slate-400 hover:text-white text-sm px-3 py-1.5">Cancel</button>
                            <button onClick={completeSelected} className="bg-green-500 hover:bg-green-600 text-white px-5 py-1.5 rounded-xl font-semibold flex items-center gap-2 text-sm"><CheckCircle2 size={15} />Mark Done</button>
                            <button onClick={startSelected} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded-xl font-semibold flex items-center gap-2 text-sm"><PlayCircle size={15} />Start Timer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}