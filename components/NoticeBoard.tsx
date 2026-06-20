"use client";

import { useState } from "react";
import { noticeTabLabels, noticesByTab } from "@/data/notices";
import { quickServiceLinks, hospital } from "@/data/hospital";

export default function NoticeBoard() {
  const [activeTab, setActiveTab] = useState(0);
  const notices = noticesByTab[activeTab];

  return (
    <div id="notices" className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-[30px]">
        <div>
          <div className="mb-[22px] flex flex-col gap-2">
            <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
              NOTICE BOARD
            </div>
            <div className="font-np text-[22px] font-extrabold text-[#1B262C] sm:text-[28px]">
              सूचना तथा जानकारी
            </div>
          </div>
          <div className="mb-1.5 flex gap-1 overflow-x-auto border-b-2 border-[#eef0f3]">
            {noticeTabLabels.map((label, i) => {
              const isActive = i === activeTab;
              return (
                <button
                  key={label}
                  onClick={() => setActiveTab(i)}
                  style={{
                    color: isActive ? "#0F4C75" : "#7a818b",
                    borderBottomColor: isActive ? "#0F4C75" : "transparent",
                  }}
                  className="font-np -mb-0.5 flex-none whitespace-nowrap border-b-[3px] px-4 py-[11px] text-[14.5px] font-semibold"
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div>
            {notices.map((n) => (
              <a
                key={n.ref}
                href="#"
                className="flex items-center gap-4 border-b border-[#eef0f3] px-1.5 py-4 text-[#1B262C] hover:bg-[#fafbfc]"
              >
                <div className="w-[58px] flex-none rounded-[5px] bg-[#f0f2f5] py-2 text-center">
                  <div className="text-[19px] font-extrabold leading-none tabular-nums text-[#3282B8]">
                    {n.day}
                  </div>
                  <div className="font-np mt-0.5 text-[11px] text-[#7a818b]">{n.mon}</div>
                </div>
                <div className="flex-1">
                  <div className="font-np text-[14.5px] font-medium leading-[1.5]">{n.title}</div>
                  <div className="mt-[3px] text-[11.5px] text-[#98a0aa]">{n.ref}</div>
                </div>
                {n.isNew && (
                  <span className="flex-none rounded-[3px] bg-[#D24B45] px-2 py-[3px] text-[10px] font-bold tracking-[.5px] text-white">
                    NEW
                  </span>
                )}
                <span className="font-np flex-none text-[12px] font-semibold text-[#D24B45]">
                  डाउनलोड ↓
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[18px]">
          <div className="overflow-hidden rounded-md border border-[#e4e7ec]">
            <div className="font-np bg-[#3282B8] px-[18px] py-[13px] text-[15px] font-bold text-white">
              द्रुत सेवाहरू
            </div>
            <div className="py-1.5">
              {quickServiceLinks.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-np flex items-center justify-between px-[18px] py-3 text-[14px] text-[#1B262C] hover:bg-[#fafbfc] hover:text-[#0F4C75] ${
                    i < quickServiceLinks.length - 1 ? "border-b border-[#f1f3f5]" : ""
                  }`}
                >
                  {link.label} <span className="text-[#98a0aa]">→</span>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-[#F0CCCA] bg-[#FBEAE9] p-[22px]">
            <div className="font-np text-[18px] font-extrabold text-[#B23A35]">
              आकस्मिक हेल्पलाइन
            </div>
            <div className="font-np mt-1 text-[13px] text-[#C0726E]">२४ घण्टा उपलब्ध</div>
            <div className="mt-2.5 text-[30px] font-extrabold tabular-nums text-[#D24B45]">
              {hospital.emergencyFull}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
