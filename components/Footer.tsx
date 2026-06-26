import {
  hospital,
  footerQuickLinks,
  footerServiceLinks,
  footerContact,
} from "@/data/hospital";

export default function Footer() {
  return (
    <div className="bg-[#1B262C] text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-9 px-5 pb-8 pt-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:px-[30px] lg:pb-[30px] lg:pt-[54px]">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-[46px] w-[46px] rounded-full border-2 border-[#b7902f] bg-[repeating-linear-gradient(45deg,#d3aa55_0_7px,#c79e49_7px_14px)]" />
            <div>
              <div className="font-np text-[17px] font-extrabold">{hospital.nameNp}</div>
              <div className="text-[11px] tracking-[1px] text-white/60">{hospital.nameEn}</div>
            </div>
          </div>
          <p className="font-np mt-4 text-[13px] leading-[1.7] text-white/70">
            मेचीनगर नगरपालिकाद्वारा सञ्चालित झापा जिल्लाको सार्वजनिक स्वास्थ्य संस्था। गुणस्तरीय र सुलभ
            स्वास्थ्य सेवामा प्रतिबद्ध।
          </p>
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
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-2.5 px-5 py-[18px] text-center text-[12.5px] text-white/60 sm:justify-between sm:px-6 sm:text-left lg:px-[30px]">
          <span className="font-np">
            © {hospital.copyrightYear} {hospital.nameNp}। सर्वाधिकार सुरक्षित।
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
