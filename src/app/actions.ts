'use server'; 

import { prisma } from '@/lib/prisma'; 
import { revalidatePath } from 'next/cache'; // Import the cache invalidation function from Next.js

// --- TOOL 1: The Seeder (Your existing code) ---
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
  } catch (error) {
    console.error("[DATABASE ERROR]", error);
  }
}

// --- TOOL 2: The Course Creator (The new code to append) ---
export async function createCourse(studentId: string) {
  try {
    const newTask = await prisma.task.create({
      data: {
        title: 'New Course',     
        targetDuration: '30m',   
        status: 'pending',       
        studentId: studentId,    
      }
    });

    // Cache Invalidation: Tell Next.js to clear the cache and refresh the dashboard
    revalidatePath('/');

    return { success: true, task: newTask };
    
  } catch (error) {
    console.error("🔥 Database Insert Failed:", error);
    return { success: false, error: "Failed to create course" };
  }
}