import { hospital } from "@/data/hospital";

const socialLinks = [
  { label: "f", href: "#" },
  { label: "X", href: "#" },
  { label: "in", href: "#" },
  { label: "YT", href: "#" },
];

export default function TopBar() {
  return (
    <div className="flex h-10 items-center justify-between bg-[#1B262C] px-[30px] text-[12.5px] text-white">
      <div className="flex items-center gap-[18px]">
        <span>
          <span className="font-np opacity-60">फोन:</span> {hospital.phone}
        </span>
        <span className="h-3.5 w-px bg-white/25" />
        <span>
          <span className="font-np opacity-60">इमेल:</span> {hospital.email}
        </span>
        <span className="h-3.5 w-px bg-white/25" />
        <span className="font-np rounded-[3px] bg-[#D24B45] px-2.5 py-1 font-semibold">
          आकस्मिक: {hospital.emergencyShort}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-np opacity-65">सामाजिक सञ्जाल</span>
        <div className="flex gap-1.5">
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
        <span className="h-3.5 w-px bg-white/25" />
        <span className="font-np font-semibold">नेपाली</span>
        <span className="opacity-45">/ EN</span>
      </div>
    </div>
  );
}
