import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User.model';
import { requireSuperAdmin, isErrorResponse } from '@/lib/auth/requireSuperAdmin';

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const auth = await requireSuperAdmin();
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;

  await connectDB();

  const user = await User.findOne({ _id: id, role: { $ne: 'superadmin' } }).select('+password');
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const tempPassword = crypto.randomBytes(6).toString('hex') + 'Aa1!';
  user.password = tempPassword;
  await user.save({ validateModifiedOnly: true });

  return NextResponse.json({ tempPassword });
}
