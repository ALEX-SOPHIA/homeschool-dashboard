import { LineChart } from 'lucide-react';
import Link from 'next/link';

const CHILDREN = [
    { name: 'Jessy', color: 'bg-violet-400', completed: 1, total: 3 },
    { name: 'Joanna', color: 'bg-cyan-400', completed: 0, total: 2 },
    { name: 'Josephine', color: 'bg-rose-400', completed: 0, total: 2 },
];

export default function Sidebar() {
    return (
        <div className="w-56 bg-white border-r border-slate-100 h-[calc(100vh-64px)] flex flex-col pt-6 pb-20">
            {/* Children quick-view */}
            <div className="px-4 mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Children</p>
                <div className="space-y-1">
                    {CHILDREN.map((child) => (
                        <button
                            key={child.name}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                        >
                            <div className={`w-2.5 h-2.5 rounded-full ${child.color} shrink-0`} />
                            <span className="text-sm font-medium text-slate-700 flex-1">{child.name}</span>
                            <span className="text-xs text-slate-400 font-medium">{child.completed}/{child.total}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100 mx-4 mb-6" />

            {/* Analytics link */}
            <div className="px-4">
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
