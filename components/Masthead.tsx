"use client";

import { useEffect, useState } from "react";
import { hospital } from "@/data/hospital";

export default function Masthead() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
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
    <div className="mx-auto grid max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-[26px] border-b-[3px] border-[#D24B45] px-[30px] py-[18px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#b7902f] bg-[repeating-linear-gradient(45deg,#d3aa55_0_9px,#c79e49_9px_18px)] text-center font-mono text-[8.5px] leading-[1.25] text-[#5b4410]">
        GOVT
        <br />
        EMBLEM
      </div>
      <div className="text-center">
        <div className="font-np text-[32px] font-extrabold leading-[1.1] text-[#0F4C75]">
          {hospital.nameNp}
        </div>
        <div className="mt-[3px] text-[16px] font-bold tracking-[1.5px] text-[#1B262C]">
          {hospital.nameEn}
        </div>
        <div className="font-np mt-[7px] text-[13.5px] text-[#5b6168]">
          {hospital.municipalityNp}
        </div>
        <div className="font-np text-[12px] tracking-[.2px] text-[#7a818b]">
          {hospital.ministryNp}
        </div>
      </div>
      <div className="flex items-center gap-3.5">
        <div className="flex h-[66px] w-[54px] items-end justify-center border border-[#0F4C75] bg-[repeating-linear-gradient(45deg,#D24B45_0_8px,#B23A35_8px_16px)] pb-1 font-mono text-[8px] text-white/85">
          झण्डा
        </div>
        <div className="text-right">
          <div className="font-np text-[12.5px] text-[#5b6168]">{hospital.bsDate}</div>
          <div className="mt-px text-[12.5px] text-[#1B262C]">{adDate}</div>
          <div className="mt-0.5 text-[19px] font-extrabold tracking-[.5px] tabular-nums text-[#3282B8]">
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}
