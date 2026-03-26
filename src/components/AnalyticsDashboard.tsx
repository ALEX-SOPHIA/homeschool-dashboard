'use client';

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

// 🎨 Premium Color Palette (Matches your reference image style)
const COLORS = ['#38bdf8', '#a78bfa', '#fb923c', '#fb7185', '#34d399', '#facc15', '#818cf8'];

interface AnalyticsProps {
    data: {
        studentName: string;
        workload: { name: string; value: number }[];
    }[];
}

// 🛠️ Helper: Converts pure minutes into "3h 15m" format
const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

// 🛠️ Helper: Converts pure minutes into just the hours (for the big center text)
const getHours = (totalMinutes: number) => Math.floor(totalMinutes / 60);
// 🛠️ Helper: Converts pure minutes into just the remaining minutes
const getMins = (totalMinutes: number) => totalMinutes % 60;

export default function AnalyticsDashboard({ data }: AnalyticsProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-center">
                <p className="text-slate-400 font-medium">No learning data available yet. Start a timer!</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto pb-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {data.map((student, index) => {
                    // 1. Calculate Total Time for this student
                    const totalMinutes = student.workload.reduce((sum, item) => sum + item.value, 0);

                    // 2. Sort workload from highest time to lowest time
                    const sortedWorkload = [...student.workload].sort((a, b) => b.value - a.value);

                    return (
                        <div key={index} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-inner">
                                    {student.studentName.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{student.studentName}&apos;s Dashboard</h2>
                            </div>

                            {sortedWorkload.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-slate-400 min-h-[300px] border-2 border-dashed border-slate-100 rounded-2xl">
                                    No completed missions yet.
                                </div>
                            ) : (
                                <div className="flex flex-col lg:flex-row items-center gap-8 w-full">

                                    {/* 🍩 LEFT SIDE: The Hollow Donut Chart */}
                                    <div className="relative w-full lg:w-[45%] h-[280px] shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={sortedWorkload}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={85} // Creates the donut hole
                                                    outerRadius={120}
                                                    paddingAngle={4} // Gaps between slices
                                                    dataKey="value"
                                                    stroke="none" // Removes the ugly default border
                                                >
                                                    {sortedWorkload.map((entry, i) => (
                                                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    formatter={(value: any) => [formatTime(value), 'Time Spent']}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>

                                        {/* 🎯 THE MAGIC: Centered Total Time Overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <div className="flex items-baseline gap-1 text-slate-800">
                                                {getHours(totalMinutes) > 0 && (
                                                    <>
                                                        <span className="text-4xl font-black tracking-tighter">{getHours(totalMinutes)}</span>
                                                        <span className="text-lg font-bold text-slate-400 mr-1">h</span>
                                                    </>
                                                )}
                                                <span className="text-4xl font-black tracking-tighter">{getMins(totalMinutes)}</span>
                                                <span className="text-lg font-bold text-slate-400">m</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Time</span>
                                        </div>
                                    </div>

                                    {/* 📋 RIGHT SIDE: The Custom UI Legend List */}
                                    <div className="w-full lg:w-[55%] flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                        {sortedWorkload.map((item, i) => {
                                            const color = COLORS[i % COLORS.length];
                                            const percentage = Math.round((item.value / totalMinutes) * 100);

                                            return (
                                                <div key={i} className="bg-slate-50 hover:bg-slate-100 transition-colors p-4 rounded-2xl flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        {/* Colored Indicator Pill */}
                                                        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-700 capitalize group-hover:text-slate-900 transition-colors">{item.name}</span>
                                                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                                <span>{formatTime(item.value)}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                <span>{percentage}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Global CSS for the custom scrollbar in the legend */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />
        </div>
    );
}