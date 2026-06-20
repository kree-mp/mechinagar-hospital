import { hospital } from "@/data/hospital";

const socialLinks = [
  { label: "f", href: "#" },
  { label: "X", href: "#" },
  { label: "in", href: "#" },
  { label: "YT", href: "#" },
];

export default function TopBar() {
  return (
    <div className="flex h-auto min-h-10 flex-wrap items-center justify-between gap-y-1.5 bg-[#1B262C] px-4 py-1.5 text-[12.5px] text-white sm:px-6 lg:h-10 lg:flex-nowrap lg:py-0 lg:px-[30px]">
      <div className="flex items-center gap-[18px]">
        <span>
          <span className="font-np opacity-60">फोन:</span> {hospital.phone}
        </span>
        <span className="hidden h-3.5 w-px bg-white/25 sm:block" />
        <span className="hidden sm:inline">
          <span className="font-np opacity-60">इमेल:</span> {hospital.email}
        </span>
        <span className="hidden h-3.5 w-px bg-white/25 sm:block" />
        <span className="font-np rounded-[3px] bg-[#D24B45] px-2.5 py-1 font-semibold">
          आकस्मिक: {hospital.emergencyShort}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-np hidden opacity-65 md:inline">सामाजिक सञ्जाल</span>
        <div className="hidden gap-1.5 md:flex">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="flex h-[23px] w-[23px] items-center justify-center rounded-[3px] bg-white/[.14] text-[12px] font-bold text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
        <span className="hidden h-3.5 w-px bg-white/25 md:block" />
        <span className="font-np font-semibold">नेपाली</span>
        <span className="opacity-45">/ EN</span>
      </div>
    </div>
  );
}
