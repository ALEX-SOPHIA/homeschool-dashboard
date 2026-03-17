'use client';

import { LineChart, User } from 'lucide-react';
import Link from 'next/link';
import { useTaskStore } from '@/store/useTaskStore';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const { groups } = useTaskStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return (
        <div className="w-56 bg-white border-r border-slate-100 h-[calc(100vh-64px)] flex flex-col pt-6 pb-20 animate-pulse">
            <div className="px-4 mb-6">
                <div className="h-2 w-16 bg-slate-100 rounded mb-4" />
                <div className="space-y-3">
                    <div className="h-10 bg-slate-50 rounded-xl" />
                    <div className="h-10 bg-slate-50 rounded-xl" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-56 bg-white border-r border-slate-100 h-[calc(100vh-64px)] flex flex-col pt-6 pb-20">
            {/* Children quick-view */}
            <div className="px-4 mb-6 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Children</p>
                <div className="space-y-1">
                    {groups.map((child, idx) => {
                        const completed = child.tasks.filter(t => t.status === 'completed').length;
                        const total = child.tasks.length;
                        
                        return (
                            <button
                                key={`${child.title}-${idx}`}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                            >
                                <div className="relative w-6 h-6 shrink-0">
                                    {child.avatar ? (
                                        <img 
                                            src={child.avatar} 
                                            alt={child.title} 
                                            className="w-full h-full rounded-full object-cover border border-slate-100" 
                                        />
                                    ) : (
                                        <div className={`w-full h-full rounded-full ${child.color.split(' ')[1]} flex items-center justify-center text-[10px] font-bold text-white`}>
                                            {child.title.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-slate-700 flex-1 truncate">{child.title}</span>
                                <span className="text-[10px] text-slate-400 font-bold tabular-nums">{completed}/{total}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="h-px bg-slate-100 mx-4 mb-6 shrink-0" />

            {/* Analytics link */}
            <div className="px-4 shrink-0">
                <Link
                    href="/analytics"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <LineChart size={16} strokeWidth={2} className="text-indigo-400 shrink-0" />
                    <span className="text-sm font-medium">Analytics & Reports</span>
                </Link>
            </div>
        </div>
    );
}
