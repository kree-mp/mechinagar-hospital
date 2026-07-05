import { revalidatePath } from 'next/cache';

/**
 * Maps a unit of CMS-managed content to the public surfaces that mirror it.
 * Calling {@link revalidatePublic} after a mutation invalidates these on-demand
 * so published changes appear without waiting for the time-based fallback.
 *
 * Entries are either a literal path (page or route handler) or a
 * `[routePattern, type]` tuple for dynamic segments (required by Next.js).
 */
type RevalidateTarget = string | [pattern: string, type: 'page' | 'layout'];

const PUBLIC_TARGETS = {
  // Doctors section → client-fetched API route
  staff: ['/api/public/staff'],
  // ManagementCommittee is server-rendered into the home page
  management: ['/'],
  // PramukhMessages is server-rendered into the home page
  pramukhMessages: ['/'],
  // Gallery section → client-fetched API route
  gallery: ['/api/public/gallery'],
  // NoticeBoard (list) + every notice detail page
  notices: ['/api/public/notices', ['/notices/[id]', 'page']],
  // ReportsPublications section → client-fetched API route
  downloads: ['/api/public/downloads'],
  // NewsEvents (list) → client-fetched API route + every news detail page
  newsEvents: ['/api/public/news-events', ['/news/[slug]', 'page']],
} satisfies Record<string, RevalidateTarget[]>;

export type PublicContent = keyof typeof PUBLIC_TARGETS;

/** Invalidate every public cache entry mirroring the given CMS content. */
export function revalidatePublic(...keys: PublicContent[]): void {
  for (const key of keys) {
    for (const target of PUBLIC_TARGETS[key]) {
      if (typeof target === 'string') revalidatePath(target);
      else revalidatePath(target[0], target[1]);
    }
  }
}
