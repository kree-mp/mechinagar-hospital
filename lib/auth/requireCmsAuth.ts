import { NextResponse } from 'next/server';
import { getSession } from './session';
import type { SessionPayload } from './jwt';

type CmsAuthResult =
  | { session: SessionPayload; error?: never }
  | { error: NextResponse; session?: never };

export async function requireCmsAuth(): Promise<CmsAuthResult> {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { session };
}
