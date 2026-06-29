import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { NewsEvent } from '@/lib/db/models';
import { formatBsDay, formatBsMonth } from '@/lib/utils/dateNp';

export const revalidate = 3600;

export async function GET() {
  await connectDB();

  const items = await NewsEvent.find({ deletedAt: null, status: 'published' })
    .sort({ createdAt: -1 })
    .select('title slug excerpt label coverImage isEvent eventDate publishedAt createdAt')
    .lean();

  return NextResponse.json({
    items: items.map((n) => {
      const date = n.eventDate ?? n.publishedAt ?? n.createdAt;
      return {
        id: n._id.toString(),
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt,
        label: n.label || (n.isEvent ? 'कार्यक्रम' : 'समाचार'),
        imageUrl: n.coverImage?.url ?? null,
        date: date ? `${formatBsDay(date)} ${formatBsMonth(date)}` : '',
      };
    }),
  });
}
