import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User.model';
import { requireSuperAdmin, isErrorResponse } from '@/lib/auth/requireSuperAdmin';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireSuperAdmin();
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  const body = await req.json();

  await connectDB();

  const user = await User.findOne({ _id: id, role: { $ne: 'superadmin' } }).select(
    '+failedLoginAttempts +lockedUntil'
  );
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if ('isActive' in body) user.isActive = Boolean(body.isActive);
  if ('blacklisted' in body) {
    user.blacklisted = Boolean(body.blacklisted);
    if (user.blacklisted) user.isActive = false;
  }
  if ('role' in body) {
    if (!['admin', 'editor'].includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    user.role = body.role;
  }
  if (body.unlock) {
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
  }

  await user.save({ validateModifiedOnly: true });

  return NextResponse.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      blacklisted: user.blacklisted,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      lockedUntil: user.lockedUntil,
      failedLoginAttempts: user.failedLoginAttempts,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireSuperAdmin();
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;

  await connectDB();

  const user = await User.findOneAndDelete({ _id: id, role: { $ne: 'superadmin' } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ ok: true });
}
