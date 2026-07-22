import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { GalleryCategory, GalleryItem } from '@/lib/db/models';
import { youtubeThumbnailUrl } from '@/lib/utils/youtube';

export const revalidate = 3600;

export async function GET() {
  await connectDB();

  const [categories, items] = await Promise.all([
    GalleryCategory.find({ deletedAt: null })
      .sort({ order: 1 })
      .select('slug labelNp labelEn order')
      .lean(),
    GalleryItem.find({ deletedAt: null, status: 'published' })
      .sort({ order: 1, createdAt: 1 })
      .populate<{ category: { slug: string } }>('category', 'slug')
      .select('labelNp labelEn media thumbnail isVideo isYoutube youtubeId col row order category')
      .lean(),
  ]);

  return NextResponse.json({
    categories: categories.map((c) => ({
      slug: c.slug,
      labelNp: c.labelNp,
      labelEn: c.labelEn,
    })),
    items: items.map((i) => ({
      id: i._id.toString(),
      labelNp: i.labelNp,
      labelEn: i.labelEn,
      mediaUrl: i.media?.url ?? null,
      thumbnailUrl: i.isYoutube && i.youtubeId
        ? youtubeThumbnailUrl(i.youtubeId)
        : (i.thumbnail?.url ?? null),
      isVideo: i.isVideo,
      isYoutube: i.isYoutube,
      youtubeId: i.youtubeId ?? null,
      col: i.col,
      row: i.row,
      categorySlug: (i.category as unknown as { slug: string }).slug,
    })),
  });
}
