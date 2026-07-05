"use client";

import { aboutCopy, aboutGoals, aboutObjectives } from "@/data/hospital";
import { useLanguage } from "@/providers/LanguageProvider";
import Image from "next/image";

export default function About() {
  const { language } = useLanguage();
  const isNp = language === "np";
  const npClass = isNp ? "font-np" : "";

  return (
    <div
      id="about"
      className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-[54px]">
        <div>
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            ABOUT THE HOSPITAL
          </div>
          <div className={`mt-2 text-[24px] font-extrabold text-[#1B262C] sm:text-[31px] ${npClass}`}>
            {isNp ? "हाम्रो बारेमा" : "About Us"}
          </div>
          <div className="mt-3 h-[3px] w-[54px] bg-[#D24B45]" />
          <p className={`mt-[22px] text-[15px] leading-[1.8] text-[#41474f] sm:text-[15.5px] ${npClass}`}>
            {isNp ? aboutCopy.bodyNp : aboutCopy.bodyEn}
          </p>
          <div className="mt-[26px] grid grid-cols-1 gap-4 sm:grid-cols-2">
            {aboutGoals.map((goal) => (
              <div
                key={goal.titleNp}
                style={{ borderLeftColor: goal.color }}
                className="rounded-[4px] border border-[#e4e7ec] border-l-[3px] p-4 px-[18px]"
              >
                <div
                  style={{ color: goal.color }}
                  className={`text-[16px] font-bold ${npClass}`}
                >
                  {isNp ? goal.titleNp : goal.titleEn}
                </div>
                <div className={`mt-[5px] text-[13.5px] leading-[1.6] text-[#5b6168] ${npClass}`}>
                  {isNp ? goal.descNp : goal.descEn}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[22px] rounded-[4px] border border-[#e4e7ec] bg-[#f6f7f9] p-4 px-[18px]">
            <div className={`text-[14.5px] font-bold text-[#1B262C] ${npClass}`}>
              {isNp ? "उद्देश्यहरू" : "Objectives"}
            </div>
            <ul className="mt-2.5 space-y-2">
              {aboutObjectives.map((point) => (
                <li key={point.np} className="flex items-start gap-2.5">
                  <span className="font-extrabold text-[#D24B45]">›</span>
                  <span className={`text-[13.5px] leading-[1.55] text-[#41474f] ${npClass}`}>
                    {isNp ? point.np : point.en}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative mt-2 lg:mt-0">
          <div className="flex h-[220px] items-center justify-center rounded-md border border-[#d9dce1] bg-[repeating-linear-gradient(45deg,#dfe3e8_0_16px,#e8ebee_16px_32px)] sm:h-[300px] lg:h-[380px]">
            <span className="font-mono text-[12px] tracking-wide text-[#98a0aa]">
              <Image
                height={1000}
                width={1000}
                alt="Mechinagar hospital building"
                src="/img/hero/mechinagar-hospital-hero1.jpg"
                className="object-cover"
              />
            </span>
          </div>
          <div className="absolute -bottom-[14px] -left-[14px] rounded-md bg-[#3282B8] px-4 py-3 text-white shadow-[0_14px_30px_-14px_rgba(0,56,147,.6)] sm:-bottom-[18px] sm:-left-[18px] sm:px-6 sm:py-[18px]">
            <div className="text-[22px] font-extrabold tabular-nums sm:text-[30px]">
              {isNp ? aboutCopy.bedsBadge : aboutCopy.bedsBadgeEn}
            </div>
            <div className={`text-[11px] opacity-85 sm:text-[12.5px] ${npClass}`}>
              {isNp ? aboutCopy.bedsBadgeLabelNp : aboutCopy.bedsBadgeLabelEn}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
