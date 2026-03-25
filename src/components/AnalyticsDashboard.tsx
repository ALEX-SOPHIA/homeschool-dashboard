'use client';

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define a premium color palette for our courses
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

interface AnalyticsProps {
    data: {
        studentName: string;
        workload: { name: string; value: number }[];
    }[];
}

export default function AnalyticsDashboard({ data }: AnalyticsProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-center">
                <p className="text-slate-400">No archived data available.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Display a grid of charts: 1 column on mobile, 2 columns on large screens */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-8">
                {data.map((student, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                                {student.studentName.charAt(0)}
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">{student.studentName}&apos;s Workload</h2>
                        </div>

                        {student.workload.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-slate-400 min-h-[300px]">
                                No completed missions yet.
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                                {/* Left Side: The Chart */}
                                <div className="w-full md:w-1/2 h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                /* 👇 MODIFICATION: Inject 'fill' directly into the data payload! */
                                                data={student.workload.map((entry, i) => ({
                                                    ...entry,
                                                    fill: COLORS[i % COLORS.length]
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={3}
                                                dataKey="value"
                                            />
                                            <Tooltip
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                formatter={(value: any) => [`${value} minutes`, 'Time Spent']}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Right Side: KPI Summary Stats */}
                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-500">Total Study Time</span>
                                        <span className="text-xl font-black text-blue-600">
                                            {student.workload.reduce((sum, item) => sum + item.value, 0)} min
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-500">Top Subject</span>
                                        <span className="text-xl font-black text-emerald-600 capitalize">
                                            {student.workload.reduce((prev, current) => (prev.value > current.value) ? prev : current).name}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-500">Missions Completed</span>
                                        <span className="text-xl font-black text-purple-600">
                                            {student.workload.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}