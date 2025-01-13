/*
  Warnings:

  - You are about to drop the column `department_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `semester_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_department_id_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_course_id_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "department_id",
ADD COLUMN     "semester_id" INTEGER NOT NULL,
ADD COLUMN     "subject_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "course_id",
ADD COLUMN     "department_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
