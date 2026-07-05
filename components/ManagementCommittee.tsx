import { connectDB } from "@/lib/db/connection";
import { ManagementMember } from "@/lib/db/models";
import {
  ManagementCommitteeTitle,
  ChiefRoleLabel,
  CommitteeSectionLabel,
} from "@/components/ManagementCommitteeHeadings";

const LEAD_ROLES = ["president", "vp"];

async function getManagement() {
  await connectDB();
  const members = await ManagementMember.find({ deletedAt: null, status: "published" })
    .sort({ order: 1, createdAt: 1 })
    .select("nameNp post role photo order")
    .lean();
  return {
    chief: members.find((m) => m.role === "chief") ?? null,
    committee: members.filter((m) => m.role !== "chief"),
  };
}

export default async function ManagementCommittee() {
  const { chief, committee } = await getManagement();

  return (
    <div id="committee" className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">
          GOVERNANCE
        </div>
        <ManagementCommitteeTitle />
        <div className="h-[3px] w-[54px] bg-[#D24B45]" />
      </div>

      {chief && (
        <div className="mb-8 flex flex-col items-center gap-3.5 rounded-md border border-[#e4e7ec] border-t-[3px] border-t-[#3282B8] bg-white px-6 py-5 text-center sm:flex-row sm:text-left">
          {chief.photo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={chief.photo.url}
              alt={chief.nameNp}
              className="h-12 w-12 flex-none rounded-md object-contain bg-[#f0f2f5]"
            />
          ) : (
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#E7F1FB]">
              <span className="font-np text-[18px] font-bold text-[#0F4C75]">
                {chief.nameNp.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <ChiefRoleLabel />
            <div className="font-np text-[16px] font-bold text-[#1B262C]">{chief.nameNp}</div>
            <div className="font-np text-[13px] font-semibold text-[#D24B45]">{chief.post}</div>
          </div>
        </div>
      )}

      <CommitteeSectionLabel />
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {committee.map((m) => {
          const isLead = LEAD_ROLES.includes(m.role);
          return (
            <div
              key={m._id.toString()}
              style={{ borderLeftColor: isLead ? "#D24B45" : "#e4e7ec" }}
              className="flex items-center justify-between gap-3 rounded-[4px] border border-[#e4e7ec] border-l-[3px] bg-white px-[18px] py-3.5"
            >
              <span className="font-np text-[14px] font-semibold text-[#1B262C]">{m.nameNp}</span>
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
