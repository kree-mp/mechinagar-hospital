import { visitingHours, opdFees, citizenCharterPoints } from "@/data/hospital";

export default function PatientInfo() {
  return (
    <div id="patient" className="mx-auto max-w-[1280px] px-[30px] py-[78px]">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
          FOR PATIENTS &amp; VISITORS
        </div>
        <div className="font-np text-[31px] font-extrabold text-[#1B262C]">
          बिरामी तथा आगन्तुक जानकारी
        </div>
        <div className="h-[3px] w-[54px] bg-[#D24B45]" />
      </div>
      <div className="grid grid-cols-3 gap-[22px]">
        <div className="overflow-hidden rounded-md border border-[#e4e7ec]">
          <div className="font-np bg-[#3282B8] px-5 py-4 text-[16px] font-bold text-white">
            समय तालिका
          </div>
          <div className="px-5 pb-[18px] pt-2">
            {visitingHours.map((row, i) => (
              <div
                key={row.label}
                className={`flex justify-between py-[11px] ${
                  i < visitingHours.length - 1 ? "border-b border-[#f1f3f5]" : ""
                }`}
              >
                <span className="font-np text-[14px] text-[#41474f]">{row.label}</span>
                <span
                  className={`font-np text-[13.5px] font-semibold ${
                    row.highlight ? "text-[#0F4C75]" : ""
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-[#e4e7ec]">
          <div className="font-np bg-[#D24B45] px-5 py-4 text-[16px] font-bold text-white">
            ओपीडी शुल्क
          </div>
          <div className="px-5 pb-[18px] pt-2">
            {opdFees.map((row, i) => (
              <div
                key={row.label}
                className={`flex justify-between py-[11px] ${
                  i < opdFees.length - 1 ? "border-b border-[#f1f3f5]" : ""
                }`}
              >
                <span className="font-np text-[14px] text-[#41474f]">{row.label}</span>
                <span
                  className={
                    row.isNote
                      ? "font-np text-[13px] font-semibold text-[#3282B8]"
                      : "text-[14px] font-bold tabular-nums"
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-[#e4e7ec]">
          <div className="font-np bg-[#1B262C] px-5 py-4 text-[16px] font-bold text-white">
            नागरिक वडापत्र
          </div>
          <div className="px-5 py-4">
            {citizenCharterPoints.map((point) => (
              <div key={point} className="mb-3 flex items-start gap-2.5">
                <span className="font-extrabold text-[#D24B45]">›</span>
                <span className="font-np text-[13.5px] leading-[1.55] text-[#41474f]">
                  {point}
                </span>
              </div>
            ))}
            <a href="#" className="font-np mt-1 inline-block text-[13px] font-bold text-[#D24B45]">
              पूर्ण वडापत्र डाउनलोड ↓
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
