'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const mockData = [
    { subject: 'Math', hours: 4.5, children: 2 },
    { subject: 'Reading', hours: 3.2, children: 2 },
    { subject: 'Science', hours: 2.8, children: 1 },
    { subject: 'History', hours: 1.5, children: 2 },
    { subject: 'Art', hours: 2.0, children: 1 },
];

export default function AnalyticsDashboard() {
    return (
        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 flex flex-col gap-6 w-full">
            <div>
                <h2 className="text-xl font-semibold text-primary">Weekly Subject Analytics</h2>
                <p className="text-sm text-muted-foreground">Total hours spent per subject this week</p>
            </div>

            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={mockData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                            dataKey="subject"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 13 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 13 }}
                            tickFormatter={(value) => `${value}h`}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: 'var(--foreground)', fontWeight: 500 }}
                        />
                        <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40}>
                            {mockData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
