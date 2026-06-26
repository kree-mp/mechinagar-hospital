import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Staff, StaffCategory } from '@/lib/db/models';

export const revalidate = 3600;

export async function GET() {
  await connectDB();

  const [categories, staffList] = await Promise.all([
    StaffCategory.find({ deletedAt: null }).sort({ order: 1 }).select('slug labelNp labelEn order').lean(),
    Staff.find({ deletedAt: null, status: 'published' })
      .sort({ order: 1, createdAt: 1 })
      .populate<{ category: { slug: string } }>('category', 'slug')
      .select('nameNp post photo category order')
      .lean(),
  ]);

  return NextResponse.json({
    categories: categories.map((c) => ({
      slug: c.slug,
      labelNp: c.labelNp,
      labelEn: c.labelEn,
      order: c.order,
    })),
    staff: staffList.map((s) => ({
      id: s._id.toString(),
      nameNp: s.nameNp,
      post: s.post,
      photoUrl: s.photo?.url ?? null,
      categorySlug: (s.category as unknown as { slug: string }).slug,
    })),
  });
}
