import {
  hospital,
  footerQuickLinks,
  footerServiceLinks,
  footerContact,
} from "@/data/hospital";

const socialLinks = [
  { label: "f", href: "#" },
  { label: "X", href: "#" },
  { label: "in", href: "#" },
  { label: "YT", href: "#" },
];

export default function Footer() {
  return (
    <div className="bg-[#1B262C] text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-9 px-[30px] pb-[30px] pt-[54px]">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-[46px] w-[46px] rounded-full border-2 border-[#b7902f] bg-[repeating-linear-gradient(45deg,#d3aa55_0_7px,#c79e49_7px_14px)]" />
            <div>
              <div className="font-np text-[17px] font-extrabold">{hospital.nameNp}</div>
              <div className="text-[11px] tracking-[1px] text-white/60">{hospital.nameEn}</div>
            </div>
          </div>
          <p className="font-np mt-4 text-[13px] leading-[1.7] text-white/70">
            नेपाल सरकारको स्वामित्वमा रहेको झापा जिल्लाको आधारभूत अस्पताल। गुणस्तरीय र सुलभ स्वास्थ्य
            सेवामा प्रतिबद्ध।
          </p>
          <div className="mt-4 flex gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-white/10 text-[13px] font-bold text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-np mb-[14px] text-[15px] font-bold">द्रुत पहुँच</div>
          {footerQuickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-np block py-1.5 text-[13.5px] text-white/72 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div>
          <div className="font-np mb-[14px] text-[15px] font-bold">सेवाहरू</div>
          {footerServiceLinks.map((link, i) => (
            <a
              key={`${link.label}-${i}`}
              href={link.href}
              className="font-np block py-1.5 text-[13.5px] text-white/72 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div>
          <div className="font-np mb-[14px] text-[15px] font-bold">सम्पर्क</div>
          <div
            className="font-np text-[13.5px] leading-[1.8] text-white/72"
            dangerouslySetInnerHTML={{ __html: footerContact.lineNp }}
          />
        </div>
      </div>
      <div className="border-t border-white/[.12]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2.5 px-[30px] py-[18px] text-[12.5px] text-white/60">
          <span className="font-np">
            © {hospital.copyrightYear} {hospital.nameNp}। सर्वाधिकार सुरक्षित।
          </span>
          <span>
            अन्तिम अपडेट: {hospital.bsDate} · कुल भ्रमण: {hospital.totalVisits}
          </span>
        </div>
      </div>
    </div>
  );
}
