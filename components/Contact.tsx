import { contactInfoCards } from "@/data/hospital";

export default function Contact() {
  return (
    <div id="contact" className="mx-auto max-w-[1280px] px-[30px] py-[78px]">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
          GET IN TOUCH
        </div>
        <div className="font-np text-[31px] font-extrabold text-[#1B262C]">सम्पर्क</div>
        <div className="h-[3px] w-[54px] bg-[#D24B45]" />
      </div>
      <div className="grid grid-cols-[0.9fr_1.1fr] gap-[30px]">
        <div className="flex flex-col gap-4">
          {contactInfoCards.map((card, i) => (
            <div
              key={card.titleNp}
              className="flex gap-3.5 rounded-md border border-[#e4e7ec] px-5 py-[18px]"
            >
              <div
                className={`flex h-10 w-10 flex-none items-center justify-center rounded-[8px] ${
                  i % 2 === 0 ? "bg-[#E7F1FB]" : "bg-[#EAF4FC]"
                }`}
              >
                <div
                  className={
                    i === 0
                      ? "h-3.5 w-3.5 rounded-full bg-[#0F4C75]"
                      : i === 1
                        ? "h-3.5 w-3.5 rounded-[3px] bg-[#3282B8]"
                        : "h-3.5 w-3.5 rotate-45 bg-[#0F4C75]"
                  }
                />
              </div>
              <div>
                <div className="font-np text-[15px] font-bold">{card.titleNp}</div>
                <div
                  className="font-np mt-0.5 text-[13.5px] leading-[1.6] text-[#5b6168]"
                  dangerouslySetInnerHTML={{ __html: card.body }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col overflow-hidden rounded-md border border-[#e4e7ec]">
          <div className="flex min-h-[230px] flex-1 items-center justify-center bg-[repeating-linear-gradient(45deg,#dfe3e8_0_16px,#e8ebee_16px_32px)]">
            <span className="font-mono text-[12px] text-[#98a0aa]">
              [ GOOGLE MAP — embed location ]
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 p-5">
            <input
              placeholder="नाम"
              className="font-np rounded-[5px] border border-[#d9dce1] px-[13px] py-[11px] text-[13.5px] outline-none"
            />
            <input
              placeholder="फोन नम्बर"
              className="font-np rounded-[5px] border border-[#d9dce1] px-[13px] py-[11px] text-[13.5px] outline-none"
            />
            <textarea
              placeholder="तपाईंको सन्देश"
              className="font-np col-span-2 h-[70px] resize-none rounded-[5px] border border-[#d9dce1] px-[13px] py-[11px] text-[13.5px] outline-none"
            />
            <button className="font-np col-span-2 rounded-[5px] bg-[#0F4C75] py-3 text-[14.5px] font-bold text-white">
              सन्देश पठाउनुहोस्
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
