'use client';

import { useTimerStore } from '@/store/useTimerStore';
import { useConcurrentTimers } from '@/hooks/useConcurrentTimers';
import { Play, Pause, Maximize2 } from 'lucide-react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

export default function MiniTimerOverlay() {
    const { timers, setActiveFocusSessions } = useTimerStore();
    const { start, pause, getElapsedMs } = useConcurrentTimers();

    // Find all active timers to display in the mini overlay
    const activeTimers = Object.values(timers).filter(t => t.isRunning || t.accumulatedTime > 0);
    const hasMultiple = activeTimers.length > 1;
    const firstTimer = activeTimers[0];

    const elapsedMotion = useMotionValue(0);

    useAnimationFrame(() => {
        if (firstTimer) {
            elapsedMotion.set(getElapsedMs(firstTimer.id));
        }
    });

    const timeDisplay = useTransform(elapsedMotion, (v) => {
        const remainingMs = Math.max(0, (firstTimer?.totalDurationMs || 3600000) - v);
        const mins = Math.ceil(remainingMs / 1000 / 60);
        return mins;
    });

    if (activeTimers.length === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-[#1f2233] text-white rounded-full px-5 py-3 shadow-2xl flex items-center gap-4 cursor-pointer hover:bg-[#282c40] transition-colors"
                onClick={() => setActiveFocusSessions(activeTimers.map(t => t.id))}>

                {/* Timer Mini Display */}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm tracking-widest tabular-nums text-white"
                    style={{ fontFamily: 'var(--font-share-tech-mono), monospace' }}>
                    <motion.span>{timeDisplay}</motion.span>
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                        {hasMultiple ? `${activeTimers.length} Active Timers` : firstTimer.subjectId}
                    </span>
                    <span className="text-xs text-white/50">
                        {hasMultiple ? 'Tracking concurrently' : firstTimer.profileId}
                    </span>
                </div>

                <div className="w-px h-6 bg-white/10 mx-2" />

                <div className="flex items-center gap-2">
                    {!hasMultiple && (
                        firstTimer.isRunning ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); pause(firstTimer.id); }}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <Pause size={18} fill="currentColor" />
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); start(firstTimer.id); }}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <Play size={18} fill="currentColor" />
                            </button>
                        )
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); setActiveFocusSessions(activeTimers.map(t => t.id)); }}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
