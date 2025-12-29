-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Artwork_isFavorite_idx" ON "Artwork"("isFavorite");
