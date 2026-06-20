import { statistics } from "@/data/hospital";

export default function Statistics() {
  return (
    <div className="bg-[#3282B8] text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-5 gap-5 px-[30px] py-[46px]">
        {statistics.map((stat, i) => (
          <div
            key={stat.en}
            className={`text-center ${i < statistics.length - 1 ? "border-r border-white/[.16]" : ""}`}
          >
            <div className="text-[40px] font-extrabold tabular-nums">{stat.value}</div>
            <div className="font-np mt-0.5 text-[14px] opacity-85">{stat.np}</div>
            <div className="text-[11px] tracking-[.5px] opacity-55">{stat.en}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
