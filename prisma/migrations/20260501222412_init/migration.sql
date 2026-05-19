/*
  Warnings:

  - A unique constraint covering the columns `[vendorID,slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vendorID,name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Product_slug_key";

-- DropIndex
DROP INDEX "public"."Role_name_key";

-- AlterTable
ALTER TABLE "public"."Role" ADD COLUMN     "vendorID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_vendorID_slug_key" ON "public"."Product"("vendorID", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Role_vendorID_name_key" ON "public"."Role"("vendorID", "name");

-- AddForeignKey
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_vendorID_fkey" FOREIGN KEY ("vendorID") REFERENCES "public"."Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
