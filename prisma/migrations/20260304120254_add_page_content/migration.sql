-- CreateTable
CREATE TABLE "page_contents" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "contentKey" TEXT NOT NULL,
    "contentValue" TEXT NOT NULL,
    "metadata" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_contents_pageKey_section_contentKey_key" ON "page_contents"("pageKey", "section", "contentKey");
