'use client';

import Link from 'next/link';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Analytics & Reports</h1>
                <Link
                    href="/"
                    className="px-4 py-2 bg-white text-slate-600 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors font-medium flex items-center gap-2"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Dashboard
                </Link>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-300"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                    <h2 className="text-xl font-semibold text-slate-600">Analytics Module Under Construction</h2>
                    <p className="text-slate-400">This fullscreen view is completely isolated from the main dashboard sidebar.</p>
                </div>
            </div>
        </div>
    );
}
