-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM (
    'PRIMARY_1',
    'PRIMARY_2',
    'PRIMARY_3',
    'PRIMARY_4',
    'PRIMARY_5',
    'PRIMARY_6',
    'JS_1',
    'JS_2',
    'JS_3',
    'SS_1',
    'SS_2',
    'SS_3',
    'YEAR_1',
    'YEAR_2',
    'YEAR_3',
    'YEAR_4',
    'YEAR_5',
    'YEAR_6',
    'YEAR_7'
);

-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'UNAPPROVED';

-- AlterTable
ALTER TABLE "user" ADD COLUMN "educationLevel" "EducationLevel";
