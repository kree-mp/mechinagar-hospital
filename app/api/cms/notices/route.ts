import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Notice } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { noticeSchema } from '@/lib/validations/cms';

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const categoryId = req.nextUrl.searchParams.get('category');
  await connectDB();

  const filter = categoryId ? { category: categoryId } : {};
  const notices = await Notice.find(filter).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    notices: notices.map((n) => ({
      ...n,
      _id: n._id.toString(),
      category: n.category.toString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = noticeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const notice = await Notice.create({ ...parsed.data, createdBy: auth.session.sub });

  return NextResponse.json({ notice }, { status: 201 });
}
