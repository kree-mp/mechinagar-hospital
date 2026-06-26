import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Download } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { downloadPatchSchema } from '@/lib/validations/cms';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const parsed = downloadPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const download = await Download.findByIdAndUpdate(
    id,
    { ...parsed.data, updatedBy: auth.session.sub },
    { new: true, runValidators: true }
  );

  if (!download) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ download });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();

  const download = await Download.findById(id);
  if (!download) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await download.softDelete(auth.session.sub);

  return NextResponse.json({ ok: true });
}
