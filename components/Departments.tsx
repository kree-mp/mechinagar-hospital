"use client";

import { useState } from "react";
import { departments } from "@/data/departments";

export default function Departments() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDept = departments[activeIndex];
  const bedsLabel = activeDept.beds > 0 ? `शय्या: ${activeDept.beds}` : "दैनिक सेवा";

  return (
    <div id="departments" className="mx-auto max-w-[1280px] px-[30px] py-[78px]">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
          CLINICAL DEPARTMENTS
        </div>
        <div className="font-np text-[31px] font-extrabold text-[#1B262C]">विभागहरू</div>
        <div className="h-[3px] w-[54px] bg-[#D24B45]" />
      </div>
      <div className="grid grid-cols-[320px_1fr] items-start gap-[26px]">
        <div className="overflow-hidden rounded-md border border-[#e4e7ec]">
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
                className="flex w-full flex-col border-b border-[#eef0f3] border-l-[3px] px-[18px] py-3.5 text-left"
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
        <div className="rounded-md border border-[#e4e7ec] border-t-[3px] border-t-[#3282B8] bg-white px-8 py-[30px]">
          <div className="flex flex-wrap items-start justify-between gap-3.5">
            <div>
              <div className="font-np text-[24px] font-extrabold text-[#3282B8]">
                {activeDept.np}
              </div>
              <div className="mt-0.5 text-[12.5px] font-semibold tracking-[1px] text-[#98a0aa]">
                {activeDept.en}
              </div>
            </div>
            <div className="font-np rounded-[20px] bg-[#E7F1FB] px-3.5 py-2 text-[13px] font-bold text-[#0F4C75]">
              {bedsLabel}
            </div>
          </div>
          <p className="font-np mt-4 text-[14.5px] leading-[1.8] text-[#41474f]">
            {activeDept.desc}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3.5">
            <div className="rounded bg-[#f6f7f9] px-4 py-3.5">
              <div className="text-[11px] font-bold tracking-[.8px] text-[#98a0aa]">
                विभाग प्रमुख · HEAD
              </div>
              <div className="font-np mt-1 text-[15px] font-semibold text-[#1B262C]">
                {activeDept.head}
              </div>
            </div>
            <div className="rounded bg-[#f6f7f9] px-4 py-3.5">
              <div className="text-[11px] font-bold tracking-[.8px] text-[#98a0aa]">
                ओपीडी समय · OPD
              </div>
              <div className="font-np mt-1 text-[15px] font-semibold text-[#1B262C]">
                {activeDept.opd}
              </div>
            </div>
          </div>
          <div className="font-np mb-2.5 mt-[22px] text-[13px] font-bold text-[#1B262C]">
            उपलब्ध सेवाहरू
          </div>
          <div className="flex flex-wrap gap-2">
            {activeDept.services.map((sv) => (
              <span
                key={sv}
                className="font-np rounded-[20px] border border-[#d9dce1] bg-white px-[13px] py-1.5 text-[13px] text-[#41474f]"
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
