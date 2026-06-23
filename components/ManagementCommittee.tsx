import { healthBranch, committeeMembers } from "@/data/committee";

const LEAD_POSTS = ["अध्यक्ष", "उपाध्यक्ष"];

export default function ManagementCommittee() {
  return (
    <div id="committee" className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
          GOVERNANCE
        </div>
        <div className="font-np text-[24px] font-extrabold text-[#1B262C] sm:text-[31px]">
          अस्पताल व्यवस्थापन
        </div>
        <div className="h-[3px] w-[54px] bg-[#D24B45]" />
      </div>

      <div className="mb-8 flex flex-col items-center gap-3.5 rounded-md border border-[#e4e7ec] border-t-[3px] border-t-[#3282B8] bg-white px-6 py-5 text-center sm:flex-row sm:text-left">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#E7F1FB]">
          <span className="font-np text-[18px] font-bold text-[#0F4C75]">
            {healthBranch.chiefName.charAt(0)}
          </span>
        </div>
        <div>
          <div className="font-np text-[12px] font-bold tracking-[.5px] text-[#98a0aa]">
            स्वास्थ्य शाखा प्रमुख
          </div>
          <div className="font-np text-[16px] font-bold text-[#1B262C]">
            {healthBranch.chiefName}
          </div>
          <div className="font-np text-[13px] font-semibold text-[#D24B45]">
            {healthBranch.chiefPost}
          </div>
        </div>
      </div>

      <div className="font-np mb-[18px] text-center text-[16px] font-bold text-[#1B262C] sm:text-left">
        अस्पताल व्यवस्थापन समिति
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {committeeMembers.map((m) => {
          const isLead = LEAD_POSTS.includes(m.post);
          return (
            <div
              key={m.name}
              style={{ borderLeftColor: isLead ? "#D24B45" : "#e4e7ec" }}
              className="flex items-center justify-between gap-3 rounded-[4px] border border-[#e4e7ec] border-l-[3px] bg-white px-[18px] py-3.5"
            >
              <span className="font-np text-[14px] font-semibold text-[#1B262C]">{m.name}</span>
              <span
                className={`font-np flex-none rounded-[20px] px-3 py-1 text-[12px] font-bold ${
                  isLead ? "bg-[#FBEAE9] text-[#D24B45]" : "bg-[#f0f2f5] text-[#5b6168]"
                }`}
              >
                {m.post}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
