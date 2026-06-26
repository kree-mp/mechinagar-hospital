import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Download } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { downloadSchema } from '@/lib/validations/cms';

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const categoryId = req.nextUrl.searchParams.get('category');
  await connectDB();

  const filter = categoryId ? { category: categoryId } : {};
  const downloads = await Download.find(filter).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    downloads: downloads.map((d) => ({
      ...d,
      _id: d._id.toString(),
      category: d.category.toString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const download = await Download.create({ ...parsed.data, createdBy: auth.session.sub });

  return NextResponse.json({ download }, { status: 201 });
}
