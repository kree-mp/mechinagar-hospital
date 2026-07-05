"use client";

import { useState } from "react";
import { departments } from "@/data/departments";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Departments() {
  const { language } = useLanguage();
  const isNp = language === "np";
  const npClass = isNp ? "font-np" : "";
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDept = departments[activeIndex];

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
      <div className="grid grid-cols-1 items-start gap-[26px] lg:grid-cols-[320px_1fr]">
        <div className="overflow-x-auto rounded-md border border-[#e4e7ec] lg:overflow-hidden">
          <div className="flex lg:block">
            {departments.map((d, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={d.np}
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
                    {d.np}
                  </span>
                  <span className="font-en mt-px text-[11px] text-[#98a0aa]">{d.en}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-md border border-[#e4e7ec] border-t-[3px] border-t-[#3282B8] bg-white px-5 py-6 sm:px-8 sm:py-[30px]">
          <div className="flex flex-wrap items-start justify-between gap-3.5">
            <div>
              <div className="font-np text-[20px] font-extrabold text-[#3282B8] sm:text-[24px]">
                {activeDept.np}
              </div>
              <div className="mt-0.5 text-[12.5px] font-semibold tracking-[1px] text-[#98a0aa]">
                {activeDept.en}
              </div>
            </div>
            <div className={`rounded-[20px] bg-[#E7F1FB] px-3.5 py-2 text-[13px] font-bold text-[#0F4C75] ${npClass}`}>
              {isNp ? activeDept.availability : activeDept.availabilityEn}
            </div>
          </div>
          <p className={`mt-4 text-[14.5px] leading-[1.8] text-[#41474f] ${npClass}`}>
            {isNp ? activeDept.desc : activeDept.descEn}
          </p>
          <div className={`mb-2.5 mt-[22px] text-[13px] font-bold text-[#1B262C] ${npClass}`}>
            {isNp ? "उपलब्ध सेवाहरू" : "Available Services"}
          </div>
          <div className="flex flex-wrap gap-2">
            {(isNp ? activeDept.subServices : activeDept.subServicesEn).map((sv) => (
              <span
                key={sv}
                className={`rounded-[20px] border border-[#d9dce1] bg-white px-[13px] py-1.5 text-[13px] text-[#41474f] ${npClass}`}
              >
                {sv}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
