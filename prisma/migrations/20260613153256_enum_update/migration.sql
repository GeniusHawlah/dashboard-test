/*
  Warnings:

  - You are about to drop the column `displayUsername` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_displayUsername_key";

-- DropIndex
DROP INDEX "user_username_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "displayUsername",
DROP COLUMN "isActive",
DROP COLUMN "username";
