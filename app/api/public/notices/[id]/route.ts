import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Notice, NoticeCategory } from '@/lib/db/models';
import { formatBsDay, formatBsMonth } from '@/lib/utils/dateNp';

export const revalidate = 1800;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const n = await Notice.findOne({ _id: id, deletedAt: null, status: 'published' })
    .select('title refNumber body category publishedAt createdAt file')
    .lean({ virtuals: false });

  if (!n) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const category = await NoticeCategory.findById(n.category).select('labelNp').lean();
  const date = n.publishedAt ?? n.createdAt;

  return NextResponse.json({
    notice: {
      id: n._id.toString(),
      title: n.title,
      refNumber: n.refNumber,
      body: n.body ?? null,
      fileUrl: n.file?.url ?? null,
      categoryLabel: category?.labelNp ?? null,
      day: date ? formatBsDay(date) : '–',
      mon: date ? formatBsMonth(date) : '–',
    },
  });
}
