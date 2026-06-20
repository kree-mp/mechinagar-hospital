"use client";

import { useState } from "react";
import { doctors, doctorFilterChips } from "@/data/doctors";

export default function Doctors() {
  const [filter, setFilter] = useState<"all" | number>("all");
  const filtered = filter === "all" ? doctors : doctors.filter((d) => d.deptId === filter);

  return (
    <div id="doctors" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-[30px] flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            FIND A DOCTOR &amp; OPD
          </div>
          <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">
            हाम्रा चिकित्सकहरू
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        <div className="mb-[30px] flex flex-wrap justify-center gap-2">
          {doctorFilterChips.map((chip) => {
            const isActive = filter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                style={{
                  background: isActive ? "#0F4C75" : "#fff",
                  color: isActive ? "#fff" : "#41474f",
                  borderColor: isActive ? "#0F4C75" : "#d9dce1",
                }}
                className="font-np rounded-[20px] border px-4 py-2 text-[13.5px] font-semibold"
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((d) => (
            <div
              key={d.name}
              className="overflow-hidden rounded-md border border-[#e4e7ec] bg-white hover:shadow-[0_14px_30px_-18px_rgba(15,23,42,.4)]"
            >
              <div className="flex h-[150px] items-center justify-center bg-[repeating-linear-gradient(45deg,#dfe3e8_0_14px,#e8ebee_14px_28px)]">
                <span className="font-mono text-[10px] text-[#98a0aa]">[ PHOTO ]</span>
              </div>
              <div className="px-[18px] py-4">
                <div className="font-np text-[16px] font-bold text-[#1B262C]">{d.name}</div>
                <div className="text-[12px] font-semibold tracking-[.3px] text-[#98a0aa]">
                  {d.qual}
                </div>
                <div className="font-np mt-2 text-[13px] font-semibold text-[#D24B45]">
                  {d.dept}
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 border-t border-[#eef0f3] pt-2.5">
                  <span className="font-np text-[12px] text-[#5b6168]">ओपीडी:</span>
                  <span className="font-np text-[12px] font-semibold text-[#1B262C]">{d.opd}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
