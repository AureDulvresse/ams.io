/*
  Warnings:

  - You are about to drop the column `archive_reason` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `archived_at` on the `Course` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `name` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the column `class_id` on the `Subject` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `Subject` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `name` on the `Subject` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `Subject` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "archive_reason",
DROP COLUMN "archived_at",
ALTER COLUMN "code" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "class_id",
ALTER COLUMN "code" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- CreateTable
CREATE TABLE "CourseVersion" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "changes" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseEquivalence" (
    "id" SERIAL NOT NULL,
    "source_course_id" INTEGER NOT NULL,
    "target_course_id" INTEGER NOT NULL,
    "equivalence_type" VARCHAR(20) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseEquivalence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseGroupMembership" (
    "course_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseGroupMembership_pkey" PRIMARY KEY ("course_id","group_id")
);

-- CreateTable
CREATE TABLE "EnrollmentConstraint" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "min_grade" DOUBLE PRECISION,
    "min_credits" INTEGER,
    "max_students" INTEGER,
    "prerequisites_validation_rule" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrollmentConstraint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequiredCourse" (
    "constraint_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequiredCourse_pkey" PRIMARY KEY ("constraint_id","course_id")
);

-- AddForeignKey
ALTER TABLE "CourseVersion" ADD CONSTRAINT "CourseVersion_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEquivalence" ADD CONSTRAINT "CourseEquivalence_source_course_id_fkey" FOREIGN KEY ("source_course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEquivalence" ADD CONSTRAINT "CourseEquivalence_target_course_id_fkey" FOREIGN KEY ("target_course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseGroupMembership" ADD CONSTRAINT "CourseGroupMembership_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseGroupMembership" ADD CONSTRAINT "CourseGroupMembership_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "CourseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentConstraint" ADD CONSTRAINT "EnrollmentConstraint_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequiredCourse" ADD CONSTRAINT "RequiredCourse_constraint_id_fkey" FOREIGN KEY ("constraint_id") REFERENCES "EnrollmentConstraint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
