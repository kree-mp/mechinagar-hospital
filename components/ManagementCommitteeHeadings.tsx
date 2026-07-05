"use client";

import { useLanguage } from "@/providers/LanguageProvider";

export function ManagementCommitteeTitle() {
  const { language } = useLanguage();
  const isNp = language === "np";
  return (
    <div className={`text-[24px] font-extrabold text-[#1B262C] sm:text-[31px] ${isNp ? "font-np" : ""}`}>
      {isNp ? "अस्पताल व्यवस्थापन" : "Hospital Management"}
    </div>
  );
}

export function ChiefRoleLabel() {
  const { language } = useLanguage();
  const isNp = language === "np";
  return (
    <div className={`text-[12px] font-bold tracking-[.5px] text-[#98a0aa] ${isNp ? "font-np" : ""}`}>
      {isNp ? "स्वास्थ्य शाखा प्रमुख" : "Head of Health Branch"}
    </div>
  );
}

export function CommitteeSectionLabel() {
  const { language } = useLanguage();
  const isNp = language === "np";
  return (
    <div className={`mb-[18px] text-center text-[16px] font-bold text-[#1B262C] sm:text-left ${isNp ? "font-np" : ""}`}>
      {isNp ? "अस्पताल व्यवस्थापन समिति" : "Hospital Management Committee"}
    </div>
  );
}
