'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 🛠️ HELPER: Converts "1h" to 60, or "30m" to 30 for the database
function parseDurationToMinutes(durationStr: string): number {
  const lower = durationStr.toLowerCase().trim();
  if (lower.endsWith('h')) return parseInt(lower) * 60;
  if (lower.endsWith('m')) return parseInt(lower);
  return parseInt(lower) || 30; // Defaults to 30 if they type something weird
}

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

export async function createCourse(studentId: string) {
  try {
    const newTask = await prisma.task.create({
      data: {
        title: 'New Course',
        subject: 'General',   // 👈 NEW: Default category
        targetDuration: 30,   // 👈 NEW: Pure integer (minutes)
        actualDuration: 0,    // 👈 NEW: Starts at 0 minutes spent
        status: 'pending',
        studentId: studentId,
      }
    });

    revalidatePath('/');
    return { success: true, task: newTask };
  } catch (error) {
    console.error("🔥 Database Insert Failed:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function deleteCourse(taskId: string) {
  try {
    await prisma.task.delete({ where: { id: taskId } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Failed to delete from database" };
  }
}

export async function updateStudent(studentId: string, newName: string) {
  try {
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
    const family = await prisma.family.findFirst();
    if (!family) throw new Error("Family not found in database");

    await prisma.student.create({
      data: {
        name: "New Astronaut",
        avatar: "🧒", 
        familyId: family.id
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, error: "Failed to create student in database" };
  }
}

export async function updateCourse(taskId: string, newTitle: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { title: newTitle }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Failed to update database" };
  }
}

// 🚀 UPGRADED: Now handles Time Tracking & Atomic Increments!
export async function updateTaskStatus(taskId: string, newStatus: string, timeSpentMinutes: number = 0) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status: newStatus };

    if (newStatus === 'completed') {
      updateData.completedAt = new Date(); // 👈 Stamp the exact completion time
      
      if (timeSpentMinutes > 0) {
        // 👈 ATOMIC INCREMENT: Adds new time to the old time without overriding it!
        updateData.actualDuration = { increment: timeSpentMinutes }; 
      }
    } else if (newStatus === 'pending') {
      updateData.completedAt = null; // 👈 Clear the timestamp if they uncheck it
    }

    await prisma.task.update({
      where: { id: taskId },
      data: updateData
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating task status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// 🚀 UPGRADED: Safely converts string inputs ("30m") to integers before saving
export async function updateTaskDuration(taskId: string, newDurationString: string) {
  try {
    const durationInMinutes = parseDurationToMinutes(newDurationString); // 👈 Convert to Int

    await prisma.task.update({
      where: { id: taskId },
      data: { targetDuration: durationInMinutes }
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
    await prisma.task.updateMany({
      where: { status: 'completed' },
      data: { status: 'archived' }
    });
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

// 🚀 NEW: Updates the subject category
export async function updateTaskSubject(taskId: string, newSubject: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { subject: newSubject }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating subject:", error);
    return { success: false, error: "Failed to update subject in database" };
  }
}

// ==========================================
// 🚀 EPIC 2: THE TEMPLATE ENGINE ACTIONS
// ==========================================

export async function createCourseTemplate(
  studentId: string, 
  data: { title: string; subject: string; color: string; defaultDuration: number }
) {
  try {
    const newTemplate = await prisma.courseTemplate.create({
      data: {
        studentId: studentId,
        title: data.title,
        subject: data.subject,
        color: data.color,
        defaultDuration: data.defaultDuration
      }
    });

    revalidatePath('/');
    return { success: true, template: newTemplate };
  } catch (error) {
    console.error("Error creating course template:", error);
    return { success: false, error: "Failed to create course template in database" };
  }
}

// 🪄 THE MAGIC FUNCTION: Turns a "Template" into a "Daily Task"
export async function spawnTaskFromTemplate(
  studentId: string, 
  template: { title: string; subject: string; defaultDuration: number }
) {
  try {
    const newTask = await prisma.task.create({
      data: {
        studentId: studentId,
        title: template.title,
        subject: template.subject,       // 👈 Hidden from user, but saved to DB!
        targetDuration: template.defaultDuration, // Convert Int back to string for your UI
        status: 'pending',
      }
    });

    revalidatePath('/');
    return { success: true, task: newTask };
  } catch (error) {
    console.error("Error spawning task:", error);
    return { success: false, error: "Failed to spawn daily task" };
  }
}

// 🔍 获取所有预设课程胶囊
export async function fetchAllTemplates() {
  try {
    const templates = await prisma.courseTemplate.findMany();
    return { success: true, templates };
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { success: false, templates: [] };
  }
}

// ==========================================
// 🗑️ EPIC 2: TEARDOWN (DELETE ACTIONS)
// ==========================================

export async function deleteStudent(studentId: string) {
  try {
    // Thanks to onDelete: Cascade in Prisma, this single line will also 
    // automatically wipe out all their tasks and course templates!
    await prisma.student.delete({
      where: { id: studentId }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Failed to delete student" };
  }
}

export async function deleteCourseTemplate(templateId: string) {
  try {
    await prisma.courseTemplate.delete({
      where: { id: templateId }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error deleting template:", error);
    return { success: false, error: "Failed to delete template" };
  }
}

// ==========================================
// ✏️ EPIC 2: UPDATE TEMPLATES (Name & Color)
// ==========================================
export async function updateCourseTemplate(templateId: string, updates: { title?: string; color?: string }) {
  try {
    await prisma.courseTemplate.update({
      where: { id: templateId },
      data: updates
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating template:", error);
    return { success: false, error: "Failed to update template" };
  }
}