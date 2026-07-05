import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { PramukhMessage } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { pramukhMessageSchema } from '@/lib/validations/cms';

export async function GET() {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  await connectDB();

  const messages = await PramukhMessage.find().sort({ role: 1 }).lean();

  return NextResponse.json({
    messages: messages.map((m) => ({ ...m, _id: m._id.toString() })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = pramukhMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const message = await PramukhMessage.create({ ...parsed.data, createdBy: auth.session.sub });

  revalidatePublic('pramukhMessages');
  return NextResponse.json({ message }, { status: 201 });
}
