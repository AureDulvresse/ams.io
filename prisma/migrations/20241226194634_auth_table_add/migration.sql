/*
  Warnings:

  - You are about to drop the column `is_read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - The primary key for the `ParentStudent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `parent_id` on the `ParentStudent` table. All the data in the column will be lost.
  - You are about to drop the column `relation` on the `ParentStudent` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `level_id` on the `TuitionFeeStructure` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `TuitionPayment` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `TuitionPayment` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleDailySalary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Salary` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receipt_number]` on the table `TuitionPayment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academic_year_id` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationship` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ParentStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Semester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_id` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staff_type_id` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `program_level` to the `TuitionFeeStructure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount_paid` to the `TuitionPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee_structure_id` to the `TuitionPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipt_number` to the `TuitionPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TuitionPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Login" DROP CONSTRAINT "Login_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ParentStudent" DROP CONSTRAINT "ParentStudent_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "RoleDailySalary" DROP CONSTRAINT "RoleDailySalary_role_id_fkey";

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_department_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_role_id_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_user_id_fkey";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "academic_year_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "max_capacity" INTEGER,
ADD COLUMN     "organizer" TEXT,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Login" ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "login_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "is_read",
DROP COLUMN "subject",
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "sender_id" SET DATA TYPE TEXT,
ALTER COLUMN "receiver_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "is_read",
DROP COLUMN "type",
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ParentStudent" DROP CONSTRAINT "ParentStudent_pkey",
DROP COLUMN "parent_id",
DROP COLUMN "relation",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "relationship" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "ParentStudent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Qualification" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "recurring" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Semester" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_current" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "role_id",
ADD COLUMN     "position_id" INTEGER NOT NULL,
ADD COLUMN     "staff_type_id" INTEGER NOT NULL,
ALTER COLUMN "department_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StaffAttendance" ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "StudentAttendance" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "priority",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "due_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TuitionFeeStructure" DROP COLUMN "level_id",
ADD COLUMN     "program_level" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TuitionPayment" DROP COLUMN "amount",
DROP COLUMN "reference",
ADD COLUMN     "amount_paid" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "fee_structure_id" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "receipt_number" TEXT NOT NULL,
ADD COLUMN     "transaction_reference" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Parent";

-- DropTable
DROP TABLE "RoleDailySalary";

-- DropTable
DROP TABLE "Salary";

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryScale" (
    "id" SERIAL NOT NULL,
    "grade" TEXT NOT NULL,
    "base_salary" DECIMAL(10,2) NOT NULL,
    "hourly_rate" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryScale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffSalary" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "salary_scale_id" INTEGER NOT NULL,
    "base_salary" DECIMAL(10,2) NOT NULL,
    "allowances" JSONB,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffSalary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryPayment" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "base_amount" DECIMAL(10,2) NOT NULL,
    "bonuses" JSONB,
    "deductions" JSONB,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_date" TIMESTAMP(3),
    "payment_method" TEXT,
    "status" TEXT NOT NULL,
    "reference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalaryPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT,
    "publisher" TEXT,
    "publication_year" INTEGER,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "total_copies" INTEGER NOT NULL,
    "available_copies" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookBorrowing" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "student_id" INTEGER,
    "staff_id" INTEGER,
    "borrow_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookBorrowing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_key" ON "Position"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StaffType_name_key" ON "StaffType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StaffSalary_staff_id_key" ON "StaffSalary"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSettings_key_key" ON "SystemSettings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TuitionPayment_receipt_number_key" ON "TuitionPayment"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_staff_type_id_fkey" FOREIGN KEY ("staff_type_id") REFERENCES "StaffType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSalary" ADD CONSTRAINT "StaffSalary_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSalary" ADD CONSTRAINT "StaffSalary_salary_scale_id_fkey" FOREIGN KEY ("salary_scale_id") REFERENCES "SalaryScale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryPayment" ADD CONSTRAINT "SalaryPayment_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuitionPayment" ADD CONSTRAINT "TuitionPayment_fee_structure_id_fkey" FOREIGN KEY ("fee_structure_id") REFERENCES "TuitionFeeStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrowing" ADD CONSTRAINT "BookBorrowing_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
