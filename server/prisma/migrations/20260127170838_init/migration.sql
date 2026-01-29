-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FACULTY', 'STUDENT');

-- CreateEnum
CREATE TYPE "RegType" AS ENUM ('ONLINE', 'MANUAL');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECH', 'CULTURAL', 'SPORTS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "rollNumber" TEXT,
    "branch" TEXT,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "location" TEXT,
    "fees" INTEGER NOT NULL DEFAULT 0,
    "category" "Category",
    "posterUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "mainCoordinatorId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "RegType" NOT NULL DEFAULT 'ONLINE',
    "eventId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventCoordinators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_eventId_studentId_key" ON "Registration"("eventId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_EventCoordinators_AB_unique" ON "_EventCoordinators"("A", "B");

-- CreateIndex
CREATE INDEX "_EventCoordinators_B_index" ON "_EventCoordinators"("B");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_mainCoordinatorId_fkey" FOREIGN KEY ("mainCoordinatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventCoordinators" ADD CONSTRAINT "_EventCoordinators_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventCoordinators" ADD CONSTRAINT "_EventCoordinators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
