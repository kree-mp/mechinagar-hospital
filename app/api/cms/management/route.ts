import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { ManagementMember } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { managementSchema } from '@/lib/validations/cms';

const ROLE_ORDER = { chief: 0, president: 1, vp: 2, member: 3 };

export async function GET() {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  await connectDB();

  const members = await ManagementMember.find().sort({ order: 1, createdAt: 1 }).lean();

  return NextResponse.json({
    members: members
      .map((m) => ({ ...m, _id: m._id.toString() }))
      .sort((a, b) => (ROLE_ORDER[a.role as keyof typeof ROLE_ORDER] ?? 3) - (ROLE_ORDER[b.role as keyof typeof ROLE_ORDER] ?? 3)),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = managementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const member = await ManagementMember.create({ ...parsed.data, createdBy: auth.session.sub });

  revalidatePublic('management');
  return NextResponse.json({ member }, { status: 201 });
}
