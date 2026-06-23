"use client";

import { useState } from "react";
import { staff, staffFilterChips, type StaffCategory } from "@/data/staff";

export default function Doctors() {
  const [filter, setFilter] = useState<"all" | StaffCategory>("all");
  const filtered = filter === "all" ? staff : staff.filter((s) => s.category === filter);

  return (
    <div id="staff" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-[30px] flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            OUR TEAM
          </div>
          <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">
            चिकित्सक तथा कर्मचारी विवरण
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        <div className="mb-[30px] flex flex-wrap justify-center gap-2">
          {staffFilterChips.map((chip) => {
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
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3.5 rounded-md border border-[#e4e7ec] bg-white px-4 py-3.5 hover:border-[#0F4C75] hover:shadow-[0_14px_30px_-18px_rgba(15,23,42,.4)]"
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[repeating-linear-gradient(45deg,#dfe3e8_0_8px,#e8ebee_8px_16px)]">
                <span className="font-np text-[14px] font-bold text-[#5b6168]">
                  {s.name.replace("डा.", "").trim().charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-np text-[14.5px] font-bold leading-[1.3] text-[#1B262C]">
                  {s.name}
                </div>
                <div className="font-np mt-0.5 text-[12.5px] font-semibold text-[#D24B45]">
                  {s.post}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
