import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { ManagementMember } from '@/lib/db/models';

export const revalidate = 3600;

export async function GET() {
  await connectDB();

  const members = await ManagementMember.find({ deletedAt: null, status: 'published' })
    .sort({ order: 1, createdAt: 1 })
    .select('nameNp post role order')
    .lean();

  const chief = members.find((m) => m.role === 'chief') ?? null;
  const committee = members.filter((m) => m.role !== 'chief');

  return NextResponse.json({
    chief: chief
      ? { id: chief._id.toString(), nameNp: chief.nameNp, post: chief.post }
      : null,
    members: committee.map((m) => ({
      id: m._id.toString(),
      nameNp: m.nameNp,
      post: m.post,
      role: m.role,
    })),
  });
}
