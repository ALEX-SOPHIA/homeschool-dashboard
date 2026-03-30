import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default async function AnalyticsPage() {
    // 1. Fetch all students and their completed OR archived tasks
    const familyData = await prisma.family.findFirst({
        include: {
            students: {
                include: {
                    tasks: {
                        // 👇 FIX 1: Look for both statuses so it updates instantly!
                        where: {
                            status: { in: ['completed', 'archived'] }
                        }
                    }
                }
            }
        }
    });

    // 2. Data Aggregation: Group by subject, then sum up actual minutes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = familyData?.students.map((student: any) => {
        const courseMap = new Map<string, number>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        student.tasks.forEach((task: any) => {
            // 👇 FIX 2: Group by the new 'subject' category we built!
            const categoryName = task.subject || task.title;

            // 👇 FIX 3: Directly read the new actualDuration integer!
            const minutes = task.actualDuration || 0;

            // Only add to the chart if they actually spent time on it
            if (minutes > 0) {
                courseMap.set(categoryName, (courseMap.get(categoryName) || 0) + minutes);
            }
        });

        // Convert Map to the array format Recharts PieChart expects
        const workload = Array.from(courseMap.entries()).map(([name, value]) => ({
            name,
            value // Total actual minutes spent
        }));

        return {
            studentName: student.name,
            workload
        };
    }) || [];

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

            {/* 3. The Handover: Pass the aggregated data to the Client Component */}
            <AnalyticsDashboard data={chartData} />
        </div>
    );
}