"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/providers/LanguageProvider";

interface Offer {
  id: string;
  titleNp: string;
  titleEn: string;
  order: number;
}

interface ServiceCategory {
  id: string;
  nameNp: string;
  nameEn: string;
  badge: string;
  availability: string | null;
  availabilityEn: string | null;
  desc: string | null;
  descEn: string | null;
  inDepartments: boolean;
  order: number;
  services: Offer[];
}

interface ServicesData {
  categories: ServiceCategory[];
}

async function fetchServices(): Promise<ServicesData> {
  const res = await fetch("/api/public/services", { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export default function Departments() {
  const { language } = useLanguage();
  const isNp = language === "np";
  const npClass = isNp ? "font-np" : "";
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading } = useQuery<ServicesData>({
    queryKey: ["public-services"],
    queryFn: fetchServices,
    staleTime: 30 * 60 * 1000,
  });

  const departments = (data?.categories ?? []).filter((c) => c.inDepartments);
  const activeDept = departments[Math.min(activeIndex, Math.max(departments.length - 1, 0))];

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="h-3 w-48 animate-pulse rounded bg-[#e4e7ec]" />
          <div className="h-7 w-64 animate-pulse rounded bg-[#e4e7ec]" />
        </div>
        <div className="grid grid-cols-1 items-start gap-[26px] lg:grid-cols-[320px_1fr]">
          <div className="h-64 animate-pulse rounded-md bg-[#e4e7ec]" />
          <div className="h-80 animate-pulse rounded-md bg-[#e4e7ec]" />
        </div>
      </div>
    );
  }

  return (
    <div id="departments" className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
          AVAILABLE HEALTH SERVICES
        </div>
        <div className={`text-[24px] font-extrabold text-[#1B262C] sm:text-[31px] ${npClass}`}>
          {isNp ? "उपलब्ध स्वास्थ्य सेवाहरू" : "Available Health Services"}
        </div>
        <div className="h-[3px] w-[54px] bg-[#D24B45]" />
      </div>
      {departments.length === 0 ? (
        <div className={`rounded-md border border-[#e4e7ec] bg-white px-6 py-12 text-center text-[14px] text-[#98a0aa] ${npClass}`}>
          हाल उपलब्ध सेवाहरू छैनन्।
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-[26px] lg:grid-cols-[320px_1fr]">
          <div className="overflow-x-auto rounded-md border border-[#e4e7ec] lg:overflow-hidden">
            <div className="flex lg:block">
              {departments.map((d, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveIndex(i)}
                    style={{
                      background: isActive ? "#EAF4FC" : "#fff",
                      borderLeftColor: isActive ? "#0F4C75" : "transparent",
                    }}
                    className="flex w-[170px] flex-none flex-col border-b border-r border-[#eef0f3] border-l-[3px] px-[18px] py-3.5 text-left lg:w-full lg:border-r-0"
                  >
                    <span
                      style={{ color: isActive ? "#0F4C75" : "#1B262C" }}
                      className="font-np text-[15px] font-semibold"
                    >
                      {d.nameNp}
                    </span>
                    <span className="font-en mt-px text-[11px] text-[#98a0aa]">{d.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-md border border-[#e4e7ec] border-t-[3px] border-t-[#3282B8] bg-white px-5 py-6 sm:px-8 sm:py-[30px]">
            <div className="flex flex-wrap items-start justify-between gap-3.5">
              <div>
                <div className="font-np text-[20px] font-extrabold text-[#3282B8] sm:text-[24px]">
                  {activeDept.nameNp}
                </div>
                <div className="mt-0.5 text-[12.5px] font-semibold tracking-[1px] text-[#98a0aa]">
                  {activeDept.nameEn}
                </div>
              </div>
              {activeDept.availability && (
                <div className={`rounded-[20px] bg-[#E7F1FB] px-3.5 py-2 text-[13px] font-bold text-[#0F4C75] ${npClass}`}>
                  {isNp ? activeDept.availability : activeDept.availabilityEn}
                </div>
              )}
            </div>
            <p className={`mt-4 text-[14.5px] leading-[1.8] text-[#41474f] ${npClass}`}>
              {isNp ? activeDept.desc : activeDept.descEn}
            </p>
            {activeDept.services.length > 0 && (
              <>
                <div className={`mb-2.5 mt-[22px] text-[13px] font-bold text-[#1B262C] ${npClass}`}>
                  {isNp ? "उपलब्ध सेवाहरू" : "Available Services"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeDept.services.map((sv) => (
                    <span
                      key={sv.id}
                      className={`rounded-[20px] border border-[#d9dce1] bg-white px-[13px] py-1.5 text-[13px] text-[#41474f] ${npClass}`}
                    >
                      {isNp ? sv.titleNp : sv.titleEn}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}