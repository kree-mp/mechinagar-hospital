import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Service } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { servicePatchSchema } from '@/lib/validations/cms';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const parsed = servicePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const service = await Service.findByIdAndUpdate(
    id,
    { ...parsed.data, updatedBy: auth.session.sub },
    { new: true, runValidators: true }
  );

  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  revalidatePublic('services');
  return NextResponse.json({ service });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  await connectDB();

  const service = await Service.findById(id);
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await service.softDelete(auth.session.sub);

  revalidatePublic('services');
  return NextResponse.json({ ok: true });
}