import { prisma } from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  // 1. Upgraded Fetch: Grab the family, the students, AND their tasks
  const familyData = await prisma.family.findFirst({
    include: {
      students: {
        include: {
          tasks: true, 
        }
      }
    },
  });

  return (
    <DashboardClient initialFamilyData={familyData} />
  );
}