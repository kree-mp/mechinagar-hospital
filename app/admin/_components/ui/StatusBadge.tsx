import type { PublishStatus } from '@/lib/db/plugins/publishable.plugin';

const MAP: Record<PublishStatus, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  published: { label: 'Published', classes: 'bg-green-50 text-green-700 border-green-200' },
  archived: { label: 'Archived', classes: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export default function StatusBadge({ status }: { status: PublishStatus }) {
  const { label, classes } = MAP[status] ?? MAP.draft;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}
