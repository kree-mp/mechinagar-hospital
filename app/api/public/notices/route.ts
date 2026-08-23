import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Notice, NoticeCategory } from '@/lib/db/models';
import { formatBsDay, formatBsMonth } from '@/lib/utils/dateNp';

export const revalidate = 1800;

export async function GET() {
  await connectDB();

  const categories = await NoticeCategory.find({ deletedAt: null })
    .sort({ order: 1 })
    .select('slug labelNp order')
    .lean();

  const categoryIds = categories.map((c) => c._id);

  const notices = await Notice.find({
    deletedAt: null,
    status: 'published',
    category: { $in: categoryIds },
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  })
    .sort({ createdAt: -1 })
    .select('title refNumber category publishedAt createdAt file coverPhoto')
    .lean({ virtuals: true });

  const NOTICE_NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const grouped = Object.fromEntries(categories.map((c) => [c._id.toString(), [] as unknown[]]));

  for (const n of notices) {
    const catId = n.category.toString();
    if (!grouped[catId]) continue;
    const date = n.publishedAt ?? n.createdAt;
    (grouped[catId] as unknown[]).push({
      id: n._id.toString(),
      title: n.title,
      refNumber: n.refNumber,
      fileUrl: n.file?.url ?? null,
      coverPhotoUrl: n.coverPhoto?.url ?? null,
      day: date ? formatBsDay(date) : '–',
      mon: date ? formatBsMonth(date) : '–',
      isNew: date ? date.getTime() > now - NOTICE_NEW_WINDOW_MS : false,
    });
  }

  return NextResponse.json({
    categories: categories.map((c) => ({
      slug: c.slug,
      labelNp: c.labelNp,
      notices: grouped[c._id.toString()] ?? [],
    })),
  });
}
