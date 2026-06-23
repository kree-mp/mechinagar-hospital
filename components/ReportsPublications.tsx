import { reportCategories } from "@/data/reports";

export default function ReportsPublications() {
  return (
    <div id="reports" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            DOWNLOADS
          </div>
          <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">
            प्रतिवेदन तथा प्रकाशन
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {reportCategories.map((r) => (
            <div
              key={r.en}
              className="flex items-center justify-between gap-3 rounded-md border border-[#e4e7ec] bg-white px-5 py-4"
            >
              <div>
                <div className="font-np text-[15px] font-bold text-[#1B262C]">{r.np}</div>
                <div className="mt-0.5 text-[11px] font-semibold tracking-[.5px] text-[#98a0aa]">
                  {r.en}
                </div>
              </div>
              <span className="font-np flex-none rounded-[20px] bg-[#f0f2f5] px-3 py-1.5 text-[12px] font-semibold text-[#98a0aa]">
                अपलोड हुँदैछ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
