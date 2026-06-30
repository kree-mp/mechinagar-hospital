"use client";

import { useLinkStatus } from "next/link";

/**
 * In-place pending feedback for a navigation `<Link>`. Render as a direct child
 * of a `relative` Link; it covers the link with a spinner the instant the click
 * is registered, until the destination route segment finishes loading.
 */
export default function RoutePendingOverlay() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span className="absolute inset-0 z-10 flex items-center justify-center bg-white/55 backdrop-blur-[1px]">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#0F4C75] border-t-transparent" />
    </span>
  );
}
