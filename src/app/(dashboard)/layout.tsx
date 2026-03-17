'use client';

import Sidebar from '@/components/Sidebar';
import MiniTimerOverlay from '@/components/MiniTimerOverlay';
import TimerFullscreenModal from '@/components/TimerFullscreenModal';
import { useTimerStore } from '@/store/useTimerStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { timers, activeFocusSessionIds } = useTimerStore();
    const activeFocusSessions = activeFocusSessionIds.map(id => timers[id]).filter(Boolean);

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col overflow-hidden">
            {/* Top Header - Mocked for prototype */}

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                {children}
            </div>

            {/* Mini Overlay (Shows when a timer is active but focus view is dismissed) */}
            {activeFocusSessionIds.length === 0 && <MiniTimerOverlay />}

            {/* Fullscreen Overlay (Shows when focus view is requested) */}
            {activeFocusSessions.length > 0 && (
                <TimerFullscreenModal sessions={activeFocusSessions} />
            )}
        </div>
    );
}
