/*
  Warnings:

  - The `targetDuration` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `subject` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "actualDuration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ALTER COLUMN "subject" SET NOT NULL,
ALTER COLUMN "subject" SET DEFAULT 'General',
DROP COLUMN "targetDuration",
ADD COLUMN     "targetDuration" INTEGER NOT NULL DEFAULT 0;
