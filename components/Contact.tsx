import { contactInfoCards } from "@/data/hospital";

export default function Contact() {
  return (
    <div id="contact" className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
          GET IN TOUCH
        </div>
        <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">सम्पर्क</div>
        <div className="h-[3px] w-[54px] bg-[#D24B45]" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[30px]">
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
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d992.5207556222213!2d88.09979618772128!3d26.65943924294638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e5b3db483fffff%3A0xd997f9804daf48dc!2sDhulabari%20Health%20Centre!5e0!3m2!1sen!2snp!4v1782799983576!5m2!1sen!2snp"
            title="Dhulabari Health Centre स्थान नक्सा"
            className="min-h-[230px] w-full flex-1 border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
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
              className="font-np col-span-1 h-[70px] resize-none rounded-[5px] border border-[#d9dce1] px-[13px] py-[11px] text-[13.5px] outline-none sm:col-span-2"
            />
            <button className="font-np col-span-1 rounded-[5px] bg-[#0F4C75] py-3 text-[14.5px] font-bold text-white sm:col-span-2">
              सन्देश पठाउनुहोस्
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
