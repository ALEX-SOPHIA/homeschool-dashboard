'use client';

import { useConcurrentTimers } from '@/hooks/useConcurrentTimers';
import { TimerSession, useTimerStore } from '@/store/useTimerStore';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { Play, Pause, Trash2, CheckCircle2, Minimize2, User } from 'lucide-react';

interface TimerFullscreenModalProps {
    sessions: TimerSession[];
}

export default function TimerFullscreenModal({ sessions }: TimerFullscreenModalProps) {
    const { setActiveFocusSessions } = useTimerStore();

    // Determine grid columns based on number of sessions
    const getGridClass = () => {
        const count = sessions.length;
        if (count === 1) return "grid-cols-1 max-w-2xl";
        if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-5xl";
        if (count === 3) return "grid-cols-1 md:grid-cols-3 max-w-7xl";
        if (count === 4) return "grid-cols-1 sm:grid-cols-2 max-w-5xl";
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-7xl";
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#0c0d10] text-[#e0e1dd] flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-y-auto pt-24 pb-12">

            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-50 pointer-events-none">
                <button
                    onClick={() => setActiveFocusSessions([])}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group pointer-events-auto"
                >
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors bg-[#0c0d10]">
                        <Minimize2 size={18} />
                    </div>
                    <span className="font-medium tracking-wide text-sm uppercase drop-shadow-md">Back to Dashboard</span>
                </button>
            </div>

            <div className={`w-full grid ${getGridClass()} gap-x-12 gap-y-16 px-8 mx-auto place-items-center`}>
                {sessions.map(session => (
                    <SingleTimerRing key={session.id} session={session} isMulti={sessions.length > 1} />
                ))}
            </div>
        </div>
    );
}

function SingleTimerRing({ session, isMulti }: { session: TimerSession, isMulti: boolean }) {
    const totalDurationMs = session.totalDurationMs || 3600000;
    const { start, pause, reset, getElapsedMs, remove } = useConcurrentTimers();
    const elapsedMotion = useMotionValue(getElapsedMs(session.id));

    useAnimationFrame(() => {
        const elapsed = getElapsedMs(session.id);
        if (elapsed >= totalDurationMs && session.isRunning) {
            pause(session.id);
            elapsedMotion.set(totalDurationMs);
        } else {
            elapsedMotion.set(elapsed);
        }
    });

    const progress = useTransform(elapsedMotion, (v) => Math.max(0, 100 - (v / totalDurationMs) * 100));

    const timeDisplay = useTransform(elapsedMotion, (v) => {
        const remainingMs = Math.max(0, totalDurationMs - v);
        const totalSeconds = Math.ceil(remainingMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[500px] flex flex-col items-center justify-center">

                <div className="w-full justify-center flex flex-row items-center gap-4 z-10 mb-8 px-4 flex-wrap">
                    <div className="flex items-center gap-3 bg-white/5 rounded-full pl-2 pr-6 py-2 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-[#00d8ff] flex items-center justify-center font-bold shadow-[0_0_10px_rgba(0,216,255,0.2)]">
                            <User size={18} />
                        </div>
                        <div className="flex flex-col text-left max-w-[200px]">
                            <span className="text-sm font-semibold tracking-wider text-[#a8b8d0] uppercase truncate">{session.subjectId}</span>
                            <span className="text-xs text-white/40 uppercase tracking-widest truncate">{session.profileId}</span>
                        </div>
                    </div>
                </div>

                <div className="relative w-full aspect-square flex flex-col items-center justify-center group z-10 shrink-0">
                    {/* Main Ring */}
                    <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full transform -rotate-90">
                        <defs>
                            <linearGradient id={`gradient-${session.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00d8ff" />
                                <stop offset="30%" stopColor="#00ff6a" />
                                <stop offset="65%" stopColor="#ffb000" />
                                <stop offset="100%" stopColor="#ff2a2a" />
                            </linearGradient>
                        </defs>

                        {/* Background dimmed segmented ring */}
                        <circle
                            cx="250"
                            cy="250"
                            r="240"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="16"
                            className="text-white/5"
                            strokeDasharray="24 12"
                        />

                        {/* Foreground bright segmented ring */}
                        <motion.circle
                            cx="250"
                            cy="250"
                            r="240"
                            fill="none"
                            stroke={`url(#gradient-${session.id})`}
                            strokeWidth="16"
                            strokeLinecap="butt"
                            className={session.isRunning ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" : "opacity-50"}
                            strokeDasharray="1508"
                            style={{ strokeDashoffset: useTransform(progress, (v) => 1508 - (1508 * v) / 100) }}
                        />

                        {/* Re-apply gap mask using dashed stroke over the top to 'cut out' the gradient */}
                        <circle
                            cx="250"
                            cy="250"
                            r="240"
                            fill="none"
                            stroke="#0c0d10" /* Must match background! */
                            strokeWidth="18"
                            strokeDasharray="0 24 12 0"
                            className="pointer-events-none"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                        <div
                            className="font-bold tracking-[0.05em] tabular-nums text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] leading-none text-center"
                            style={{ 
                                fontFamily: 'var(--font-share-tech-mono), monospace',
                                fontSize: isMulti ? 'min(11vw, 90px)' : 'min(17vw, 155px)',
                            }}
                        >
                            <motion.span>{timeDisplay}</motion.span>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center gap-6 mt-12 z-10 w-full justify-center px-6`}>
                    <button
                        onClick={() => {
                            remove(session.id);
                            // In a real app, you would log nothing to the DB here (session cancelled)
                        }}
                        className="p-3 sm:p-4 text-white/30 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        aria-label="Cancel Timer"
                    >
                        <Trash2 size={isMulti ? 24 : 28} />
                    </button>

                    {session.isRunning ? (
                        <button
                            onClick={() => pause(session.id)}
                            className="p-6 sm:p-8 bg-black/40 border border-white/10 hover:bg-black/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)] text-[#00d8ff] hover:scale-[1.03] active:scale-95 rounded-3xl transition-all focus-visible:ring-2 focus-visible:ring-[#00d8ff]/50"
                            aria-label="Pause Timer"
                        >
                            <Pause size={isMulti ? 32 : 40} className="fill-current" />
                        </button>
                    ) : (
                        <button
                            onClick={() => start(session.id)}
                            className="p-6 sm:p-8 bg-gradient-to-br from-[#1e2326] to-[#0f1112] border border-white/10 shadow-[inner_0_1px_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.5)] hover:border-white/20 text-white hover:scale-[1.03] active:scale-95 rounded-3xl transition-all focus-visible:ring-2 focus-visible:ring-white/30"
                            aria-label="Start Timer"
                        >
                            <Play size={isMulti ? 32 : 40} className="fill-current ml-2" />
                        </button>
                    )}

                    <button
                        onClick={() => {
                            remove(session.id);
                            // In a real app, this would log the `session.accumulatedTime` to DB
                        }}
                        className="p-3 sm:p-4 text-white/30 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        aria-label="Complete Session"
                    >
                        <CheckCircle2 size={isMulti ? 26 : 30} />
                    </button>
                </div>
            </div>
        </div>
    );
}
