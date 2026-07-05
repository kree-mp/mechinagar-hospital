"use client";

import { quickAccessCards } from "@/data/hospital";
import { useLanguage } from "@/providers/LanguageProvider";

export default function QuickAccess() {
  const { language } = useLanguage();
  const isNp = language === "np";

  return (
    <div className="relative z-[5] mx-auto -mt-8 grid max-w-[1280px] grid-cols-2 gap-3 px-5 sm:-mt-12 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-[30px]">
      {quickAccessCards.map((card) => (
        <a
          key={card.titleNp}
          href={card.href}
          style={{ borderTopColor: card.barColor }}
          className="rounded-[4px] border border-[#e4e7ec] border-t-[3px] bg-white p-4 text-[#1B262C] shadow-[0_14px_32px_-18px_rgba(15,23,42,.4)] transition-transform sm:p-5 hover:-translate-y-[3px]"
        >
          <div className={`text-[16.5px] font-bold ${isNp ? "font-np" : ""}`}>
            {isNp ? card.titleNp : card.titleEn}
          </div>
          <div className="mt-[3px] text-[13px] text-[#7a818b]">{isNp ? card.sub : card.subEn}</div>
        </a>
      ))}
    </div>
  );
}
