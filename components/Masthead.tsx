"use client";

import { useEffect, useState } from "react";
import { hospital } from "@/data/hospital";

export default function Masthead() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    queueMicrotask(tick);
    return () => clearInterval(id);
  }, []);

  const time = now?.toLocaleTimeString("en-GB") ?? "--:--:--";
  const adDate =
    now?.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }) ?? "";

  return (
    <div className="mx-auto grid max-w-[1280px] grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 border-b-[3px] border-[#D24B45] px-3 py-2 sm:gap-x-4 sm:gap-y-3 sm:px-6 sm:py-4 lg:grid-cols-[auto_1fr_auto] lg:gap-[26px] lg:px-[30px] lg:py-[18px]">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#b7902f] bg-[repeating-linear-gradient(45deg,#d3aa55_0_9px,#c79e49_9px_18px)] text-center font-mono text-[5.5px] leading-[1.25] text-[#5b4410] sm:h-16 sm:w-16 sm:text-[7.5px] lg:h-20 lg:w-20 lg:text-[8.5px]">
        GOVT
        <br />
        EMBLEM
      </div>
      <div className="text-left lg:text-center">
        <div className="font-np text-[14.5px] font-extrabold leading-[1.1] text-[#0F4C75] sm:text-[24px] lg:text-[32px]">
          {hospital.nameNp}
        </div>
        <div className="mt-[2px] text-[10px] font-bold tracking-[.5px] text-[#1B262C] sm:mt-[3px] sm:text-[14px] lg:text-[16px] lg:tracking-[1.5px]">
          {hospital.nameEn}
        </div>
        <div className="font-np mt-[7px] hidden text-[13.5px] text-[#5b6168] sm:block">
          {hospital.municipalityNp}
        </div>
        <div className="font-np hidden text-[12px] tracking-[.2px] text-[#7a818b] sm:block">
          {hospital.ministryNp}
        </div>
      </div>
      <div className="col-span-2 flex items-center gap-3.5 lg:col-span-1">
        <div className="hidden h-[50px] w-[42px] items-end justify-center border border-[#0F4C75] bg-[repeating-linear-gradient(45deg,#D24B45_0_8px,#B23A35_8px_16px)] pb-1 font-mono text-[7px] text-white/85 sm:flex lg:h-[66px] lg:w-[54px] lg:text-[8px]">
          झण्डा
        </div>
        <div className="text-left">
          <div className="mt-px text-[10.5px] text-[#1B262C] sm:text-[12.5px]">{adDate}</div>
          <div className="mt-0.5 text-[13px] font-extrabold tracking-[.5px] tabular-nums text-[#3282B8] sm:text-[19px]">
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}
