import { prisma } from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  // 1. Try to fetch the first family from the database
  let familyData = await prisma.family.findFirst({
    include: {
      students: {
        include: {
          /* 👇 MODIFICATION: Tell Prisma to sort by creation date ascending */
          tasks: {
            orderBy: {
              id: 'asc'
            }
          },
        }
      }
    },
  });

  // 2. AUTO-SEEDER: If the database is completely empty, create the default family!
  if (!familyData) {
    console.log("Database is empty! Auto-seeding initial data...");

    familyData = await prisma.family.create({
      data: {
        name: "The GraceField Academy",
        students: {
          create: [
            { name: "Jessy", avatar: "👨‍🚀" },
            { name: "Joanna", avatar: "👸" }
          ]
        }
      },
      // We must also include the nested data so it matches our expected format
      include: {
        students: {
          include: {
            tasks: true,
          }
        }
      }
    });
  }

  // 3. Pass the guaranteed real database data to the Client
  return (
    <DashboardClient initialFamilyData={familyData} />
  );
}