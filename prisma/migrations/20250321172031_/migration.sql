/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.
  - The required column `slug` was added to the `Projects` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Projects_slug_key" ON "Projects"("slug");
