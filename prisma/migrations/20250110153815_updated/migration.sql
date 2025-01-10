/*
  Warnings:

  - Added the required column `archived_at` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "archived_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
