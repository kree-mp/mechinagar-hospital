import { statistics } from "@/data/hospital";

export default function Statistics() {
  return (
    <div className="bg-[#3282B8] text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-5 px-5 py-9 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:px-[30px] lg:py-[46px]">
        {statistics.map((stat, i) => (
          <div
            key={stat.en}
            className={`text-center ${i < statistics.length - 1 ? "lg:border-r lg:border-white/[.16]" : ""}`}
          >
            <div className="text-[28px] font-extrabold tabular-nums sm:text-[34px] lg:text-[40px]">{stat.value}</div>
            <div className="font-np mt-0.5 text-[13px] opacity-85 sm:text-[14px]">{stat.np}</div>
            <div className="text-[10px] tracking-[.5px] opacity-55 sm:text-[11px]">{stat.en}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
