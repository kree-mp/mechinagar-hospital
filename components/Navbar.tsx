"use client";

import { useState } from "react";
import { navItems } from "@/data/hospital";
import { departments } from "@/data/departments";

export default function Navbar() {
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false);

  const [home, about, services] = navItems;
  const rest = navItems.slice(3);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileDeptOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="border-t-[3px] border-[#D24B45] bg-[#0F4C75] shadow-[0_2px_10px_rgba(0,0,0,.12)]">
        <div className="mx-auto flex max-w-[1280px] items-center px-4">
          <a
            href={home.href}
            className="font-np hidden bg-black/[.16] px-[15px] py-[15px] text-[14.5px] font-semibold text-white lg:block"
          >
            {home.label}
          </a>
          <a
            href={about.href}
            className="font-np hidden px-[15px] py-[15px] text-[14.5px] font-medium text-[#BBE1FA] hover:bg-black/[.12] hover:text-white lg:block"
          >
            {about.label}
          </a>
          <a
            href={services.href}
            className="font-np hidden px-[15px] py-[15px] text-[14.5px] font-medium text-[#BBE1FA] hover:bg-black/[.12] hover:text-white lg:block"
          >
            {services.label}
          </a>

          <div className="relative hidden lg:block">
            <button
              onClick={() => setDeptMenuOpen((v) => !v)}
              className="font-np flex items-center gap-1.5 px-[15px] py-[15px] text-[14.5px] font-medium text-[#BBE1FA] hover:text-white"
            >
              सेवा विवरण <span className="text-[9px] opacity-80">▼</span>
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
              className="font-np hidden px-[15px] py-[15px] text-[14.5px] font-medium text-[#BBE1FA] hover:bg-black/[.12] hover:text-white lg:block"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            className="font-np ml-auto hidden rounded-[3px] bg-[#D24B45] px-[18px] py-[9px] text-[13.5px] font-bold text-white lg:block"
          >
            अनलाइन अपोइन्टमेन्ट
          </a>

          <a
            href={home.href}
            className="font-np py-[15px] text-[14.5px] font-semibold text-white lg:hidden"
          >
            {home.label}
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="ml-auto flex h-10 w-10 flex-none items-center justify-center text-white lg:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[2px] w-5 bg-current transition-transform ${mobileOpen ? "top-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[2px] w-5 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[2px] w-5 bg-current transition-transform ${mobileOpen ? "top-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-50px)] overflow-y-auto border-t border-white/10 bg-[#0F4C75] lg:hidden">
          <a
            href={about.href}
            onClick={closeMobile}
            className="font-np block border-b border-white/10 px-5 py-3.5 text-[14.5px] font-medium text-[#BBE1FA]"
          >
            {about.label}
          </a>
          <a
            href={services.href}
            onClick={closeMobile}
            className="font-np block border-b border-white/10 px-5 py-3.5 text-[14.5px] font-medium text-[#BBE1FA]"
          >
            {services.label}
          </a>

          <button
            onClick={() => setMobileDeptOpen((v) => !v)}
            className="font-np flex w-full items-center justify-between border-b border-white/10 px-5 py-3.5 text-[14.5px] font-medium text-[#BBE1FA]"
          >
            सेवा विवरण <span className="text-[9px] opacity-80">{mobileDeptOpen ? "▲" : "▼"}</span>
          </button>
          {mobileDeptOpen && (
            <div className="bg-black/[.15] px-5 py-2">
              {departments.map((d) => (
                <a
                  key={d.np}
                  href="#departments"
                  onClick={closeMobile}
                  className="font-np block py-2 text-[13.5px] text-[#BBE1FA]"
                >
                  {d.np} <span className="font-en text-[11px] opacity-60">· {d.en}</span>
                </a>
              ))}
            </div>
          )}

          {rest.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className="font-np block border-b border-white/10 px-5 py-3.5 text-[14.5px] font-medium text-[#BBE1FA]"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={closeMobile}
            className="font-np m-4 block rounded-[3px] bg-[#D24B45] px-[18px] py-3 text-center text-[13.5px] font-bold text-white"
          >
            अनलाइन अपोइन्टमेन्ट
          </a>
        </div>
      )}

      {deptMenuOpen && (
        <div
          onClick={() => setDeptMenuOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
}
