import { news } from "@/data/news";

export default function NewsEvents() {
  return (
    <div id="news" className="bg-[#f6f7f9]">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            NEWS &amp; EVENTS
          </div>
          <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">
            समाचार तथा गतिविधि
          </div>
          <div className="h-[3px] w-[54px] bg-[#D24B45]" />
        </div>
        {news.length === 0 ? (
          <div className="font-np rounded-md border border-[#e4e7ec] bg-white py-14 text-center text-[15px] text-[#98a0aa]">
            हाल कुनै समाचार उपलब्ध छैन।
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <div
                key={n.title}
                className="overflow-hidden rounded-md border border-[#e4e7ec] bg-white hover:shadow-[0_16px_34px_-20px_rgba(15,23,42,.4)]"
              >
                <div className="relative flex h-[180px] items-center justify-center bg-[repeating-linear-gradient(45deg,#dfe3e8_0_16px,#e8ebee_16px_32px)]">
                  <span className="font-mono text-[11px] text-[#98a0aa]">[ {n.label} ]</span>
                  <span className="font-np absolute left-3.5 top-3.5 rounded-[3px] bg-[#0F4C75] px-2.5 py-[5px] text-[11px] font-bold text-white">
                    {n.date}
                  </span>
                </div>
                <div className="p-5">
                  <div className="font-np text-[17px] font-bold leading-[1.45] text-[#1B262C]">
                    {n.title}
                  </div>
                  <div className="font-np mt-2 text-[13.5px] leading-[1.65] text-[#5b6168]">
                    {n.excerpt}
                  </div>
                  <a
                    href="#"
                    className="font-np mt-3.5 inline-block text-[13px] font-bold text-[#D24B45]"
                  >
                    विस्तृत पढ्नुहोस् →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
