"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

interface StaffCategory {
  slug: string;
  labelNp: string;
  labelEn: string;
  order: number;
}

interface StaffMember {
  id: string;
  nameNp: string;
  post: string;
  photoUrl: string | null;
  categorySlug: string;
}

interface StaffData {
  categories: StaffCategory[];
  staff: StaffMember[];
}

async function fetchStaff(): Promise<StaffData> {
  const res = await fetch("/api/public/staff");
  if (!res.ok) throw new Error("Failed to fetch staff");
  return res.json();
}

function DoctorsSkeleton() {
  return (
    <div className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-[30px] flex flex-col items-center gap-2">
          <div className="h-3 w-24 animate-pulse rounded bg-[#e4e7ec]" />
          <div className="h-7 w-64 animate-pulse rounded bg-[#e4e7ec]" />
          <div className="h-[3px] w-[54px] bg-[#e4e7ec]" />
        </div>
        <div className="mb-[30px] flex flex-wrap justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-20 animate-pulse rounded-[20px] bg-[#e4e7ec]" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3.5 rounded-md border border-[#e4e7ec] bg-white px-4 py-3.5">
              <div className="h-11 w-11 flex-none animate-pulse rounded-full bg-[#e4e7ec]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#e4e7ec]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#e4e7ec]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Doctors() {
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading } = useQuery<StaffData>({
    queryKey: ["public-staff"],
    queryFn: fetchStaff,
    staleTime: 60 * 60 * 1000,
    select: (d) => d,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return filter === "all"
      ? data.staff
      : data.staff.filter((s) => s.categorySlug === filter);
  }, [data, filter]);

  if (isLoading || !data) return <DoctorsSkeleton />;

  const chips = [
    { id: "all", label: "सबै" },
    ...data.categories.map((c) => ({ id: c.slug, label: c.labelNp })),
  ];

  return (
    <div id="staff" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-[30px] flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            OUR TEAM
          </div>
          <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">
            चिकित्सक तथा कर्मचारी विवरण
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        <div className="mb-[30px] flex flex-wrap justify-center gap-2">
          {chips.map((chip) => {
            const isActive = filter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                style={{
                  background: isActive ? "#0F4C75" : "#fff",
                  color: isActive ? "#fff" : "#41474f",
                  borderColor: isActive ? "#0F4C75" : "#d9dce1",
                }}
                className="font-np rounded-[20px] border px-4 py-2 text-[13.5px] font-semibold"
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3.5 rounded-md border border-[#e4e7ec] bg-white px-4 py-3.5 hover:border-[#0F4C75] hover:shadow-[0_14px_30px_-18px_rgba(15,23,42,.4)]"
            >
              {s.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.photoUrl}
                  alt={s.nameNp}
                  className="h-11 w-11 flex-none rounded-md object-contain bg-[#f0f2f5]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[repeating-linear-gradient(45deg,#dfe3e8_0_8px,#e8ebee_8px_16px)]">
                  <span className="font-np text-[14px] font-bold text-[#5b6168]">
                    {s.nameNp.replace("डा.", "").trim().charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <div className="font-np text-[14.5px] font-bold leading-[1.3] text-[#1B262C]">
                  {s.nameNp}
                </div>
                <div className="font-np mt-0.5 text-[12.5px] font-semibold text-[#D24B45]">
                  {s.post}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
