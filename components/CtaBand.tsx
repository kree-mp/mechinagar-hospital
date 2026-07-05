"use client";

import { hospital } from "@/data/hospital";
import { useLanguage } from "@/providers/LanguageProvider";

export default function CtaBand() {
  const { language } = useLanguage();
  const isNp = language === "np";
  const npClass = isNp ? "font-np" : "";

  return (
    <div className="bg-[#D24B45]">
      <div className="mx-auto flex max-w-[1280px] flex-col flex-wrap items-center justify-between gap-6 px-5 py-8 text-center sm:px-6 lg:flex-row lg:px-[30px] lg:py-10 lg:text-left">
        <div>
          <div className={`text-[19px] font-extrabold text-white sm:text-[24px] ${npClass}`}>
            {isNp ? "आकस्मिक अवस्थामा हामीलाई सम्पर्क गर्नुहोस्" : "Contact us in case of an emergency"}
          </div>
          <div className="mt-1 text-[13px] text-white/85 sm:text-[14px]">
            24/7 emergency &amp; ambulance services available across Jhapa.
          </div>
        </div>
        <div className="flex flex-col items-center gap-3.5 sm:flex-row lg:items-center">
          <div className="text-center lg:text-right">
            <div className={`text-[12px] text-white/80 ${npClass}`}>{isNp ? "हेल्पलाइन" : "Helpline"}</div>
            <div className="text-[24px] font-extrabold tabular-nums text-white sm:text-[28px]">
              {isNp ? hospital.emergencyFull : hospital.emergencyFullEn}
            </div>
          </div>
          <a
            href="#contact"
            className={`rounded bg-white px-7 py-3.5 text-[15px] font-bold text-[#D24B45] ${npClass}`}
          >
            {isNp ? "सम्पर्क विवरण" : "Contact Details"}
          </a>
        </div>
      </div>
    </div>
  );
}
