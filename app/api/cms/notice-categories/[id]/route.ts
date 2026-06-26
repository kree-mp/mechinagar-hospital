import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { NoticeCategory } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { noticeCategorySchema } from '@/lib/validations/cms';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const parsed = noticeCategorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const category = await NoticeCategory.findByIdAndUpdate(
    id,
    { ...parsed.data, updatedBy: auth.session.sub },
    { new: true, runValidators: true }
  );

  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ category });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();

  const category = await NoticeCategory.findById(id);
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await category.softDelete(auth.session.sub);

  return NextResponse.json({ ok: true });
}
