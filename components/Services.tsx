"use client";

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

const TINTS = ["#E7F1FB", "#EAF4FC"];
const COLORS = ["#0F4C75", "#3282B8"];

export default function Services() {
  const { language } = useLanguage();
  const isNp = language === "np";
  const npClass = isNp ? "font-np" : "";

  const { data, isLoading } = useQuery<ServicesData>({
    queryKey: ["public-services"],
    queryFn: fetchServices,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div id="services" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            WHAT WE OFFER
          </div>
          <div className={`text-[24px] font-extrabold text-[#1B262C] sm:text-[31px] ${npClass}`}>
            {isNp ? "हाम्रा सेवाहरू" : "Our Services"}
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-md bg-[#e4e7ec]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {data?.categories.map((s, i) => (
              <div
                key={s.id}
                className="flex items-start gap-4 rounded-md border border-[#e4e7ec] bg-white p-6 hover:border-[#0F4C75] hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,.35)]"
              >
                <div
                  style={{ background: TINTS[i % 2] }}
                  className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[10px]"
                >
                  <div
                    style={{ background: COLORS[i % 2] }}
                    className="h-4 w-4 rotate-45 rounded"
                  />
                </div>
                <div>
                  <div className={`text-[17px] font-bold text-[#1B262C] ${npClass}`}>
                    {isNp ? s.nameNp : s.nameEn}
                  </div>
                  <div className="mt-px text-[11.5px] font-semibold tracking-[.8px] text-[#98a0aa]">
                    {s.badge}
                  </div>
                  <div className={`mt-2 text-[13.5px] leading-[1.6] text-[#5b6168] ${npClass}`}>
                    {isNp ? s.desc : s.descEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}