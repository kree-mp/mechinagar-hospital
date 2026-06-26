import { cookies } from 'next/headers';
import { verifyToken, type SessionPayload } from './jwt';
import { NextResponse } from 'next/server';

export async function requireSuperAdmin(): Promise<SessionPayload | NextResponse> {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await verifyToken(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return session;
}

export function isErrorResponse(v: SessionPayload | NextResponse): v is NextResponse {
  return v instanceof NextResponse;
}
