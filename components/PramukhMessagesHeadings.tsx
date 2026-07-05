"use client";

import { useLanguage } from "@/providers/LanguageProvider";
import type { PramukhRole } from "@/lib/db/models";

export function PramukhMessagesTitle() {
  const { language } = useLanguage();
  const isNp = language === "np";
  return (
    <div className={`text-[24px] font-extrabold text-[#1B262C] sm:text-[31px] ${isNp ? "font-np" : ""}`}>
      {isNp ? "प्रमुखहरूको सन्देश" : "Messages from Leadership"}
    </div>
  );
}

const ROLE_LABEL_EN: Record<PramukhRole, string> = {
  nagar_pramukh: "Message from the Nagar Pramukh",
  hospital_pramukh: "Message from the Hospital Pramukh",
};

export function PramukhRoleLabel({ role }: { role: PramukhRole }) {
  const { language } = useLanguage();
  const isNp = language === "np";
  return (
    <div className={`text-[12px] font-bold tracking-[1.5px] text-[#D24B45] ${isNp ? "font-np" : ""}`}>
      {isNp
        ? role === "nagar_pramukh"
          ? "नगर प्रमुखको सन्देश"
          : "अस्पताल प्रमुखको सन्देश"
        : ROLE_LABEL_EN[role]}
    </div>
  );
}
