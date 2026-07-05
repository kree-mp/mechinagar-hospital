"use client";

import { hospital } from "@/data/hospital";
import { useLanguage } from "@/providers/LanguageProvider";

export default function TopBar() {
  const { language, toggleLanguage } = useLanguage();
  const isNp = language === "np";

  return (
    <div className="flex h-auto min-h-10 flex-wrap items-center justify-between gap-y-1.5 bg-[#1B262C] px-4 py-1.5 text-[12.5px] text-white sm:px-6 lg:h-10 lg:flex-nowrap lg:py-0 lg:px-[30px]">

      {/* Contact & Emergency Info */}
      <div className="flex items-center gap-[18px]">
        <span>
          <span className={`opacity-60 ${isNp ? "font-np" : ""}`}>{isNp ? "फोन:" : "Phone:"}</span>{" "}
          {isNp ? hospital.phone : hospital.phoneEn}
        </span>
        <span className="hidden h-3.5 w-px bg-white/25 sm:block" />
        <span className="hidden sm:inline">
          <span className={`opacity-60 ${isNp ? "font-np" : ""}`}>{isNp ? "इमेल:" : "Email:"}</span> {hospital.email}
        </span>
        <span className="hidden h-3.5 w-px bg-white/25 sm:block" />
        <span className={`rounded-[3px] bg-[#D24B45] px-2.5 py-1 font-semibold ${isNp ? "font-np" : ""}`}>
          {isNp ? "आकस्मिक" : "Emergency"}: {isNp ? hospital.emergencyShort : hospital.emergencyShortEn}
        </span>
      </div>

      {/* Social Links & Language Switcher */}
      <div className="flex items-center gap-4">

        {/* Facebook Link */}
        <a
          href="https://www.facebook.com/share/18NwSkNA85/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-white/80 hover:text-white transition-colors"
          aria-label="Facebook Page"
        >
          {/* Increased size here to h-5 and w-5 */}
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
        </a>

        {/* Separator between Facebook and Language */}
        <span className="h-3.5 w-px bg-white/25" />

        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label="Toggle site language"
          className="flex items-center gap-1"
        >
          <span className={`font-np font-semibold ${isNp ? "" : "opacity-45"}`}>नेपाली</span>
          <span className={isNp ? "opacity-45" : "font-semibold"}>/ EN</span>
        </button>

      </div>
    </div>
  );
}
