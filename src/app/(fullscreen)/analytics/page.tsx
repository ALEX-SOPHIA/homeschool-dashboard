import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default async function AnalyticsPage() {
    // 1. Fetch all students and ONLY their archived (completed) tasks!
    const familyData = await prisma.family.findFirst({
        include: {
            students: {
                include: {
                    tasks: {
                        where: { status: 'archived' }
                    }
                }
            }
        }
    });

    // Helper function to convert "30m", "1h", or "45" into pure minutes
    const parseToMinutes = (durationStr: string | null): number => {
        if (!durationStr) return 0;
        const str = durationStr.toLowerCase().trim();
        if (str.includes('h')) {
            const val = parseFloat(str);
            return isNaN(val) ? 0 : val * 60;
        }
        const val = parseFloat(str); // Handles "30m" or just "30"
        return isNaN(val) ? 0 : val;
    };

    // 2. Data Aggregation: Group by student, then sum up minutes per course
    const chartData = familyData?.students.map(student => {
        const courseMap = new Map<string, number>();

        student.tasks.forEach(task => {
            const courseName = task.title;
            const minutes = parseToMinutes(task.targetDuration);
            courseMap.set(courseName, (courseMap.get(courseName) || 0) + minutes);
        });

        // Convert Map to the array format Recharts PieChart expects
        const workload = Array.from(courseMap.entries()).map(([name, value]) => ({
            name,
            value // Total minutes for this specific course
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