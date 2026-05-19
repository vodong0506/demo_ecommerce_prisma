/*
  Warnings:

  - The values [SUPER_ADMIN] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RoleType_new" AS ENUM ('SYSTEM', 'VENDOR');
ALTER TABLE "public"."Role" ALTER COLUMN "roleType" DROP DEFAULT;
ALTER TABLE "public"."Role" ALTER COLUMN "roleType" TYPE "public"."RoleType_new" USING ("roleType"::text::"public"."RoleType_new");
ALTER TYPE "public"."RoleType" RENAME TO "RoleType_old";
ALTER TYPE "public"."RoleType_new" RENAME TO "RoleType";
DROP TYPE "public"."RoleType_old";
ALTER TABLE "public"."Role" ALTER COLUMN "roleType" SET DEFAULT 'VENDOR';
COMMIT;
