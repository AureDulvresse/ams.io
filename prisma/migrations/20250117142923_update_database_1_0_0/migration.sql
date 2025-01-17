/*
  Warnings:

  - The `device` column on the `Login` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `ip_address` on the `Login` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Login" DROP COLUMN "ip_address",
ADD COLUMN     "ip_address" JSONB NOT NULL,
DROP COLUMN "device",
ADD COLUMN     "device" JSONB;
