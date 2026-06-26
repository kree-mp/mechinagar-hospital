import { cookies } from 'next/headers';
import { verifyToken, type SessionPayload } from './jwt';

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
