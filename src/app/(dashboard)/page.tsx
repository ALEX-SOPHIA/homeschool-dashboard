import { prisma } from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  // 1. Fetch the data securely on the Vercel/Node server
  const familyData = await prisma.family.findFirst({
    include: {
      students: true,
    },
  });

  // 2. Pass the raw database data into the Client Component as a prop (Props Drilling)
  return (
    <DashboardClient initialFamilyData={familyData} />
  );
}