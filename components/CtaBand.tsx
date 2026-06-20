import { hospital } from "@/data/hospital";

export default function CtaBand() {
  return (
    <div className="bg-[#D24B45]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-6 px-[30px] py-10">
        <div>
          <div className="font-np text-[24px] font-extrabold text-white">
            आकस्मिक अवस्थामा हामीलाई सम्पर्क गर्नुहोस्
          </div>
          <div className="mt-1 text-[14px] text-white/85">
            24/7 emergency &amp; ambulance services available across Jhapa.
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="text-right">
            <div className="font-np text-[12px] text-white/80">हेल्पलाइन</div>
            <div className="text-[28px] font-extrabold tabular-nums text-white">
              {hospital.emergencyFull}
            </div>
          </div>
          <a
            href="#contact"
            className="font-np rounded bg-white px-7 py-3.5 text-[15px] font-bold text-[#D24B45]"
          >
            सम्पर्क विवरण
          </a>
        </div>
      </div>
    </div>
  );
}
