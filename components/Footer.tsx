"use client";

import {
  hospital,
  footerQuickLinks,
  footerServiceLinks,
  footerContact,
} from "@/data/hospital";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();
  const isNp = language === "np";
  const npClass = isNp ? "font-np" : "";

  return (
    <div className="bg-[#1B262C] text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-9 px-5 pb-8 pt-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:px-[30px] lg:pb-[30px] lg:pt-[54px]">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-[46px] w-[46px] rounded-full border-2 border-[#b7902f] bg-[repeating-linear-gradient(45deg,#d3aa55_0_7px,#c79e49_7px_14px)]" />
            <div>
              <div className={`text-[17px] font-extrabold ${npClass}`}>{isNp ? hospital.nameNp : hospital.nameEn}</div>
              <div className="text-[11px] tracking-[1px] text-white/60">{isNp ? hospital.nameEn : hospital.nameNp}</div>
            </div>
          </div>
          <p className={`mt-4 text-[13px] leading-[1.7] text-white/70 ${npClass}`}>
            {isNp
              ? "मेचीनगर नगरपालिकाद्वारा सञ्चालित झापा जिल्लाको सार्वजनिक स्वास्थ्य संस्था। गुणस्तरीय र सुलभ स्वास्थ्य सेवामा प्रतिबद्ध।"
              : "A public health institution in Jhapa district operated by Mechinagar Municipality. Committed to quality and accessible healthcare."}
          </p>
        </div>
        <div>
          <div className={`mb-[14px] text-[15px] font-bold ${npClass}`}>{isNp ? "द्रुत पहुँच" : "Quick Links"}</div>
          {footerQuickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`block py-1.5 text-[13.5px] text-white/72 hover:text-white ${npClass}`}
            >
              {isNp ? link.label : link.labelEn}
            </a>
          ))}
        </div>
        <div>
          <div className={`mb-[14px] text-[15px] font-bold ${npClass}`}>{isNp ? "सेवाहरू" : "Services"}</div>
          {footerServiceLinks.map((link, i) => (
            <a
              key={`${link.label}-${i}`}
              href={link.href}
              className={`block py-1.5 text-[13.5px] text-white/72 hover:text-white ${npClass}`}
            >
              {isNp ? link.label : link.labelEn}
            </a>
          ))}
        </div>
        <div>
          <div className={`mb-[14px] text-[15px] font-bold ${npClass}`}>{isNp ? "सम्पर्क" : "Contact"}</div>
          <div
            className={`text-[13.5px] leading-[1.8] text-white/72 ${npClass}`}
            dangerouslySetInnerHTML={{ __html: isNp ? footerContact.lineNp : footerContact.lineEn }}
          />
        </div>
      </div>
      <div className="border-t border-white/[.12]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-2.5 px-5 py-[18px] text-center text-[12.5px] text-white/60 sm:justify-between sm:px-6 sm:text-left lg:px-[30px]">
          <span className={npClass}>
            © {isNp ? hospital.copyrightYear : hospital.copyrightYearEn} {isNp ? hospital.nameNp : hospital.nameEn}
            {isNp ? "। सर्वाधिकार सुरक्षित।" : ". All rights reserved."}
          </span>
          <a
            href="/dev"
            className="text-white/20 hover:text-white/50 text-[11px] transition-colors duration-200"
          >
            Staff Login
          </a>
        </div>
      </div>
    </div>
  );
}
