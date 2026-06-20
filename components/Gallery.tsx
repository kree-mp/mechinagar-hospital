import { gallery } from "@/data/gallery";

export default function Gallery() {
  return (
    <div id="gallery" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-[30px] py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            PHOTO GALLERY
          </div>
          <div className="font-np text-[31px] font-extrabold text-[#1B262C]">ग्यालरी</div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        <div
          className="grid grid-cols-4 gap-3.5"
          style={{ gridAutoRows: "168px" }}
        >
          {gallery.map((g) => (
            <div
              key={g.label}
              style={{ gridColumn: g.col, gridRow: g.row }}
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-[repeating-linear-gradient(45deg,#dfe3e8_0_16px,#e8ebee_16px_32px)] hover:brightness-95"
            >
              <span className="font-mono text-[11px] text-[#98a0aa]">[ {g.label} ]</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
