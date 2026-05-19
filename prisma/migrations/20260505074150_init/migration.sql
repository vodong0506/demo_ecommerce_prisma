/*
  Warnings:

  - You are about to drop the column `vendorID` on the `Role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Role" DROP CONSTRAINT "Role_vendorID_fkey";

-- DropIndex
DROP INDEX "public"."Role_vendorID_name_key";

-- AlterTable
ALTER TABLE "public"."Role" DROP COLUMN "vendorID";
