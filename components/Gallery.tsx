import { gallery } from "@/data/gallery";

export default function Gallery() {
  return (
    <div id="gallery" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            PHOTO GALLERY
          </div>
          <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">ग्यालरी</div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        <div className="grid grid-cols-2 gap-3 [grid-auto-rows:120px] sm:grid-cols-4 sm:gap-3.5 sm:[grid-auto-rows:168px]">
          {gallery.map((g) => (
            <div
              key={g.labelEn}
              style={{ gridColumn: g.col, gridRow: g.row }}
              className="relative flex cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md bg-[repeating-linear-gradient(45deg,#dfe3e8_0_16px,#e8ebee_16px_32px)] hover:brightness-95"
            >
              {g.isVideo && (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D24B45] text-white">
                  ▶
                </span>
              )}
              <span className="font-np text-[12.5px] font-semibold text-[#5b6168]">{g.labelNp}</span>
              <span className="font-mono text-[10px] text-[#98a0aa]">[ {g.labelEn} ]</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
