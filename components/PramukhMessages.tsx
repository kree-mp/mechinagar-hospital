import Image from "next/image";
import { connectDB } from "@/lib/db/connection";
import { PramukhMessage } from "@/lib/db/models";
import type { PramukhRole } from "@/lib/db/models";
import { PramukhMessagesTitle, PramukhRoleLabel } from "@/components/PramukhMessagesHeadings";

const ROLE_ORDER: PramukhRole[] = ["nagar_pramukh", "hospital_pramukh"];

async function getMessages() {
  await connectDB();
  const messages = await PramukhMessage.find({ deletedAt: null, status: "published" })
    .select("role name post message photo")
    .lean();
  return ROLE_ORDER.map((role) => messages.find((m) => m.role === role)).filter(
    (m): m is NonNullable<typeof m> => Boolean(m)
  );
}

export default async function PramukhMessages() {
  const messages = await getMessages();
  if (messages.length === 0) return null;

  return (
    <div id="messages" className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 sm:py-16 lg:px-[30px] lg:py-[78px]">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="text-[12px] font-bold tracking-[2.5px] text-[#D24B45]">LEADERSHIP</div>
        <PramukhMessagesTitle />
        <div className="h-[3px] w-[54px] bg-[#D24B45]" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {messages.map((m) => (
          <div
            key={m._id.toString()}
            className="overflow-hidden rounded-md border border-[#e4e7ec] bg-white shadow-sm"
          >
            {m.photo?.url && (
              <div className="relative h-[280px] w-full bg-[#f0f2f5] sm:h-[340px]">
                <Image
                  src={m.photo.url}
                  alt={m.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <PramukhRoleLabel role={m.role} />
              <div className="mt-4 space-y-3">
                {m.message
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="font-np text-[14.5px] leading-[1.85] text-[#41474f] sm:text-[15px]">
                      {para}
                    </p>
                  ))}
              </div>
              <div className="mt-5 border-t border-[#e4e7ec] pt-4">
                <div className="font-np text-[16px] font-bold text-[#1B262C]">{m.name}</div>
                <div className="font-np text-[13px] font-semibold text-[#D24B45]">{m.post}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
