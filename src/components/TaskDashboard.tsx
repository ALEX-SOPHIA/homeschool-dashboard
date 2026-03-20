'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, PlayCircle, Plus, Image as ImageIcon, Circle, Trash2, UserPlus, X } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { ColdRocket } from './ColdRocket';


/* ── 🏆 子组件：纯 CSS 璀璨星云星球 (Procedural Asset) ── */
const ProceduralPlanet = () => (
    <div className="relative w-32 h-32 md:w-40 md:h-40 group/planet">
        <div className="absolute inset-0 rounded-full bg-black border-4 border-slate-900 shadow-[0_0_50px_10px_rgba(16,185,129,0.3)] animate-pulse overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-emerald-800 to-indigo-950 opacity-90" />

            {/* 程序生成星球内部星尘 */}
            {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-70 animate-twinkle"
                    style={{
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${Math.random() * 3}s`
                    }} />
            ))}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full bg-radial-gradient(ellipse at center, rgba(16,185,129,0.7)_0%,_rgba(59,130,246,0.2)_40%,_transparent_70%) opacity-60" />
            <div className="absolute inset-0 rounded-full z-10" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)' }} />
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-white/20 rounded-full filter blur-xl z-20" />
        </div>
    </div>
);

/* ── 子组件：电影级火箭发射台 ── */
function RocketLaunchpad({ totalTasks, completedTasks, percentage }: {
    totalTasks: number; completedTasks: number; percentage: number;
}) {
    const [launchStatus, setLaunchStatus] = useState<'idle' | 'shaking' | 'liftoff' | 'completed'>('idle');
    const igniteAudioRef = useRef<HTMLAudioElement | null>(null);
    const audioPlayed = useRef({ shake: false, cheer: false });

    useEffect(() => {
        if (percentage === 100 && totalTasks > 0) {
            setLaunchStatus('shaking');

            if (!audioPlayed.current.shake) {
                // ⚠️ TEMPORARY: Unstable hotlinked sound asset.
                const audio = new Audio('/sounds/ignite.wav');
                audio.volume = 0.6;
                igniteAudioRef.current = audio;
                audio.play().catch(e => console.warn("Audio play failed:", e));
                audioPlayed.current.shake = true;
            }

            const timer1 = setTimeout(() => {
                setLaunchStatus('liftoff');

                if (igniteAudioRef.current) {
                    const fadeOut = setInterval(() => {
                        if (igniteAudioRef.current) {
                            const newVolume = igniteAudioRef.current.volume - 0.05;
                            if (newVolume > 0) {
                                igniteAudioRef.current.volume = newVolume;
                            } else {
                                igniteAudioRef.current.volume = 0;
                                igniteAudioRef.current.pause();
                                clearInterval(fadeOut);
                            }
                        } else {
                            clearInterval(fadeOut);
                        }
                    }, 150);
                }
            }, 1000);

            const timer2 = setTimeout(() => {
                setLaunchStatus('completed');

                if (igniteAudioRef.current) {
                    igniteAudioRef.current.pause();
                    igniteAudioRef.current = null;
                }
                if (!audioPlayed.current.cheer) {
                    // ⚠️ TEMPORARY: Unstable hotlinked sound asset.
                    const cheerAudio = new Audio('/sounds/cheer.wav');
                    cheerAudio.volume = 0.8;
                    cheerAudio.play().catch(e => console.warn("Audio play failed:", e));
                    audioPlayed.current.cheer = true;
                }
            }, 3500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        } else if (percentage < 100) {
            setLaunchStatus('idle');
            audioPlayed.current = { shake: false, cheer: false };
            if (igniteAudioRef.current) {
                igniteAudioRef.current.pause();
                igniteAudioRef.current = null;
            }
        }
    }, [percentage, totalTasks]);

    if (launchStatus === 'completed') {
        return (
            <div className="bg-black p-8 rounded-xl shadow-2xl mb-8 flex flex-col items-center justify-center min-h-[260px] border border-slate-900 animate-in fade-in zoom-in duration-700 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center scale-110">
                    <ProceduralPlanet />
                </div>
                <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)' }} />

                <div className="relative z-10 flex flex-col items-center justify-center mt-4">
                    <div className="absolute w-[120%] h-[120%] bg-black/60 blur-2xl rounded-full z-[-1]" />
                    <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 tracking-tighter uppercase italic">
                        MISSION COMPLETE 🚀
                    </h3>
                    <p className="mt-6 text-emerald-400 font-bold tracking-[0.4em] uppercase text-sm animate-pulse shadow-black drop-shadow-md">
                        All Systems Clear
                    </p>
                </div>
            </div>
        );
    }

    // 🏆 主发射台区域 (Idle/Shaking/Liftoff)
    return (
        <div className="bg-black p-8 rounded-xl shadow-2xl mb-8 relative overflow-hidden min-h-[220px] border border-slate-900 flex items-center justify-center">

            {/* 🎯 终极方案：纯 CSS 璀璨星空背景层 */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Layer 1: TEMPORARY Hotlinked texture (用于微弱背景尘埃) */}
                {/* ✅ 替代方案：纯 CSS 幽蓝深空背景 (无任何外部依赖) */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-black to-black pointer-events-none" />

                {/* Layer 2: 动态程序生成 CSS 星星 (Twinkling Stars) */}
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-twinkle opacity-30"
                        style={{
                            // 随机尺寸 (1px 或 2px)
                            width: `${Math.random() < 0.7 ? 1 : 2}px`,
                            height: `${Math.random() < 0.7 ? 1 : 2}px`,
                            // 随机 X/Y轴位置
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            // 随机闪烁延迟 (0~5s)
                            animationDelay: `${Math.random() * 5}s`,
                            // 随机闪烁频率 (3~7s)
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-4xl mx-auto flex items-center justify-between gap-12 relative z-10 w-full h-full">

                {launchStatus === 'idle' || launchStatus === 'shaking' ? (
                    <div className="flex items-center flex-1 gap-12 animate-in fade-in duration-500">
                        <div className="flex flex-col gap-4 shrink-0">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Energy Bank</h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                                {[...Array(totalTasks)].map((_, i) => (
                                    <div key={i} className={`w-3 h-5 rounded-[4px] transition-all duration-500 ${i < completedTasks ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-slate-800 border border-slate-700 opacity-60'}`} />
                                ))}
                            </div>
                            <div className="flex items-end gap-2 mt-1">
                                <span className="text-xl font-black text-white italic tracking-tighter leading-none">{Math.round(percentage)}%</span>
                                <span className="text-slate-500 text-xs uppercase tracking-wider">/ 100% Complete</span>
                            </div>
                        </div>

                        <div className="w-[120px] md:w-[250px] relative h-[2px] border-t-2 border-dashed border-emerald-700/40 self-center shrink-0">
                            {completedTasks > 0 && [...Array(3)].map((_, i) => (
                                <span key={i} className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-energy-particle" style={{ animationDelay: `${i * 0.6}s` }} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex justify-start items-center animate-in zoom-in slide-in-from-left-10 duration-1000">
                        <ProceduralPlanet />
                    </div>
                )}

                <div className={`shrink-0 z-10 ${launchStatus === 'liftoff' ? 'animate-epic-flight' : launchStatus === 'shaking' ? 'animate-rocket-shake rotate-[-45deg]' : 'rotate-[-45deg] transition-all duration-300'}`}>
                    <div className="relative w-24 h-24">
                        <ColdRocket className="absolute inset-0 w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,1)] z-10" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f97316] rounded-full filter blur-[2px] opacity-100 animate-pulse shadow-[0_0_24px_rgba(249,115,22,1)] z-0" />
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#f97316] rounded-full filter blur-[4px] opacity-70 animate-pulse shadow-[0_0_32px_rgba(249,115,22,1)] z-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── 主看板组件：TaskDashboard (剩余部分保留) ── */
export default function TaskDashboard({ onStartTasks }: { onStartTasks: (tasks: any[]) => void }) {
    const { groups, addTask, removeTask, updateTask, updateGroup, addGroup, removeGroup, undoTask } = useTaskStore();
    const [selected, setSelected] = useState<Map<string, any>>(new Map());
    const [isHydrated, setIsHydrated] = useState(false);
    const [editing, setEditing] = useState<{ id: string; field: 'title' | 'targetDuration' } | null>(null);
    const [groupEditing, setGroupEditing] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingGroupIdx, setUploadingGroupIdx] = useState<number | null>(null);

    useEffect(() => { setIsHydrated(true); }, []);

    if (!isHydrated) return null;

    const totalTasks = groups.reduce((acc, g) => acc + g.tasks.length, 0);
    const completedTasks = groups.reduce((acc, g) => acc + g.tasks.filter(t => t.status === 'completed').length, 0);
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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
        // 加上这行：清空 input 的值，确保下次选同一张图也能触发
        e.target.value = '';
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
        const tasks = Array.from(selected.entries()).map(([id, val]) => ({ id, ...val }));
        onStartTasks(tasks);
        setSelected(new Map());
    };

    const startSingle = (id: string, title: string, subject: string, targetDuration: string) => {
        onStartTasks([{ id, title, subject, targetDuration }]);
        setSelected(new Map());
    };

    const completeSelected = () => {
        Array.from(selected.keys()).forEach(id => useTaskStore.getState().completeTask(id));
        setSelected(new Map());
    };

    return (
        <div className="flex-1 bg-[#f7f8fa] flex flex-col overflow-hidden h-[calc(100vh-64px)] relative">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            <div className="shrink-0 px-8 pt-8 pb-5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Today&apos;s Dashboard</h2>
                        <p className="text-sm text-slate-400 mt-0.5">{groups.length} children active</p>
                    </div>
                </div>
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
                                    <button onClick={() => removeGroup(groupIdx)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center opacity-0 group-hover/column:opacity-100 transition-all border border-white/20"><X size={12} /></button>
                                    <div className="flex items-center gap-3 mb-3">
                                        <button onClick={() => handleAvatarClick(groupIdx)} className="relative w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold border border-white/30 overflow-hidden group/avatar">
                                            {group.avatar ? <img src={group.avatar} alt={group.title} className="w-full h-full object-cover" /> : group.title.charAt(0)}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"><ImageIcon size={12} /></div>
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            {groupEditing === groupIdx ? (
                                                <input autoFocus className="w-full bg-white/20 border border-white/30 rounded px-1 outline-none text-base font-bold text-white" defaultValue={group.title} onBlur={(e) => { updateGroup(groupIdx, { title: e.target.value }); setGroupEditing(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { updateGroup(groupIdx, { title: e.currentTarget.value }); setGroupEditing(null); } if (e.key === 'Escape') setGroupEditing(null); }} />
                                            ) : (
                                                <div onClick={() => setGroupEditing(groupIdx)} className="font-bold text-base leading-tight truncate cursor-text hover:bg-white/10 rounded px-1 -ml-1 transition-colors">{group.title}</div>
                                            )}
                                            <div className="text-white/70 text-xs">{group.duration} scheduled</div>
                                        </div>
                                        <div className="shrink-0 text-right font-bold">{completedCourses}/{totalCourses}</div>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    {group.tasks.map((task) => {
                                        const isSelected = selected.has(task.id);

                                        return (
                                            <div key={task.id} className={`group relative rounded-xl px-3.5 py-3 border transition-all ${isSelected ? 'bg-blue-50 border-blue-300 shadow-sm shadow-blue-100' : task.status === 'completed' ? 'bg-slate-50 opacity-60' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                                <button onClick={(e) => { e.stopPropagation(); removeTask(groupIdx, task.id); }} className="absolute -right-2 -top-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"><Trash2 size={12} /></button>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={(e) => { e.stopPropagation(); if (task.status === 'completed') { undoTask(task.id); } else { toggle(task.id, task.title, group.title, task.targetDuration); } }} className={`shrink-0 cursor-pointer transition-transform ${task.status === 'completed' ? 'hover:scale-110 active:scale-95' : ''}`}>
                                                        {task.status === 'completed' ? <CheckCircle2 size={18} className="text-emerald-500" /> : isSelected ? <div className="w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div> : <Circle size={18} className="text-slate-200 hover:text-blue-300 transition-colors" />}
                                                    </button>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1 min-w-0">
                                                                {editing?.id === task.id && editing?.field === 'title' ? (
                                                                    <input autoFocus className="w-full text-sm font-semibold text-slate-700 bg-white border border-blue-300 rounded px-1 outline-none" defaultValue={task.title} onBlur={(e) => { updateTask(groupIdx, task.id, { title: e.target.value }); setEditing(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { updateTask(groupIdx, task.id, { title: e.currentTarget.value }); setEditing(null); } if (e.key === 'Escape') setEditing(null); }} />
                                                                ) : (
                                                                    <div onClick={() => task.status !== 'completed' && setEditing({ id: task.id, field: 'title' })} className={`text-sm font-semibold truncate cursor-text hover:text-blue-600 transition-colors ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</div>
                                                                )}
                                                            </div>
                                                            {task.isOverdue && task.status !== 'completed' && (
                                                                <div className="shrink-0 ml-2 text-[8px] uppercase tracking-widest font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md leading-none">Late</div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div className="flex-1">
                                                                {editing?.id === task.id && editing?.field === 'targetDuration' ? (
                                                                    <input autoFocus className="w-20 text-[11px] font-medium text-slate-400 bg-white border border-blue-300 rounded px-1 outline-none" defaultValue={task.targetDuration} onBlur={(e) => { updateTask(groupIdx, task.id, { targetDuration: e.target.value }); setEditing(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { updateTask(groupIdx, task.id, { targetDuration: e.currentTarget.value }); setEditing(null); } if (e.key === 'Escape') setEditing(null); }} />
                                                                ) : (
                                                                    <span onClick={() => task.status !== 'completed' && setEditing({ id: task.id, field: 'targetDuration' })} className="text-[11px] text-slate-400 font-medium cursor-text hover:text-blue-600 transition-colors">{task.targetDuration}</span>
                                                                )}
                                                            </div>
                                                            {task.status !== 'completed' && (
                                                                <button onClick={() => startSingle(task.id, task.title, group.title, task.targetDuration)} className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer"><PlayCircle size={10} />{task.status === 'in_progress' ? 'Resume' : 'Start'}</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-3 border-t border-slate-50">
                                    <button onClick={() => addTask(groupIdx)} className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-500 rounded-xl transition-all border border-dashed border-slate-200"><Plus size={14} />Add course</button>
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