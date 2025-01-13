/*
  Warnings:

  - You are about to drop the column `department_id` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_department_id_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "department_id";

-- CreateTable
CREATE TABLE "SubjectDepartment" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "SubjectDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectDepartment_subject_id_department_id_key" ON "SubjectDepartment"("subject_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- AddForeignKey
ALTER TABLE "SubjectDepartment" ADD CONSTRAINT "SubjectDepartment_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectDepartment" ADD CONSTRAINT "SubjectDepartment_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
