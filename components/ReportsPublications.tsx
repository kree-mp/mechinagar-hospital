"use client";

import { useQuery } from "@tanstack/react-query";

interface DownloadItem {
  id: string;
  titleNp: string;
  titleEn: string;
  fiscalYear: string;
  fileUrl: string;
  fileFormat: string;
}

interface DownloadCategory {
  slug: string;
  labelNp: string;
  labelEn: string;
  downloads: DownloadItem[];
}

interface DownloadsData {
  categories: DownloadCategory[];
}

async function fetchDownloads(): Promise<DownloadsData> {
  const res = await fetch("/api/public/downloads");
  if (!res.ok) throw new Error("Failed to fetch downloads");
  return res.json();
}

function ReportsSkeleton() {
  return (
    <div className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="h-3 w-24 animate-pulse rounded bg-[#e4e7ec]" />
          <div className="h-7 w-48 animate-pulse rounded bg-[#e4e7ec]" />
          <div className="h-[3px] w-[54px] bg-[#e4e7ec]" />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-md bg-[#e4e7ec]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPublications() {
  const { data, isLoading } = useQuery<DownloadsData>({
    queryKey: ["public-downloads"],
    queryFn: fetchDownloads,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading || !data) return <ReportsSkeleton />;

  return (
    <div id="reports" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            DOWNLOADS
          </div>
          <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">
            प्रतिवेदन तथा प्रकाशन
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {data.categories.map((cat) => (
            <div
              key={cat.slug}
              className="flex items-center justify-between gap-3 rounded-md border border-[#e4e7ec] bg-white px-5 py-4"
            >
              <div>
                <div className="font-np text-[15px] font-bold text-[#1B262C]">{cat.labelNp}</div>
                <div className="mt-0.5 text-[11px] font-semibold tracking-[.5px] text-[#98a0aa]">
                  {cat.labelEn}
                </div>
              </div>
              {cat.downloads.length > 0 ? (
                <a
                  href={cat.downloads[0].fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-np flex-none rounded-[20px] bg-[#EBF3FB] px-3 py-1.5 text-[12px] font-semibold text-[#3282B8] hover:bg-[#d6eaf8] transition-colors"
                >
                  डाउनलोड ↓
                </a>
              ) : (
                <span className="font-np flex-none rounded-[20px] bg-[#f0f2f5] px-3 py-1.5 text-[12px] font-semibold text-[#98a0aa]">
                  अपलोड हुँदैछ
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
