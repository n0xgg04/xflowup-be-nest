/*
  Warnings:

  - Added the required column `icon` to the `DockerImageServices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DockerImageServices" ADD COLUMN     "icon" VARCHAR(255) NOT NULL;
