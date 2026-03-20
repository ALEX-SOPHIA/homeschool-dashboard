'use server'; 

import { prisma } from '@/lib/prisma'; 

// 1. We add 'formData: FormData' to satisfy the <form> requirement (even though we don't use it here)
export async function seedTestFamily(formData: FormData) {
  try {
    const newFamily = await prisma.family.create({
      data: {
        name: "The Skywalker Family",
        students: {
          create: [
            { name: "Luke Skywalker", avatar: "👨‍🚀" },
            { name: "Leia Organa", avatar: "👸" }
          ]
        }
      }
    });

    console.log("Successfully seeded database!", newFamily);
    
    // 2. We completely remove the 'return' statements so the function returns Promise<void>
    
  } catch (error) {
    console.error("[DATABASE ERROR]", error);
  }
}