"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  label: string;
  imageUrl: string | null;
  date: string;
}

async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch("/api/public/news-events");
  if (!res.ok) throw new Error("Failed to fetch news");
  const data = await res.json();
  return data.items;
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="overflow-hidden rounded-md border border-[#e4e7ec] bg-white hover:shadow-[0_16px_34px_-20px_rgba(15,23,42,.4)]">
      <div className="relative flex h-[180px] items-center justify-center bg-[repeating-linear-gradient(45deg,#dfe3e8_0_16px,#e8ebee_16px_32px)]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <span className="font-mono text-[11px] text-[#98a0aa]">[ {item.label} ]</span>
        )}
        {item.date && (
          <span className="font-np absolute left-3.5 top-3.5 rounded-[3px] bg-[#0F4C75] px-2.5 py-[5px] text-[11px] font-bold text-white">
            {item.date}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="font-np text-[17px] font-bold leading-[1.45] text-[#1B262C]">
          {item.title}
        </div>
        <div className="font-np mt-2 line-clamp-3 text-[13.5px] leading-[1.65] text-[#5b6168]">
          {item.excerpt}
        </div>
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-md border border-[#e4e7ec] bg-white">
          <div className="h-[180px] animate-pulse bg-[#e4e7ec]" />
          <div className="space-y-2 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-[#e4e7ec]" />
            <div className="h-3 w-full animate-pulse rounded bg-[#e4e7ec]" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-[#e4e7ec]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewsEvents() {
  const { data, isLoading } = useQuery<NewsItem[]>({
    queryKey: ["public-news-events"],
    queryFn: fetchNews,
    staleTime: 60 * 60 * 1000,
  });

  return (
    <div id="news" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            NEWS &amp; EVENTS
          </div>
          <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">
            समाचार तथा गतिविधि
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        {isLoading ? (
          <NewsSkeleton />
        ) : !data || data.length === 0 ? (
          <div className="font-np rounded-md border border-[#e4e7ec] bg-white py-14 text-center text-[15px] text-[#98a0aa]">
            हाल कुनै समाचार उपलब्ध छैन।
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
