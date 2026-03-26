'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache'; // Import the cache invalidation function from Next.js

// --- TOOL 1: The Seeder (Your existing code) ---
export async function seedTestFamily(formData: FormData) {
  try {
    const newFamily = await prisma.family.create({
      data: {
        name: "The GraceField Academy",
        students: {
          create: [
            { name: "Jessy", avatar: "👨‍🚀" },
            { name: "Joanna", avatar: "👸" }
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


export async function deleteCourse(taskId: string) {
  try {
    // 1. Tell Prisma to execute the DELETE SQL command
    await prisma.task.delete({
      where: {
        id: taskId
      }
    });

    // 2. Cache Invalidation: Tell Next.js to purge the old HTML
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Failed to delete from database" };
  }
}

export async function updateStudent(studentId: string, newName: string) {
  try {
    // Tell Prisma to update the Student table
    await prisma.student.update({
      where: { id: studentId },
      data: { name: newName }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating student name:", error);
    return { success: false, error: "Failed to update database" };
  }
}

export async function createStudent() {
  try {
    // 1. Find our auto-seeded family
    const family = await prisma.family.findFirst();
    if (!family) throw new Error("Family not found in database");

    // 2. Create the child in the database
    await prisma.student.create({
      data: {
        name: "New Child",
        avatar: "🧒", 
        familyId: family.id
      }
    });

    // 3. Purge the cache so Next.js pulls the new child on the next render
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, error: "Failed to create student in database" };
  }
}

export async function updateCourse(taskId: string, newTitle: string) {
  try {
    // 1. Tell Prisma to execute the UPDATE SQL command
    await prisma.task.update({
      where: { id: taskId },
      data: { title: newTitle }
    });

    // 2. Purge the Next.js cache
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Failed to update database" };
  }
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating task status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateTaskDuration(taskId: string, newDuration: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { targetDuration: newDuration }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating task duration:", error);
    return { success: false, error: "Failed to update duration in database" };
  }
}

export async function archiveCompletedTasks() {
  try {
    // 1. Tell Prisma to change all 'completed' tasks to 'archived'
    await prisma.task.updateMany({
      where: { status: 'completed' },
      data: { status: 'archived' }
    });

    // 2. Purge the cache so the dashboard refreshes clean
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error archiving tasks:", error);
    return { success: false, error: "Failed to archive tasks in database" };
  }
}

export async function updateStudentAvatar(studentId: string, newAvatar: string) {
  try {
    await prisma.student.update({
      where: { id: studentId },
      data: { avatar: newAvatar }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating avatar:", error);
    return { success: false, error: "Failed to update avatar in database" };
  }
}