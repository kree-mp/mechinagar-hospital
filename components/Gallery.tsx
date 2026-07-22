"use client";

import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/providers/LanguageProvider";
import { youtubeEmbedUrl } from "@/lib/utils/youtube";

const INITIAL_LIMIT = 8;

interface GalleryItemPublic {
  id: string;
  labelNp: string;
  labelEn: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  isVideo: boolean;
  isYoutube: boolean;
  youtubeId: string | null;
  col: string;
  row: string;
}

async function fetchGallery(): Promise<{ items: GalleryItemPublic[] }> {
  const res = await fetch("/api/public/gallery");
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
}

function GallerySkeleton() {
  return (
    <div className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="h-3 w-28 animate-pulse rounded bg-[#e4e7ec]" />
          <div className="h-7 w-32 animate-pulse rounded bg-[#e4e7ec]" />
          <div className="h-[3px] w-[54px] bg-[#e4e7ec]" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-3.5">
          {Array.from({ length: INITIAL_LIMIT }).map((_, i) => (
            <div
              key={i}
              className="aspect-[16/10] rounded-md animate-pulse bg-[#e4e7ec]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const PlayBadge = memo(function PlayBadge({
  label,
  npClass,
}: {
  label: string;
  npClass: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/25">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D24B45] text-white text-xs">
        ▶
      </span>
      <span
        className={`text-[12.5px] font-semibold text-white drop-shadow-sm ${npClass}`}
      >
        {label}
      </span>
    </div>
  );
});

const GalleryTile = memo(function GalleryTile({
  item,
  label,
  npClass,
}: {
  item: GalleryItemPublic;
  label: string;
  npClass: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (item.isYoutube && item.youtubeId) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-black">
        {playing ? (
          <iframe
            src={youtubeEmbedUrl(item.youtubeId)}
            title={label}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={label}
            className="absolute inset-0 h-full w-full cursor-pointer hover:brightness-95 transition-[filter]"
          >
            {item.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnailUrl}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}
            <PlayBadge label={label} npClass={npClass} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-md cursor-pointer hover:brightness-95 transition-[filter]">
      {item.isVideo ? (
        <>
          {item.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnailUrl}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
          <PlayBadge label={label} npClass={npClass} />
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.mediaUrl ?? undefined}
            alt={label}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2.5 pt-6 pb-2">
            <span
              className={`text-[11.5px] font-semibold text-white leading-tight ${npClass}`}
            >
              {label}
            </span>
          </div>
        </>
      )}
    </div>
  );
});

export default function Gallery() {
  const { language } = useLanguage();
  const isNp = language === "np";
  const npClass = isNp ? "font-np" : "";
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: fetchGallery,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) return <GallerySkeleton />;

  const items = data?.items ?? [];
  if (items.length === 0) return null;

  const visible = showAll ? items : items.slice(0, INITIAL_LIMIT);
  const hasMore = items.length > INITIAL_LIMIT;

  return (
    <div id="gallery" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            MEDIA GALLERY
          </div>
          <div
            className={`text-[24px] font-extrabold text-[#1B262C] sm:text-[31px] ${npClass}`}
          >
            {isNp ? "मिडिया ग्यालरी" : "Media Gallery"}
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-3.5">
          {visible.map((g) => (
            <GalleryTile
              key={g.id}
              item={g}
              label={isNp ? g.labelNp : g.labelEn}
              npClass={npClass}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-md border border-[#D24B45] text-[#D24B45] text-[13.5px] font-semibold hover:bg-[#D24B45] hover:text-white transition-colors"
            >
              {showAll ? "View Less" : "View More"}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showAll ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
