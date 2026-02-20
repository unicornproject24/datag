-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "consentDate" TIMESTAMP(3),
ADD COLUMN     "consentGiven" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentName" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "links" JSONB,
ADD COLUMN     "preferredName" TEXT,
ADD COLUMN     "projects" JSONB,
ADD COLUMN     "researchInterests" TEXT[] DEFAULT ARRAY[]::TEXT[];
