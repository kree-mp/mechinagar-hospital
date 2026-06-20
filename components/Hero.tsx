"use client";

import { useEffect, useState } from "react";
import { heroSlides } from "@/data/hero";

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % heroSlides.length);
    }, 5800);
    return () => clearInterval(id);
  }, []);

  const next = () => setActive((i) => (i + 1) % heroSlides.length);
  const prev = () => setActive((i) => (i + heroSlides.length - 1) % heroSlides.length);

  return (
    <div id="home" className="relative h-[530px] overflow-hidden bg-[#0b1320]">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.label}
          className="absolute inset-0 transition-opacity duration-900 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#3a4250_0_17px,#454e5e_17px_34px)]" />
          <div className="absolute left-[22px] top-[18px] font-mono text-[11px] tracking-wide text-white/50">
            [ {slide.label} — drop photo ]
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(8,12,22,.85)_0%,rgba(8,12,22,.6)_42%,rgba(8,12,22,.12)_100%)]" />
          <div className="absolute inset-y-0 left-0 flex max-w-[min(720px,56%)] flex-col justify-center px-[60px]">
            <div className="font-np inline-flex self-start items-center gap-2 rounded-[3px] bg-[#D24B45] px-[13px] py-1.5 text-[11.5px] font-bold tracking-[1.5px] text-white">
              {slide.en}
            </div>
            <div className="font-np mt-[18px] whitespace-pre-line text-[48px] font-extrabold leading-[1.18] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.4)]">
              {slide.title}
            </div>
            <div className="mt-4 max-w-[540px] text-[16px] leading-[1.55] text-white/88">
              {slide.sub}
            </div>
            <div className="mt-7 flex gap-3.5">
              <a
                href="#services"
                className="font-np rounded bg-[#D24B45] px-[26px] py-[13px] text-[14.5px] font-bold text-white"
              >
                हाम्रा सेवाहरू
              </a>
              <a
                href="#doctors"
                className="font-np rounded border border-white/50 bg-white/[.12] px-[26px] py-[13px] text-[14.5px] font-semibold text-white"
              >
                चिकित्सक खोज्नुहोस्
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute bottom-[90px] left-[22px] flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[#080c16]/40 text-[18px] text-white"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute bottom-[90px] left-[74px] flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[#080c16]/40 text-[18px] text-white"
      >
        ›
      </button>

      <div className="absolute bottom-[100px] right-[34px] flex items-center gap-2">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.label}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-[9px] rounded-[5px] border-none p-0 transition-all duration-400 ease-in-out"
            style={{
              width: i === active ? "30px" : "10px",
              background: i === active ? "#fff" : "rgba(255,255,255,.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
