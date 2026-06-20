"use client";

import { useState } from "react";
import { navItems } from "@/data/hospital";
import { departments } from "@/data/departments";

export default function Navbar() {
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);

  const [home, about, services] = navItems;
  const rest = navItems.slice(3);

  return (
    <div className="sticky top-0 z-50">
      <div className="border-t-[3px] border-[#D24B45] bg-[#0F4C75] shadow-[0_2px_10px_rgba(0,0,0,.12)]">
        <div className="mx-auto flex max-w-[1280px] items-center px-4">
          <a
            href={home.href}
            className="font-np bg-black/[.16] px-[15px] py-[15px] text-[14.5px] font-semibold text-white"
          >
            {home.label}
          </a>
          <a
            href={about.href}
            className="font-np px-[15px] py-[15px] text-[14.5px] font-medium text-[#BBE1FA] hover:bg-black/[.12] hover:text-white"
          >
            {about.label}
          </a>
          <a
            href={services.href}
            className="font-np px-[15px] py-[15px] text-[14.5px] font-medium text-[#BBE1FA] hover:bg-black/[.12] hover:text-white"
          >
            {services.label}
          </a>

          <div className="relative">
            <button
              onClick={() => setDeptMenuOpen((v) => !v)}
              className="font-np flex items-center gap-1.5 px-[15px] py-[15px] text-[14.5px] font-medium text-[#BBE1FA] hover:text-white"
            >
              विभागहरू <span className="text-[9px] opacity-80">▼</span>
            </button>
            {deptMenuOpen && (
              <div className="absolute left-0 top-full z-[60] grid w-[480px] grid-cols-2 gap-1 rounded-b-md border-t-[3px] border-[#3282B8] bg-white p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,.35)]">
                {departments.map((d) => (
                  <a
                    key={d.np}
                    href="#departments"
                    onClick={() => setDeptMenuOpen(false)}
                    className="font-np flex flex-col rounded px-3 py-2.5 text-[#1B262C] hover:bg-[#EAF4FC]"
                  >
                    <span className="text-[14px] font-semibold">{d.np}</span>
                    <span className="font-en text-[11px] text-[#7a818b]">{d.en}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {rest.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-np px-[15px] py-[15px] text-[14.5px] font-medium text-[#BBE1FA] hover:bg-black/[.12] hover:text-white"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            className="font-np ml-auto rounded-[3px] bg-[#D24B45] px-[18px] py-[9px] text-[13.5px] font-bold text-white"
          >
            अनलाइन अपोइन्टमेन्ट
          </a>
        </div>
      </div>
      {deptMenuOpen && (
        <div
          onClick={() => setDeptMenuOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
}
