/*
  Warnings:

  - The values [ADMIN] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."UserSystemRoleStatus" AS ENUM ('active', 'inactive');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."RoleType_new" AS ENUM ('SUPER_ADMIN', 'VENDOR');
ALTER TABLE "public"."Role" ALTER COLUMN "roleType" DROP DEFAULT;
ALTER TABLE "public"."Role" ALTER COLUMN "roleType" TYPE "public"."RoleType_new" USING ("roleType"::text::"public"."RoleType_new");
ALTER TYPE "public"."RoleType" RENAME TO "RoleType_old";
ALTER TYPE "public"."RoleType_new" RENAME TO "RoleType";
DROP TYPE "public"."RoleType_old";
ALTER TABLE "public"."Role" ALTER COLUMN "roleType" SET DEFAULT 'VENDOR';
COMMIT;

-- CreateTable
CREATE TABLE "public"."UserSystemRole" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "roleID" TEXT NOT NULL,
    "status" "public"."UserSystemRoleStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "UserSystemRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSystemRole_userID_roleID_key" ON "public"."UserSystemRole"("userID", "roleID");

-- AddForeignKey
ALTER TABLE "public"."UserSystemRole" ADD CONSTRAINT "UserSystemRole_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSystemRole" ADD CONSTRAINT "UserSystemRole_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
