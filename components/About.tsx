import { aboutCopy, aboutGoals } from "@/data/hospital";

export default function About() {
  return (
    <div id="about" className="mx-auto max-w-[1280px] px-[30px] py-[78px]">
      <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-[54px]">
        <div>
          <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
            ABOUT THE HOSPITAL
          </div>
          <div className="font-np mt-2 text-[31px] font-extrabold text-[#1B262C]">
            हाम्रो बारेमा
          </div>
          <div className="mt-3 h-[3px] w-[54px] bg-[#D24B45]" />
          <p className="font-np mt-[22px] text-[15.5px] leading-[1.8] text-[#41474f]">
            {aboutCopy.bodyNp}
          </p>
          <p className="mt-3.5 text-[14.5px] leading-[1.75] text-[#5b6168]">
            {aboutCopy.bodyEn}
          </p>
          <div className="mt-[26px] grid grid-cols-2 gap-4">
            {aboutGoals.map((goal) => (
              <div
                key={goal.titleNp}
                style={{ borderLeftColor: goal.color }}
                className="rounded-[4px] border border-[#e4e7ec] border-l-[3px] p-4 px-[18px]"
              >
                <div
                  style={{ color: goal.color }}
                  className="font-np text-[16px] font-bold"
                >
                  {goal.titleNp}
                </div>
                <div className="font-np mt-[5px] text-[13.5px] leading-[1.6] text-[#5b6168]">
                  {goal.descNp}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="flex h-[380px] items-center justify-center rounded-md border border-[#d9dce1] bg-[repeating-linear-gradient(45deg,#dfe3e8_0_16px,#e8ebee_16px_32px)]">
            <span className="font-mono text-[12px] tracking-wide text-[#98a0aa]">
              [ HOSPITAL BUILDING — drop photo ]
            </span>
          </div>
          <div className="absolute -bottom-[18px] -left-[18px] rounded-md bg-[#3282B8] px-6 py-[18px] text-white shadow-[0_14px_30px_-14px_rgba(0,56,147,.6)]">
            <div className="text-[30px] font-extrabold tabular-nums">
              {aboutCopy.yearsBadge}
            </div>
            <div className="font-np text-[12.5px] opacity-85">
              {aboutCopy.yearsBadgeLabelNp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
