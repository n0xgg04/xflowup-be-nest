/*
  Warnings:

  - You are about to drop the column `slug` on the `Projects` table. All the data in the column will be lost.
  - You are about to alter the column `balance` on the `UserBalance` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `UserBanned` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Projects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `Projects` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserBanned" DROP CONSTRAINT "UserBanned_userId_fkey";

-- DropIndex
DROP INDEX "Projects_slug_key";

-- DropIndex
DROP INDEX "Projects_team_id_idx";

-- DropIndex
DROP INDEX "Teams_slug_idx";

-- DropIndex
DROP INDEX "Users_email_idx";

-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "slug",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "url" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserBalance" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "UserBanned";
