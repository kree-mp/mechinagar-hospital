import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User.model';
import { requireSuperAdmin, isErrorResponse } from '@/lib/auth/requireSuperAdmin';

const USER_PROJECTION =
  '_id name email role isActive blacklisted lastLoginAt createdAt lockedUntil failedLoginAttempts';

export async function GET() {
  const auth = await requireSuperAdmin();
  if (isErrorResponse(auth)) return auth;

  await connectDB();

  const users = await User.find({ role: { $ne: 'superadmin' } })
    .select(USER_PROJECTION + ' +failedLoginAttempts +lockedUntil')
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (isErrorResponse(auth)) return auth;

  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (!['admin', 'editor'].includes(role)) {
    return NextResponse.json({ error: 'Role must be admin or editor' }, { status: 400 });
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  const user = await User.create({ name, email, password, role });

  return NextResponse.json(
    {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        blacklisted: user.blacklisted,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        lockedUntil: null,
        failedLoginAttempts: 0,
      },
    },
    { status: 201 }
  );
}
