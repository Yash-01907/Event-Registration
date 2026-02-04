-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "formConfig" JSONB,
ADD COLUMN     "isTeamEvent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxParticipants" INTEGER,
ADD COLUMN     "maxTeamSize" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "minTeamSize" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "registrationDeadline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "formData" JSONB,
ADD COLUMN     "teamMembers" JSONB,
ADD COLUMN     "teamName" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "semester" INTEGER;
