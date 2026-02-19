/*
  Warnings:

  - You are about to drop the column `authorId` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `blog_posts` table. All the data in the column will be lost.
  - Added the required column `author` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorImage` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excerpt` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readTime` to the `blog_posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_authorId_fkey";

-- AlterTable
ALTER TABLE "blog_posts" DROP COLUMN "authorId",
DROP COLUMN "status",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "authorImage" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "excerpt" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readTime" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "content" SET DEFAULT '';

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "expertise" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tags" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);
