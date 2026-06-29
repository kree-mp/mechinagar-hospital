import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { NewsEvent } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { newsEventSchema } from '@/lib/validations/cms';

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const isEvent = req.nextUrl.searchParams.get('isEvent');
  await connectDB();

  const filter = isEvent !== null ? { isEvent: isEvent === 'true' } : {};
  const items = await NewsEvent.find(filter).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    items: items.map((i) => ({ ...i, _id: i._id.toString() })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = newsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const item = await NewsEvent.create({ ...parsed.data, createdBy: auth.session.sub });

  revalidatePublic('newsEvents');
  return NextResponse.json({ item }, { status: 201 });
}
