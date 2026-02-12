-- CreateEnum
CREATE TYPE "Department" AS ENUM ('ALL', 'COMPUTER', 'ELECTRICAL', 'MECHANICAL', 'CIVIL', 'AUTO');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "department" "Department" NOT NULL DEFAULT 'ALL';
