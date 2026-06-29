import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { NoticeCategory, Notice } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { noticeCategorySchema } from '@/lib/validations/cms';

export async function GET() {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  await connectDB();

  const [categories, counts] = await Promise.all([
    NoticeCategory.find().sort({ order: 1, createdAt: 1 }).lean(),
    Notice.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = Object.fromEntries(counts.map((c: { _id: string; count: number }) => [c._id.toString(), c.count]));

  return NextResponse.json({
    categories: categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      noticeCount: countMap[cat._id.toString()] ?? 0,
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = noticeCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const category = await NoticeCategory.create({ ...parsed.data, createdBy: auth.session.sub });

  revalidatePublic('notices');
  return NextResponse.json({ category }, { status: 201 });
}
