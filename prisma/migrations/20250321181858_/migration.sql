/*
  Warnings:

  - A unique constraint covering the columns `[image_name,image_url]` on the table `DockerImageServices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_name` to the `DockerImageServices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DockerImageServices" ADD COLUMN     "image_name" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DockerImageServices_image_name_image_url_key" ON "DockerImageServices"("image_name", "image_url");
