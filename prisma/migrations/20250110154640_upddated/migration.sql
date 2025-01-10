/*
  Warnings:

  - Added the required column `archive_reason` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "archive_reason" TEXT NOT NULL;
