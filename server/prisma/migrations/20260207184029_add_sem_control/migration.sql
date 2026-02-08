-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "maxSem" INTEGER,
ADD COLUMN     "semControlEnabled" BOOLEAN NOT NULL DEFAULT false;
