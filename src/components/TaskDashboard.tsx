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

function RocketLaunchpad({ totalTasks, completedTasks, percentage }: {
    totalTasks: number; completedTasks: number; percentage: number;
}) {
    const [launchStatus, setLaunchStatus] = useState<'idle' | 'shaking' | 'liftoff' | 'completed'>('idle');
    
    // Decoupled Audio Engine
    const igniteAudio = useRef<HTMLAudioElement | null>(null);
    const whooshAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio objects
        igniteAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2530/2530-preview.mp3');
        whooshAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3');
        
        return () => {
            igniteAudio.current = null;
            whooshAudio.current = null;
        };
    }, []);

    // State Machine Side Effects
    useEffect(() => {
        if (percentage === 100 && totalTasks > 0 && launchStatus === 'idle') {
            setLaunchStatus('shaking');
        } else if (percentage < 100) {
            setLaunchStatus('idle');
        }
    }, [percentage, totalTasks, launchStatus]);

    useEffect(() => {
        let timer1: NodeJS.Timeout;
        let timer2: NodeJS.Timeout;

        if (launchStatus === 'shaking') {
            igniteAudio.current?.play().catch(() => {});
            timer1 = setTimeout(() => setLaunchStatus('liftoff'), 1000);
        } else if (launchStatus === 'liftoff') {
            whooshAudio.current?.play().catch(() => {});
            timer2 = setTimeout(() => setLaunchStatus('completed'), 1800);
        }

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [launchStatus]);

    if (launchStatus === 'completed') {
        return (
            <div className="bg-[#0f172a] p-6 rounded-3xl shadow-2xl mb-6 flex flex-col items-center justify-center min-h-[220px] border border-slate-800 animate-in fade-in zoom-in duration-700 relative overflow-hidden">
                <div className="text-5xl mb-3 animate-bounce">🌕</div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 italic uppercase">Mission Complete</h3>
                <p className="text-slate-500 font-bold text-xs mt-2 tracking-widest uppercase">Everything is finished! 🚀✨</p>
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
            </div>
        );
    }

    return (
        <div className="bg-[#0f172a] p-5 rounded-3xl shadow-2xl mb-6 relative overflow-hidden min-h-[220px] border border-slate-800 flex items-center justify-center transition-all duration-500">
            {/* Layer 1: Cinematic Earth Backdrop (Borderless) */}
            <div
                className="absolute -bottom-[15%] -right-[5%] w-[400px] h-[400px] bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600')] bg-cover opacity-[0.2] grayscale-[30%] mix-blend-screen pointer-events-none z-0"
                style={{
                    borderRadius: '50%',
                    maskImage: 'radial-gradient(circle at 60% 60%, black 20%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at 60% 60%, black 20%, transparent 70%)'
                }}
            />

            <div className="max-w-4xl mx-auto flex items-center justify-between gap-6 relative z-10 w-full h-full">
                {/* Left: Energy Bank */}
                <div className="flex flex-col gap-2 shrink-0">
                    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Energy Bank</h3>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {[...Array(totalTasks)].map((_, i) => (
                            <div key={i} className={`w-2.5 h-4 rounded-[3px] transition-all duration-500 ${i < completedTasks ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-800 opacity-40'}`} />
                        ))}
                    </div>
                </div>

                {/* Center: Energy Conduit */}
                <div className="flex-1 min-w-[40px] max-w-[100px] relative h-[1px] border-t border-dashed border-emerald-700/30 self-center mt-6">
                    {completedTasks > 0 && [...Array(3)].map((_, i) => (
                        <span key={i} className="absolute top-[-1px] w-1 h-1 rounded-full bg-emerald-400 animate-energy-particle" style={{ animationDelay: `${i * 0.5}s` }} />
                    ))}
                </div>

                {/* Right: Decoupled Vehicle Payload (Borderless) */}
                <div className="flex flex-col items-center">
                    <MissionStatus percentage={percentage} />

                    <div className={`relative flex flex-col items-center z-20 ${
                        launchStatus === 'liftoff' ? 'animate-cinematic-strike' :
                        launchStatus === 'shaking' ? 'animate-rocket-shake rotate-[-45deg]' : 'rotate-[-45deg] transition-all duration-300'
                    }`}>
                        <div className="relative z-10 select-none hover:scale-110 transition-transform">
                            <ColdRocket className="w-16 h-16 drop-shadow-[0_15px_30px_rgba(0,0,0,1)]" />
                        </div>

                        {/* Pre-warming Fluorescent Flame */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 -bottom-[2px] rounded-full z-0 animate-breath origin-top"
                            style={{
                                width: '14px',
                                background: 'rgba(16, 185, 129, 0.95)',
                                height: `${8 + (percentage / 100) * 35}px`,
                                opacity: 0.3 + (percentage / 100) * 0.7,
                                boxShadow: `0 0 ${15 + (percentage / 100) * 35}px rgba(16, 185, 129, 0.7)`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Cinematic Stardust */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
    );
}

export default function TaskDashboard({ onStartTasks }: { onStartTasks: (tasks: any[]) => void }) {
    const { groups, addTask, removeTask, updateTask, updateGroup, addGroup, removeGroup, undoTask } = useTaskStore();
    const [selected, setSelected] = useState<Map<string, any>>(new Map());
    const [isHydrated, setIsHydrated] = useState(false);
    const [editing, setEditing] = useState<{ id: string; field: 'title' | 'targetDuration' } | null>(null);
    const [groupEditing, setGroupEditing] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingGroupIdx, setUploadingGroupIdx] = useState<number | null>(null);

    useEffect(() => { setIsHydrated(true); }, []);

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

    if (!isHydrated) return null;

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

                {(() => {
                    const totalTasks = groups.reduce((acc, g) => acc + g.tasks.length, 0);
                    const completedTasks = groups.reduce((acc, g) => acc + g.tasks.filter(t => t.status === 'completed').length, 0);
                    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    return <RocketLaunchpad totalTasks={totalTasks} completedTasks={completedTasks} percentage={percentage} />;
                })()}
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
                                                <input autoFocus className="w-full bg-white/20 border border-white/30 rounded px-1 outline-none text-base font-bold text-white" defaultValue={group.title} onBlur={(e) => { updateGroup(groupIdx, { title: e.target.value }); setGroupEditing(null); }} />
                                            ) : (
                                                <div onClick={() => setGroupEditing(groupIdx)} className="font-bold text-base leading-tight truncate cursor-text hover:bg-white/10 rounded px-1 -ml-1 transition-colors">{group.title}</div>
                                            )}
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
                                            <div key={task.id} className={`group relative rounded-xl px-3.5 py-3 border transition-all ${isSelected ? 'bg-blue-50 border-blue-300' : task.status === 'completed' ? 'bg-slate-50 opacity-60' : 'bg-white border-slate-100'}`}>
                                                <button onClick={() => removeTask(groupIdx, task.id)} className="absolute -right-2 -top-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"><Trash2 size={12} /></button>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => task.status === 'completed' ? undoTask(task.id) : toggle(task.id, task.title, group.title, task.targetDuration)}>
                                                        {task.status === 'completed' ? <CheckCircle2 size={18} className="text-emerald-500" /> : isSelected ? <div className="w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div> : <Circle size={18} className="text-slate-200" />}
                                                    </button>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</div>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-[11px] text-slate-400 font-medium">{task.targetDuration}</span>
                                                            {task.status !== 'completed' && (
                                                                <button onClick={() => startSingle(task.id, task.title, group.title, task.targetDuration)} className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1"><PlayCircle size={10} />{task.status === 'in_progress' ? 'Resume' : 'Start'}</button>
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
                </div>
            </div>

            {selected.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-3.5 flex items-center gap-5 border border-slate-700/50">
                        <span className="text-sm font-bold text-slate-400">{selected.size} selected</span>
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