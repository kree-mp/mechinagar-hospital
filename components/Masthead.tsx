"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

      <div className="flex h-14 w-14 items-center justify-center sm:h-24 sm:w-24 lg:h-28 lg:w-28">
        <Image
          width={500}
          height={500}
          src={"/img/header/mechinagar-hospital-logo.png"}
          alt="Mechinagar Hospital Logo"
          className="h-full w-full object-contain" 
          draggable={false}
        />
      </div>

      {/* Hospital Details */}
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

      {/* Flag and Time/Date Section */}
      <div className="col-span-2 flex items-center gap-3.5 lg:col-span-1">
        {/* Flag Area */}
        <div className="hidden items-center justify-center sm:flex max-w-[42px] lg:max-w-[54px]">
          <Image
            width={500}
            height={500}
            src={"/img/header/nepal-flag.gif"}
            alt="nepal flag"
            unoptimized
            draggable={false}
            className="w-full h-auto object-contain scale-150"
          />
        </div>

        {/* Date & Time Display */}
        <div className="text-left">
          <div className="mt-px text-[10.5px] text-[#1B262C] sm:text-[12.5px]">
            {adDate}
          </div>
          <div className="mt-0.5 text-[13px] font-extrabold tracking-[.5px] tabular-nums text-[#3282B8] sm:text-[19px]">
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}
