'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, PlayCircle, Plus, Image as ImageIcon, Circle, Trash2, UserPlus, X } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { ColdRocket } from './ColdRocket';

/* ── 子组件：任务状态与燃料槽 ── */
const MissionStatus = ({ percentage }: { percentage: number }) => (
    <div className="flex flex-col items-center gap-1 mb-3">
        <div className="text-xl font-black text-white tracking-tighter italic leading-none">
            {Math.round(percentage)}% <span className="text-[9px] text-slate-500 not-italic ml-1 uppercase tracking-widest">Fuel Loaded</span>
        </div>
        <div className="w-20 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-1">
            <div
                className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                style={{ width: `${percentage}%` }}
            />
        </div>
    </div>
);

/* ── 子组件：电影级火箭发射台 ── */
function RocketLaunchpad({ totalTasks, completedTasks, percentage }: {
    totalTasks: number; completedTasks: number; percentage: number;
}) {
    const [launchStatus, setLaunchStatus] = useState<'idle' | 'shaking' | 'liftoff' | 'completed'>('idle');

    // 🛡️ 引用音频对象，处理长音效淡出与防止重复播放
    const igniteAudioRef = useRef<HTMLAudioElement | null>(null);
    const audioPlayed = useRef({ shake: false, cheer: false });

    // 🛑 核心修复：单向状态驱动，彻底消除 useEffect 闭包陷阱
    useEffect(() => {
        if (percentage === 100 && totalTasks > 0) {
            setLaunchStatus('shaking');

            // 1. 点火
            if (!audioPlayed.current.shake) {
                const audio = new Audio('/sounds/ignite.wav');
                audio.volume = 0.6;
                igniteAudioRef.current = audio;
                audio.play().catch(e => console.warn("Audio play failed:", e));
                audioPlayed.current.shake = true;
            }

            const timer1 = setTimeout(() => {
                setLaunchStatus('liftoff');

                // 🔊 安全的音量淡出逻辑 (防止浮点数越界导致浏览器报错)
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

                // 彻底关闭点火音，播放喝彩
                if (igniteAudioRef.current) {
                    igniteAudioRef.current.pause();
                    igniteAudioRef.current = null;
                }
                if (!audioPlayed.current.cheer) {
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
        } else {
            // 当数据回滚 (<100%) 时，强制重置所有状态和音频锁
            setLaunchStatus('idle');
            audioPlayed.current = { shake: false, cheer: false };
            if (igniteAudioRef.current) {
                igniteAudioRef.current.pause();
                igniteAudioRef.current = null;
            }
        }
    }, [percentage, totalTasks]); // 🎯 依赖项绝对干净，没有 launchStatus

    if (launchStatus === 'completed') {
        return (
            <div className="bg-[#0f172a] p-6 rounded-3xl shadow-2xl mb-6 flex flex-col items-center justify-center min-h-[220px] border border-slate-800 animate-in fade-in zoom-in duration-700 relative overflow-hidden">
                <div className="text-5xl mb-3 animate-bounce">🌕</div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 italic">MISSION COMPLETE</h3>
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
            </div>
        );
    }

    return (
        <div className="bg-[#0f172a] p-5 rounded-3xl shadow-2xl mb-6 relative overflow-hidden min-h-[220px] border border-slate-800 flex items-center justify-center">
            {/* 🛰️ 层 0: 动态星空背景 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-stars-twinkle"
                        style={{
                            top: `${(i * 137) % 100}%`,
                            left: `${(i * 251) % 100}%`,
                            width: `${(i % 3) + 1}px`,
                            height: `${(i % 3) + 1}px`,
                            animationDelay: `${(i * 0.7) % 5}s`,
                            opacity: 0.3 + (i % 5) * 0.1
                        }}
                    />
                ))}
            </div>

            {/* Layer 1: 地球切片背景 */}
            <div className="absolute -bottom-[20%] -right-[5%] w-[350px] h-[350px] bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600')] bg-cover opacity-15 grayscale-[20%] mix-blend-screen pointer-events-none z-10"
                style={{ borderRadius: '50%', maskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 60%)' }}
            />

            <div className="max-w-4xl mx-auto flex items-center justify-between gap-10 relative z-20 w-full">
                {/* 左侧：Energy Bank */}
                <div className="flex flex-col gap-2 shrink-0">
                    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Energy Bank</h3>
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {[...Array(totalTasks)].map((_, i) => (
                            <div key={i} className={`w-2.5 h-4 rounded-[3px] transition-all duration-500 border ${
                                i < completedTasks 
                                ? 'bg-orange-500 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.8)]' 
                                : 'bg-slate-600/30 border-slate-500/20'
                            }`} />
                        ))}
                    </div>
                </div>

                {/* 中间：能量脉冲导管 */}
                <div className="flex-1 min-w-[40px] max-w-[100px] relative h-[1px] border-t border-dashed border-orange-700/30 self-center mt-6">
                    {completedTasks > 0 && [...Array(3)].map((_, i) => (
                        <span key={i} className="absolute top-[-1px] w-1 h-1 rounded-full bg-orange-400 animate-energy-particle" style={{ animationDelay: `${i * 0.5}s` }} />
                    ))}
                </div>

                {/* 右侧：火箭载荷 */}
                <div className="flex flex-col items-center">
                    <MissionStatus percentage={percentage} />
                    
                    {/* Outer Wrapper: Translation Only (Animation) */}
                    <div className={`relative z-20 ${
                        launchStatus === 'liftoff' ? 'animate-cinematic-strike' : 
                        launchStatus === 'shaking' ? 'animate-rocket-shake' : ''
                    }`}>
                        {/* Inner Wrapper: Posture Lock (Rotation Only) - Points Left */}
                        <div className="relative flex flex-col items-center rotate-[-90deg]">
                            <ColdRocket className="w-16 h-16 drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] z-10" />
                            
                            {/* 🚀 传统火焰：橙黄渐变 + 动态闪烁 - Now anchored inside rotation context */}
                            <div 
                                className={`absolute left-1/2 -translate-x-1/2 -bottom-[2px] rounded-full z-0 origin-top ${launchStatus === 'liftoff' ? 'animate-flame-flicker scale-150' : 'animate-breath'}`} 
                                style={{ 
                                    width: '14px', 
                                    background: 'linear-gradient(to bottom, #ffcc00, #ff9500, #ff4d00)', 
                                    height: `${8 + (percentage / 100) * 35}px`, 
                                    opacity: 0.6 + (percentage / 100) * 0.4, 
                                    boxShadow: `0 0 ${15 + (percentage / 100) * 35}px rgba(251, 146, 60, 0.8), 0 0 40px rgba(239, 68, 68, 0.3)` 
                                }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── 主组件：TaskDashboard ── */
export default function TaskDashboard({ onStartTasks }: { onStartTasks: (tasks: any[]) => void }) {
    const { groups, addTask, removeTask, updateTask, updateGroup, addGroup, removeGroup, undoTask } = useTaskStore();
    const [selected, setSelected] = useState<Map<string, any>>(new Map());
    const [isHydrated, setIsHydrated] = useState(false);
    const [editing, setEditing] = useState<{ id: string; field: 'title' | 'targetDuration' } | null>(null);
    const [groupEditing, setGroupEditing] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingGroupIdx, setUploadingGroupIdx] = useState<number | null>(null);

    // 解决 Next.js  hydration 错误
    useEffect(() => { setIsHydrated(true); }, []);

    if (!isHydrated) return null;

    // 统计全局任务进度
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

            {/* 顶部火箭发射台 */}
            <div className="shrink-0 px-8 pt-8 pb-5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Today&apos;s Dashboard</h2>
                        <p className="text-sm text-slate-400 mt-0.5">{groups.length} children active</p>
                    </div>
                </div>
                <RocketLaunchpad totalTasks={totalTasks} completedTasks={completedTasks} percentage={percentage} />
            </div>

            {/* 核心看板区域 */}
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
                                        <div className="shrink-0 text-right">
                                            <div className="text-xl font-bold">{completedCourses}<span className="text-white/60 text-sm font-normal">/{totalCourses}</span></div>
                                            <div className="text-white/70 text-[10px] uppercase tracking-wide">Done</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    {group.tasks.map((task) => {
                                        const isSelected = selected.has(task.id);
                                        const canSelect = task.status !== 'completed';

                                        return (
                                            <div key={task.id} className={`group relative rounded-xl px-3.5 py-3 border transition-all ${isSelected ? 'bg-blue-50 border-blue-300 shadow-sm shadow-blue-100' : task.status === 'in_progress' ? 'bg-amber-50 border-amber-200' : task.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                                <button onClick={(e) => { e.stopPropagation(); removeTask(groupIdx, task.id); }} className="absolute -right-2 -top-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"><Trash2 size={12} /></button>
                                                <div className="flex items-center gap-3">
                                                    <button disabled={!canSelect && task.status !== 'completed'} onClick={(e) => { if (task.status === 'completed') { e.stopPropagation(); undoTask(task.id); } else if (canSelect) { toggle(task.id, task.title, group.title, task.targetDuration); } }} className={`shrink-0 ${task.status === 'completed' ? 'cursor-pointer hover:scale-110 active:scale-95 transition-transform' : 'disabled:cursor-default'}`}>
                                                        {task.status === 'completed' ? <CheckCircle2 size={18} className="text-emerald-500" /> : isSelected ? <div className="w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div> : task.status === 'in_progress' ? <div className="w-[18px] h-[18px] rounded-full bg-amber-400 border-2 border-amber-300 hover:ring-2 hover:ring-blue-300" /> : <Circle size={18} className="text-slate-200 hover:text-blue-300 transition-colors" />}
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
                                                                <button onClick={(e) => { e.stopPropagation(); startSingle(task.id, task.title, group.title, task.targetDuration); }} className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm transition-colors"><PlayCircle size={10} />{task.status === 'in_progress' ? 'Resume' : 'Start'}</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-3 border-t border-slate-50">
                                    <button onClick={() => addTask(groupIdx)} className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all border border-dashed border-slate-200 hover:border-blue-200"><Plus size={14} />Add course</button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Child 占位卡片 */}
                    <div className="h-[200px] flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-100/50 transition-all cursor-pointer group/add-child" onClick={addGroup}>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover/add-child:text-blue-500 group-hover/add-child:scale-110 shadow-sm transition-all">
                            <UserPlus size={24} />
                        </div>
                        <div className="mt-4 text-sm font-bold text-slate-400 group-hover/add-child:text-slate-500 transition-colors">Add Child</div>
                        <div className="mt-1 text-xs text-slate-400/70">Create a new schedule</div>
                    </div>
                </div>
            </div>

            {/* 底部悬浮操作栏 */}
            {selected.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-3.5 flex items-center gap-5 border border-slate-700/50">
                        <div>
                            <span className="font-bold">{selected.size}</span>
                            <span className="text-slate-400 text-sm ml-1">{selected.size === 1 ? 'course' : 'courses'} selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(new Map())} className="text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-700">Cancel</button>
                            <button onClick={completeSelected} className="bg-green-500 hover:bg-green-600 text-white px-5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"><CheckCircle2 size={15} />Mark as Done</button>
                            <button onClick={startSelected} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"><PlayCircle size={15} />Start {selected.size > 1 ? `${selected.size} Timers` : 'Timer'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}