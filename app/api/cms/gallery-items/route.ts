import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { GalleryItem } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { galleryItemSchema } from '@/lib/validations/cms';

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const categoryId = req.nextUrl.searchParams.get('category');
  await connectDB();

  const filter: Record<string, unknown> = { deletedAt: null };
  if (categoryId) filter.category = categoryId;

  const items = await GalleryItem.find(filter).sort({ order: 1, createdAt: 1 }).lean();

  return NextResponse.json({
    items: items.map((i) => ({
      ...i,
      _id: i._id.toString(),
      category: i.category.toString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = galleryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const item = await GalleryItem.create({ ...parsed.data, createdBy: auth.session.sub });

  revalidatePublic('gallery');
  return NextResponse.json({ item }, { status: 201 });
}
