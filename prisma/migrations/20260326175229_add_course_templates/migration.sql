-- CreateTable
CREATE TABLE "CourseTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT 'General',
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "defaultDuration" INTEGER NOT NULL DEFAULT 30,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseTemplate" ADD CONSTRAINT "CourseTemplate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
