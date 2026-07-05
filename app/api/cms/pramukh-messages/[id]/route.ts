import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { PramukhMessage } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { pramukhMessagePatchSchema } from '@/lib/validations/cms';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const parsed = pramukhMessagePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const message = await PramukhMessage.findByIdAndUpdate(
    id,
    { ...parsed.data, updatedBy: auth.session.sub },
    { new: true, runValidators: true }
  );

  if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  revalidatePublic('pramukhMessages');
  return NextResponse.json({ message });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();

  const message = await PramukhMessage.findById(id);
  if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await message.softDelete(auth.session.sub);

  revalidatePublic('pramukhMessages');
  return NextResponse.json({ ok: true });
}
