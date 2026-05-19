/*
  Warnings:

  - You are about to drop the column `isSystemRole` on the `Role` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'VENDOR');

-- AlterTable
ALTER TABLE "public"."Role" DROP COLUMN "isSystemRole",
ADD COLUMN     "roleType" "public"."RoleType" NOT NULL DEFAULT 'VENDOR';
